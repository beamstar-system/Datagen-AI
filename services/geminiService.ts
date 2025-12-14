import { GoogleGenAI } from "@google/genai";
import { GeneratedDataset, GroundingChunk } from '../types';
import { cleanJSONString } from '../utils/helpers';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDataset = async (
  topic: string,
  fields: string[],
  rowCount: number
): Promise<GeneratedDataset> => {
  const client = getClient();
  
  // Construct a prompt that forces structure but leverages search
  const fieldList = fields.join(', ');
  const prompt = `
    I need a dataset about: "${topic}".
    
    Requirements:
    1. Use Google Search to find REAL, factual, and up-to-date information. Do not make up data.
    2. Generate exactly ${rowCount} rows of data.
    3. The dataset must strictly have these columns: ${fieldList}.
    4. Return the data as a raw JSON array of objects.
    5. Do not include markdown formatting, explanations, or code blocks. Just the JSON array.
    6. Ensure the data is rich and "expensive" looking (precise numbers, full names, accurate dates).
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-latest', // Using latest flash for speed + search capability
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search Grounding
        // Note: responseMimeType: 'application/json' is NOT supported with tools, 
        // so we must rely on the prompt for JSON formatting.
        temperature: 0.3, // Low temperature for more factual results
      },
    });

    const text = response.text || "[]";
    const cleanedText = cleanJSONString(text);
    
    let rows = [];
    try {
      rows = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      console.log("Raw Text:", text);
      throw new Error("Failed to parse the generated dataset. The model output might not be valid JSON.");
    }

    // Extract grounding sources
    const sources: string[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    
    if (chunks) {
      chunks.forEach(chunk => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    // Deduplicate sources
    const uniqueSources = Array.from(new Set(sources));

    return {
      rows,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

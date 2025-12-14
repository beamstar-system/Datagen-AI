import React, { useState } from 'react';
import DatasetForm from './components/DatasetForm';
import DataPreview from './components/DataPreview';
import { generateDataset } from './services/geminiService';
import { GeneratedDataset, GeneratorConfig } from './types';
import { Cpu, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<GeneratedDataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTopic, setCurrentTopic] = useState('');

  const handleGenerate = async (config: GeneratorConfig) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setCurrentTopic(config.topic);

    try {
      const result = await generateDataset(config.topic, config.fields, config.rowCount);
      setData(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the dataset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-primary/30">
      
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Datagen<span className="text-primary">.ai</span>
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            Powered by Gemini 2.5 & Google Search
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Generate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Expensive Datasets</span> in Seconds
          </h1>
          <p className="text-lg text-slate-400">
            Create custom, structured datasets validated by real-time Google Search data. 
            Export to CSV for immediate analysis.
          </p>
        </div>

        {/* Input Form */}
        <section>
          <DatasetForm isLoading={isLoading} onSubmit={handleGenerate} />
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-500 font-medium">Generation Failed</h3>
              <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        <section id="results" className="pb-20">
          <DataPreview data={data} topic={currentTopic} />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Datagen.ai. Built with React, Tailwind & Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

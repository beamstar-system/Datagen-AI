import { DatasetRow } from '../types';

export const cleanJSONString = (text: string): string => {
  // Remove markdown code blocks if present
  let clean = text.replace(/```json/g, '').replace(/```/g, '');
  // Attempt to find the first '[' and last ']' to isolate the array
  const firstOpen = clean.indexOf('[');
  const lastClose = clean.lastIndexOf(']');
  
  if (firstOpen !== -1 && lastClose !== -1) {
    clean = clean.substring(firstOpen, lastClose + 1);
  }
  return clean.trim();
};

export const exportToCSV = (data: DatasetRow[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        // Escape quotes and wrap in quotes if it contains comma or quotes
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

import React, { useState } from 'react';
import { GeneratorConfig } from '../types';
import { Plus, X, Database, Sparkles } from 'lucide-react';

interface DatasetFormProps {
  isLoading: boolean;
  onSubmit: (config: GeneratorConfig) => void;
}

const DatasetForm: React.FC<DatasetFormProps> = ({ isLoading, onSubmit }) => {
  const [topic, setTopic] = useState('');
  const [fields, setFields] = useState<string[]>(['Name', 'Value']);
  const [rowCount, setRowCount] = useState<number>(10);
  const [newField, setNewField] = useState('');

  const handleAddField = () => {
    if (newField.trim()) {
      setFields([...fields, newField.trim()]);
      setNewField('');
    }
  };

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic && fields.length > 0) {
      onSubmit({ topic, fields, rowCount });
    }
  };

  const suggestions = [
    { label: "Top 20 Tech Startups 2024", fields: ["Company", "Founder", "Valuation", "Industry"] },
    { label: "Nobel Prize Physics Winners", fields: ["Year", "Laureate", "Contribution", "Country"] },
    { label: "Rare Earth Minerals Prices", fields: ["Mineral", "Price_Per_Kg", "Main_Source", "Application"] },
  ];

  const applySuggestion = (s: { label: string, fields: string[] }) => {
    setTopic(s.label);
    setFields(s.fields);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Input */}
        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-slate-300">
            Dataset Topic
          </label>
          <div className="relative">
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Fortune 500 Companies ranked by Revenue"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              disabled={isLoading}
            />
            <Database className="absolute right-3 top-3.5 text-slate-500 w-5 h-5" />
          </div>
          
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applySuggestion(s)}
                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fields Configuration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Columns / Schema
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddField())}
                placeholder="Add field (e.g. Revenue)"
                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleAddField}
                disabled={!newField.trim() || isLoading}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3 min-h-[3rem] p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
              {fields.length === 0 && (
                <span className="text-slate-500 text-sm italic">No columns defined yet.</span>
              )}
              {fields.map((field, index) => (
                <span key={index} className="inline-flex items-center gap-1 bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded text-sm">
                  {field}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row Count */}
          <div className="space-y-2">
             <label className="block text-sm font-medium text-slate-300">
              Row Count (Max 50)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="5" 
                max="50" 
                step="5"
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                disabled={isLoading}
              />
              <span className="text-xl font-bold text-white w-8 text-center">{rowCount}</span>
            </div>
            <p className="text-xs text-slate-500">
              Note: Higher counts increase generation time and may require more search queries.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !topic || fields.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
            ${isLoading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-primary/25 hover:shadow-primary/40'
            }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Researching & Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Dataset
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default DatasetForm;

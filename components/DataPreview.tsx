import React from 'react';
import { GeneratedDataset } from '../types';
import { Download, ExternalLink, Table as TableIcon } from 'lucide-react';
import { exportToCSV } from '../utils/helpers';

interface DataPreviewProps {
  data: GeneratedDataset | null;
  topic: string;
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, topic }) => {
  if (!data || data.rows.length === 0) return null;

  const headers = Object.keys(data.rows[0]);

  const handleDownload = () => {
    exportToCSV(data.rows, topic.replace(/ /g, '_') || 'dataset');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TableIcon className="w-6 h-6 text-accent" />
            Generated Dataset
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {data.rows.length} rows generated based on real-time search data.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors border border-slate-600"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-300 border-b border-slate-700">
                <th className="p-4 w-12 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                {headers.map((header) => (
                  <th key={header} className="p-4 text-xs font-semibold uppercase tracking-wider min-w-[150px]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {data.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="p-4 text-center text-slate-500 text-xs">{idx + 1}</td>
                  {headers.map((header) => (
                    <td key={`${idx}-${header}`} className="p-4 text-slate-300 text-sm truncate max-w-[300px]" title={String(row[header])}>
                      {String(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sources Section */}
      {data.sources.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Verified Sources
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.sources.map((source, idx) => {
              try {
                const url = new URL(source);
                return (
                  <a
                    key={idx}
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-accent bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {url.hostname}
                  </a>
                );
              } catch (e) {
                return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreview;

import React from 'react';
import { Trash2, Download, History, Clock, CheckCircle } from 'lucide-react';

export default function GestureHistory({ history = [], onClearHistory }) {
  const exportHistoryJSON = () => {
    if (!history.length) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gesture-ai-session-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-gesture-electric/20 shadow-glass flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gesture-electric" />
          <h3 className="text-lg font-bold text-gesture-navy dark:text-white">
            Recognition Timeline
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {history.length > 0 && (
            <>
              <button
                onClick={exportHistoryJSON}
                title="Export session data as JSON"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-gesture-light dark:hover:bg-gesture-darkCard text-slate-600 dark:text-slate-300 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onClearHistory}
                title="Clear History"
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* History List */}
      <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
        {history.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center text-slate-400">
            <Clock className="w-8 h-8 mb-2 stroke-1 opacity-60" />
            <p className="text-xs font-medium">No gestures confirmed in this session yet.</p>
            <p className="text-[11px] text-slate-400/80 mt-0.5">
              Start camera or demo simulator to begin tracking.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 flex items-center justify-between text-xs hover:border-gesture-electric/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <div className="font-bold text-gesture-navy dark:text-white">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-md bg-gesture-primary/10 text-gesture-primary dark:text-gesture-cyan font-mono font-bold text-[11px]">
                  {Math.round(item.confidence * 100)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function PostSkeleton({ viewMode = 'grid' }) {
  if (viewMode === 'list') {
    return (
      <div className="skeleton-post-card list-mode bg-white/70 border border-slate-200/60 rounded-2xl p-5 mb-4 shadow-sm flex flex-col md:flex-row gap-6 animate-pulse">
        <div className="w-full md:w-56 h-40 bg-slate-200 rounded-xl shrink-0"></div>
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
            <div className="h-4 bg-slate-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-post-card grid-mode bg-white/70 border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col animate-pulse">
      <div className="w-full h-48 bg-slate-200"></div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
          <div className="h-6 bg-slate-200 rounded w-4/5 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          <div className="h-4 bg-slate-200 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
}

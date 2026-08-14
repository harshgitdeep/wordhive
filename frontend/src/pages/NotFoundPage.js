import { Link } from "react-router-dom";
import { Home, FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white/80 backdrop-blur-md border border-amber-200/80 p-8 sm:p-10 rounded-3xl shadow-xl shadow-amber-500/5 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Badge & Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-500 shadow-inner">
            <FileQuestion className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 bg-amber-100/70 px-3 py-1 rounded-full">
              Error 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Oops! The story or page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold shadow-md shadow-amber-500/20 transition-all text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

export default function Loader({ className = "" }) {
  return (
    <div className={`flex items-center justify-center min-h-[200px] w-full ${className}`}>
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200"></div>
        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}

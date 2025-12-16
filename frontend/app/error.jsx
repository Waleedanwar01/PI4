'use client';

import Link from 'next/link';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-gray-600">{String(error?.message || 'Unexpected error')}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => reset()} className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">Try again</button>
          <Link href="/" className="px-5 py-2 rounded-md bg-gray-900 text-white font-semibold hover:bg-gray-800">Go Home</Link>
        </div>
      </div>
    </div>
  );
}


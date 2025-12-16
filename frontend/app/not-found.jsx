import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
        <h1 className="text-3xl font-black text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">The page you are looking for does not exist.</p>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700">Go Home</Link>
        </div>
      </div>
    </div>
  );
}


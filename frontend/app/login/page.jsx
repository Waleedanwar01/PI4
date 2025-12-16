"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Reveal from "../components/Reveal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [partners, setPartners] = useState([]);
  const router = useRouter();
  const heroPics = ['/images/car.jpg','/images/women.jpg','/images/family.jpg'];

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("http://localhost:8000/api/home/partners", { cache: "no-store" });
        if (r.ok) {
          const d = await r.json();
          setPartners(d.items || []);
        }
      } catch {}
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call - replace with actual authentication
      if (email && password) {
        const userData = {
          email,
          name: email.split('@')[0],
          id: Date.now()
        };
        
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Redirect to portal
        router.push("/portal");
      } else {
        setError("Please enter both email and password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Reveal>
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              Insurance Portal
            </Link>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                create a new account
              </Link>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="mb-6 flex items-center justify-center gap-3">
              {heroPics.map((src, i) => (
                <img key={`login-pic-${i}`} src={src} alt="Preview" className="h-10 w-10 rounded-md object-cover ring-1 ring-slate-200" onError={(e) => { e.currentTarget.src = '/images/logo.png'; }} />
              ))}
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">For testing purposes, use any email and password:</p>
                <div className="text-xs text-gray-500">
                  <p>Email: demo@example.com</p>
                  <p>Password: password123</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
    {partners.length ? (
      <div className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex items-center gap-8 slider-track">
              {[...partners, ...partners].map((p, i) => (
                <a key={`lp-${i}`} href={p.url || "#"} target="_blank" rel="noopener noreferrer" className="block">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-10 sm:h-12 object-contain" />
                  ) : (
                    <div className="h-10 sm:h-12 w-28 bg-gray-100" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .slider-track { animation: scroll 30s linear infinite; }
          @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        `}</style>
      </div>
    ) : null}
  );
}

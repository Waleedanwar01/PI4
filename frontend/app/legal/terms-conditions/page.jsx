"use client";

import Link from "next/link";
import Reveal from "../../components/Reveal";

export default function TermsConditionsPage() {
  const lastUpdated = "December 15, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.1),transparent_60%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Reveal>
            <div className="text-center">
              <p className="text-blue-300 text-sm font-bold uppercase tracking-wider mb-2">Legal Document</p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                Terms & Conditions
              </h1>
              <p className="text-blue-100 text-lg sm:text-xl max-w-3xl mx-auto">
                Please read these terms and conditions carefully before using our services
              </p>
              <p className="mt-4 text-blue-200 text-sm">
                Last updated: {lastUpdated}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Reveal>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  <a href="#acceptance" className="block text-sm text-gray-600 hover:text-blue-600 py-1">1. Acceptance of Terms</a>
                  <a href="#services" className="block text-sm text-gray-600 hover:text-blue-600 py-1">2. Our Services</a>
                  <a href="#eligibility" className="block text-sm text-gray-600 hover:text-blue-600 py-1">3. Eligibility</a>
                  <a href="#account" className="block text-sm text-gray-600 hover:text-blue-600 py-1">4. Account Registration</a>
                  <a href="#use" className="block text-sm text-gray-600 hover:text-blue-600 py-1">5. Acceptable Use</a>
                  <a href="#privacy" className="block text-sm text-gray-600 hover:text-blue-600 py-1">6. Privacy Policy</a>
                  <a href="#payments" className="block text-sm text-gray-600 hover:text-blue-600 py-1">7. Payments & Billing</a>
                  <a href="#cancellation" className="block text-sm text-gray-600 hover:text-blue-600 py-1">8. Cancellation Policy</a>
                  <a href="#disclaimers" className="block text-sm text-gray-600 hover:text-blue-600 py-1">9. Disclaimers</a>
                  <a href="#liability" className="block text-sm text-gray-600 hover:text-blue-600 py-1">10. Limitation of Liability</a>
                  <a href="#intellectual" className="block text-sm text-gray-600 hover:text-blue-600 py-1">11. Intellectual Property</a>
                  <a href="#modifications" className="block text-sm text-gray-600 hover:text-blue-600 py-1">12. Modifications</a>
                  <a href="#governing-law" className="block text-sm text-gray-600 hover:text-blue-600 py-1">13. Governing Law</a>
                  <a href="#contact" className="block text-sm text-gray-600 hover:text-blue-600 py-1">14. Contact Information</a>
                </nav>
              </div>
            </Reveal>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
                <div className="prose prose-lg prose-gray max-w-none">
                  
                  <section id="acceptance" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">1</span>
                      </span>
                      Acceptance of Terms
                    </h2>
                    <p className="text-gray-700 mb-4">
                      By accessing and using this website and our insurance services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                    <p className="text-gray-700">
                      These Terms and Conditions ("Terms") govern your use of our website located at [website URL] (the "Service") operated by [Company Name] ("us", "we", or "our").
                    </p>
                  </section>

                  <section id="services" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-600 font-bold text-sm">2</span>
                      </span>
                      Our Services
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We provide comprehensive insurance services including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Personal insurance (auto, home, life, health)</li>
                      <li>Business insurance and commercial coverage</li>
                      <li>Risk assessment and consulting services</li>
                      <li>Claims management and support</li>
                      <li>Insurance policy comparison and recommendations</li>
                    </ul>
                    <p className="text-gray-700">
                      All services are subject to the terms and conditions outlined in this document and any specific policy agreements you enter into with us.
                    </p>
                  </section>

                  <section id="eligibility" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold text-sm">3</span>
                      </span>
                      Eligibility
                    </h2>
                    <p className="text-gray-700 mb-4">
                      To use our services, you must:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Be at least 18 years of age</li>
                      <li>Have the legal authority to enter into contracts</li>
                      <li>Provide accurate and complete information</li>
                      <li>Comply with all applicable laws and regulations</li>
                    </ul>
                    <p className="text-gray-700">
                      By using our services, you represent and warrant that you meet all eligibility requirements.
                    </p>
                  </section>

                  <section id="account" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-yellow-600 font-bold text-sm">4</span>
                      </span>
                      Account Registration
                    </h2>
                    <p className="text-gray-700 mb-4">
                      To access certain features of our service, you may be required to register for an account. You agree to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Maintain the security of your password and account</li>
                      <li>Accept all risks of unauthorized access to your account</li>
                      <li>Notify us immediately of any unauthorized use of your account</li>
                    </ul>
                  </section>

                  <section id="use" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-red-600 font-bold text-sm">5</span>
                      </span>
                      Acceptable Use
                    </h2>
                    <p className="text-gray-700 mb-4">You agree not to use the service to:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Violate any applicable laws or regulations</li>
                      <li>Infringe upon the rights of others</li>
                      <li>Transmit harmful, offensive, or illegal content</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Interfere with the proper functioning of the service</li>
                      <li>Use the service for any fraudulent or deceptive purposes</li>
                    </ul>
                  </section>

                  <section id="privacy" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-bold text-sm">6</span>
                      </span>
                      Privacy Policy
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
                    </p>
                    <p className="text-gray-700">
                      Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
                    </p>
                  </section>

                  <section id="payments" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">7</span>
                      </span>
                      Payments & Billing
                    </h2>
                    <p className="text-gray-700 mb-4">
                      All fees for our services are as described on our website. Payment terms include:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Payments are due according to the terms specified in your policy</li>
                      <li>We accept major credit cards and electronic payment methods</li>
                      <li>Late payments may result in policy cancellation or suspension</li>
                      <li>Refunds are subject to our refund policy and applicable law</li>
                      <li>All prices are subject to change with proper notice</li>
                    </ul>
                  </section>

                  <section id="cancellation" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-bold text-sm">8</span>
                      </span>
                      Cancellation Policy
                    </h2>
                    <p className="text-gray-700 mb-4">
                      You may cancel your insurance policy at any time by contacting us. Cancellation terms include:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Notice requirements vary by policy type and state regulations</li>
                      <li>Refunds are calculated based on unused coverage periods</li>
                      <li>Cancellation may affect coverage and expose you to risks</li>
                      <li>Administrative fees may apply to cancellation processing</li>
                    </ul>
                  </section>

                  <section id="disclaimers" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-bold text-sm">9</span>
                      </span>
                      Disclaimers
                    </h2>
                    <p className="text-gray-700 mb-4">
                      The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, we:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Exclude all representations and warranties relating to this website</li>
                      <li>Do not warrant that the service will be constantly available</li>
                      <li>Do not guarantee the accuracy or completeness of information</li>
                      <li>Reserve the right to modify or discontinue services without notice</li>
                    </ul>
                  </section>

                  <section id="liability" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-pink-600 font-bold text-sm">10</span>
                      </span>
                      Limitation of Liability
                    </h2>
                    <p className="text-gray-700 mb-4">
                      In no event shall [Company Name], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                    </p>
                  </section>

                  <section id="intellectual" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">11</span>
                      </span>
                      Intellectual Property
                    </h2>
                    <p className="text-gray-700 mb-4">
                      The service and its original content, features, and functionality are and will remain the exclusive property of [Company Name] and its licensors. The service is protected by copyright, trademark, and other laws.
                    </p>
                  </section>

                  <section id="modifications" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold text-sm">12</span>
                      </span>
                      Modifications to Terms
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                  </section>

                  <section id="governing-law" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-yellow-600 font-bold text-sm">13</span>
                      </span>
                      Governing Law
                    </h2>
                    <p className="text-gray-700 mb-4">
                      These Terms shall be interpreted and governed by the laws of [State/Country], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                    </p>
                  </section>

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-600 font-bold text-sm">14</span>
                      </span>
                      Contact Information
                    </h2>
                    <p className="text-gray-700 mb-4">
                      If you have any questions about these Terms and Conditions, please contact us:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">legal@company.com</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">1-800-INSURANCE</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">123 Insurance Street, City, State 12345</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="bg-blue-50 rounded-lg p-6 mt-8">
                    <p className="text-blue-800 font-semibold mb-2">Need Help?</p>
                    <p className="text-blue-700 mb-4">
                      If you have any questions about these terms and conditions, our team is here to help.
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Contact Us
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
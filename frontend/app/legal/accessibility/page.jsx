"use client";

import Link from "next/link";
import Reveal from "../../components/Reveal";

export default function AccessibilityPage() {
  const lastUpdated = "December 15, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_60%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Reveal>
            <div className="text-center">
              <p className="text-emerald-300 text-sm font-bold uppercase tracking-wider mb-2">Legal Document</p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                Accessibility Statement
              </h1>
              <p className="text-emerald-100 text-lg sm:text-xl max-w-3xl mx-auto">
                We are committed to ensuring digital accessibility for all users
              </p>
              <p className="mt-4 text-emerald-200 text-sm">
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
                  <a href="#commitment" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">1. Our Commitment</a>
                  <a href="#standards" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">2. Accessibility Standards</a>
                  <a href="#features" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">3. Accessibility Features</a>
                  <a href="#assistive" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">4. Assistive Technology</a>
                  <a href="#alternatives" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">5. Alternative Formats</a>
                  <a href="#limitations" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">6. Known Limitations</a>
                  <a href="#ongoing" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">7. Ongoing Efforts</a>
                  <a href="#feedback" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">8. Feedback Process</a>
                  <a href="#enforcement" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">9. Enforcement Procedure</a>
                  <a href="#technical" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">10. Technical Specifications</a>
                  <a href="#contact" className="block text-sm text-gray-600 hover:text-emerald-600 py-1">11. Contact Information</a>
                </nav>
              </div>
            </Reveal>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
                <div className="prose prose-lg prose-gray max-w-none">
                  
                  <section id="commitment" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-emerald-600 font-bold text-sm">1</span>
                      </span>
                      Our Commitment to Accessibility
                    </h2>
                    <p className="text-gray-700 mb-4">
                      [Company Name] is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to ensure our website and services are accessible to all users.
                    </p>
                    <p className="text-gray-700">
                      We believe that the internet should be available to anyone and are committed to providing a website that is accessible to the widest possible audience, regardless of ability.
                    </p>
                  </section>

                  <section id="standards" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-teal-600 font-bold text-sm">2</span>
                      </span>
                      Accessibility Standards
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Our website strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content accessible to people with a wide range of disabilities.
                    </p>
                    <div className="bg-emerald-50 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-3">WCAG 2.1 Guidelines</h3>
                      <ul className="list-disc pl-6 text-emerald-700 space-y-2">
                        <li><strong>Perceivable:</strong> Information must be presentable in ways users can perceive</li>
                        <li><strong>Operable:</strong> Interface components must be operable by all users</li>
                        <li><strong>Understandable:</strong> Information and UI operation must be understandable</li>
                        <li><strong>Robust:</strong> Content must be robust enough for interpretation by assistive technologies</li>
                      </ul>
                    </div>
                  </section>

                  <section id="features" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-cyan-600 font-bold text-sm">3</span>
                      </span>
                      Accessibility Features
                    </h2>
                    <p className="text-gray-700 mb-4">Our website includes the following accessibility features:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li><strong>Keyboard Navigation:</strong> Full website navigation using only the keyboard</li>
                      <li><strong>Screen Reader Support:</strong> Compatible with popular screen readers</li>
                      <li><strong>Alternative Text:</strong> Descriptive text for all images and graphics</li>
                      <li><strong>Color Contrast:</strong> High contrast ratios for text and background elements</li>
                      <li><strong>Focus Indicators:</strong> Clear visual focus indicators for interactive elements</li>
                      <li><strong>Resizable Text:</strong> Text can be resized up to 200% without loss of functionality</li>
                      <li><strong>Consistent Navigation:</strong> Consistent navigation structure across all pages</li>
                      <li><strong>Skip Links:</strong> Skip navigation links to main content areas</li>
                    </ul>
                  </section>

                  <section id="assistive" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">4</span>
                      </span>
                      Assistive Technology Compatibility
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Our website is designed to be compatible with various assistive technologies including:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Screen Readers</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• JAWS (Windows)</li>
                          <li>• NVDA (Windows)</li>
                          <li>• VoiceOver (macOS/iOS)</li>
                          <li>• TalkBack (Android)</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Other Technologies</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Dragon NaturallySpeaking</li>
                          <li>• ZoomText Magnifier</li>
                          <li>• High Contrast Mode</li>
                          <li>• Voice Control Software</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section id="alternatives" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold text-sm">5</span>
                      </span>
                      Alternative Formats
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We strive to provide information in formats that are accessible to all users. Upon request, we can provide:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Documents in alternative formats (PDF, Word, plain text)</li>
                      <li>Audio recordings of written content</li>
                      <li>Large print versions of documents</li>
                      <li>Braille versions of important documents</li>
                      <li>Screen reader friendly versions of forms and applications</li>
                    </ul>
                  </section>

                  <section id="limitations" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-bold text-sm">6</span>
                      </span>
                      Known Limitations
                    </h2>
                    <p className="text-gray-700 mb-4">
                      While we strive for full accessibility, some limitations may exist:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Some third-party content may not be fully accessible</li>
                      <li>Legacy content may not meet current accessibility standards</li>
                      <li>Complex data visualizations may require additional descriptions</li>
                      <li>Some interactive elements may have limited keyboard support</li>
                    </ul>
                    <p className="text-gray-700">
                      We are actively working to address these limitations and improve accessibility across all content.
                    </p>
                  </section>

                  <section id="ongoing" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">7</span>
                      </span>
                      Ongoing Accessibility Efforts
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We are committed to continuous improvement and have implemented the following measures:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Regular accessibility audits and testing</li>
                      <li>Staff training on accessibility best practices</li>
                      <li>Integration of accessibility into our design process</li>
                      <li>User testing with people who have disabilities</li>
                      <li>Partnership with accessibility consultants</li>
                      <li>Continuous monitoring and improvement of accessibility features</li>
                    </ul>
                  </section>

                  <section id="feedback" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-bold text-sm">8</span>
                      </span>
                      Feedback Process
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We welcome your feedback on the accessibility of our website and services. If you encounter accessibility barriers, please let us know:
                    </p>
                    <div className="bg-indigo-50 rounded-lg p-6 mb-4">
                      <h4 className="font-semibold text-indigo-800 mb-3">How to Contact Us</h4>
                      <ul className="space-y-2 text-indigo-700">
                        <li><strong>Email:</strong> accessibility@company.com</li>
                        <li><strong>Phone:</strong> 1-800-ACCESSIBILITY</li>
                        <li><strong>Mail:</strong> Accessibility Team, 123 Main St, City, State 12345</li>
                      </ul>
                    </div>
                    <p className="text-gray-700">
                      We aim to respond to accessibility feedback within 2 business days and will work to resolve any issues promptly.
                    </p>
                  </section>

                  <section id="enforcement" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-red-600 font-bold text-sm">9</span>
                      </span>
                      Enforcement Procedure
                    </h2>
                    <p className="text-gray-700 mb-4">
                      If you are not satisfied with our response to your accessibility concern, you may file a complaint with:
                    </p>
                    <div className="bg-red-50 rounded-lg p-6">
                      <h4 className="font-semibold text-red-800 mb-3">External Resources</h4>
                      <ul className="space-y-2 text-red-700">
                        <li>• U.S. Department of Justice - ADA Information</li>
                        <li>• Equal Employment Opportunity Commission (EEOC)</li>
                        <li>• Your state's disability rights organization</li>
                        <li>• Local ombudsman or consumer protection agency</li>
                      </ul>
                    </div>
                  </section>

                  <section id="technical" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-yellow-600 font-bold text-sm">10</span>
                      </span>
                      Technical Specifications
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Our website is designed to be compatible with:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Browsers</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Chrome (latest version)</li>
                          <li>• Firefox (latest version)</li>
                          <li>• Safari (latest version)</li>
                          <li>• Edge (latest version)</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Operating Systems</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Windows 10 and later</li>
                          <li>• macOS 10.14 and later</li>
                          <li>• iOS 13 and later</li>
                          <li>• Android 8 and later</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-pink-600 font-bold text-sm">11</span>
                      </span>
                      Contact Information
                    </h2>
                    <p className="text-gray-700 mb-4">
                      For accessibility-related questions or concerns, please contact our accessibility team:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">accessibility@company.com</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">1-800-ACCESSIBILITY</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">123 Accessibility Street, City, State 12345</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="bg-emerald-50 rounded-lg p-6 mt-8">
                    <p className="text-emerald-800 font-semibold mb-2">Commitment to Inclusion</p>
                    <p className="text-emerald-700 mb-4">
                      We are committed to ensuring that our website and services are accessible to everyone, regardless of ability. Your feedback helps us improve.
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
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
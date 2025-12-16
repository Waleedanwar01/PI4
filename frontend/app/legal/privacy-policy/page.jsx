"use client";

import Link from "next/link";
import Reveal from "../../components/Reveal";

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 15, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(124,58,237,0.1),transparent_60%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <Reveal>
            <div className="text-center">
              <p className="text-violet-300 text-sm font-bold uppercase tracking-wider mb-2">Legal Document</p>
              <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
                Privacy Policy
              </h1>
              <p className="text-violet-100 text-lg sm:text-xl max-w-3xl mx-auto">
                Your privacy is important to us. Learn how we collect, use, and protect your information
              </p>
              <p className="mt-4 text-violet-200 text-sm">
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
                  <a href="#introduction" className="block text-sm text-gray-600 hover:text-violet-600 py-1">1. Introduction</a>
                  <a href="#information" className="block text-sm text-gray-600 hover:text-violet-600 py-1">2. Information We Collect</a>
                  <a href="#usage" className="block text-sm text-gray-600 hover:text-violet-600 py-1">3. How We Use Information</a>
                  <a href="#sharing" className="block text-sm text-gray-600 hover:text-violet-600 py-1">4. Information Sharing</a>
                  <a href="#cookies" className="block text-sm text-gray-600 hover:text-violet-600 py-1">5. Cookies & Tracking</a>
                  <a href="#security" className="block text-sm text-gray-600 hover:text-violet-600 py-1">6. Data Security</a>
                  <a href="#retention" className="block text-sm text-gray-600 hover:text-violet-600 py-1">7. Data Retention</a>
                  <a href="#rights" className="block text-sm text-gray-600 hover:text-violet-600 py-1">8. Your Rights</a>
                  <a href="#third-party" className="block text-sm text-gray-600 hover:text-violet-600 py-1">9. Third-Party Services</a>
                  <a href="#international" className="block text-sm text-gray-600 hover:text-violet-600 py-1">10. International Transfers</a>
                  <a href="#children" className="block text-sm text-gray-600 hover:text-violet-600 py-1">11. Children's Privacy</a>
                  <a href="#changes" className="block text-sm text-gray-600 hover:text-violet-600 py-1">12. Policy Changes</a>
                  <a href="#contact" className="block text-sm text-gray-600 hover:text-violet-600 py-1">13. Contact Us</a>
                </nav>
              </div>
            </Reveal>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-10">
                <div className="prose prose-lg prose-gray max-w-none">
                  
                  <section id="introduction" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-violet-600 font-bold text-sm">1</span>
                      </span>
                      Introduction
                    </h2>
                    <p className="text-gray-700 mb-4">
                      [Company Name] ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our insurance services.
                    </p>
                    <p className="text-gray-700 mb-4">
                      This policy applies to information we collect on our website, through our mobile applications, and in electronic communications between you and our company. It does not apply to information collected by us offline or through other means.
                    </p>
                    <p className="text-gray-700">
                      By using our services, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our services.
                    </p>
                  </section>

                  <section id="information" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-purple-600 font-bold text-sm">2</span>
                      </span>
                      Information We Collect
                    </h2>
                    <p className="text-gray-700 mb-4">We may collect information about you in a variety of ways:</p>
                    
                    <div className="bg-purple-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-purple-800 mb-3">Personal Information</h3>
                      <ul className="list-disc pl-6 text-purple-700 space-y-2">
                        <li>Name, email address, telephone number, and postal address</li>
                        <li>Date of birth and social security number (for insurance purposes)</li>
                        <li>Financial information (income, bank account details)</li>
                        <li>Insurance policy information and claims history</li>
                        <li>Driver's license number and vehicle information</li>
                        <li>Health information (for health and life insurance)</li>
                      </ul>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-6 mb-4">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-3">Automatically Collected Information</h3>
                      <ul className="list-disc pl-6 text-indigo-700 space-y-2">
                        <li>IP address, browser type, and device information</li>
                        <li>Pages visited, time spent on pages, and click-through rates</li>
                        <li>Referring website addresses and exit pages</li>
                        <li>Cookies and similar tracking technologies</li>
                        <li>Location information (with your permission)</li>
                      </ul>
                    </div>
                  </section>

                  <section id="usage" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">3</span>
                      </span>
                      How We Use Your Information
                    </h2>
                    <p className="text-gray-700 mb-4">We use the information we collect for various purposes, including:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li><strong>Insurance Services:</strong> Processing applications, underwriting, and claims handling</li>
                      <li><strong>Customer Service:</strong> Responding to inquiries and providing support</li>
                      <li><strong>Marketing:</strong> Sending promotional materials and product information (with consent)</li>
                      <li><strong>Communication:</strong> Sending important notices about your policies and services</li>
                      <li><strong>Website Improvement:</strong> Analyzing usage patterns to enhance user experience</li>
                      <li><strong>Legal Compliance:</strong> Meeting regulatory requirements and preventing fraud</li>
                      <li><strong>Business Operations:</strong> Processing payments, maintaining records, and analytics</li>
                    </ul>
                  </section>

                  <section id="sharing" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-cyan-600 font-bold text-sm">4</span>
                      </span>
                      Information Sharing and Disclosure
                    </h2>
                    <p className="text-gray-700 mb-4">We may share your information in the following circumstances:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li><strong>Service Providers:</strong> With trusted partners who assist in our operations</li>
                      <li><strong>Insurance Industry:</strong> With other insurers for industry databases and fraud prevention</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                      <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                      <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                    </ul>
                    <p className="text-gray-700">
                      We do not sell, trade, or otherwise transfer your personal information to third parties for their marketing purposes without your explicit consent.
                    </p>
                  </section>

                  <section id="cookies" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-teal-600 font-bold text-sm">5</span>
                      </span>
                      Cookies and Tracking Technologies
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We use cookies and similar tracking technologies to enhance your experience on our website. These technologies help us:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Remember your preferences and settings</li>
                      <li>Analyze website traffic and usage patterns</li>
                      <li>Provide personalized content and advertisements</li>
                      <li>Improve website functionality and performance</li>
                    </ul>
                    <div className="bg-teal-50 rounded-lg p-6 mb-4">
                      <h4 className="font-semibold text-teal-800 mb-3">Types of Cookies We Use</h4>
                      <ul className="space-y-2 text-teal-700">
                        <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                      </ul>
                    </div>
                  </section>

                  <section id="security" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold text-sm">6</span>
                      </span>
                      Data Security
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We implement appropriate technical and organizational security measures to protect your personal information:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li><strong>Encryption:</strong> Data encryption in transit and at rest</li>
                      <li><strong>Access Controls:</strong> Restricted access to personal information</li>
                      <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                      <li><strong>Employee Training:</strong> Regular privacy and security training for staff</li>
                      <li><strong>Incident Response:</strong> Procedures for responding to security breaches</li>
                      <li><strong>Third-Party Security:</strong> Requirement for service providers to maintain security standards</li>
                    </ul>
                    <p className="text-gray-700">
                      While we strive to protect your personal information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                    </p>
                  </section>

                  <section id="retention" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-yellow-600 font-bold text-sm">7</span>
                      </span>
                      Data Retention
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li><strong>Active Policies:</strong> Throughout the policy term and applicable grace period</li>
                      <li><strong>Claims Data:</strong> Per regulatory requirements (typically 7-10 years)</li>
                      <li><strong>Marketing Data:</strong> Until you opt out or request deletion</li>
                      <li><strong>Website Data:</strong> Per our data retention schedule and legal obligations</li>
                    </ul>
                  </section>

                  <section id="rights" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-orange-600 font-bold text-sm">8</span>
                      </span>
                      Your Privacy Rights
                    </h2>
                    <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li><strong>Access:</strong> Request access to your personal information</li>
                      <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                      <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                      <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                      <li><strong>Opt-out:</strong> Object to certain processing activities</li>
                      <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
                    </ul>
                    <div className="bg-orange-50 rounded-lg p-6">
                      <p className="text-orange-800">
                        <strong>How to Exercise Your Rights:</strong> Contact us at privacy@company.com or use the contact information provided below. We will respond to your request within the timeframes required by applicable law.
                      </p>
                    </div>
                  </section>

                  <section id="third-party" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-red-600 font-bold text-sm">9</span>
                      </span>
                      Third-Party Services
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
                    </p>
                    <p className="text-gray-700 mb-4">We may also use third-party service providers who have access to your personal information:</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Cloud storage and hosting providers</li>
                      <li>Payment processing companies</li>
                      <li>Analytics and marketing platforms</li>
                      <li>Customer relationship management systems</li>
                      <li>Communication and email service providers</li>
                    </ul>
                  </section>

                  <section id="international" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-pink-600 font-bold text-sm">10</span>
                      </span>
                      International Data Transfers
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. When we transfer your information internationally, we implement appropriate safeguards to protect your information in accordance with this policy and applicable law.
                    </p>
                  </section>

                  <section id="children" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-bold text-sm">11</span>
                      </span>
                      Children's Privacy
                    </h2>
                    <p className="text-gray-700 mb-4">
                      Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
                    </p>
                    <p className="text-gray-700">
                      Parents and guardians who believe their child has provided personal information to us should contact us immediately.
                    </p>
                  </section>

                  <section id="changes" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-bold text-sm">12</span>
                      </span>
                      Changes to This Privacy Policy
                    </h2>
                    <p className="text-gray-700 mb-4">
                      We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
                    </p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                      <li>Posting the updated policy on our website</li>
                      <li>Sending an email notification to registered users</li>
                      <li>Displaying a notice on our website</li>
                    </ul>
                    <p className="text-gray-700">
                      Your continued use of our services after the effective date of any changes constitutes acceptance of the updated policy.
                    </p>
                  </section>

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-violet-600 font-bold text-sm">13</span>
                      </span>
                      Contact Information
                    </h2>
                    <p className="text-gray-700 mb-4">
                      If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">privacy@company.com</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-700">1-800-PRIVACY</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-700">Privacy Officer, 123 Privacy Street, City, State 12345</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <div className="bg-violet-50 rounded-lg p-6 mt-8">
                    <p className="text-violet-800 font-semibold mb-2">Questions About Your Privacy?</p>
                    <p className="text-violet-700 mb-4">
                      We're here to help. If you have any questions about how we protect your privacy or want to exercise your rights, please don't hesitate to contact us.
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200"
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
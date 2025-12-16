'use client';

import ResponsiveDropdown from './ResponsiveDropdown';

function extractCarrierInfo(html) {
  try {
    const strongMatch = html.match(/<strong[^>]*>(.*?)<\/strong>/i);
    if (strongMatch) {
      const carrierName = strongMatch[1].trim();
      
      // Extract phone numbers
      const phoneMatches = html.match(/tel:[\d\s\-\(\)\+\.]+/gi) || [];
      const phoneNumbers = phoneMatches.map(p => p.replace('tel:', '').trim());
      
      // Extract URLs
      const urlMatches = html.match(/href=["'](.*?)["']/gi) || [];
      const urls = urlMatches.map(u => {
        const match = u.match(/href=["'](.*?)["']/);
        return match ? match[1] : '';
      }).filter(Boolean);
      
      return {
        name: carrierName,
        phones: phoneNumbers,
        urls: urls,
        html: html
      };
    }
  } catch (error) {
    console.error('Error extracting carrier info:', error);
  }
  return null;
}

export function CarrierDropdown({ carriersHtml }) {
  const carriers = [];
  
  // Parse carrier information from HTML
  if (carriersHtml) {
    const carrierBlocks = carriersHtml
      .split(/<\/p>/i)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.endsWith("</p>") ? s : s + "</p>");
    
    for (const block of carrierBlocks) {
      const carrierInfo = extractCarrierInfo(block);
      if (carrierInfo) {
        carriers.push(carrierInfo);
      }
    }
  }

  const renderCarrierItem = (carrier, index) => (
    <div className="group relative rounded-xl border border-gray-200 p-6 bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex-1">
          {carrier.name}
        </h4>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 ml-4">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      
      {/* Phone Numbers */}
      {carrier.phones && carrier.phones.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact Numbers
          </h5>
          <div className="space-y-2">
            {carrier.phones.map((phone, phoneIndex) => (
              <div key={phoneIndex} className="flex items-center gap-2">
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  {phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Links */}
      {carrier.urls && carrier.urls.length > 0 && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Online Resources
          </h5>
          <div className="space-y-2">
            {carrier.urls.map((url, urlIndex) => {
              const isPdf = url.toLowerCase().includes('.pdf');
              const isClaimForm = url.toLowerCase().includes('claim') || url.toLowerCase().includes('report');
              
              return (
                <div key={urlIndex} className="flex items-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      isPdf 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : isClaimForm
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                    download={isPdf ? url.split('/').pop() : undefined}
                  >
                    {isPdf && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {isClaimForm ? 'Report Claim' : isPdf ? 'Download PDF' : 'Visit Website'}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Raw HTML content if available */}
      {carrier.html && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="prose prose-sm max-w-none text-gray-600" 
               dangerouslySetInnerHTML={{ __html: carrier.html }} />
        </div>
      )}
    </div>
  );

  return (
    <ResponsiveDropdown
      title="Insurance Carriers - Claims Contact Information"
      items={carriers}
      renderItem={renderCarrierItem}
      defaultOpen={true}
      icon="/api/placeholder/64/64"
      className="mb-6"
      maxHeight="max-h-[800px]"
    />
  );
}

export function QuickTipsDropdown() {
  const tips = [
    {
      icon: "📸",
      title: "Take Photos",
      description: "Always take photographs for documentation of the incident scene, damages, and any injuries."
    },
    {
      icon: "👥", 
      title: "Get Witness Info",
      description: "If you have witnesses, make sure you have their full name and contact phone number."
    },
    {
      icon: "📝",
      title: "Document Details",
      description: "Write down as much as you can remember regarding the details immediately after the incident occurs."
    },
    {
      icon: "📋",
      title: "Policy Ready",
      description: "Have your policy number ready when calling the claims department."
    },
    {
      icon: "📞",
      title: "Contact Agent",
      description: "We encourage you to talk to your agent before submitting a claim for advice and assistance."
    },
    {
      icon: "⏰",
      title: "Time Matters",
      description: "Report claims promptly as delays may affect the claims process."
    }
  ];

  const renderTipItem = (tip, index) => (
    <div className="group relative rounded-xl border border-gray-200 p-4 bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform duration-300">
          {tip.icon}
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
            {tip.title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {tip.description}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveDropdown
      title="Quick Tips for Claims"
      items={tips}
      renderItem={renderTipItem}
      defaultOpen={false}
      icon="/api/placeholder/64/64"
      className="mb-6"
      maxHeight="max-h-96"
    />
  );
}
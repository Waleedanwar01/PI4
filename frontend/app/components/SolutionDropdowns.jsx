'use client';

import ResponsiveDropdown from './ResponsiveDropdown';

const isPdf = (u) => {
  try { const x = String(u || ""); return x.toLowerCase().includes(".pdf"); } catch { return false; }
};

export function ServiceDropdown({ service }) {
  const gradients = [
    'from-yellow-400 to-orange-500',
    'from-emerald-400 to-teal-500',
    'from-blue-400 to-indigo-500',
    'from-purple-400 to-pink-500',
    'from-red-400 to-rose-500'
  ];

  const renderServiceItem = (serviceItem, index) => {
    const gradient = gradients[index % gradients.length];
    
    return (
      <div className="group relative rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden bg-white hover:-translate-y-1">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 flex-1">
              {serviceItem.title}
            </h4>
            <div className={`ml-4 w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          {serviceItem.description_html && (
            <div className="prose prose-sm prose-gray max-w-none mb-4 prose-p:text-gray-700" 
                 dangerouslySetInnerHTML={{ __html: serviceItem.description_html }} />
          )}
          
          {serviceItem.pricing_html && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: serviceItem.pricing_html }} />
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {serviceItem.buttons && serviceItem.buttons.length > 0 && serviceItem.buttons.map((b, j) => {
              const href = b.file_url || b.url || '#';
              const pdf = isPdf(href);
              const downloadName = pdf && b.file_url ? href.split('/').pop() : undefined;
              return (
                <a
                  key={j}
                  href={href}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                  target={pdf ? "_blank" : undefined}
                  rel={pdf ? "noopener noreferrer" : undefined}
                  download={downloadName}
                >
                  {b.label}
                </a>
              );
            })}
            
            {serviceItem.learn_more_url && (
              <a 
                href={serviceItem.learn_more_url} 
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
              >
                Learn more
              </a>
            )}
            
            {serviceItem.schedule_url && (
              <a 
                href={serviceItem.schedule_url} 
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
              >
                Schedule
              </a>
            )}
            
            {serviceItem.upcoming_url && (
              <a 
                href={serviceItem.upcoming_url} 
                className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
              >
                Upcoming classes
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveDropdown
      title="Consulting Services"
      items={service ? [service] : []}
      renderItem={renderServiceItem}
      defaultOpen={false}
      icon="/api/placeholder/64/64"
      className="mb-6"
      maxHeight="max-h-[800px]"
    />
  );
}

export function IndustryDropdown({ industries }) {
  const renderIndustryItem = (industry, index) => (
    <div className="group relative rounded-xl border border-gray-200 p-4 text-center bg-white hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        {industry.icon ? (
          <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 group-hover:scale-110 transition-transform duration-300">
            <img src={industry.icon} alt={industry.name} className="w-full h-full object-contain brightness-0 invert" />
          </div>
        ) : (
          <div className="h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
        )}
        <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {industry.name}
        </h4>
      </div>
    </div>
  );

  return (
    <ResponsiveDropdown
      title="Industries We Specialize In"
      items={industries || []}
      renderItem={renderIndustryItem}
      defaultOpen={false}
      icon="/api/placeholder/64/64"
      className="mb-6"
      maxHeight="max-h-96"
    />
  );
}

export function ConsultantDropdown({ consultants }) {
  const renderConsultantItem = (consultant, index) => (
    <div className="group relative rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 bg-white hover:-translate-y-1 overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {consultant.photo ? (
          <img
            src={consultant.photo}
            alt={consultant.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
            <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-1">
          {consultant.name}
        </h4>
        {consultant.title && (
          <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wider">
            {consultant.title}
          </p>
        )}
        {consultant.intro_html && (
          <div className="text-gray-600 mb-4 prose prose-sm max-w-none" 
               dangerouslySetInnerHTML={{ __html: consultant.intro_html }} />
        )}
        <div className="flex gap-2">
          {consultant.email && (
            <a
              href={`mailto:${consultant.email}`}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          )}
          {consultant.phone && (
            <a
              href={`tel:${consultant.phone}`}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors duration-200"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveDropdown
      title="Expert Consultants"
      items={consultants || []}
      renderItem={renderConsultantItem}
      defaultOpen={false}
      icon="/api/placeholder/64/64"
      className="mb-6"
      maxHeight="max-h-[600px]"
    />
  );
}
'use client';

import { useState } from 'react';
import Reveal from './Reveal';

export default function ResponsiveDropdown({ 
  title, 
  items, 
  renderItem, 
  defaultOpen = false,
  icon = null,
  className = "",
  maxHeight = "max-h-96"
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <img src={icon} alt="" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        </div>
        <svg
          className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className={`transition-all duration-500 ease-in-out ${
        isOpen ? `${maxHeight} opacity-100` : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-6">
          <div className="space-y-4">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  {renderItem(item, index)}
                </Reveal>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No items available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
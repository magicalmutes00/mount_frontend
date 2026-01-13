import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Church, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PublicNavigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/mass-booking', label: t('nav.massBooking') },
    { path: '/donations', label: t('nav.donations') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/livestream', label: t('nav.livestream') },
    { path: '/testimonies', label: t('nav.testimonies') },
    { path: '/prayer-request', label: t('nav.prayerRequest') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg bg-white/95 backdrop-blur-md' : 'shadow-md'
    }`}>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with gentle glow effect */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Church className="w-8 h-8 text-green-700 transition-all duration-500 group-hover:text-green-600 group-hover:drop-shadow-lg" />
              {/* Gentle glow effect */}
              <div className="absolute inset-0 w-8 h-8 bg-green-300 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-all duration-500"></div>
            </div>
            <span className={`font-semibold text-green-800 transition-all duration-300 group-hover:text-green-600 whitespace-nowrap ${
              language === 'മലയാളം' ? 'text-sm' : 
              language === 'தமிழ்' || language === 'हिंदी' ? 'text-base' : 
              'text-base'
            }`}>
              Our Lady Of Sorrows Shrine
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-2 py-2 font-medium transition-all duration-300 group ${
                  language === 'മലയാളം' ? 'text-xs' : 
                  language === 'தமிழ்' ? 'text-sm' : 
                  'text-sm'
                } ${
                  isActive(item.path)
                    ? 'text-green-700'
                    : 'text-gray-700 hover:text-green-700'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                
                {/* Animated underline */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 transform origin-left transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'scale-x-100' 
                    : 'scale-x-0 group-hover:scale-x-100'
                }`}></div>
                
                {/* Subtle background on hover */}
                <div className="absolute inset-0 bg-green-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
            
            {/* Language Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-all duration-300 group"
              >
                <Globe className="w-4 h-4 text-green-500" />
                <span>{language}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${languageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={() => {
                      setLanguage('ENG');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-sm text-left hover:bg-green-50 hover:text-green-700 transition-colors ${
                      language === 'ENG' ? 'text-green-700 bg-green-50' : 'text-gray-700'
                    }`}
                  >
                    ENG
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('தமிழ்');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-sm text-left hover:bg-green-50 hover:text-green-700 transition-colors ${
                      language === 'தமிழ்' ? 'text-green-700 bg-green-50' : 'text-gray-700'
                    }`}
                  >
                    தமிழ்
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('മലയാളം');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-sm text-left hover:bg-green-50 hover:text-green-700 transition-colors ${
                      language === 'മലയാളം' ? 'text-green-700 bg-green-50' : 'text-gray-700'
                    }`}
                  >
                    മലയാളം
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('हिंदी');
                      setLanguageDropdownOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-sm text-left hover:bg-green-50 hover:text-green-700 transition-colors ${
                      language === 'हिंदी' ? 'text-green-700 bg-green-50' : 'text-gray-700'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile and Tablet menu button with clean animation */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-green-700 hover:bg-green-50 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <div className="absolute inset-0 flex flex-col justify-center space-y-1.5">
                <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}></span>
              </div>
            </div>
          </button>
        </div>

        {/* Mobile and Tablet Navigation with smooth slide */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-gray-200 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 font-medium rounded-md transition-all duration-300 ${
                  language === 'മലയാളം' ? 'text-sm' : 
                  language === 'தமிழ்' ? 'text-sm' : 
                  'text-sm'
                } ${
                  isActive(item.path)
                    ? 'text-green-700 bg-green-50 border-l-4 border-green-600'
                    : 'text-gray-700 hover:text-green-700 hover:bg-green-50 hover:pl-6'
                }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 30}ms` : '0ms'
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Language Options */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{t('common.language')}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLanguage('ENG')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'ENG' 
                      ? 'text-green-700 bg-green-50 border border-green-200' 
                      : 'text-gray-700 bg-gray-50 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  ENG
                </button>
                <button
                  onClick={() => setLanguage('தமிழ்')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'தமிழ்' 
                      ? 'text-green-700 bg-green-50 border border-green-200' 
                      : 'text-gray-700 bg-gray-50 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setLanguage('മലയാളം')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'മലയാളം' 
                      ? 'text-green-700 bg-green-50 border border-green-200' 
                      : 'text-gray-700 bg-gray-50 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  മലയാളം
                </button>
                <button
                  onClick={() => setLanguage('हिंदी')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    language === 'हिंदी' 
                      ? 'text-green-700 bg-green-50 border border-green-200' 
                      : 'text-gray-700 bg-gray-50 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
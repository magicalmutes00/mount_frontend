import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { Eye, Target, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const isTamil = language === 'தமிழ்';

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      <style>{`
        /* Tamil-specific font sizing */
        .tamil-text {
          font-size: 0.9em;
        }

        .tamil-heading {
          font-size: 0.85em;
        }

        .tamil-title {
          font-size: 0.9em;
        }

        .tamil-subtitle {
          font-size: 0.85em;
        }

        /* Animation classes */
        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 1s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }

        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.3s; }
        .stagger-3 { animation-delay: 0.5s; }
        .stagger-4 { animation-delay: 0.7s; }
        .stagger-5 { animation-delay: 0.9s; }
        .stagger-6 { animation-delay: 1.1s; }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Header */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl font-bold text-center mb-4 ${isTamil ? 'tamil-title' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            {t('about.page.title')}
          </h1>
          <p className={`text-center text-green-100 max-w-3xl mx-auto ${isTamil ? 'tamil-subtitle' : ''} ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            {t('about.page.subtitle')}
          </p>
        </div>
      </div>

      {/* Hero Section - A Life of Faith & Courage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          <div className={`md:col-span-1 rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            <img
              src="/about1.png"
              alt={t('about.statue.title')}
              className="w-full h-96 object-contain bg-gray-50"
            />
          </div>
          <div className={`md:col-span-2 ${isVisible ? 'animate-slideInRight stagger-2' : 'opacity-0'}`}>
            <h2 className={`text-3xl font-semibold text-green-800 mb-6 ${isTamil ? 'tamil-heading' : ''}`}>
              {t('about.life.title')}
            </h2>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''}`}>
              <p>{t('about.life.description')}</p>
              <p>{t('about.journey.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Early Life & Conversion */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            {t('about.early.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <div className={`space-y-4 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''}`}>
                <p>{t('about.early.birth')}</p>
                <p>{t('about.early.father')}</p>
                <p>{t('about.early.palace')}</p>
                <Card className="border-green-200 bg-green-100">
                  <CardContent className="pt-6">
                    <h4 className={`text-green-800 mb-3 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                      {t('about.turning.title')}
                    </h4>
                    <div className={`text-gray-700 text-sm leading-relaxed space-y-2 ${isTamil ? 'tamil-text' : ''}`}>
                      <p>{t('about.turning.battle')}</p>
                      <p>{t('about.turning.friendship')}</p>
                      <p>{t('about.turning.baptism')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className={`rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              <img
                src="/about2.jpeg"
                alt={t('about.image.memorial')}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline of His Life */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
          {t('about.timeline.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className={`rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
            <img
              src="/about3.jpeg"
              alt={t('about.image.memorial2')}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`space-y-6 ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className={`text-green-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.birth')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.birth')}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className={`text-green-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.battle')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.battle')}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className={`text-green-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.conversion')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.conversion')}</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6 py-3">
              <div className={`text-green-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.imprisonment')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.imprisonment')}</p>
            </div>
            <div className="border-l-4 border-red-500 pl-6 py-3">
              <div className={`text-red-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.martyrdom')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.martyrdom')}</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-6 py-3">
              <div className={`text-blue-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.beatified')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.beatified')}</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-6 py-3">
              <div className={`text-yellow-800 font-bold text-lg mb-2 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.date.canonized')}</div>
              <p className={`text-gray-700 ${isTamil ? 'tamil-text' : ''}`}>{t('about.timeline.canonized')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Persecution & Martyrdom */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            {t('about.persecution.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className={`md:col-span-2 space-y-4 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''} ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <p>{t('about.persecution.conversion')}</p>
              <p>{t('about.persecution.captivity')}</p>
              <p>{t('about.persecution.torture')}</p>
              
              {/* Miracle Quote */}
              <div className="bg-green-100 border-l-4 border-green-500 p-4 my-6 rounded-r-lg">
                <p className={`text-green-800 italic font-medium ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.miracle.quote')}
                </p>
              </div>
            </div>
            <div className={`md:col-span-1 rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              <img
                src="/about4.JPG"
                alt={t('about.image.church')}
                className="w-full h-80 object-contain bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Places & Final Resting Place */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
          {t('about.sacred.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`rounded-lg overflow-hidden shadow-lg card-hover ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
            <img
              src="/about5.JPG"
              alt="St. Francis Xavier's Cathedral"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className={`space-y-4 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''} ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
            <p>{t('about.tomb.cathedral')}</p>
            <p>{t('about.tomb.restoration')}</p>
            <p>{t('about.pilgrimage.sites')}</p>
          </div>
        </div>
      </div>

      {/* Journey to Sainthood */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            {t('about.journey.sainthood')}
          </h2>
          <div className={`max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''} ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <p>{t('about.journey.path')}</p>
            <p>{t('about.journey.beatification')}</p>
            
            {/* Historic Achievement Box */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 my-8 rounded-r-lg">
              <h4 className={`text-yellow-800 mb-3 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                {t('about.historic.achievement')}
              </h4>
              <p className={`text-yellow-800 ${isTamil ? 'tamil-text' : ''}`}>
                {t('about.historic.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legacy & Veneration */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
          {t('about.legacy.title')}
        </h2>
        <div className={`max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''} ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
          <p>{t('about.patron.saint')}</p>
          <p>{t('about.witness.legacy')}</p>
          
          {/* Pope Benedict XVI Quote */}
          <div className="bg-blue-100 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
            <p className={`text-blue-800 italic font-medium text-lg ${isTamil ? 'tamil-text' : ''}`}>
              {t('about.miracle.quote')}
            </p>
            <p className={`text-blue-700 text-sm mt-3 ${isTamil ? 'tamil-text' : ''}`}>
              {t('about.quote.attribution')}
            </p>
          </div>
        </div>
      </div>

      {/* Vision and Mission */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <Card className={`border-green-200 card-hover ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center animate-float">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-2xl font-semibold text-green-800 ${isTamil ? 'tamil-heading' : ''}`}>
                    {t('about.vision.title')}
                  </h3>
                </div>
                <p className={`text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.vision.description')}
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className={`border-green-200 card-hover ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center animate-float" style={{animationDelay: '0.5s'}}>
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-2xl font-semibold text-green-800 ${isTamil ? 'tamil-heading' : ''}`}>
                    {t('about.mission.title')}
                  </h3>
                </div>
                <p className={`text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.mission.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Shrine Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className={`flex items-center gap-3 mb-6 ${isVisible ? 'animate-slideInLeft stagger-1' : 'opacity-0'}`}>
            <Heart className="w-8 h-8 text-green-700 animate-pulse-custom" />
            <h2 className={`text-3xl font-semibold text-green-800 ${isTamil ? 'tamil-heading' : ''}`}>
              {t('about.shrine.title')}
            </h2>
          </div>
          <div className={`space-y-4 text-gray-700 leading-relaxed ${isTamil ? 'tamil-text' : ''} ${isVisible ? 'animate-fadeInUp stagger-2' : 'opacity-0'}`}>
            <p>{t('about.shrine.description')}</p>
            <p>{t('about.shrine.pilgrimage')}</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-semibold text-green-800 text-center mb-12 ${isTamil ? 'tamil-heading' : ''} ${isVisible ? 'animate-fadeInUp stagger-1' : 'opacity-0'}`}>
            {t('about.services.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-2' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={`mb-3 text-green-700 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('about.services.masses')}
                </h4>
                <p className={`text-gray-700 text-sm ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.services.masses.time')}
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-3' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={`mb-3 text-green-700 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('about.services.pilgrimage')}
                </h4>
                <p className={`text-gray-700 text-sm ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.services.pilgrimage.desc')}
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-4' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={`mb-3 text-green-700 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('about.services.charity')}
                </h4>
                <p className={`text-gray-700 text-sm ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.services.charity.desc')}
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-5' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={`mb-3 text-green-700 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('about.services.confession')}
                </h4>
                <p className={`text-gray-700 text-sm ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.services.confession.desc')}
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-6' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={`mb-3 text-green-700 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('about.services.feast')}
                </h4>
                <p className={`text-gray-700 text-sm ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.services.feast.desc')}
                </p>
              </CardContent>
            </Card>
            <Card className={`text-center card-hover ${isVisible ? 'animate-scaleIn stagger-1' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
              <CardContent className="pt-6">
                <h4 className={`mb-3 text-green-700 font-semibold ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('about.services.youth')}
                </h4>
                <p className={`text-gray-700 text-sm ${isTamil ? 'tamil-text' : ''}`}>
                  {t('about.services.youth.desc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

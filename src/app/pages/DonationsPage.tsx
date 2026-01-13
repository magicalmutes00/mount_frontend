import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useShrineData } from '../context/ShrineDataContext';
import { useLanguage } from '../context/LanguageContext';
import { Heart, CheckCircle, IndianRupee, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const DonationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { donationPurposes, addDonation } = useShrineData();
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [formData, setFormData] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    customAmount: '',
    purpose: '',
  });

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  // Tamil font size classes
  const getTamilClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-text` : baseClass;
  };

  const getTamilHeadingClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-heading` : baseClass;
  };

  const getTamilButtonClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-button` : baseClass;
  };

  const getTamilLabelClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-label` : baseClass;
  };

  useEffect(() => {
    // Trigger animations on mount with staggered delays
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = formData.amount === 'custom' 
      ? parseFloat(formData.customAmount) 
      : parseFloat(formData.amount);

    if (!formData.donorName || !formData.purpose || !finalAmount || finalAmount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    navigate('/payment', {
      state: {
        name: formData.donorName,
        email: formData.email,
        phone: formData.phone,
        amount: finalAmount,
        purpose: formData.purpose,
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAmountSelect = (amount: number | 'custom') => {
    setSelectedAmount(amount.toString());
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: amount === 'custom' ? prev.customAmount : '',
    }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Card className="max-w-md w-full border-green-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-700" />
              <Sparkles className="w-6 h-6 text-green-500 absolute animate-ping" />
            </div>
            <div className="success-text">
              <h2 className={getTamilHeadingClass("text-2xl font-bold text-green-800 mb-4")}>Thank You for Your Generous Heart!</h2>
              <p className={getTamilClass("text-gray-700 mb-6")}>
                Your donation has been received with gratitude. May Saint Devasahayam's blessings 
                be upon you and your family for your kindness and support.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl mb-6 success-details border border-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IndianRupee className="w-5 h-5 text-green-700" />
                <p className="text-lg font-semibold text-green-800">
                  ₹{formData.amount === 'custom' ? formData.customAmount : formData.amount}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Purpose: <span className="font-medium text-green-700">{formData.purpose}</span>
              </p>
              <p className="text-xs text-gray-500 mt-3">
                A confirmation email will be sent shortly with payment instructions
              </p>
            </div>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  donorName: '',
                  email: '',
                  phone: '',
                  amount: '',
                  customAmount: '',
                  purpose: '',
                });
                setSelectedAmount('');
              }}
              className="bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 success-button transform hover:scale-105 transition-all duration-200"
            >
              <Heart className="mr-2 w-5 h-5" />
              Make Another Donation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-16 px-3 sm:px-4 pb-4 bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <style>{`
        /* Tamil text sizing */
        .tamil-text {
          font-size: 0.85em;
          line-height: 1.4;
        }
        
        .tamil-heading {
          font-size: 0.9em;
          line-height: 1.3;
        }
        
        .tamil-button {
          font-size: 0.8em;
          line-height: 1.2;
        }
        
        .tamil-label {
          font-size: 0.85em;
          line-height: 1.3;
        }

        /* Mobile responsive improvements */
        @media (max-width: 768px) {
          .donation-title {
            font-size: 1.875rem !important;
          }
          
          .donation-subtitle {
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
            padding: 0 0.5rem;
          }
          
          .donation-form-header {
            padding: 0.75rem 1rem !important;
          }
          
          .donation-form-content {
            padding: 1rem !important;
          }
          
          .amount-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          
          .amount-button-mobile {
            padding: 0.75rem 0.5rem !important;
            font-size: 0.75rem !important;
            min-height: 2.75rem !important;
          }
          
          .amount-button-mobile.tamil {
            font-size: 0.7rem !important;
            padding: 0.75rem 0.25rem !important;
          }
          
          .form-input-mobile {
            height: 2.75rem !important;
            font-size: 0.875rem !important;
          }
          
          .form-label-mobile {
            font-size: 0.875rem !important;
            margin-bottom: 0.5rem !important;
          }
          
          .form-label-mobile.tamil {
            font-size: 0.8rem !important;
          }
          
          .submit-button-mobile {
            height: 3rem !important;
            font-size: 0.875rem !important;
          }
          
          .submit-button-mobile.tamil {
            font-size: 0.8rem !important;
          }
        }

        /* Extra small screens */
        @media (max-width: 480px) {
          .donation-title {
            font-size: 1.5rem !important;
          }
          
          .donation-subtitle {
            font-size: 0.8rem !important;
          }
          
          .amount-button-mobile {
            padding: 0.625rem 0.375rem !important;
            font-size: 0.7rem !important;
            min-height: 2.5rem !important;
          }
          
          .amount-button-mobile.tamil {
            font-size: 0.65rem !important;
            padding: 0.625rem 0.25rem !important;
          }
          
          .form-input-mobile {
            height: 2.5rem !important;
            font-size: 0.8rem !important;
          }
          
          .form-label-mobile {
            font-size: 0.8rem !important;
          }
          
          .form-label-mobile.tamil {
            font-size: 0.75rem !important;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Heart className={`w-10 h-10 text-green-700 ${isVisible ? 'animate-heartBeat' : ''}`} />
              <div className="floating-hearts">
                <Heart className="w-4 h-4 text-green-400 floating-heart" style={{animationDelay: '0s'}} />
                <Heart className="w-3 h-3 text-green-500 floating-heart" style={{animationDelay: '1s'}} />
                <Heart className="w-4 h-4 text-green-600 floating-heart" style={{animationDelay: '2s'}} />
              </div>
            </div>
            <h1 className={getTamilHeadingClass("donation-title text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent")}>
              {t('donations.title')}
            </h1>
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 animate-pulse" />
          </div>
          <p className={getTamilClass("donation-subtitle text-gray-700 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-2")}>
            {t('donations.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Animated Form */}
          <div className="lg:col-span-2">
            <Card className={`border-green-200 card-hover bg-white/80 backdrop-blur-sm ${isVisible ? 'animate-slideInLeft stagger-2' : 'opacity-0'}`}>
              <CardHeader className="donation-form-header bg-gradient-to-r from-green-50 to-emerald-50 py-3 sm:py-6 pb-2 sm:pb-6">
                <CardTitle className={getTamilHeadingClass("text-green-800 flex items-center gap-2 text-lg sm:text-xl")}>
                  <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
                  {t('donations.details')}
                </CardTitle>
              </CardHeader>
              <CardContent className="donation-form-content p-4 sm:p-6 pt-4 sm:pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Animated Form Fields */}
                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-3' : 'opacity-0'}`}>
                    <Label htmlFor="donorName" className={getTamilLabelClass("form-label-mobile text-green-800 font-medium block mb-2")}>
                      {t('donations.fullName')} <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id="donorName"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="form-input-mobile border-green-200 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-4' : 'opacity-0'}`}>
                    <Label htmlFor="email" className={getTamilLabelClass("form-label-mobile text-green-800 font-medium block mb-2")}>{t('donations.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="form-input-mobile border-green-200 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-5' : 'opacity-0'}`}>
                    <Label htmlFor="phone" className={getTamilLabelClass("form-label-mobile text-green-800 font-medium block mb-2")}>{t('donations.phone')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 89037 60869"
                      className="form-input-mobile border-green-200 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div className={`form-field ${isVisible ? 'animate-fadeInUp stagger-6' : 'opacity-0'}`}>
                    <Label htmlFor="purpose" className={getTamilLabelClass("form-label-mobile text-green-800 font-medium block mb-2")}>
                      Donation Purpose <span className='text-red-500'>*</span>
                    </Label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className={getTamilClass("form-input-mobile flex w-full rounded-md border border-green-200 bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus:border-green-500 transition-colors")}
                      required
                    >
                      <option value="">{t('donations.purpose')}</option>
                      {donationPurposes.map(purpose => (
                        <option key={purpose.id} value={purpose.name}>
                          {t(purpose.name)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Animated Amount Selection */}
                  <div className={`${isVisible ? 'animate-scaleIn stagger-6' : 'opacity-0'}`}>
                    <Label className={getTamilLabelClass("text-green-800 font-medium text-lg mb-4 block")}>
                      {t('donations.amount')} <span className='text-red-500'>*</span>
                    </Label>
                    <div className="amount-grid grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
                      {predefinedAmounts.map((amount, index) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={formData.amount === amount.toString() ? 'default' : 'outline'}
                          onClick={() => handleAmountSelect(amount)}
                          className={`amount-button-mobile ${getTamilButtonClass('')} font-semibold ${
                            formData.amount === amount.toString() 
                              ? 'selected bg-gradient-to-r from-green-700 to-emerald-700 text-white border-green-700' 
                              : 'border-green-200 hover:border-green-500 hover:bg-green-50'
                          }`}
                          style={{animationDelay: `${0.7 + index * 0.1}s`}}
                        >
                          <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="truncate">{amount.toLocaleString()}</span>
                          {formData.amount === amount.toString() && (
                            <div className="shimmer-bg absolute inset-0 rounded-md"></div>
                          )}
                        </Button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant={formData.amount === 'custom' ? 'default' : 'outline'}
                      onClick={() => handleAmountSelect('custom')}
                      className={`amount-button-mobile ${getTamilButtonClass('')} w-full mt-3 sm:mt-4 font-semibold ${
                        formData.amount === 'custom' 
                          ? 'selected bg-gradient-to-r from-green-700 to-emerald-700 text-white border-green-700' 
                          : 'border-green-200 hover:border-green-500 hover:bg-green-50'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      {t('donations.custom')}
                      {formData.amount === 'custom' && (
                        <div className="shimmer-bg absolute inset-0 rounded-md"></div>
                      )}
                    </Button>
                  </div>

                  {/* Custom Amount Input with Animation */}
                  {formData.amount === 'custom' && (
                    <div className="animate-fadeInUp form-field">
                      <Label htmlFor="customAmount" className={getTamilLabelClass("form-label-mobile text-green-800 font-medium block mb-2")}>
                        Enter Custom Amount (₹) <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id="customAmount"
                        name="customAmount"
                        type="number"
                        min="1"
                        value={formData.customAmount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        required
                        className="form-input-mobile border-green-200 focus:border-green-500 transition-colors"
                      />
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className={`submit-button-mobile ${getTamilButtonClass('')} w-full font-semibold bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 transform hover:scale-105 transition-all duration-200 animate-fadeInUp`}
                  >
                    <Heart className="mr-2 w-5 h-5 animate-heartBeat" />
                    {t('donations.proceed')}
                  </Button>

                  {/* <p className="text-xs text-gray-500 text-center animate-fadeInUp">
                    This is a demo. In production, you would integrate with Razorpay, Stripe, or UPI payment gateway.
                  </p> */}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Animated Info Sidebar */}
          <div className="space-y-6">
            {/* Donation Purposes */}
            <Card className={`border-green-200 card-hover bg-white/80 backdrop-blur-sm ${isVisible ? 'animate-slideInRight stagger-3' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className="w-6 h-6 text-green-700" />
                  <h4 className={getTamilHeadingClass("text-green-800 font-semibold text-lg")}>{t('donations.help.title')}</h4>
                </div>
                <div className="space-y-4">
                  {donationPurposes.slice(0, 4).map((purpose, index) => (
                    <div 
                      key={purpose.id} 
                      className={`border-l-4 border-green-300 pl-4 py-2 rounded-r-lg bg-green-50/50 hover:bg-green-50 transition-colors ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                      style={{animationDelay: `${0.8 + index * 0.1}s`}}
                    >
                      <p className={getTamilClass("text-sm text-gray-800 font-medium")}>
                        {t(purpose.name)}
                      </p>
                      <p className={getTamilClass("text-xs text-gray-600 mt-1")}>{t(purpose.description)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tax Benefits */}
            <Card className={`border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 card-hover ${isVisible ? 'animate-slideInRight stagger-4' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={getTamilHeadingClass("text-green-800 mb-3 font-semibold flex items-center gap-2")}>
                  <Sparkles className="w-5 h-5" />
                  {t('donations.tax.title')}
                </h4>
                <p className={getTamilClass("text-sm text-gray-700 leading-relaxed")}>
                  {t('donations.tax.description')}
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className={`border-green-200 card-hover bg-white/80 backdrop-blur-sm ${isVisible ? 'animate-slideInRight stagger-5' : 'opacity-0'}`}>
              <CardContent className="pt-6">
                <h4 className={getTamilHeadingClass("text-green-800 mb-3 font-semibold")}>{t('donations.need.help')}</h4>
                <p className={getTamilClass("text-sm text-gray-700 mb-3 leading-relaxed")}>
                  {t('donations.contact')}
                </p>
                <p className={getTamilClass("text-lg font-semibold text-green-700 flex items-center gap-2")}>
                  <Heart className="w-4 h-4" />
                  +91 89037 60869
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

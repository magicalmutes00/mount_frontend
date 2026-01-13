import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useLanguage } from '../context/LanguageContext';
import {
  IndianRupee,
  CheckCircle,
  QrCode,
  Upload,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentState {
  amount: number;
  purpose: string;
  name: string;
  email?: string;
  phone?: string;
  massDetails?: {
    startDate: string;
    preferredTime: string;
    intentionType: string;
    intentionDescription: string;
    numberOfDays: number;
    totalAmount: number;
  };
}

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const data = location.state as PaymentState;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [errors, setErrors] = useState({
    utrNumber: "",
    screenshot: "",
  });
  
  const isTamil = language === 'தமிழ்';

  useEffect(() => {
    if (!data?.amount) navigate("/");
  }, [data, navigate]);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, screenshot: 'Please upload a valid image file' }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, screenshot: 'File size must be less than 5MB' }));
        return;
      }

      setScreenshot(file);
      setErrors(prev => ({ ...prev, screenshot: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePaymentDetails = () => {
    const newErrors = { utrNumber: "", screenshot: "" };
    
    if (!utrNumber.trim()) {
      newErrors.utrNumber = "UTR number is required";
    } else if (utrNumber.length < 12) {
      newErrors.utrNumber = "UTR number must be at least 12 characters";
    }
    
    if (!screenshot) {
      newErrors.screenshot = "Payment screenshot is required";
    }
    
    setErrors(newErrors);
    return !newErrors.utrNumber && !newErrors.screenshot;
  };

  const handlePaymentSubmission = async () => {
    if (!validatePaymentDetails()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email || '');
      formData.append('phone', data.phone || '');
      formData.append('amount', data.amount.toString());
      formData.append('purpose', data.purpose);
      formData.append('utrNumber', utrNumber);
      formData.append('screenshot', screenshot!);
      
      if (data.massDetails) {
        formData.append('massDetails', JSON.stringify(data.massDetails));
      }

      // Submit to backend API - use different endpoints for donations vs mass bookings
      const endpoint = data.massDetails ? '/api/mass-bookings/payment' : '/api/donations/submit';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        toast.success('Payment details submitted successfully!');
      } else {
        throw new Error(result.message || 'Failed to submit payment details');
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      const errorMessage = error.message || 'Failed to submit payment details. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <style>{`
          .tamil-text { font-size: 0.8em; }
          .tamil-heading { font-size: 0.75em; }
          .tamil-button { font-size: 0.8em; }
        `}</style>
        <Card className="max-w-md w-full border-green-200">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-700" />
            </div>
            <h2 className={`text-2xl font-semibold text-green-800 mb-3 ${isTamil ? 'tamil-heading' : ''}`}>
              {t('payment.success.title')}
            </h2>
            <p className={`text-gray-700 mb-4 ${isTamil ? 'tamil-text' : ''}`}>
              {t('payment.success.message')}
            </p>
            <div className="bg-green-50 p-4 rounded-lg mb-4 text-sm">
              <p className={isTamil ? 'tamil-text' : ''}><strong>{isTamil ? 'தொகை:' : 'Amount:'}</strong> ₹{data.amount}</p>
              <p className={isTamil ? 'tamil-text' : ''}><strong>{isTamil ? 'நோக்கம்:' : 'Purpose:'}</strong> {data.purpose}</p>
              <p className={isTamil ? 'tamil-text' : ''}><strong>UTR {isTamil ? 'எண்:' : 'Number:'}</strong> {utrNumber}</p>
            </div>
            <p className={`text-sm text-gray-600 mb-4 ${isTamil ? 'tamil-text' : ''}`}>
              {t('payment.success.confirmation')}
            </p>
            <Button
              className={`bg-green-700 hover:bg-green-800 ${isTamil ? 'tamil-button' : ''}`}
              onClick={() => navigate("/")}
            >
              {t('payment.success.home')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <style>{`
        .tamil-text { font-size: 0.8em; }
        .tamil-heading { font-size: 0.75em; }
        .tamil-button { font-size: 0.8em; }
        .tamil-label { font-size: 0.8em; }
      `}</style>
      
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* LEFT – Summary */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className={`text-green-800 flex items-center gap-2 ${isTamil ? 'tamil-heading' : ''}`}>
              <IndianRupee className="w-6 h-6" />
              {t('payment.summary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <p className={isTamil ? 'tamil-text' : ''}><strong>{isTamil ? 'பெயர்:' : 'Name:'}</strong> {data.name}</p>
              <p className={isTamil ? 'tamil-text' : ''}><strong>{isTamil ? 'நோக்கம்:' : 'Purpose:'}</strong> {data.purpose}</p>
              <p className={`text-xl font-semibold text-green-700 ${isTamil ? 'tamil-text' : ''}`}>
                {isTamil ? 'தொகை:' : ''} ₹ {data.amount}
              </p>
            </div>

            {data.massDetails && (
              <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <h4 className={`font-semibold text-blue-800 ${isTamil ? 'tamil-heading' : ''}`}>
                  {t('payment.mass.details')}
                </h4>
                <p className={isTamil ? 'tamil-text' : ''}><strong>{t('payment.start.date')}:</strong> {data.massDetails.startDate}</p>
                <p className={isTamil ? 'tamil-text' : ''}><strong>{t('payment.time')}:</strong> {data.massDetails.preferredTime}</p>
                <p className={isTamil ? 'tamil-text' : ''}><strong>{t('payment.intention')}:</strong> {data.massDetails.intentionType}</p>
                <p className={isTamil ? 'tamil-text' : ''}><strong>{t('payment.days')}:</strong> {data.massDetails.numberOfDays}</p>
              </div>
            )}

            <div className={`text-sm text-gray-600 space-y-1 ${isTamil ? 'tamil-text' : ''}`}>
              <p>{t('payment.security.secure')}</p>
              <p>{t('payment.security.upi')}</p>
              <p>{t('payment.security.verification')}</p>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT – Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className={isTamil ? 'tamil-heading' : ''}>{t('payment.complete')}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* QR Code Section */}
            <div className="border rounded-lg p-6 bg-green-50">
              <div className="flex items-center gap-3 mb-4">
                <QrCode className="w-6 h-6 text-green-700" />
                <span className={`font-medium text-green-800 ${isTamil ? 'tamil-text' : ''}`}>
                  {t('payment.qr.scan')}
                </span>
              </div>

              <div className="flex justify-center mb-4">
                <img 
                  src="/QR.jpg" 
                  alt="UPI Payment QR Code" 
                  className="w-48 h-48 border-2 border-green-200 rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=devasahayam@upi&pn=Devasahayam%20Mount%20Shrine&am=${data.amount}&cu=INR`;
                  }}
                />
              </div>

              <div className="text-center">
                <p className={`text-sm text-gray-600 mb-2 ${isTamil ? 'tamil-text' : ''}`}>
                  {t('payment.qr.description')}
                </p>
                <p className={`text-lg font-semibold text-green-700 ${isTamil ? 'tamil-text' : ''}`}>
                  {t('payment.amount')}: ₹{data.amount}
                </p>
              </div>
            </div>

            {!paymentConfirmed ? (
              <Button
                onClick={() => setPaymentConfirmed(true)}
                className={`w-full bg-green-700 hover:bg-green-800 ${isTamil ? 'tamil-button' : ''}`}
              >
                {t('payment.made')}
              </Button>
            ) : (
              <div className="space-y-4 border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 text-blue-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className={`font-medium ${isTamil ? 'tamil-text' : ''}`}>
                    {t('payment.confirmation.required')}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="utrNumber" className={`text-sm font-medium ${isTamil ? 'tamil-label' : ''}`}>
                      {t('payment.utr.label')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="utrNumber"
                      value={utrNumber}
                      onChange={(e) => {
                        setUtrNumber(e.target.value);
                        if (errors.utrNumber) {
                          setErrors(prev => ({ ...prev, utrNumber: '' }));
                        }
                      }}
                      placeholder={t('payment.utr.placeholder')}
                      className={errors.utrNumber ? 'border-red-500' : ''}
                    />
                    {errors.utrNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.utrNumber}</p>
                    )}
                    <p className={`text-xs text-gray-600 mt-1 ${isTamil ? 'tamil-text' : ''}`}>
                      {t('payment.utr.help')}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="screenshot" className={`text-sm font-medium ${isTamil ? 'tamil-label' : ''}`}>
                      {t('payment.screenshot.label')} <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-2">
                      <input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="screenshot"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${
                          errors.screenshot ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {screenshotPreview ? (
                          <img
                            src={screenshotPreview}
                            alt="Payment screenshot"
                            className="h-28 object-contain rounded"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className={`text-sm text-gray-600 ${isTamil ? 'tamil-text' : ''}`}>
                              {t('payment.screenshot.click')}
                            </p>
                            <p className={`text-xs text-gray-500 ${isTamil ? 'tamil-text' : ''}`}>
                              {t('payment.screenshot.formats')}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.screenshot && (
                      <p className="text-red-500 text-sm mt-1">{errors.screenshot}</p>
                    )}
                  </div>

                  <Button
                    onClick={handlePaymentSubmission}
                    disabled={loading}
                    className={`w-full bg-blue-700 hover:bg-blue-800 ${isTamil ? 'tamil-button' : ''}`}
                  >
                    {loading ? t('payment.submitting') : t('payment.submit.details')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
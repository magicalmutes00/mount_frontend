import React, { createContext, useContext, useState, useEffect } from "react";

interface PaymentContextType {
  paymentData: any;
  setPaymentData: (data: any) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentData, setPaymentData] = useState<any>(() => {
    const stored = sessionStorage.getItem("paymentData");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (paymentData) {
      sessionStorage.setItem("paymentData", JSON.stringify(paymentData));
    }
  }, [paymentData]);

  return (
    <PaymentContext.Provider value={{ paymentData, setPaymentData }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used inside PaymentProvider");
  return ctx;
};

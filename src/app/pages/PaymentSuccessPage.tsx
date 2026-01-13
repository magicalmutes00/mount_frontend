import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";

interface PaymentSuccessProps {
  data: {
    amount: number;
    purpose: string;
    name: string;
    paymentId?: string;
  };
  onNavigate: (page: string) => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessProps> = ({
  data,
  onNavigate,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <Card className="max-w-md w-full border-green-200">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-700" />
          </div>

          <h2 className="text-xl font-semibold text-green-800">
            Payment Successful
          </h2>

          <p className="text-gray-600">
            Thank you for your contribution.
          </p>

          <div className="bg-green-50 p-4 rounded-md text-left text-sm">
            <p><strong>Name:</strong> {data.name}</p>
            <p><strong>Purpose:</strong> {data.purpose}</p>
            <p><strong>Amount:</strong> ₹{data.amount}</p>
            {data.paymentId && (
              <p><strong>Transaction ID:</strong> {data.paymentId}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => onNavigate("home")}
            >
              Go to Home
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigate("donate")}
            >
              Make Another Donation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

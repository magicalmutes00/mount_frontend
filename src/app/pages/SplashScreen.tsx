import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000); // Increased to 2 seconds for better visibility

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <>
      <style>
        {`
          .splash-container {
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            animation: splashFadeOut 0.8s ease-in-out forwards;
            animation-delay: 1.5s;
          }

          .splash-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .splash-logo {
            width: 120px;
            height: 120px;
            max-width: 70%;
            border-radius: 50%;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            animation: logoFadeInScale 1s ease-in-out;
          }

          .splash-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            text-align: center;
            margin-top: 0.5rem;
            animation: titleFadeIn 1s ease-in-out 0.3s both;
          }

          .splash-subtitle {
            font-size: 1rem;
            color: #718096;
            text-align: center;
            animation: titleFadeIn 1s ease-in-out 0.6s both;
          }

          @keyframes logoFadeInScale {
            from {
              opacity: 0;
              transform: scale(0.8) rotate(-10deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }

          @keyframes titleFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes splashFadeOut {
            to {
              opacity: 0;
              visibility: hidden;
            }
          }
        `}
      </style>

      <div className="splash-container">
        <div className="splash-content">
          <img
            src="/favicon.ico"
            alt="Devasahayam Mount Shrine"
            className="splash-logo"
          />
          <h1 className="splash-title">Our Lady Of Sorrows Shrine</h1>
          <p className="splash-subtitle">Welcome to our spiritual home</p>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;

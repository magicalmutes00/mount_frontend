import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { Bus, Clock, MapPin, ArrowRight } from "lucide-react";
import "./BusDetails.css";

const BusDetails: React.FC = () => {
  const { language, t } = useLanguage();

  const getTamilClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-text` : baseClass;
  };

  const getTamilHeadingClass = (baseClass: string = '') => {
    return language === 'தமிழ்' ? `${baseClass} tamil-heading` : baseClass;
  };

  // Helper function to convert English time to Tamil time format
  const getTamilTime = (englishTime: string) => {
    const timeMap: { [key: string]: string } = {
      'AM': 'காலை',
      'PM': 'மதியம்',
      '12:00 PM': '12:00 மதியம்',
      '12:15 PM': '12:15 மதியம்',
      '12:25 PM': '12:25 மதியம்',
      '1:10 PM': '1:10 மதியம்',
      '2:20 PM': '2:20 மதியம்',
      '3:05 PM': '3:05 மதியம்',
      '3:15 PM': '3:15 மதியம்',
      '3:30 PM': '3:30 மதியம்',
      '4:00 PM': '4:00 மாலை',
      '4:15 PM': '4:15 மாலை',
      '4:25 PM': '4:25 மாலை',
      '4:30 PM': '4:30 மாலை',
      '5:10 PM': '5:10 மாலை',
      '5:15 PM': '5:15 மாலை',
      '5:25 PM': '5:25 மாலை',
      '6:00 PM': '6:00 மாலை',
      '6:10 PM': '6:10 மாலை',
      '6:45 PM': '6:45 மாலை',
      '6:55 PM': '6:55 மாலை',
      '7:30 PM': '7:30 மாலை',
      '7:40 PM': '7:40 மாலை',
      '8:15 PM': '8:15 இரவு',
      '8:25 PM': '8:25 இரவு',
      '8:30 PM': '8:30 இரவு',
      '9:10 PM': '9:10 இரவு',
      '9:15 PM': '9:15 இரவு',
      '9:25 PM': '9:25 இரவு',
      '10:00 PM': '10:00 இரவு',
      '10:10 PM': '10:10 இரவு',
      '10:45 PM': '10:45 இரவு'
    };

    if (timeMap[englishTime]) {
      return timeMap[englishTime];
    }

    // Handle general AM/PM conversion
    if (englishTime.includes('AM')) {
      return englishTime.replace('AM', 'காலை');
    } else if (englishTime.includes('PM')) {
      const hour = parseInt(englishTime.split(':')[0]);
      if (hour >= 4 && hour < 8) {
        return englishTime.replace('PM', 'மாலை');
      } else if (hour >= 8) {
        return englishTime.replace('PM', 'இரவு');
      } else {
        return englishTime.replace('PM', 'மதியம்');
      }
    }
    
    return englishTime;
  };

  const getTimeDisplay = (time: string) => {
    return language === 'தமிழ்' ? getTamilTime(time) : time;
  };

  return (
    <div className="bus-details-container">
      {/* Header */}
      <div className="header-container">
        <Bus className="bus-icon" />
        <h1 className={getTamilHeadingClass("page-title")}>
          {t('bus.title')}
        </h1>
      </div>

      {/* Route Information */}
      <div className="route-info">
        <div className="route-header">
          <MapPin className="route-icon" />
          <h2 className={getTamilHeadingClass("route-title")}>
            {t('bus.route.info')}
          </h2>
        </div>
        
        <div className="route-info-grid">
          <div className="route-info-left">
            <p className={getTamilClass("route-info-text")}>
              <strong>{t('bus.number')}</strong> 15V
            </p>
            <p className={getTamilClass("route-info-text")}>
              <strong>{t('bus.route')}</strong> {t('bus.route.path')}
            </p>
          </div>
          <div className="route-info-right">
            <p className={getTamilClass("route-info-text")}>
              <strong>{t('bus.travel.time')}</strong> {t('bus.travel.duration')}
            </p>
            <p className={getTamilClass("route-info-text")}>
              <strong>{t('bus.stand.time')}</strong> {t('bus.stand.duration')}
            </p>
          </div>
        </div>
      </div>

      {/* Bus Schedule Table */}
      <div className="table-container">
        <table className="bus-table">
          <thead>
            <tr>
              <th className={getTamilClass("table-header")}>
                <div className="table-header-content">
                  <Clock className="table-icon" />
                  <span className={getTamilClass("header-text")}>{t('bus.from.mount')}</span>
                </div>
              </th>
              <th className={getTamilClass("table-header")}>
                <div className="table-header-content">
                  <ArrowRight className="table-icon" />
                  <span className={getTamilClass("header-text")}>{t('bus.reach.nagercoil')}</span>
                </div>
              </th>
              <th className={getTamilClass("table-header")}>
                <div className="table-header-content">
                  <Clock className="table-icon" />
                  <span className={getTamilClass("header-text")}>{t('bus.return.start')}</span>
                </div>
              </th>
              <th className={getTamilClass("table-header")}>
                <div className="table-header-content">
                  <ArrowRight className="table-icon" />
                  <span className={getTamilClass("header-text")}>{t('bus.reach.mount.back')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td className={getTamilClass("table-cell")}>{getTimeDisplay('4:50 AM')}</td><td className={getTamilClass("table-cell")}>{getTimeDisplay('5:35 AM')}</td><td className={getTamilClass("table-cell")}>{getTimeDisplay('5:45 AM')}</td><td className={getTamilClass("table-cell")}>{getTimeDisplay('6:30 AM')}</td></tr>
            <tr><td className={getTamilClass("table-cell")}>{getTimeDisplay('6:00 AM')}</td><td className={getTamilClass("table-cell")}>{getTimeDisplay('6:45 AM')}</td><td className={getTamilClass("table-cell")}>{getTimeDisplay('6:55 AM')}</td><td className={getTamilClass("table-cell")}>{getTimeDisplay('7:40 AM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('7:30 AM')}</td><td className="table-cell">{getTimeDisplay('8:15 AM')}</td><td className="table-cell">{getTimeDisplay('8:25 AM')}</td><td className="table-cell">{getTimeDisplay('9:10 AM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('9:00 AM')}</td><td className="table-cell">{getTimeDisplay('9:45 AM')}</td><td className="table-cell">{getTimeDisplay('9:55 AM')}</td><td className="table-cell">{getTimeDisplay('10:40 AM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('10:20 AM')}</td><td className="table-cell">{getTimeDisplay('11:05 AM')}</td><td className="table-cell">{getTimeDisplay('11:15 AM')}</td><td className="table-cell">{getTimeDisplay('12:00 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('11:30 AM')}</td><td className="table-cell">{getTimeDisplay('12:15 PM')}</td><td className="table-cell">{getTimeDisplay('12:25 PM')}</td><td className="table-cell">{getTimeDisplay('1:10 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('2:20 PM')}</td><td className="table-cell">{getTimeDisplay('3:05 PM')}</td><td className="table-cell">{getTimeDisplay('3:15 PM')}</td><td className="table-cell">{getTimeDisplay('4:00 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('3:30 PM')}</td><td className="table-cell">{getTimeDisplay('4:15 PM')}</td><td className="table-cell">{getTimeDisplay('4:25 PM')}</td><td className="table-cell">{getTimeDisplay('5:10 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('4:30 PM')}</td><td className="table-cell">{getTimeDisplay('5:15 PM')}</td><td className="table-cell">{getTimeDisplay('5:25 PM')}</td><td className="table-cell">{getTimeDisplay('6:10 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('6:00 PM')}</td><td className="table-cell">{getTimeDisplay('6:45 PM')}</td><td className="table-cell">{getTimeDisplay('6:55 PM')}</td><td className="table-cell">{getTimeDisplay('7:40 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('7:30 PM')}</td><td className="table-cell">{getTimeDisplay('8:15 PM')}</td><td className="table-cell">{getTimeDisplay('8:25 PM')}</td><td className="table-cell">{getTimeDisplay('9:10 PM')}</td></tr>
            <tr><td className="table-cell">{getTimeDisplay('8:30 PM')}</td><td className="table-cell">{getTimeDisplay('9:15 PM')}</td><td className="table-cell">{getTimeDisplay('9:25 PM')}</td><td className="table-cell">{getTimeDisplay('10:10 PM')}</td></tr>
            <tr>
              <td className="table-cell">{getTimeDisplay('10:00 PM')}</td>
              <td className="table-cell">{getTimeDisplay('10:45 PM')}</td>
              <td colSpan={2} className={getTamilClass("table-cell special-note")}>
                {t('bus.stay.mount')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Additional Information */}
      <div className="info-section">
        <h3 className={getTamilHeadingClass("info-title")}>
          {t('bus.notes.title')}
        </h3>
        <ul className={getTamilClass("info-list")}>
          <li className={getTamilClass("info-item")}>
            <span className="info-bullet">•</span>
            <span>{t('bus.note.weather')}</span>
          </li>
          <li className={getTamilClass("info-item")}>
            <span className="info-bullet">•</span>
            <span>{t('bus.note.festival')}</span>
          </li>
          <li className={getTamilClass("info-item")}>
            <span className="info-bullet">•</span>
            <span>{t('bus.note.contact')}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BusDetails;

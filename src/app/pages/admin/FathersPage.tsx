import React, { useState, useEffect } from "react";

type Priest = {
  id: number;
  name: string;
  period?: string;
  category: string;
  display_order: number;
};

type FathersData = {
  parish_priest: Priest[];
  assistant_priest: Priest[];
  son_of_soil: Priest[];
  deacon: Priest[];
};

const Section = ({ title, data }: { title: string; data: Priest[] }) => (
  <div className="section-card">
    <h3>{title}</h3>
    <ul>
      {data.map((item) => (
        <li key={item.id}>
          <span>{item.name}</span>
          {item.period && <em>{item.period}</em>}
        </li>
      ))}
    </ul>
  </div>
);

const FathersPage: React.FC = () => {
  const [fathersData, setFathersData] = useState<FathersData>({
    parish_priest: [],
    assistant_priest: [],
    son_of_soil: [],
    deacon: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFathersData();
  }, []);

  const fetchFathersData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fathers/active');
      
      if (!response.ok) {
        throw new Error('Failed to fetch fathers data');
      }

      const data = await response.json();
      setFathersData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fathers data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fathers-page">
        <div className="loading">Loading fathers information...</div>
        <style>{`
          .loading {
            text-align: center;
            padding: 2rem;
            color: #666;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fathers-page">
        <div className="error">
          <p>Error loading fathers information: {error}</p>
          <button onClick={fetchFathersData}>Try Again</button>
        </div>
        <style>{`
          .error {
            text-align: center;
            padding: 2rem;
            color: #c33;
          }
          .error button {
            background: #2f6b3f;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fathers-page">
      <h1>Fathers Information</h1>

      <div className="grid">
        <Section title="Parish Priests" data={fathersData.parish_priest} />
        <Section title="Assistant Parish Priests" data={fathersData.assistant_priest} />
        <Section title="Son of Soils" data={fathersData.son_of_soil} />
        <Section title="Deacons" data={fathersData.deacon} />
      </div>

      <style>{`
        .fathers-page {
          padding: 2.5rem 1.5rem;
          max-width: 1400px;
          margin: auto;
          font-family: "Inter", "Segoe UI", sans-serif;
          background: #f7faf7;
        }

        h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #1f3d2b;
          border-left: 5px solid #2f6b3f;
          padding-left: 0.75rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        .section-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-top: 4px solid #2f6b3f;
        }

        .section-card h3 {
          margin-bottom: 1rem;
          font-size: 1.15rem;
          color: #2f6b3f;
          font-weight: 600;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.55rem 0;
          border-bottom: 1px dashed #e2e8e2;
          font-size: 0.9rem;
        }

        li:last-child {
          border-bottom: none;
        }

        li span {
          font-weight: 500;
          color: #1f2937;
        }

        li em {
          font-style: normal;
          font-size: 0.8rem;
          color: #6b7280;
          white-space: nowrap;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .fathers-page {
            padding: 1rem 0.75rem;
            background: #f7faf7;
          }

          h1 {
            font-size: 1.4rem;
            margin-bottom: 1.25rem;
            padding-left: 0.5rem;
            border-left-width: 3px;
            text-align: center;
            border-left: none;
            border-bottom: 3px solid #2f6b3f;
            padding-bottom: 0.5rem;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .section-card {
            padding: 1rem;
            border-radius: 10px;
            margin: 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .section-card h3 {
            font-size: 1rem;
            margin-bottom: 0.75rem;
            text-align: center;
            background: #f0f7f0;
            padding: 0.5rem;
            border-radius: 6px;
            margin: -1rem -1rem 0.75rem -1rem;
          }

          li {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
            padding: 0.6rem 0;
            border-bottom: 1px solid #e5e7eb;
          }

          li:last-child {
            border-bottom: none;
          }

          li span {
            font-size: 0.9rem;
            line-height: 1.4;
            font-weight: 600;
            color: #1f2937;
          }

          li em {
            font-size: 0.75rem;
            color: #6b7280;
            font-style: italic;
            margin-top: 0.125rem;
            white-space: normal;
          }

          .loading, .error {
            padding: 1.5rem 1rem;
            margin: 0 0.5rem;
            border-radius: 8px;
          }

          .error button {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .fathers-page {
            padding: 0.75rem 0.5rem;
          }

          h1 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            padding-bottom: 0.4rem;
          }

          .grid {
            gap: 0.75rem;
          }

          .section-card {
            padding: 0.75rem;
            border-radius: 8px;
          }

          .section-card h3 {
            font-size: 0.95rem;
            margin: -0.75rem -0.75rem 0.5rem -0.75rem;
            padding: 0.4rem;
          }

          li {
            padding: 0.5rem 0;
          }

          li span {
            font-size: 0.85rem;
          }

          li em {
            font-size: 0.7rem;
          }

          .loading, .error {
            padding: 1rem 0.75rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 360px) {
          .fathers-page {
            padding: 0.5rem 0.25rem;
          }

          h1 {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
          }

          .section-card {
            padding: 0.6rem;
          }

          .section-card h3 {
            font-size: 0.9rem;
            margin: -0.6rem -0.6rem 0.4rem -0.6rem;
            padding: 0.35rem;
          }

          li span {
            font-size: 0.8rem;
          }

          li em {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FathersPage;
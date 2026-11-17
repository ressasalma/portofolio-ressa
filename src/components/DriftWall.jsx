import { useEffect, useRef } from "react";
import "./DriftWall.css";

export default function DriftWall({ items = [] }) {
  const columns = Array.from({ length: 5 }, (_, i) => 
    [...items, ...items].filter((_, index) => index % 5 === i)
  );

  return (
    <div className="drift-wall-viewport">
      {columns.map((colItems, colIndex) => (
        <div key={colIndex} className={`drift-wall-track drift-wall-track--${colIndex % 2 === 0 ? 'fast' : 'slow'}`}>
          {colItems.map((item, index) => (
            <a
              key={`${item.src}-${index}`}
              href={item.src}
              target="_blank"
              rel="noopener noreferrer"
              className="drift-wall-card"
              title={item.title}
            >
              {item.isPdf ? (
                <div className="drift-wall-pdf">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>PDF Certificate</span>
                </div>
              ) : (
                <img src={item.src} alt={item.title} loading="lazy" />
              )}
              <div className="drift-wall-card__title">{item.title}</div>
            </a>
          ))}
        </div>
      ))}
    </div>
  );
}

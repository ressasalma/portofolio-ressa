import { useEffect, useState } from "react";
import "./ShuffleText.css";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/*";

export default function ShuffleText({ text, className = "", duration = 120 }) {
  const [value, setValue] = useState(text);

  useEffect(() => {
    let frame = 0;
    let step = 0;
    const total = text.length * 3;
    const timer = window.setInterval(() => {
      setValue(Array.from(text, (char, index) => {
        if (char === " ") return " ";
        return index < step ? char : CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join(""));
      step += 1;
      if (step > total) {
        window.clearInterval(timer);
        setValue(text);
      }
    }, duration);

    return () => {
      window.clearInterval(timer);
      frame += 1;
    };
  }, [text, duration]);

  return <span className={className}>{value}</span>;
}

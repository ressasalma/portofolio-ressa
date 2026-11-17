import { useEffect, useState } from "react";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/*";

export default function DecryptedText({ text, speed = 70, className = "" }) {
  const [value, setValue] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const timer = window.setInterval(() => {
      setValue(Array.from(text, (character, index) => {
        if (character === " ") return " ";
        if (index < iteration) return character;
        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      }).join(""));
      iteration += 1 / 2;
      if (iteration >= text.length) {
        window.clearInterval(timer);
        setValue(text);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return <span className={className}>{value}</span>;
}

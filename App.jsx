import React, { useState } from "react";
import Portfolio from "./Portfolio";
import LoadingScreen from "./src/components/LoadingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onDone={() => setLoading(false)} />
      ) : (
        <Portfolio />
      )}
    </>
  );
}

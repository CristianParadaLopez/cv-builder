import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Builder from "./pages/Builder";

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("skillara-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("skillara-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home dark={dark} setDark={setDark} />} />
        <Route path="/builder" element={<Builder dark={dark} setDark={setDark} />} />
      </Routes>
    </BrowserRouter>
  );
}

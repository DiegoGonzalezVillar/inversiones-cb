import React from "react";

// pages/Home.jsx
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Contacto from "../components/Contacto";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <Contacto />
    </>
  );
}

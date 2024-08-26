"use client";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import Hero from "./Hero";

export default function Landing() {
  return (
    <section id="hero" className="snap-start">
    <Hero  />
  </section>
  );
}

import { useState } from "react";

import HeroSection from "./landing/HeroSection";
import CategoriesSection from "./landing/CategoriesSection";
import FeaturedBooksSection from "./landing/FeaturedBooksSection";
import SellBanner from "./landing/SellBanner";
import Footer from "../components/layout/Footer";

import "./landing/styles/landing-page.css";

export default function LandingPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <main className="landing-page">
        <HeroSection
          search={search}
          setSearch={setSearch}
        />

        <CategoriesSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <FeaturedBooksSection
          search={search}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <SellBanner />
      </main>

      <Footer />
    </>
  );
}

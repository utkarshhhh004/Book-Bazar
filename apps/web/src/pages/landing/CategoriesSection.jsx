
import { categories } from "../../data/categories";
import "./styles/categories-section.css";

export default function CategoriesSection({
  selectedCategory,
  setSelectedCategory,
}) {
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    document.getElementById("featured")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section className="categories-section" id="categories">
      <div className="container">
        <div className="section-heading">
          <span className="section-eyebrow">EXPLORE OUR COLLECTION</span>

          <h2>
            Browse by <span>Category</span>
          </h2>

          <p>
            Find books that match your interests, goals and curiosity.
          </p>
        </div>

        <div className="categories-grid">
          <button
            type="button"
            className={`category-card ${
              selectedCategory === "All" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("All")}
          >
            <span className="category-icon">📚</span>
            <h3>All Books</h3>
            <p>Explore our complete collection</p>
          </button>

          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                type="button"
                key={category.name}
                className={`category-card ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span className="category-icon">
                  <Icon size={28} />
                </span>

                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

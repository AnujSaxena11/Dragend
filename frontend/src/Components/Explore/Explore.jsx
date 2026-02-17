import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Star, ArrowDown } from "lucide-react";
import "./Explore.css";

const projects = [
  {
    id: 1,
    name: "Express API Generator",
    tech: "Express",
    category: "REST API",
    rating: 4.5,
    price: "₹499",
    desc: "Auto generates Express backend structure with authentication and modular architecture."
  },
  {
    id: 2,
    name: "Spring Boot Auth Service",
    tech: "Spring Boot",
    category: "Authentication",
    rating: 4.2,
    price: "₹699",
    desc: "JWT based authentication microservice with role management."
  },
  {
    id: 3,
    name: "Laravel Ecommerce Backend",
    tech: "Laravel",
    category: "Ecommerce",
    rating: 4.7,
    price: "₹899",
    desc: "Complete ecommerce backend including payments and order management."
  },
  {
    id: 4,
    name: "Mongo CRUD API",
    tech: "Node",
    category: "Database",
    rating: 3.9,
    price: "Free",
    desc: "CRUD boilerplate with MongoDB integration."
  }
];

export default function Explore() {
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState("");
  const [techFilter, setTechFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IMPROVED FILTERING LOGIC
  const filteredProjects = projects.filter((p) => {
    const searchTerm = search.toLowerCase().trim();
    
    // If search is empty, matchesSearch is always true
    const matchesSearch = searchTerm === "" || 
      p.name.toLowerCase().includes(searchTerm) ||
      p.desc.toLowerCase().includes(searchTerm) ||
      p.tech.toLowerCase().includes(searchTerm);

    const matchesTech = techFilter === "All" || p.tech === techFilter;
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesPrice =
      priceFilter === "All" ||
      (priceFilter === "Free" && p.price === "Free") ||
      (priceFilter === "Paid" && p.price !== "Free");

    return matchesSearch && matchesTech && matchesCategory && matchesPrice;
  });

  const resetFilters = () => {
    setSearch("");
    setTechFilter("All");
    setCategoryFilter("All");
    setPriceFilter("All");
  };

  return (
    <div className="explore-root">
      {/* HERO */}
      <motion.section
        className={`explore-hero ${scrolled ? "released" : ""}`}
        animate={{ height: scrolled ? "80px" : "100vh" }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div className="hero-content" animate={{ scale: scrolled ? 0.8 : 1 }}>
          <h1>Starters</h1>
          {!scrolled && <p>Production-ready backend starters to ship faster.</p>}
        </motion.div>

        <AnimatePresence>
          {!scrolled && (
            <motion.button
              className="scroll-cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            >
              Explore Now <ArrowDown size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.section>

      {/* HEADER */}
      <AnimatePresence>
        {scrolled && (
          <motion.header
            className="explore-header"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
          >
            <div className="header-left">
              <Search size={18} color="#6b7280" />
              <input
                placeholder="Search by name, tech, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch("")}>×</button>
              )}
            </div>
            <div className="header-right" style={{ "--logo-url": `url(${import.meta.env.VITE_LOGO_URL || ''})` }} />
          </motion.header>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <main className="explore-main">
        <div className="filters-bar">
          <div className="filter">
            <SlidersHorizontal size={14} />
            <select value={techFilter} onChange={(e) => setTechFilter(e.target.value)}>
              <option value="All">All Stacks</option>
              <option value="Express">Express</option>
              <option value="Spring Boot">Spring Boot</option>
              <option value="Laravel">Laravel</option>
              <option value="Node">Node</option>
            </select>
          </div>

          <div className="filter">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="REST API">REST API</option>
              <option value="Authentication">Authentication</option>
              <option value="Ecommerce">Ecommerce</option>
              <option value="Database">Database</option>
            </select>
          </div>

          <div className="filter">
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="All">All Pricing</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          {(search || techFilter !== "All" || categoryFilter !== "All" || priceFilter !== "All") && (
            <button className="reset-btn" onClick={resetFilters}>Reset All</button>
          )}
        </div>

        <div className="content-shell">
          <div className="project-list">
            {filteredProjects.map((p) => (
              <motion.div layout key={p.id} className="project-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="project-main">
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="meta">
                    <span>{p.tech}</span>
                    <span>{p.category}</span>
                  </div>
                </div>
                <div className="project-side">
                  <span className="price">{p.price}</span>
                  <div className="rating"><Star size={14} fill="currentColor" /> {p.rating}</div>
                  <button>View</button>
                </div>
              </motion.div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="empty-state">
                <p>No results found for "{search}"</p>
                <button onClick={resetFilters}>Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
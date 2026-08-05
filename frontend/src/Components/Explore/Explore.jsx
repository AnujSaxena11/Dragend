import { useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import "./Explore.css";
import { useEffect } from "react";

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
    id: 1,
    name: "Express API Generator",
    tech: "Express",
    category: "REST API",
    rating: 4.5,
    price: "₹499",
    desc: "Auto generates Express backend structure with authentication and modular architecture."
  },
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
    desc: "JWT based authentication microservice with role management and security layers."
  },
  {
    id: 3,
    name: "Laravel Ecommerce Backend",
    tech: "Laravel",
    category: "Ecommerce",
    rating: 4.7,
    price: "₹899",
    desc: "Complete ecommerce backend including payments, cart system and order management."
  },
  {
    id: 4,
    name: "Mongo CRUD API",
    tech: "Node",
    category: "Database",
    rating: 3.9,
    price: "Free",
    desc: "CRUD boilerplate with MongoDB integration and scalable folder structure."
  }
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");
  const [category, setCategory] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="explore-root">

      {/* HERO */}
      <section className={`explore-hero ${scrolled ? "collapsed" : ""}`}>
        <div className="hero-content">
          <h1>Production-ready backend starters</h1>
          <p>
            Explore curated backend templates, services, and generators
            designed to save weeks of setup time.
          </p>
        </div>
      </section>

      {/* STICKY HEADER */}
      <header className={`explore-header ${scrolled ? "visible" : ""}`}>
        <div className="header-left">
          <Search size={16} />
          <input
            placeholder="Search backends, stacks, or features"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="header-right">
          <img src="/logo.svg" alt="Dragend" />
        </div>
      </header>

      {/* MAIN */}
      <main className="explore-main">

        {/* FILTERS */}
        <div className="filters-bar">
          <div className="filter">
            <SlidersHorizontal size={14} />
            <select onChange={(e) => setTech(e.target.value)}>
              <option value="">All stacks</option>
              <option value="Express">Express</option>
              <option value="Spring Boot">Spring Boot</option>
              <option value="Laravel">Laravel</option>
            </select>
          </div>

          <div className="filter">
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              <option value="REST API">REST API</option>
              <option value="Authentication">Authentication</option>
              <option value="Database">Database</option>
            </select>
          </div>
        </div>

        {/* LIST */}
        <div className="project-list">
          {projects.map((p) => (
            <div className="project-row" key={p.id}>
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
                <div className="rating">
                  <Star size={14} fill="#111" />
                  {p.rating}
                </div>
                <button>View</button>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

import { useNavigate } from "react-router-dom";

export const featuredItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=60",
    tag: "#01",
    label: "Visual Backend Builder",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
    tag: "#02",
    label: "Database & Schema Design",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29kaW5nfGVufDB8fDB8fHww",
    tag: "#03",
    label: "API & Logic Generation",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=60",
    tag: "#04",
    label: "Secure Auth & Config",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60",
    tag: "#05",
    label: "Instant Deployment",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=600&auto=format&fit=crop&q=60",
    tag: "#06",
    label: "Scalable Architecture",
  },
];


export const FeaturedHeader = () => {
    const navigate = useNavigate();
  return (
    <div className="text-center max-w-2xl mx-auto mb-16">
      <h2 className="text-4xl font-bold tracking-tight">
        Curious What Else I’ve Created?
      </h2>

      <p className="text-gray-500 mt-4">
        Explore more brand identities, packaging, and digital design work
        in my extended portfolio.
      </p>

      <button onClick={() => navigate('/explore')} className="cursor-pointer mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition">
        See more Projects
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-400 text-white">
          →
        </span>
      </button>
    </div>
  );
};

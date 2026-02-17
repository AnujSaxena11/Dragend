import { SelectionCard } from "./SelectionCard";
import { Globe, Server } from "lucide-react";


const BACKENDS = [
  { name: "Node + Express", logo: import.meta.env.VITE_NODEJS_LOGO },
  { name: "FastAPI", logo: import.meta.env.VITE_FASTAPI_LOGO },
  { name: "Django", logo: import.meta.env.VITE_DJANGO_LOGO },
  { name: "Laravel", logo: import.meta.env.VITE_LARAVEL_LOGO },
  { name: "Spring Boot", logo: import.meta.env.VITE_SBOOT_LOGO }
];


export const StepTechStack = ({ formData, update }) => (
  <div className="space-y-6">

    <h3 className="text-2xl font-semibold mt-6">Backend</h3>

    {BACKENDS.map((b) => (
      <SelectionCard
        key={b.name}
        title={b.name}
        icon={b.logo}
        selected={formData.backend === b.name}
        onClick={() => update("backend", b.name)}
      />
    ))}
  </div>
);

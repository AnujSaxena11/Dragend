import { FeaturedHeader } from "./FeaturedHeader";
import { FeaturedCarousel } from "./FeaturedCarousel";

export const Featured = () => {
  return (
    <section className="py-32 bg-white">
      <FeaturedHeader />
      <FeaturedCarousel />
    </section>
  );
};

import { FeaturedCard } from "./FeaturedCard";
import { featuredItems } from "./FeaturedHeader";

export const FeaturedCarousel = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-center gap-6">
        {featuredItems.map((item, index) => (
          <FeaturedCard
            key={item.id}
            image={item.image}
            index={index}
            total={featuredItems.length}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-center gap-24 mt-10">
        {featuredItems.map((item) => (
          <div key={item.id} className="text-center">
            <span className="text-pink-500 font-semibold text-sm">
              {item.tag}
            </span>
            <p className="text-gray-800 mt-1 text-sm">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

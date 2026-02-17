export const FeaturedCard = ({ image, index, total }) => {
  // center cards pop, side cards rotate
  const offset = index - Math.floor(total / 2);
  const rotate = offset * -8;
  const translateY = Math.abs(offset) * 14;
  const scale = offset === 0 ? 1.05 : 0.95;

  return (
    <div
      className="relative shrink-0 w-[220px] h-[320px] rounded-[32px] overflow-hidden transition-all duration-500"
      style={{
        transform: `
          perspective(1200px)
          rotateY(${rotate}deg)
          translateY(${translateY}px)
          scale(${scale})
        `,
      }}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
};

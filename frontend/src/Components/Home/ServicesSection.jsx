const services = [
  {
    title: "REST APIs",
    video: import.meta.env.VITE_API_VIDEO_URL,
  },
  {
    title: "AI Agent",
    video: import.meta.env.VITE_ROBO_VIDEO_URL,
  },
  {
    title: "Database Management",
    video: import.meta.env.VITE_DB_VIDEO_URL,
  },

];


const ServicesSection = () => {
  return (
    <section className="w-full bg-white py-24">

      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-semibold text-black">
          Services
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-500 px-4 sm:px-0">
          Everything you need to design, deploy, and scale your backend —
          visually.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            video={service.video}
          />
        ))}
      </div>

    </section>
  );
};
const ServiceCard = ({ title, video }) => {
  return (
    <div className="relative rounded-3xl p-6">

      {/* Media */}
      <div className="relative rounded-2xl overflow-hidden bg-white">
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="h-[220px] sm:h-[280px] lg:h-90 w-full object-cover"
        />

        {/* Bottom fade for media */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full
            bg-linear-to-t
            from-[#f7f7f9]
            via-[#f7f7f9]/75
            to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mt-8 text-center">
        <h3 className="text-2xl font-semibold text-black">
          {title}
        </h3>

        <button
          className="
            mt-6 px-9 py-3.5 rounded-2xl
            bg-[#0b1220] text-white text-sm font-medium
            transition-all duration-300 cursor-pointer
            hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500
          "
        >
          Explore now
        </button>
      </div>

    </div>
  );
};

export default ServiceCard;




export { ServicesSection };

const AboutSection = () => {
  return (
    <section
      id="about"
      className="w-full min-h-screen bg-white py-20 sm:py-32
+   flex flex-col items-center justify-center text-center
+   px-4 sm:px-6"
    >
      {/* Video */}
      {/* Glass video capsule */}
      <div
        className="relative mb-12 rounded-full p-[3.6px]
  bg-linear-to-br from-pink-200/60 via-purple-200/40 to-blue-200/60
"
      >
        <div
          className="relative rounded-full overflow-hidden
    bg-white/70 backdrop-blur-md
    border border-white/60
    w-[280px] sm:w-90 h-[120px] sm:h-35
  "
        >
          <video
            src={import.meta.env.VITE_BG_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Soft light wash */}
          <div
            className="pointer-events-none absolute inset-0
        bg-linear-to-tr
        from-pink-200/20 via-transparent to-purple-200/20"
          />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-5xl font-bold text-[#0b1220] ">
        What is Dragend?
      </h2>

      {/* Description */}
      <p className="mt-6 max-w-[90%] sm:max-w-3xl
+ text-base sm:text-lg text-gray-500 leading-relaxed">
        Dragend is a visual backend builder that lets you design REST APIs,
        manage databases, and orchestrate AI agents using a drag-and-drop
        interface. Built for developers who want speed without sacrificing
        control.
      </p>

      {/* CTA */}
      <button
        className="
          mt-12 px-10 py-4 rounded-2xl
          bg-[#f5f9ff] text-[#0b1220] font-medium
          border border-blue-200
          hover:bg-white hover:border-blue-300
          transition-all duration-300 cursor-pointer
        "
      >
        Whitepaper
      </button>
    </section>
  );
};

export default AboutSection;

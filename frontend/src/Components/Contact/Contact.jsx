import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer";

const Contact = () => {
  return (
    <div className="h-screen w-screen overflow-x-hidden bg-white text-black">
      <div className="fixed inset-0 z-0">
        <video
          className="h-full w-full object-cover opacity-50"
          src={import.meta.env.VITE_BG_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>


      <div className="relative z-10 flex flex-col min-h-full">
        <Navbar></Navbar>
        <main className="flex-grow flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/40 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl">


            <div className="flex flex-col justify-center">
              <h1 className="text-5xl font-bold tracking-tight mb-6">
                Get in <span className="text-purple-600">touch.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Have questions about Dragend? Our team is here to help you build your next backend faster.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-widest text-gray-400">Email</h3>
                  <p className="text-xl">hackathonprevision@gmail.com
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-widest text-gray-400">Office</h3>
                  <p className="text-xl">GLA U, Mathura</p>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-white/50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-white/50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="bg-white/50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
              <textarea
                placeholder="How can we help?"
                rows="4"
                className="bg-white/50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              ></textarea>

              <button className="bg-black text-white font-medium py-4 rounded-xl shadow-lg transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-2xl cursor-pointer hover:bg-gray-800 active:scale-95">
                Send Message
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact;
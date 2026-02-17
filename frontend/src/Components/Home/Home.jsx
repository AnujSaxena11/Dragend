import Navbar from "../Navbar/Navbar";
import AboutSection from "./AboutSection";
import { Featured } from "./Featured/Featured";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import { ServicesSection } from "./ServicesSection";

// home page
const Home = () => {
    return (
        <div className="grid h-screen w-full">
            <video className="col-start-1 row-start-1 h-full w-full object-cover" src={import.meta.env.VITE_BG_VIDEO_URL} autoPlay loop muted playsInline />
        <div className="col-start-1 row-start-1 z-10 h-[12vh] text-black">
                <Navbar />
                <HeroSection/>
                <Featured/>
                <ServicesSection/>
                <AboutSection/>
                <Footer/>
                
            </div>
            

        </div>
    );
};

export default Home;

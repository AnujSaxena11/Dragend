import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { CheckAuth, logoutApi } from "../auth/AuthAPI";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const data = await CheckAuth();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        setUser(null);
      }
    };
    verifyUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGetStarted = async () => {
    try {
      const isLoggedIn = await CheckAuth();
      if (isLoggedIn.authenticated) {
        navigate('/new');
      } else {
        navigate('/auth', { state: { from: "/new" } });
      }
    } catch {
      navigate('/auth', { state: { from: "/new" } });
    }
  };

  const handleProfile = async () => {
    try {
      const isLoggedIn = await CheckAuth();
      if (isLoggedIn.authenticated) {
        navigate('/projects');
      } else {
        navigate('/auth', { state: { from: "/my-projects" } });
      }
    } catch {
      navigate('/auth', { state: { from: "/my-projects" } });
    }
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    setOpen(false);

    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 ">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <div onClick={() => navigate('/')} className=" flex text-2xl sm:text-3xl font-medium text-black cursor-pointer" >
          {/* <img src={Main_logo} alt="" width={'200px'} /> */}
          <img src={import.meta.env.VITE_MAIN_LOGO} alt="" width={'80px'} className="mt-2" />
          {/* <img src={best_logo} alt="" width={'200px'} className=""/> */}
          {/* <video className="w-50" src={Logo_gif} autoPlay loop muted playsInline /> */}
          {/* <div className="mt-[10%]">Dragend</div> */}
          <img src={import.meta.env.VITE_DRAGEND_LOGO} alt="" width={'150px'} className="mt-4" />
        </div>

        <ul className="hidden md:flex items-center gap-10 text-lg font-medium">
          <li
            className="
            cursor-pointer text-black
            hover:bg-linear-to-r hover:from-purple-800 hover:to-pink-900
            hover:bg-clip-text hover:text-transparent
            transition-all duration-300
          "
          >
            About
          </li>

          <li onClick={() => navigate('/contact')} className="cursor-pointer text-black hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all duration-300 ">
            Contact
          </li>
          <li>
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-12 h-12 rounded-full border-2 border-purple-500 p-[2px] cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-full bg-linear-to-r from-purple-700 to-pink-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                    {user.username ? user.username.charAt(0) : "U"}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-60  backdrop-blur-xl bg-white/10 border-t border-white/5 rounded-2xl shadow-xl overflow-hidden transform origin-top-right animate-in fade-in zoom-in-95 duration-200">

                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Signed in as</p>
                      <p className="font-bold text-gray-800 truncate text-lg">
                        @{user.username}
                      </p>
                    </div>

                    <div className="flex flex-col py-2">
                      <button onClick={() => navigate('/profile')} className="text-left px-6 py-3 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-3">
                        My Profile
                      </button>
                      <button onClick={() => navigate('/projects')} className="text-left px-6 py-3 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center gap-3">
                        My Projects
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button onClick={handleLogout} className="text-left px-6 py-3 text-red-500 hover:bg-red-50 transition-colors font-medium">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div onClick={handleProfile} className="cursor-pointer text-black hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all duration-300 ">
                My Project
              </div>
            )}
          </li>
          <li>
            <button
              onClick={handleGetStarted}
              className="
                px-6 py-3 rounded-2xl
                bg-white text-black
                hover:bg-linear-to-r hover:from-purple-700 hover:to-pink-600
                hover:text-white
                transition-all duration-500
                cursor-pointer
              "
            >
              Get Started
            </button>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl text-black mr-3"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="
            md:hidden
            backdrop-blur-xl
            bg-white/5
            border-t border-white/5
            shadow-lg
          "
        >
          <ul className="flex flex-col items-center gap-6 py-8 text-lg font-medium">
            <li
              className="
                cursor-pointer text-black
                hover:bg-linear-to-r hover:from-purple-800 hover:to-pink-900
                hover:bg-clip-text hover:text-transparent
                transition-all duration-300
              "
            >
              About
            </li>

            <li
              className="
                cursor-pointer text-black
                hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-500
                hover:bg-clip-text hover:text-transparent
                transition-all duration-300
              "
            >
              Contact
            </li>

            <button
              onClick={() => {
                handleGetStarted(); // Use the logic function
                setOpen(false); // Close menu after clicking
              }}
              className="
                mt-4 px-8 py-3 rounded-2xl
                bg-black/90 text-white
                hover:bg-linear-to-r hover:from-purple-700 hover:to-pink-600
                transition-all duration-500
              "
            >
              Get Started
            </button>
            {user ? (
              // Mobile Logged In View
              <>
                <div className="w-1/2 h-[1px] bg-gray-300 my-2"></div>
                <li className="text-purple-900 font-bold uppercase">@{user.username}</li>
                <li onClick={() => navigate('/profile')} className="cursor-pointer text-gray-700 hover:text-purple-600">My Profile</li>
                <li onClick={() => navigate('/projects')} className="cursor-pointer text-gray-700 hover:text-purple-600">My Projects</li>
                <li onClick={() => { handleLogout(); setOpen(false); }} className="cursor-pointer text-red-500 font-semibold">Logout</li>
              </>
            ) : (
              <div></div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
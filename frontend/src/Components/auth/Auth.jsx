import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginUserApi, SignUpApi, VerifyOtpApi } from "./AuthAPI";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    Cpassword: "",
  });

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(180);
  const [showPass, setShowPass] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") setLoginData({ ...loginData, [name]: value });
    else setSignupData({ ...signupData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password)
      return toast.error("Fill all fields");
//
    setLoading(true);
    try {
      const res = await LoginUserApi(loginData.email, loginData.password);
      if (res.success || res.msg === "Login successfully.") {
        toast.success("Login successful!");
        localStorage.setItem("isLoggedIn", "true");
        const destination = location.state?.from || "/new";
        setTimeout(() => navigate(destination), 1000);
      } else toast.error(res.message || "Invalid credentials");
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password, Cpassword } = signupData;

    if (!username || !email || !password)
      return toast.error("All fields required");
    if (password !== Cpassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await SignUpApi(username, email, password, Cpassword);
      if (res.status === 201) {
        toast.success("Check your email for OTP");
        setShowOtp(true);
        setTimeLeft(180);
      }
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < 6) return toast.error("Enter full OTP");

    setLoading(true);
    try {
      const res = await VerifyOtpApi(signupData.email, code);
      if (res.status === 200) {
        toast.success("Verified! Please login.");
        setShowOtp(false);
        setIsLogin(true);
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (el, i) => {
    if (isNaN(el.value)) return;
    const newOtp = [...otp];
    newOtp[i] = el.value;
    setOtp(newOtp);
    if (el.value && i < 5) inputRefs.current[i + 1].focus();
  };

  useEffect(() => {
    let timer;
    if (showOtp && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showOtp, timeLeft]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#b46cff] via-[#ff6cab] to-[#f4dcc2] overflow-hidden">
      <Toaster position="top-center" />

      {/* Glass Container */}
      <div className="relative w-full flex justify-around max-w-6xl h-auto lg:h-[85vh] rounded-3xl bg-black/50 backdrop-blur-xl shadow-2xl border border-black/30 flex overflow-visible">
        {/* LEFT - AUTH FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome Back, Builder." : "Start Building in Minutes."}
          </h2>
          <p className="text-white/70 mb-8">
            {isLogin
              ? "Log in to keep shipping smarter backends."
              : "Create your account and design without limits."}
          </p>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <input
                  name="email"
                  placeholder="Email"
                  onChange={(e) => handleInput(e, "login")}
                  className="w-full px-5 py-4 rounded-full bg-black/60 text-white outline-none placeholder:text-white/50"
                />

                <div className="flex items-center bg-black/60 rounded-full px-5">
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => handleInput(e, "login")}
                    className="w-full py-4 bg-transparent outline-none text-white placeholder:text-white/50"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <div className="flex justify-between text-sm text-white/70">
                  <span>Keep me logged in</span>
                  <span className="cursor-pointer underline">
                    Forgot Password
                  </span>
                </div>

                <button
                  disabled={loading}
                  className="w-full py-4 rounded-full font-semibold bg-gradient-to-r from-pink-400 to-orange-300 text-black hover:scale-[1.02] transition"
                >
                  {loading ? "Signing In..." : "Sign in"}
                </button>

                <p className="text-center text-white/70">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-white font-semibold cursor-pointer"
                  >
                    Sign up
                  </span>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {!showOtp ? (
                  <form onSubmit={handleSignup} className="space-y-5">
                    <input
                      name="username"
                      placeholder="Full Name"
                      onChange={(e) => handleInput(e, "signup")}
                      className="w-full px-5 py-4 rounded-full bg-black/60 text-white"
                    />

                    <input
                      name="email"
                      placeholder="Email"
                      onChange={(e) => handleInput(e, "signup")}
                      className="w-full px-5 py-4 rounded-full bg-black/60 text-white"
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => handleInput(e, "signup")}
                        className="w-full sm:w-1/2 px-5 py-4 rounded-full bg-black/60 text-white"
                      />

                      <input
                        name="Cpassword"
                        type="password"
                        placeholder="Confirm"
                        onChange={(e) => handleInput(e, "signup")}
                        className="w-full sm:w-1/2 px-5 py-4 rounded-full bg-black/60 text-white"
                      />
                    </div>

                    <button className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-black font-semibold">
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                    <p className="text-center text-white/70">
                      Already a member?{" "}
                      <span
                        onClick={() => {
                          setIsLogin(true);
                          setShowOtp(false);
                        }}
                        className="text-white font-semibold cursor-pointer"
                      >
                        Login
                      </span>
                    </p>
                  </form>
                ) : (
                  <div className="text-center">
                    <h3 className="text-xl mb-4">Verify Your Email</h3>

                    <div className="flex justify-center gap-2 mb-6">
                      {otp.map((d, i) => (
                        <input
                          key={i}
                          maxLength="1"
                          ref={(el) => (inputRefs.current[i] = el)}
                          value={d}
                          onChange={(e) => handleOtpChange(e.target, i)}
                          className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-white text-black"
                        />
                      ))}
                    </div>

                    <button
                      onClick={handleVerifyOtp}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 text-black font-semibold"
                    >
                      Verify Code
                    </button>

                    <p className="mt-4 text-white/70">
                      {timeLeft > 0 ? (
                        `Resend in ${Math.floor(timeLeft / 60)}:${(
                          timeLeft % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      ) : (
                        <span
                          className="cursor-pointer underline"
                          onClick={() => setTimeLeft(180)}
                        >
                          Resend OTP
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden lg:flex w-[42%] min-w-[420px] relative p-6 text-white flex-col justify-center">
          <div
            className="main-card h-full p-10 rounded-3xl max-w-md"
            style={{
              backgroundImage: `url(${import.meta.env.VITE_AUTH_BG_URL})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h2 className="text-4xl font-bold leading-snug">
              Design Backends. <br /> Skip the Drama.
            </h2>

            <p className="mt-6 text-8 text-white/80">
              “Dragend turns backend chaos into clean, visual workflows — build
              faster, deploy smarter.”
            </p>

            <p className="mt-6 font-semibold">Visual automation made easy</p>
            <p className="text-sm text-white/70">Developed by Dragend Team</p>
          </div>

          <div className="absolute card text-black -bottom-6 ml-8 w-92 h-35 p-6 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-200 shadow-2xl">
            <h4 className="font-bold mb-2">Ship backend faster</h4>
            <p className="text-sm text-black/70">
              Design, connect, and deploy your backend in minutes — not weeks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
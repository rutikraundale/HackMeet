import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ToastContainer from "../components/ToastContainer";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all required fields.", "warning");
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      addToast("Welcome back! You're now signed in.", "success");
      navigate("/dashboard");
    } catch (err) {
      addToast("Invalid email or password. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col overflow-x-hidden">
      {/* ToastContainer must be mounted here — SignIn is a public route outside DashboardLayout */}
      <ToastContainer />
      
      {/* Header */}
      <div className="border-b border-slate-700 flex items-center">
        <div className="flex items-center gap-2 mx-4">
          <div className="border border-white px-2 py-1 text-sm font-bold">▶</div>
          <span className="font-bold text-lg tracking-wider px-6 py-3">
            HACKMEET
          </span>
        </div>
      </div>

      {/* Main */}
      {/* pb-28 sm:pb-0: keyboard-safe spacing so form isn't hidden behind virtual keyboard on mobile */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 pb-28 sm:pb-6 overflow-y-auto">
        
        {/* Container */}
        <div className="w-full max-w-xl mx-auto bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-800">

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Access Your Profile
          </h1>

          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Sign in to your HackMeet account and connect with high-performance teams.
          </p>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-8">

            {/* Authentication Section */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700">
                — AUTHENTICATION
              </h3>

              <div className="space-y-6">
                
                {/* Email */}
                <div>
                  <label className="block text-xs text-gray-400 mb-3 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[44px]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs text-gray-400 mb-3 font-semibold">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition pr-12 min-h-[44px]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-semibold min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-400 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-lg transition text-lg min-h-[44px]"
            >
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </button>

          </form>

          {/* Footer */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500 mt-8 pt-4 border-t border-gray-700">
            <Link to="/signup" className="hover:text-gray-300 transition min-h-[44px] flex items-center">
              CREATE NEW ACCOUNT
            </Link>
            <a href="#!" className="hover:text-gray-300 transition min-h-[44px] flex items-center">
              FORGOT PASSWORD
            </a>
            <a href="#!" className="hover:text-gray-300 transition min-h-[44px] flex items-center">
              SUPPORT
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignIn;
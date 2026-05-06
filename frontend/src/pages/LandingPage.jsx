import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Code, Users, Rocket, Shield, Globe, Zap, Menu, X, Github, Twitter, Linkedin } from "lucide-react";
export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Simulate initial loading window to ensure smooth entrance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl animate-pulse mb-6 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
          H
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p className="text-slate-400 mt-4 font-medium tracking-wide">Preparing workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
              H
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white hidden sm:block">HACKMEET</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#community" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Community</a>
            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition px-4 py-2">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900 border-b border-slate-800 py-6 px-4 flex flex-col gap-4 shadow-2xl animate-in slide-in-from-top-4">
            <a href="#features" className="text-base font-medium text-slate-300 p-2 hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#community" className="text-base font-medium text-slate-300 p-2 hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Community</a>
            <Link to="/login" className="text-base font-medium text-slate-300 p-2 hover:bg-slate-800 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            <Link to="/signup" className="mt-2 text-center text-base font-semibold bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-blue-600/20 rounded-full blur-[100px] sm:blur-[120px] -z-10 animate-pulse pointer-events-none" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[100px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-8 sm:mb-10 hover:bg-blue-500/20 transition-colors cursor-default">
          <Zap size={16} className="text-amber-400" />
          The Ultimate Hackathon Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-6 sm:mb-8 max-w-5xl tracking-tight leading-[1.1]">
          Build the Future,<br className="hidden sm:block" /> Together.
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl sm:max-w-3xl mx-auto mb-10 sm:mb-12 leading-relaxed px-2">
          Connect with elite developers, visionary designers, and driven innovators. Form dream teams, dominate global hackathons, and turn your boldest ideas into production-ready reality.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center px-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2"
          >
            Start Building <Rocket size={20} />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-700 text-white rounded-full font-bold text-lg transition-all duration-300 border border-slate-700 hover:border-slate-500 flex items-center justify-center"
          >
            Access Dashboard
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-slate-900 border-y border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6">Everything you need to ship fast</h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              HackMeet provides an enterprise-grade toolset for participants and organizers to smoothly execute hackathons, manage teams, and deploy projects.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Users size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Intelligent Matchmaking</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Find the perfect teammates instantly based on complementary skills, technical stacks, and timezone compatibility. Build balanced teams effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 group transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Global Discovery</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Browse and register for upcoming global, local, and virtual hackathons directly through our unified, highly-curated interactive discovery panel.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 group transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Code size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Live Integrations</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Integrate GitHub repositories to track live commit activity, giving organizers and teammates real-time insights into your actual progress.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 group transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 mb-8 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Shield size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Admin Command Center</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                Organizers receive a complete top-down dashboard to manage hackathons, monitor registered teams, enforce rules, and track overall analytics.
              </p>
            </div>

             {/* Feature 5 */}
             <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 group transform hover:-translate-y-1 lg:col-span-2">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-400 mb-8 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                <Globe size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Global Real-time Networking</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base max-w-3xl">
                Connect and communicate with industry peers across the world via instant WebSocket messaging directly inside your dashboard. Never lose context by switching between external chat apps and your hackathon portal again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2 pr-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                  H
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">HACKMEET</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Empowering the next generation of builders. We provide the infrastructure for innovation, bringing talent and opportunity together in one seamless platform.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-400 transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors">
                  <Github size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Community Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Hackathon Guide</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Partners</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} HackMeet Inc. All rights reserved. Built for builders.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

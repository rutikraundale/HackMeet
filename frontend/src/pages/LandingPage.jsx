import React from "react";
import { Link } from "react-router-dom";
import { Code, Users, Rocket, Shield, Globe, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="font-bold text-xl tracking-wide text-white">HACKMEET</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-white transition">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center px-4">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Zap size={14} />
          The Ultimate Hackathon Platform
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 mb-6 max-w-4xl tracking-tight leading-tight">
          Build the Future,<br />Together.
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Connect with top developers, designers, and innovators. Join forces, participate in world-class hackathons, and turn your boldest ideas into reality.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)] transform hover:-translate-y-1"
          >
            Start Building Now
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-all duration-300 border border-slate-700 hover:border-slate-600"
          >
            Access Dashboard
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything you need to ship fast</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              HackMeet provides the complete toolset for participants and organizers to smoothly execute hackathons and manage teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Intelligent Team Matchmaking</h3>
              <p className="text-slate-400">
                Find the perfect teammates instantly based on complementary skills and technical stacks. Build balanced teams effortlessly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-colors group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hackathon Discovery</h3>
              <p className="text-slate-400">
                Browse and register for upcoming global, local, and online hackathons directly through a unified interactive discovery panel.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-colors group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Repository Tracking</h3>
              <p className="text-slate-400">
                Integrate your GitHub repositories to track live commit activity, giving organizers and teammates realtime insights into your progress.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-amber-500/50 transition-colors group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Admin Overviews</h3>
              <p className="text-slate-400">
                Organizers receive a complete top-down dashboard to manage hackathons, monitor registered teams, and track overall analytics.
              </p>
            </div>

             {/* Feature 5 */}
             <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 hover:border-pink-500/50 transition-colors group">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Global Networking</h3>
              <p className="text-slate-400">
                Connect and communicate with industry peers across the world via instant messaging directly inside your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              H
            </div>
            <span className="font-bold tracking-wide text-white">HACKMEET</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} HackMeet. All rights reserved. Built for builders.
          </p>
          <div className="flex gap-4 text-sm text-slate-400">
            <a href="#!" className="hover:text-white transition">Privacy Policy</a>
            <a href="#!" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

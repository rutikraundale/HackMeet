import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const predefinedSkills = [
    "React", "Node.js", "MongoDB", "Docker", 
    "AWS", "Java", "Python", "C++",
  ];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleCheckboxChange = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      addToast("Username, Email, and Password are required", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      await signup({ username, email, password, bio, college, skills });
      addToast("Account created successfully! 🎉", "success");
      navigate("/login");
    } catch (err) {
      addToast(err.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col overflow-x-hidden">
      
      {/* Header */}
      <div className="border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2 mx-4">
          <div className="border border-white px-2 py-1 text-sm font-bold">▶</div>
          <span className="font-bold text-lg tracking-wider px-6 py-3">
            HACKMEET
          </span>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 overflow-y-auto">
        
        <div className="w-full max-w-xl mx-auto bg-gray-900 p-8 rounded-xl border border-gray-800">

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3">
            Architect Your Identity
          </h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Complete your technical profile to match with high-performance teams and cutting-edge projects.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Personal Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700 uppercase">
                — Core Identity (Required)
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username *"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address *"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password * (min 6 characters)"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-semibold"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Enrichment */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700 uppercase">
                — Professional Profile (Optional)
              </h3>

              <div className="space-y-4">
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="College / Organization"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
                />

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself (Bio)"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>
            </div>

            {/* Technical Arsenal */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700 uppercase">
                — Technical Arsenal (Optional)
              </h3>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {predefinedSkills.map((skill) => (
                  <label
                    key={skill}
                    className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer ${
                      skills.includes(skill)
                        ? "bg-blue-500/20 border-blue-500"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes(skill)}
                      onChange={() => handleCheckboxChange(skill)}
                    />
                    <span className="text-sm">{skill}</span>
                  </label>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 mb-4">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add custom skill"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 bg-slate-800 border border-slate-700 rounded"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Selected Skills */}
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2 border border-slate-700"
                  >
                    <span className="text-xs">{skill}</span>
                    <button onClick={() => removeSkill(skill)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-400 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-lg transition"
            >
              {loading ? "CREATING..." : "CREATE PROFILE →"}
            </button>
          </form>

          {/* Footer */}
          <div className="flex justify-center gap-6 text-xs text-gray-500 mt-8 pt-3 border-t border-gray-700 flex-wrap">
            <Link to="/login" className="hover:text-gray-300 transition">ALREADY HAVE AN ACCOUNT?</Link>
            <a href="#!" className="hover:text-gray-300 transition">PRIVACY_POLICY</a>
            <a href="#!">TERMS_OF_SERVICE</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
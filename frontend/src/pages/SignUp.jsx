import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ToastContainer from "../components/ToastContainer";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
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
    if (!username || !email || !password || !mobileNumber) {
      addToast("Please fill in all required fields.", "warning");
      return;
    }
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(mobileNumber)) {
      addToast("Please enter a valid 10-digit Indian mobile number.", "warning");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters.", "warning");
      return;
    }
    setLoading(true);
    try {
      const parsedSocialLinks = socialLinks
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean);

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("mobileNumber", mobileNumber);
      if (bio) formData.append("bio", bio);
      if (college) formData.append("college", college);
      skills.forEach(skill => formData.append("skills", skill));
      parsedSocialLinks.forEach(link => formData.append("socialLinks", link));
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await signup(formData);
      addToast("Account created! Welcome to HackMeet.", "success");
      navigate("/login");
    } catch (err) {
      addToast("Sign up failed. That email may already be in use.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col overflow-x-hidden">
      {/* ToastContainer must be mounted here — SignUp is a public route outside DashboardLayout */}
      <ToastContainer />
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
      {/* pb-28 sm:pb-6: keyboard-safe spacing on mobile */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 pb-28 sm:pb-6 overflow-y-auto">
        
        <div className="w-full max-w-xl mx-auto bg-gray-900 p-6 sm:p-8 rounded-xl border border-gray-800">

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
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
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="Username * (no spaces allowed)"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[44px]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address *"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[44px]"
                />

                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Indian Mobile Number (10 digits) *"
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[44px]"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password * (min 6 characters)"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition pr-16 min-h-[44px]"
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

            {/* Profile Enrichment */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700 uppercase">
                — Professional Profile (Optional)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Profile Picture (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50 cursor-pointer"
                  />
                </div>

                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="College / Organization"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[44px]"
                />

                <input
                  type="text"
                  value={socialLinks}
                  onChange={(e) => setSocialLinks(e.target.value)}
                  placeholder="Coding Profiles / Social URLs (comma-separated)"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition min-h-[44px]"
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

              {/* Skill checkboxes — 2-col on mobile, 3 on sm, 4 on md */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {predefinedSkills.map((skill) => (
                  <label
                    key={skill}
                    className={`flex items-center gap-2 px-3 py-2 rounded border cursor-pointer min-h-[44px] ${
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

              {/* Custom skill input — stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
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
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded min-h-[44px]"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 bg-slate-800 border border-slate-700 rounded min-h-[44px] min-w-[44px] flex items-center justify-center self-start sm:self-auto"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Selected Skills */}
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2 border border-slate-700 min-h-[36px]"
                  >
                    <span className="text-xs">{skill}</span>
                    <button onClick={() => removeSkill(skill)} className="min-w-[20px] min-h-[20px] flex items-center justify-center">
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
              className="w-full bg-blue-400 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-bold py-3 rounded-lg transition min-h-[44px]"
            >
              {loading ? "CREATING..." : "CREATE PROFILE →"}
            </button>
          </form>

          {/* Footer */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-gray-500 mt-8 pt-3 border-t border-gray-700">
            <Link to="/login" className="hover:text-gray-300 transition min-h-[44px] flex items-center">ALREADY HAVE AN ACCOUNT?</Link>
            <a href="#!" className="hover:text-gray-300 transition min-h-[44px] flex items-center">PRIVACY_POLICY</a>
            <a href="#!" className="min-h-[44px] flex items-center">TERMS_OF_SERVICE</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
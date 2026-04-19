import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const predefinedSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "Docker",
    "AWS",
    "Java",
    "Python",
    "C++",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { name, phone, email, skills };
    console.log(userData);
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
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700">
                — PERSONAL INFORMATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded"
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 123456xxxx"
                  className="px-4 py-3 bg-slate-800 border border-slate-700 rounded"
                />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded"
              />
            </div>

            {/* Technical Arsenal */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-4 pb-3 border-b border-gray-700">
                — TECHNICAL ARSENAL
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
                    {skill}
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
                    className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
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
              className="w-full bg-blue-400 hover:bg-blue-500 text-slate-900 font-bold py-3 rounded-lg"
            >
              CREATE PROFILE →
            </button>
          </form>

          {/* Footer */}
          <div className="flex justify-center gap-6 text-xs text-gray-500 mt-8 pt-3 border-t border-gray-700 flex-wrap">
            <Link to="/login">ALREADY HAVE AN ACCOUNT?</Link>
            <a href="#!">PRIVACY_POLICY</a>
            <a href="#!">TERMS_OF_SERVICE</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
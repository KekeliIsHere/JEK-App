import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthPageProps {
  onLogin: (name: string) => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  // state for toggling between Sign In and Sign Up
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // Defensive toggle function: checks that setIsLogin is a function before calling.
  // In normal React environments this is unnecessary, but it prevents the specific
  // runtime error you reported ("" is not a function) when environments are misconfigured.
  const toggleAuthMode = () => {
    if (typeof setIsLogin === "function") {
      setIsLogin((prev) => !prev);
    } else {
      // If setIsLogin unexpectedly isn't a function, log useful debugging info
      // so you (or I) can trace why hooks might be broken in the environment.
      // Do not throw — degrade gracefully.
      // (This should never happen in a standard React app.)
      // eslint-disable-next-line no-console
      console.error("setIsLogin is not a function", setIsLogin);
    }
  };

  // Handle the form submit. Prevent default to avoid full page reloads causing
  // odd runtime behavior in non-React environments.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Log submission
    // eslint-disable-next-line no-console
    console.log(isLogin ? "Sign In submitted" : "Sign Up submitted", formData);

    // Call onLogin with the student name and navigate to dashboard
    const studentName = isLogin
      ? formData.email.split("@")[0] // Use email prefix as name for login
      : `${formData.firstname} ${formData.lastname}`; // Use full name for signup

    onLogin(studentName);
    navigate("/dashboard");
  };

  // toggle to reveal/hide password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbf9f9] p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-[#b3ccb8] grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/*
          IMAGE SLOT (left column)
          -------------------------
          Replace the content of the div below with your image, canvas, Lottie, or animation.
          Keep the container (wrapper) if you want the same layout/responsiveness.
        */}
        <div className="hidden md:flex items-stretch justify-center bg-[var(--secondary)] p-0">
          {/* Image fills the left column. Put your file at /JEKlogo.png (frontend/public/JEKlogo.png).
              The image will cover the area and keep aspect by object-cover. */}
          <div className="w-full h-full">
            <img
              src="/JEKlogo.png"
              alt="Logo"
              onError={(e) => {
                // fallback to vite/react logo shipped in public if JEKlogo.png isn't present
                (e.currentTarget as HTMLImageElement).src = '/vite.svg';
              }}
              className="w-full h-full object-cover rounded-l-2xl"
            />
          </div>
        </div>

        {/* Auth Panel (right column) */}
        <div className="p-8 flex flex-col justify-center text-[#060404]">
          <h2 className="text-3xl font-bold mb-6 text-center">{isLogin ? "Welcome Back" : "Create Account"}</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full name only shown on Sign Up */}
            {!isLogin && (
             <>
              <input
                name="firstname"
                type="text"
                placeholder="first name"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
              />
              <input
                name="lastname"
                type="text"
                placeholder="last name"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
              />
             </>
              
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pr-20 p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
              />

              <button
                type="button"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className={`absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                  showPassword ? "bg-[var(--primary)] text-white border-transparent" : "bg-white/70 text-[var(--text)] border-transparent hover:bg-white/90"
                }`}
              >
                {/* Eye / Eye-off icons */}
                {showPassword ? (
                  // Eye-off (visible state)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a3 3 0 0 0 4.24 4.24" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M14.12 14.12C16.06 13.01 17.5 11.16 18.5 9.5 16.5 6 12 4 8 4c-1.2 0-2.36.2-3.43.6" />
                  </svg>
                ) : (
                  // Eye (hidden state)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S5.5 6 12 6s9.5 6 9.5 6-3 6-9.5 6S2.5 12 2.5 12z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                  </svg>
                )}
              </button>
            </div>

            {/* Primary submit button */}
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-[#68ba4a] text-white font-semibold hover:opacity-90 transition"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>

            <div className="text-center text-sm text-[#060404]/70">or</div>

            {/* Google Login - make this type=button so it doesn't submit the form */}
            <button
              type="button"
              onClick={() => {
                // TODO: wire this to your Google OAuth popup logic
                // eslint-disable-next-line no-console
                console.log("Google login clicked");
              }}
              className="w-full p-3 rounded-lg border border-[#8baab1] text-[#060404] font-medium hover:bg-[#8baab1]/20 transition"
            >
              <div className="flex items-center justify-center space-x-2">
                {/* Google Logo */}
                <img
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </div>
            </button>
          </form>

          {/* Toggle between Login and Signup. Put type=button to avoid submitting when clicked */}
          <p className="text-center text-sm mt-4 text-[#060404]/80">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-[#68ba4a] font-semibold hover:underline"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>

          {/*
            Notes / Debugging tips:
            - If you still see "is not a function" for setIsLogin, ensure:
              1) You are running this inside a React environment that supports hooks (React >=16.8).
              2) The file is imported as a React component (not copy-pasted into plain HTML).
              3) You don't have a global variable shadowing `setIsLogin` (unlikely but possible).
            - If you want, I can add PropTypes or a strict TS version to catch more issues early.
          */}
        </div>
      </div>
    </div>
  );
}

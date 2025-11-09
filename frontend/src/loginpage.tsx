import React, { useState } from "react";

// AuthPage (Tailwind-ready React component)
// - Minimal login / signup UI
// - Dedicated IMAGE SLOT (commented where to place it)
// - Safe handlers (prevents potential "not a function" crashes)
// - All interactive buttons inside the form that shouldn't submit are given type="button"

export default function AuthPage() {
  // state for toggling between Sign In and Sign Up
  const [isLogin, setIsLogin] = useState(true);

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
    // TODO: connect your auth logic here (call backend / Firebase / etc.)
    // For now, just log inputs (or show a toast) — not implemented intentionally.
    // eslint-disable-next-line no-console
    console.log(isLogin ? "Sign In submitted" : "Sign Up submitted");
  };

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
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 rounded-lg border border-[#b3ccb8] focus:outline-none focus:ring-2 focus:ring-[#68ba4a]"
            />

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

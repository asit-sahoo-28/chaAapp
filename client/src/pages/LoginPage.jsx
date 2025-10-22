






import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentSate, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentSate === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currentSate === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-between px-[8vw] backdrop-blur-2xl 
      max-lg:justify-center max-lg:gap-10 max-lg:flex-col">
      
      {/* Left side - Logo */}
      <div className="flex justify-center items-center">
        <img
          src={assets.logo_big}
          alt="App Logo"
          className="w-[min(25vw,220px)] max-sm:w-[160px]"
        />
      </div>

      {/* Right side - Login / Signup Form */}
      <div className="flex justify-center items-center w-full max-w-md">
        <form
          onSubmit={onSubmitHandler}
          className="w-full border-2 bg-white/10 text-white border-gray-500 p-8 flex flex-col gap-6 rounded-lg shadow-xl"
        >
          <h2 className="font-medium text-2xl flex justify-between items-center">
            {currentSate}
            {isDataSubmitted && (
              <img
                onClick={() => setIsDataSubmitted(false)}
                src={assets.arrow_icon}
                alt=""
                className="w-5 cursor-pointer"
              />
            )}
          </h2>

          {currentSate === "Sign up" && !isDataSubmitted && (
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none"
              placeholder="Full Name"
              required
            />
          )}

          {!isDataSubmitted && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2"
                placeholder="Email Address"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2"
                placeholder="Password"
                required
              />
            </>
          )}

          {currentSate === "Sign up" && isDataSubmitted && (
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-indigo-500"
              placeholder="Provide a short bio..."
              required
            ></textarea>
          )}

          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
          >
            {currentSate === "Sign up" ? "Create Account" : "Login Now"}
          </button>

          <div className="flex items-start gap-2 text-xs">
            <input type="checkbox" className="mt-[2px]" />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className="flex flex-col gap-2">
            {currentSate === "Sign up" ? (
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setCurrentState("Login");
                    setIsDataSubmitted(false);
                  }}
                  className="font-medium text-violet-400 cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                Create an account{" "}
                <span
                  onClick={() => setCurrentState("Sign up")}
                  className="font-medium text-violet-400 cursor-pointer"
                >
                  Click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

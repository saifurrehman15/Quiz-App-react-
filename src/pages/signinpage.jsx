import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider, db } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GoogleOutlined } from "@ant-design/icons";
import ParticleCanvas from "../component/particles";
import image from "../assets/image 1.png";
function SignInForm() {
  const navigate = useNavigate();

  const signUp = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);

        try {
          // Check if the user document already exists
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              email: user.email,
              userName: user.displayName,
              id: user.uid,
              result: [],
            });
          }
          // Continue with the navigation or any other logic
          navigate(`/`);
          console.log(user);
        } catch (error) {
          console.error("Error checking/creating user document: ", error);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Sign-in error: ", errorCode, errorMessage, credential);
      });
  };

  return (
    <div className="w-full h-screen overflow-y-scroll overflow-x-hidden text-white main relative">
      {/* Particle Effect */}
      <ParticleCanvas />

      {/* Hero Section */}
      <section className="hero-section relative z-10">
        <div className="container mx-auto sect">
          <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 items-center small-device">
            <div className="flex items-center px-4 sm:px-10">
              <div>
                <h2 className="mb-4 font-bold text-2xl sm:text-3xl">
                  Welcome to QuizMaster!
                </h2>
                <p className="mb-4">
                  Challenge yourself with our interactive quiz app! Learn,
                  improve, and track your progress with every question. Perfect
                  for all ages and skill levels. Get started now and unlock your
                  full potential!
                </p>
                <button
                  className=" bg-blue-500 p-3 px-4 mt-2 text-white rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow-xl hover:shadow-2xl"
                  onClick={signUp}
                >
                  <GoogleOutlined className="google mx-2 bg-danger" />
                  Sign up with Google
                </button>
              </div>
            </div>
            <div className="flex justify-center items-center px-4 sm:px-10">
              <div className="image">
                <img
                  src={image}
                  alt="QuizMaster Logo"
                  className="img-fluid rounded-lg w-[80%] h-auto md:w-[60%] lg:w-[70%] object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SVG Section with Animation */}
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="svg fill-blue-600 mt-1"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="shape-fill"
          >
            <animate
              attributeName="d"
              dur="3s"
              repeatCount="indefinite"
              values="
                M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z;
                M321.39,50.44c58-5.79,114.16-15.13,172-26.86,82.39-6.72,168.19-7.73,250.45,.39C823.78,21,906.67,62,985.66,82.83c70.05,10.48,146.53,18.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,50.44Z;
                M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            />
          </path>
        </svg>
      </section>
    </div>
  );
}

export default SignInForm;

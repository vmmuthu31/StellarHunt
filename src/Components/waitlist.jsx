import React, { useState, useEffect } from "react";
import axios from "axios";
import stellarHuntText from "../assets/waitlist.svg";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Confetti from "react-confetti";
import { FaWhatsapp, FaEnvelope, FaTelegram, FaDiscord } from "react-icons/fa";

const textStyle = {
  fontSize: "1.8rem",
  width: "30rem",
  textAlign: "center",
  fontWeight: "bold",
  color: "#fff",
  textShadow:
    "0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00, 0 0 20px #00ff00, 0 0 25px #00ff00, 0 0 30px #00ff00, 0 0 35px #00ff00",
  animation: "glow 1.5s infinite alternate",
  position: "relative",
  zIndex: 2,
};

function GLTFModel() {
  const gltf = useLoader(GLTFLoader, "./models/Character_Soldier.gltf");
  gltf.scene.scale.set(1, 1, 1);
  return <primitive object={gltf.scene} position={[0, 1, 0]} castShadow />;
}

const glowKeyframes = `
 @keyframes glow {
    from {
      text-shadow: 0 0 5px #fcfe37, 0 0 10px #fcfe37, 0 0 15px #fcfe37, 0 0 20px #fcfe37, 0 0 25px #fcfe37, 0 0 30px #fcfe37, 0 0 35px #fcfe37;
    }
    to {
      text-shadow: 0 0 10px #fcfe37, 0 0 20px #fcfe37, 0 0 30px #fcfe37, 0 0 40px #fcfe37, 0 0 50px #fcfe37, 0 0 60px #fcfe37, 0 0 70px #fcfe37;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-30px);
    }
    60% {
      transform: translateY(-15px);
    }
  }
`;

const animatedTextStyle = {
  animation: "fadeIn 2s ease-out",
  animationFillMode: "forwards",
  opacity: 0,
};

const animatedButtonStyle = {
  animation: "fadeIn 3s ease-out, bounce 2s ease-in-out",
  animationFillMode: "forwards",
  opacity: 0,
};

const animatedIconsStyle = {
  animation: "fadeIn 4s ease-out",
  animationFillMode: "forwards",
  opacity: 0,
};

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://stellarhunt-be.vercel.app/api/waitlist",
        {
          email,
        }
      );
      setMessage(response.data.message);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 12000); // Show confetti for 12 seconds
    } catch (error) {
      setMessage("Error adding to the waitlist");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 12000);
    }
  };

  const shareLink = "https://stellarhunt.vercel.app/waitlist";
  return (
    <div className="bg-[url('https://blogger.googleusercontent.com/img/a/AVvXsEicOwCW7fWeZ9xLNlLeabY6YZaSndKriwzi7evh6saDDipcRL4_3PjstCbRj-XX8D4T94t_9_R9I7tFVTfp7cUkLDQ-KsxGkuLcTO5o2YjSbhx4P_l-ejYi1S_MjsOv_YVTYwve1iMn6LsmZiinZFCxxCCXOyoOITRutiSjyNkBwDUAML9ZHMgsILPAzTo')] min-h-screen bg-no-repeat bg-cover">
      <style jsx>{glowKeyframes}</style>

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <main className="flex flex-col items-center justify-start min-h-screen pt-0 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-8xl font-extrabold text-white" style={textStyle}>
          <img
            src={stellarHuntText}
            alt="StellarHunt"
            className="inline-block w-auto h-60"
          />
        </h1>
        <h1 className="text-lg font-extrabold text-white" style={textStyle}>
          <div className="h-0"></div> {/* Adjust height as needed */}
          Join the
        </h1>
        <h1 className="text-lg font-extrabold text-white" style={textStyle}>
          <div className="h-0"></div> {/* Adjust height as needed */}
          Waitlist
        </h1>
        <br></br>
        <div className="mt-14 text-center mb-4" style={animatedTextStyle}>
          <p className="mt-2 text-lg text-white">
            Be the first to experience the thrilling adventures of StellarHunt.
          </p>
        </div>
        <div className="bg-black bg-opacity-50 mt-5 p-6 rounded-xl glowing-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-lg text-white bg-transparent border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9fa00] focus:border-transparent"
              style={{
                animation: "fadeIn 3s ease-out, bounce 2s ease-in-out",
                animationFillMode: "forwards",
                opacity: 0,
              }}
            />
            <button
              type="submit"
              className="w-full p-3 text-xl font-bold text-black bg-[#c9fa00] rounded-md hover:bg-[#00cc00] transition duration-300 ease-in-out"
              style={animatedButtonStyle}
            >
              Join Waitlist
            </button>
          </form>
          {message && <p className="mt-2 text-center text-white">{message}</p>}
        </div>
        <div className="mt-4 flex space-x-2" style={animatedIconsStyle}>
          <span className="text-lg text-white">Share with your friends:</span>
          <a
            href={`https://wa.me/?text=Join the waitlist to play StellarHunt with me -> ${encodeURIComponent(
              shareLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="text-white text-3xl" />
          </a>
          <a
            href={`mailto:?subject=Join%20the%20Waitlist&body=Join the waitlist to play StellarHunt with me -> ${encodeURIComponent(
              shareLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaEnvelope className="text-white text-3xl" />
          </a>
          <a
            href={`https://t.me/share/url?url=Join the waitlist to play StellarHunt with me -> ${encodeURIComponent(
              shareLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTelegram className="text-white text-3xl" />
          </a>
          <a
            href={`https://discord.com/channels/@me?url=Join the waitlist to play StellarHunt with me -> ${encodeURIComponent(
              shareLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="text-white text-3xl" />
          </a>
        </div>
        <div className="absolute mt-10 top-0 left-0 w-full h-full -z-10">
          <Suspense fallback={<div>Loading...</div>}>
            <Canvas camera={{ fov: 75, position: [0, 1, 5] }} shadows>
              <directionalLight position={[3.3, 1.0, 4.4]} castShadow />
              <GLTFModel />
              <OrbitControls target={[0, 1, 0]} />
            </Canvas>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default WaitlistForm;

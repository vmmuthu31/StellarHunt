import React, { useState, useEffect } from "react";
import axios from "axios";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Confetti from "react-confetti";

const textStyle = {
  fontSize: "2.5rem",
  width: "15rem",
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
      text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00, 0 0 20px #00ff00, 0 0 25px #00ff00, 0 0 30px #00ff00, 0 0 35px #00ff00;
    }
    to {
      text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00, 0 0 50px #00ff00, 0 0 60px #00ff00, 0 0 70px #00ff00;
    }
  }
`;

const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://stellarhunt-be.vercel.app/api/waitlist",
        {
          email,
          walletAddress,
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

  return (
    <div className="bg-[url('https://blogger.googleusercontent.com/img/a/AVvXsEicOwCW7fWeZ9xLNlLeabY6YZaSndKriwzi7evh6saDDipcRL4_3PjstCbRj-XX8D4T94t_9_R9I7tFVTfp7cUkLDQ-KsxGkuLcTO5o2YjSbhx4P_l-ejYi1S_MjsOv_YVTYwve1iMn6LsmZiinZFCxxCCXOyoOITRutiSjyNkBwDUAML9ZHMgsILPAzTo')] min-h-screen bg-no-repeat bg-cover">
      <style jsx>{glowKeyframes}</style>

      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-6xl font-extrabold text-white" style={textStyle}>
          StellarHunt
          <div className="h-16"></div> {/* Adjust height as needed */}
          Join the Waitlist
        </h1>

        <div className="mt-8 text-center mb-8">
          <p className="mt-4 text-xl text-white">
            Be the first to experience the thrilling adventures of StellarHunt.
          </p>
          <p className="mt-4 text-xl text-white">
            Sign up now to secure your spot and stay updated with the latest
            news and updates!
          </p>
        </div>
        <div className="bg-black bg-opacity-50 p-8 rounded-xl glowing-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 text-xl text-white bg-transparent border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9fa00] focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="w-full p-4 text-xl text-white bg-transparent border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9fa00] focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full p-4 text-2xl font-bold text-black bg-[#c9fa00] rounded-md hover:bg-[#00cc00] transition duration-300 ease-in-out"
            >
              Join Waitlist
            </button>
          </form>
          {message && <p className="mt-4 text-center text-white">{message}</p>}
        </div>
        <div className="absolute top-0 left-0 w-full h-full -z-10">
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

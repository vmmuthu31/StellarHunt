import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Soldier = () => {
  const { scene } = useGLTF("/path/to/soldier.glb");
  return <primitive object={scene} />;
};

const Map = () => {
  const { scene } = useGLTF("models/map.glb");
  return <primitive object={scene} />;
};

const Game = ({ gameTime }) => {
  const [timeLeft, setTimeLeft] = useState(gameTime * 60);
  const [kills, setKills] = useState(0);
  const [hp, setHp] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Game over logic
    }
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <div className="absolute top-4 left-4">Time Left: {timeLeft}s</div>
      <div className="absolute top-4 right-4">Kills: {kills}</div>
      <div className="absolute top-12 right-4">HP: {hp}</div>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Soldier />
        <Map />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Game;

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useSelector } from "react-redux";
import * as THREE from "three";

const Soldier = () => {
  const { scene } = useGLTF("models/soldier.gltf");
  return <primitive object={scene} />;
};

const Map = () => {
  const { scene } = useGLTF("models/map.glb");
  return <primitive object={scene} />;
};

const Zombie = ({ position, setPosition, onDeath }) => {
  const { scene, error } = useGLTF("models/zombie.gltf");
  const [life, setLife] = useState(100);

  useEffect(() => {
    if (error) {
      console.error("Error loading zombie model:", error);
    }
  }, [error]);

  useFrame(() => {
    // Move zombie towards the soldier's position (assumed to be [0, 0, 0])
    const direction = new THREE.Vector3()
      .subVectors(new THREE.Vector3(0, 0, 0), position)
      .normalize();
    const newPosition = position.add(direction.multiplyScalar(0.01));
    setPosition(newPosition.clone());

    // Check if zombie is close enough to the soldier to "attack"
    if (newPosition.length() < 1) {
      // Damage the soldier or handle collision here
    }

    // Reduce life over time or on some condition
    setLife((prevLife) => {
      if (prevLife <= 0) {
        onDeath();
        return 0;
      }
      return prevLife - 0.1;
    });
  });

  if (error) {
    return null;
  }

  return <primitive object={scene} position={position.toArray()} />;
};

const Game = ({ gameTime }) => {
  const { time, map } = useSelector((state) => state.game);
  const [timeLeft, setTimeLeft] = useState(time);
  const [kills, setKills] = useState(0);
  const [hp, setHp] = useState(100);
  const [zombies, setZombies] = useState([]);

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

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (zombies.length < 4) {
        const newZombie = {
          id: Math.random().toString(36).substring(7),
          position: new THREE.Vector3(
            Math.random() * 10 - 5,
            0,
            Math.random() * 10 - 5
          ),
        };
        setZombies((prevZombies) => [...prevZombies, newZombie]);
      }
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [zombies]);

  const handleZombieDeath = (id) => {
    setZombies((prevZombies) =>
      prevZombies.filter((zombie) => zombie.id !== id)
    );
    setKills((prevKills) => prevKills + 1);
  };

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
        {zombies.map((zombie) => (
          <Zombie
            key={zombie.id}
            position={zombie.position}
            setPosition={(newPos) =>
              setZombies((prevZombies) =>
                prevZombies.map((z) =>
                  z.id === zombie.id ? { ...z, position: newPos } : z
                )
              )
            }
            onDeath={() => handleZombieDeath(zombie.id)}
          />
        ))}
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Game;

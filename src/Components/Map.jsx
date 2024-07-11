import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";

export const Map = () => {
  const { scene } = useGLTF("models/map.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={scene} />
    </RigidBody>
  );
};

useGLTF.preload("models/map.glb");

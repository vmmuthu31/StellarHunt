import React, { useState, useEffect, useRef } from "react";
import { Billboard, CameraControls, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier";
import { myPlayer } from "playroomkit";
import { CharacterSoldier } from "./CharacterSoldier";

const MOVEMENT_SPEED = 202;
const FIRE_RATE = 380;
const JUMP_FORCE = 20;

export const WEAPON_OFFSET = {
  x: -0.2,
  y: 1.4,
  z: 0.8,
};

const WEAPONS = [
  "GrenadeLauncher",
  "AK",
  "Knife_1",
  "Knife_2",
  "Pistol",
  "Revolver",
  "Revolver_Small",
  "RocketLauncher",
  "ShortCannon",
  "SMG",
  "Shotgun",
  "Shovel",
  "Sniper",
  "Sniper_2",
];

const BULLET_PROPERTIES = {
  GrenadeLauncher: {
    damage: 35,
    speed: 1.2,
    size: 0.5,
    range: 150,
    spread: 0.05,
    bullets: 8,
  },
  AK: {
    damage: 10,
    speed: 1.5,
    size: 0.2,
    range: 100,
    spread: 0.01,
    bullets: 1,
  },
  Knife_1: { damage: 25, speed: 1, size: 0.3, range: 5, spread: 0, bullets: 0 },
  Knife_2: { damage: 30, speed: 1, size: 0.3, range: 5, spread: 0, bullets: 0 },
  Pistol: {
    damage: 15,
    speed: 1.5,
    size: 0.2,
    range: 80,
    spread: 0.02,
    bullets: 1,
  },
  Revolver: {
    damage: 20,
    speed: 1.4,
    size: 0.25,
    range: 90,
    spread: 0.01,
    bullets: 1,
  },
  Revolver_Small: {
    damage: 18,
    speed: 1.4,
    size: 0.2,
    range: 80,
    spread: 0.02,
    bullets: 1,
  },
  RocketLauncher: {
    damage: 50,
    speed: 1,
    size: 0.6,
    range: 200,
    spread: 0.05,
    bullets: 5,
  },
  ShortCannon: {
    damage: 40,
    speed: 1,
    size: 0.5,
    range: 120,
    spread: 0.05,
    bullets: 1,
  },
  SMG: {
    damage: 8,
    speed: 1.6,
    size: 0.15,
    range: 90,
    spread: 0.02,
    bullets: 1,
  },
  Shotgun: {
    damage: 6,
    speed: 1.2,
    size: 0.2,
    range: 30,
    spread: 0.2,
    bullets: 3,
  },
  Shovel: { damage: 20, speed: 1, size: 0.35, range: 5, spread: 0, bullets: 1 },
  Sniper: {
    damage: 25,
    speed: 2,
    size: 0.4,
    range: 300,
    spread: 0,
    bullets: 1,
  },
  Sniper_2: {
    damage: 30,
    speed: 2,
    size: 0.4,
    range: 300,
    spread: 0,
    bullets: 1,
  },
};

export const CharacterController = ({
  state,
  joystick,
  userPlayer,
  onKilled,
  onFire,
  downgradedPerformance,
  ...props
}) => {
  const [weapon, setWeapon] = useState("AK");
  const [weaponIndex, setWeaponIndex] = useState(1);
  const group = useRef();
  const character = useRef();
  const rigidbody = useRef();
  const [animation, setAnimation] = useState("Idle");
  const lastShoot = useRef(0);
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    fire: false,
    jump: false,
  });
  const scene = useThree((state) => state.scene);
  const controls = useRef();
  const directionalLight = useRef();

  const spawnRandomly = () => {
    const spawns = [];
    for (let i = 0; i < 1000; i++) {
      const spawn = scene.getObjectByName(`spawn_${i}`);
      if (spawn) {
        spawns.push(spawn);
      } else {
        break;
      }
    }
    const spawnPos = spawns[Math.floor(Math.random() * spawns.length)].position;
    rigidbody.current.setTranslation(spawnPos);
  };

  useEffect(() => {
    if (userPlayer) {
      spawnRandomly();
    }
  }, [userPlayer]);

  useEffect(() => {
    if (state.state.dead) {
      const audio = new Audio("/audios/dead.mp3");
      audio.volume = 0.5;
      audio.play();
    }
  }, [state.state.dead]);

  useEffect(() => {
    if (state.state.health < 100) {
      const audio = new Audio("/audios/hurt.mp3");
      audio.volume = 0.4;
      audio.play();
    }
  }, [state.state.health]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setMovement((prev) => ({ ...prev, forward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setMovement((prev) => ({ ...prev, backward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setMovement((prev) => ({ ...prev, left: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setMovement((prev) => ({ ...prev, right: true }));
          break;
        case "KeyF":
          setMovement((prev) => ({ ...prev, fire: true }));
          break;
        case "Space":
          setMovement((prev) => ({ ...prev, jump: true }));
          break;
        case "KeyQ":
          console.log("press q working...!");
          setWeaponIndex((prev) => (prev + 1) % WEAPONS.length);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case "KeyW":
        case "ArrowUp":
          setMovement((prev) => ({ ...prev, forward: false }));
          break;
        case "KeyS":
        case "ArrowDown":
          setMovement((prev) => ({ ...prev, backward: false }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setMovement((prev) => ({ ...prev, left: false }));
          break;
        case "KeyD":
        case "ArrowRight":
          setMovement((prev) => ({ ...prev, right: false }));
          break;
        case "KeyF":
          setMovement((prev) => ({ ...prev, fire: false }));
          break;
        case "Space":
          setMovement((prev) => ({ ...prev, jump: false }));
          break;
        default:
          break;
      }
    };

    if (userPlayer) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }

    return () => {
      if (userPlayer) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [userPlayer]);

  useEffect(() => {
    setWeapon(WEAPONS[weaponIndex]);
  }, [weaponIndex]);

  useFrame((_, delta) => {
    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + (state.state.dead ? 12 : cameraDistanceY),
        playerWorldPos.z + (state.state.dead ? 2 : cameraDistanceZ),
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true
      );
    }

    if (state.state.dead) {
      setAnimation("Death");
      return;
    }

    const angle = joystick.angle();
    const movementAngle = () => {
      if (movement.forward && movement.right) return (3 * Math.PI) / 4;
      if (movement.forward && movement.left) return (5 * Math.PI) / 4;
      if (movement.backward && movement.right) return Math.PI / 4;
      if (movement.backward && movement.left) return -(Math.PI / 4);
      if (movement.forward) return Math.PI;
      if (movement.backward) return 0;
      if (movement.left) return -(Math.PI / 2);
      if (movement.right) return Math.PI / 2;
      return null;
    };

    const applyMovement = (angle) => {
      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta,
        y: 0,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta,
      };
      rigidbody.current.applyImpulse(impulse, true);
      character.current.rotation.y = angle;
    };

    if (joystick.isJoystickPressed() && angle) {
      setAnimation("Run");
      applyMovement(angle);
    } else {
      const moveAngle = movementAngle();
      if (moveAngle !== null) {
        setAnimation("Run");
        applyMovement(moveAngle);
      } else {
        setAnimation("Idle");
      }
    }

    const playerWorldPos = vec3(rigidbody.current.translation());

    if (joystick.isPressed("jump") && playerWorldPos.y < 2) {
      setAnimation("Run");
      character.current.rotation.y = angle;

      const impulse = {
        x: Math.sin(angle) * MOVEMENT_SPEED * delta,
        y: JUMP_FORCE,
        z: Math.cos(angle) * MOVEMENT_SPEED * delta,
      };
      rigidbody.current.applyImpulse(impulse, true);
    } else {
      const impulse = {
        x: 0,
        y: -2,
        z: 0,
      };
      if (playerWorldPos.y > 0) {
        rigidbody.current.applyImpulse(impulse, true);
      }
    }
    if (joystick.isPressed("fire")) {
      setAnimation(
        joystick.isJoystickPressed() && angle ? "Run_Shoot" : "Idle_Shoot"
      );
      if (Date.now() - lastShoot.current > FIRE_RATE) {
        lastShoot.current = Date.now();
        const bulletProps = BULLET_PROPERTIES[weapon] || {};
        const {
          damage = 10,
          speed = 1,
          size = 0.2,
          range = 100,
          spread = 0,
          bullets = 1,
        } = bulletProps;

        for (let i = 0; i < bullets; i++) {
          const newBullet = {
            id: state.id + "-" + +new Date(),
            position: vec3(rigidbody.current.translation()),
            angle:
              character.current.rotation.y +
              (spread ? (Math.random() - 0.5) * spread : 0),
            player: state.id,
            damage: damage,
            speed: speed,
            size: size,
            range: range,
          };
          onFire(newBullet);
        }
      }
    }

    if (userPlayer) {
      state.setState("pos", rigidbody.current.translation());
      state.setState("rotY", character.current.rotation.y);
      state.setState("animation", animation);
      state.setState("weapon", weapon);
    } else {
      const pos = state.getState("pos");
      const rotY = state.getState("rotY");
      const networkAnimation = state.getState("animation");
      const networkWeapon = state.getState("weapon");

      if (pos) {
        rigidbody.current.setTranslation(pos);
      }
      if (rotY !== undefined) {
        character.current.rotation.y = rotY;
      }
      if (networkAnimation !== undefined) {
        setAnimation(networkAnimation);
      }
      if (networkWeapon !== undefined) {
        setWeapon(networkWeapon);
      }
    }
  });

  useEffect(() => {
    if (character.current && userPlayer) {
      directionalLight.current.target = character.current;
    }
  }, [character.current]);

  return (
    <group {...props} ref={group}>
      {userPlayer && <CameraControls ref={controls} />}
      <RigidBody
        ref={rigidbody}
        colliders={false}
        linearDamping={12}
        lockRotations
        type={userPlayer ? "dynamic" : "kinematicPosition"}
        onIntersectionEnter={({ other }) => {
          if (
            other.rigidBody.userData.type === "bullet" &&
            other.rigidBody.userData.player !== state.id
          ) {
            const newHealth =
              state.state.health - other.rigidBody.userData.damage;
            if (newHealth <= 0) {
              state.setState("deaths", state.state.deaths + 1);
              state.setState("dead", true);
              state.setState("health", 0);
              rigidbody.current.setEnabled(false);
              setTimeout(() => {
                spawnRandomly();
                rigidbody.current.setEnabled(true);
                state.setState("health", 100);
                state.setState("dead", false);
              }, 2000);
              onKilled(state.id, other.rigidBody.userData.player);
            } else {
              state.setState("health", newHealth);
            }
          }
        }}
      >
        <PlayerInfo state={state.state} />
        <group ref={character}>
          <CharacterSoldier
            color={state.state.profile?.color}
            animation={animation}
            weapon={weapon}
          />
          {userPlayer && (
            <Crosshair
              position={[WEAPON_OFFSET.x, WEAPON_OFFSET.y, WEAPON_OFFSET.z]}
            />
          )}
        </group>
        {userPlayer && (
          <directionalLight
            ref={directionalLight}
            position={[25, 18, -25]}
            intensity={0.3}
            castShadow={!downgradedPerformance}
            shadow-camera-near={0}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
        )}
        <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
      </RigidBody>
    </group>
  );
};

const PlayerInfo = ({ state }) => {
  const health = state.health;
  const [playerdata, setPlayerdata] = useState("");

  const name = playerdata[0];
  return (
    <Billboard position-y={2.5}>
      <Text position-y={0.36} fontSize={0.4}>
        {name}
        <meshBasicMaterial color={state.profile.color} />
      </Text>
      <mesh position-z={-0.1}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="black" transparent opacity={0.5} />
      </mesh>
      <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
        <planeGeometry args={[1, 0.2]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Billboard>
  );
};

const Crosshair = (props) => {
  return (
    <group {...props}>
      <mesh position-z={1}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" transparent opacity={0.9} />
      </mesh>
      <mesh position-z={2}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" transparent opacity={0.85} />
      </mesh>
      <mesh position-z={3}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" transparent opacity={0.8} />
      </mesh>

      <mesh position-z={4.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" opacity={0.7} transparent />
      </mesh>

      <mesh position-z={6.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" opacity={0.6} transparent />
      </mesh>

      <mesh position-z={9}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="black" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

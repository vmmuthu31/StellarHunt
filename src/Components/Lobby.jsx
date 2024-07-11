import React, { Suspense, useEffect, useState, startTransition } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Link from "next/link";
import axios from "axios";
import Modal from "react-modal";
import { setAllowed } from "@stellar/freighter-api";
import { useAccount } from "../../config/useAccount";
import { useIsMounted } from "../../config/useMount";
import { isUserRegistered, registerUser } from "../../config/Services";
import { useDispatch } from "react-redux";
import { setTimer } from "../../store/authslice";

const mapPaths = [
  "https://blogger.googleusercontent.com/img/a/AVvXsEiIDKYobYMAxdl5gAtBoE7B8P9G8iB0AYJUfiA0kR0NubthcLBo_LyYjsajGpA0jr6B1mCVB0lG5ZhMnhFYjNtbY5CiE6PJYmlXaAv5-TZ9GFJjnNZhLCulC76CPvjJfPmfIq3_5bvh0U7N7g784SznhnU5qS_uaRzeL2RsDlx39RboomQP1eg_MmahpNY",
  "https://blogger.googleusercontent.com/img/a/AVvXsEgHxU-HB-lQ9ifrEy-ymcHR6aeTkwzBaOsIQ6SXinjXyVVmqCbtY44ZraIGYM86B6DT7vk3jDrQSbdJn61D6jZB3HX3aRSc7EIYnSStvJmZefxCOpcKRZVFqha7jg0dd4i-0qZN-87FqviZbUY3oODu3bvJZK9ytVKnLRYcgFpo9hz4JzK25BmQS5c9TMI",
];

const mapNames = ["Pochinki", "Israel"];

const Lobby = () => {
  const mounted = useIsMounted();
  const account = useAccount();
  const dispatch = useDispatch();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapIndex, setMapIndex] = useState(0);
  const [playerData, setPlayerData] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const gltf = useLoader(GLTFLoader, "./models/Character_Soldier.gltf");

  useEffect(() => {
    if (account && account.address) {
      axios
        .get(`https://horizon-testnet.stellar.org/accounts/${account.address}`)
        .then((response) => {
          setBalances(response.data.balances);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch balances:", error);
          setLoading(false);
        });

      checkIfUserRegistered(account.address);
    }
  }, [account]);

  const checkIfUserRegistered = async (wallet) => {
    try {
      const result = await isUserRegistered(wallet);
      console.log("User registration check result:", result);
      if (!result._value) {
        startTransition(() => {
          setModalIsOpen(true);
        });
      }
    } catch (error) {
      console.error("Error checking user registration:", error);
    }
  };

  const leftClick = () => {
    startTransition(() => {
      setMapIndex((prevIndex) =>
        prevIndex === 0 ? mapPaths.length - 1 : prevIndex - 1
      );
    });
  };

  const rightClick = () => {
    startTransition(() => {
      setMapIndex((prevIndex) =>
        prevIndex === mapPaths.length - 1 ? 0 : prevIndex + 1
      );
    });
  };

  const setGameTime = (time) => {
    startTransition(() => {
      dispatch(setTimer(time));
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(account.address, username, account.address);
      console.log(
        `User ${username} with wallet ${account.address} registered successfully`
      );
      setModalIsOpen(false);
    } catch (error) {
      console.error("User registration failed", error);
    }
  };

  return (
    <div className="bg-[url('https://blogger.googleusercontent.com/img/a/AVvXsEicOwCW7fWeZ9xLNlLeabY6YZaSndKriwzi7evh6saDDipcRL4_3PjstCbRj-XX8D4T94t_9_R9I7tFVTfp7cUkLDQ-KsxGkuLcTO5o2YjSbhx4P_l-ejYi1S_MjsOv_YVTYwve1iMn6LsmZiinZFCxxCCXOyoOITRutiSjyNkBwDUAML9ZHMgsILPAzTo')] min-h-screen bg-no-repeat bg-cover">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center"
      >
        <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-lg w-96 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-black font-semibold">Hi, new user</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setModalIsOpen(false)}
            >
              &times;
            </button>
          </div>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700">Wallet Address</label>
              <input
                type="text"
                value={account?.address}
                readOnly
                disabled
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <button
              type="submit"
              onClick={handleRegister}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </form>
        </div>
      </Modal>

      <div className="flex justify-between w-full px-20 py-8">
        <div className="flex items-center space-x-11 text-white text-xl">
          <div className="flex homeprofilebg px-3 py-2 items-center space-x-3">
            <img src="your-profile-image-url" className="h-12 w-auto" alt="" />
            <p>
              {playerData[0]} LVL {playerData[3]?.toString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <img src="your-image-url" alt="" className="h-8 w-auto" />
            <p>{playerData[1]?.toString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <img src="your-image-url" alt="" className="h-8 w-auto" />
            <p>{playerData[2]?.toString()}</p>
          </div>
        </div>
        <div>
          {mounted && account ? (
            <div className="flex flex-col items-center">
              <div className="text-lg flex gap-2 bg-blue-400 px-4 py-3 rounded-2xl font-semibold text-white">
                {account.displayName} :{" "}
                {loading
                  ? "..."
                  : balances && (
                      <ul className="space-y-1">
                        {balances.map((balance, index) => (
                          <li key={index}>
                            <span>
                              {parseFloat(balance.balance).toFixed(2)} XLM
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
              </div>
            </div>
          ) : (
            <button
              className="bg-[#B9FF09] rounded-full text-xl px-10 py-3 text-black"
              onClick={setAllowed}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      <div className="flex text-white text-2xl font-semibold justify-between mx-20">
        <div>
          <div className="homebox mt-20 px-16 py-10">
            <div className="flex items-center space-x-5">
              <img src="your-image-url" alt="" className="h-8 w-auto" />
              <p>
                <Link href="/optstore">Store</Link>
              </p>
            </div>
            <div className="flex items-center my-10 space-x-5">
              <img src="your-image-url" alt="" className="h-8 w-auto" />
              <p>
                <Link href="/optstore">LuckRoyale</Link>
              </p>
            </div>
            <div className="flex items-center space-x-5">
              <img src="your-image-url" alt="" className="h-8 w-auto" />
              <p>
                <Link href="/Guns">Vault</Link>
              </p>
            </div>
          </div>
        </div>
        <div className="root2">
          <Canvas camera={{ fov: 75, position: [0, 1, 5] }} shadows>
            <Suspense fallback={null}>
              <directionalLight position={[3.3, 1.0, 4.4]} castShadow />
              <primitive object={gltf.scene} position={[0, 1, 0]} castShadow />
              <OrbitControls target={[0, 1, 0]} />
            </Suspense>
          </Canvas>
        </div>
        <div className="mt-48">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="flex mapbox px-6 py-3 w-72 items-center space-x-5">
              <img src="your-image-url" alt="" className="h-8 w-auto" />
              <p>Select Map</p>
            </div>
            <div>
              <img src={mapPaths[mapIndex]} className="h-40 w-auto" alt="" />
              <div
                className="bg-black"
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "nowrap",
                }}
              >
                <button className="px-2 bg-[#2f2f2f]" onClick={rightClick}>
                  {">"}
                </button>
                <p className="text-center bg-opacity-40 py-2 w-[68px]">
                  {mapNames[mapIndex]}
                </p>
                <button className="px-2 bg-[#2f2f2f]" onClick={leftClick}>
                  {"<"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between mx-2 items-center mt-3">
            <button
              onClick={() => {
                setGameTime(60);
              }}
              className="px-3 text-lg hover:text-black hover:bg-[#9FC610] py-1 border border-[#9FC610] rounded-xl text-[#9FC610]"
            >
              1 min
            </button>
            <button
              onClick={() => {
                setGameTime(300);
              }}
              className="px-3 text-lg hover:text-black hover:bg-[#9FC610] py-1 border border-[#9FC610] rounded-xl text-[#9FC610]"
            >
              5 min
            </button>
            <button
              onClick={() => {
                setGameTime(600);
              }}
              className="px-3 text-lg hover:text-black hover:bg-[#9FC610] py-1 border border-[#9FC610] rounded-xl text-[#9FC610]"
            >
              10 min
            </button>
          </div>
          <div className="flex justify-center">
            <Link
              className="playbtm px-10 font-semibold py-2 mt-5 text-xl text-black"
              href="/game"
            >
              Play!!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;

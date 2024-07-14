import React, { useState, useEffect, startTransition, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import Link from "next/link";
import axios from "axios";
import Modal from "react-modal";
import { setAllowed } from "@stellar/freighter-api";
import { useAccount } from "../../config/useAccount";
import { useIsMounted } from "../../config/useMount";
import {
  isUserRegistered,
  registerUser,
  getUserData,
  gameStart,
} from "../../config/Services";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerData, setTimer } from "../../store/authslice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DotLoader } from "react-spinners";
import { GLTFLoader } from "three-stdlib";

const mapPaths = [
  "https://blogger.googleusercontent.com/img/a/AVvXsEiIDKYobYMAxdl5gAtBoE7B8P9G8iB0AYJUfiA0kR0NubthcLBo_LyYjsajGpA0jr6B1mCVB0lG5ZhMnhFYjNtbY5CiE6PJYmlXaAv5-TZ9GFJjnNZhLCulC76CPvjJfPmfIq3_5bvh0U7N7g784SznhnU5qS_uaRzeL2RsDlx39RboomQP1eg_MmahpNY",
  "https://blogger.googleusercontent.com/img/a/AVvXsEgHxU-HB-lQ9ifrEy-ymcHR6aeTkwzBaOsIQ6SXinjXyVVmqCbtY44ZraIGYM86B6DT7vk3jDrQSbdJn61D6jZB3HX3aRSc7EIYnSStvJmZefxCOpcKRZVFqha7jg0dd4i-0qZN-87FqviZbUY3oODu3bvJZK9ytVKnLRYcgFpo9hz4JzK25BmQS5c9TMI",
];

const mapNames = ["Pochinki", "Upcoming..."];

const Lobby = () => {
  const mounted = useIsMounted();
  const account = useAccount();
  const dispatch = useDispatch();
  const playerinfo = useSelector((state) => state.authslice.playerdata);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapIndex, setMapIndex] = useState(0);
  const [walletAddress, setWalletAddress] = useState(account?.address || "");
  const [playerData, setPlayerData] = useState(playerinfo || null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const gltf = useLoader(GLTFLoader, "./models/Character_Soldier.gltf");

  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address);
      fetchBalances(account.address);
      checkIfUserRegistered(account.address);
    }
  }, [account]);

  const fetchBalances = async (address) => {
    try {
      const response = await axios.get(
        `https://horizon-testnet.stellar.org/accounts/${address}`
      );
      setBalances(response.data.balances);
    } catch (error) {
      console.error("Failed to fetch balances:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfUserRegistered = async (wallet) => {
    try {
      const result = await isUserRegistered(wallet);
      if (!result || !playerData) {
        setModalIsOpen(true);
      } else {
        fetchUserData(wallet);
      }
    } catch (error) {
      console.error("Error checking user registration:", error);
      toast.error("Error checking user registration");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (wallet) => {
    try {
      const userData = await getUserData(wallet);
      dispatch(setPlayerData(userData));
      setPlayerData(userData);
      console.log(playerinfo);
      toast.success("User is ready to play!");
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
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

  const setGameTime = (time, buttonId) => {
    startTransition(() => {
      dispatch(setTimer(time));
      setActiveButton(buttonId);
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setLoading(true);
    try {
      const result = await registerUser(walletAddress, username, walletAddress);
      if (result) {
        setModalIsOpen(false);
        fetchUserData(walletAddress);
        toast.success("Registration successful, ready to play!");
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("User registration failed", error);
      toast.error("Registration failed");
    } finally {
      setIsRegistering(false);
      setLoading(false);
    }
  };

  const startGame = async () => {
    setLoading(true);
    try {
      await gameStart(walletAddress, walletAddress);
      toast.success("Game started!");
      window.location.href = "/game";
    } catch (error) {
      console.error("Failed to start game", error);
      toast.error("Failed to start game");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('https://blogger.googleusercontent.com/img/a/AVvXsEicOwCW7fWeZ9xLNlLeabY6YZaSndKriwzi7evh6saDDipcRL4_3PjstCbRj-XX8D4T94t_9_R9I7tFVTfp7cUkLDQ-KsxGkuLcTO5o2YjSbhx4P_l-ejYi1S_MjsOv_YVTYwve1iMn6LsmZiinZFCxxCCXOyoOITRutiSjyNkBwDUAML9ZHMgsILPAzTo')] min-h-screen bg-no-repeat bg-cover relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
          <DotLoader color="#B9FF09" />
        </div>
      )}
      {!account?.address && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex flex-col justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-8 py-7 max-w-lg w-96 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-black font-semibold">Hi, Huntee</h2>
            </div>
            <button
              className="w-full bg-[#c9fa00] text-black px-4 py-2 rounded-md hover:bg-[#d9f762] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                setAllowed();
                setWalletAddress(account?.address);
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}
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
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700">Wallet Address</label>
              <input
                type="text"
                value={walletAddress}
                readOnly
                disabled
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border text-gray-600 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#c9fa00] text-black px-4 py-2 rounded-md hover:bg-[#d9f762] focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRegistering}
            >
              {isRegistering ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </Modal>

      <div className="flex justify-between w-full px-20 py-8">
        <div className="flex items-center space-x-11 text-white text-xl">
          <div className="flex homeprofilebg px-3 py-2 items-center space-x-3">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEilxD0f-Y5qYnr3AA8xT_tvMlR7ru7Yl1zxozlEzg-C5oJqOStwAR8OxsgItoWC112TQTgCt4_xylJDmr4v_Z_A3MDUy22L6CAI_Cvw_FnicYCcoXScwCt41T-xiWNZ8JQJyfbXNdygsgY9TxXvH-Yqdg0vqpeMrakh78RxXj5BAT4XwW1a3KsQVhexzog"
              className="h-12 w-auto"
              alt=""
            />
            <p>{playerData?.username} LVL 1</p>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEispplhVXS52zWgstszpWTDQTrJ7FpVpnN4YjBilPRJ0hmtf0FGRI1-JoXko1x1mIG4Gi7ADUF3Yl9lu5JlsLRFnGUcPJnJzStlHom3K63Wu2QcL-nsJoMq2V66FcenoK7MbQVn_9vg1_8E1Q25wDoQJb2AGKiq4JGDYyknSKoXzYQFFR8LEhpX-R13ad4"
              alt=""
              className="h-8 w-auto"
            />
            <p>{playerData?.user?.tokens || 0}</p>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEie2DZwyszxtLdkqYknRhqV0hDa85fb4knhn16GCCa3HO6AB_BHA19-BnWKl5qzuE8oOJ_WVifNg1FdY05UTucSiz36llzpSqUBjYbOriIDtaQV9iLJe0eMs455RVi3wkImTId7l0BqdOamXFulz7jivdeEiXqlhfItGYU-7iDuUgSBWA1PweMDY341yFM"
              alt=""
              className="h-8 w-auto"
            />
            <p>{playerData?.user?.xp || 0}</p>
          </div>
        </div>
        <div>
          {mounted && account ? (
            <div className="flex flex-col items-center">
              <div className="text-lg flex gap-2 mapbox px-4 py-3 rounded-2xl font-semibold text-white">
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
              onClick={() => {
                setAllowed().then(() => {
                  setWalletAddress(account?.address);
                  window.location.reload();
                });
              }}
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
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhwze50sr7c42qWHWl1ZtWP-h91tRw96mnDxbST2rhMGENwxAH4LRxTWod417CEaB4xQfPVZ-0-kB1XCD2BDn1hwqxTPxNK6Z_Dz8F7Fo8hDjazJX_zXr458VZUPjdzdih1xheqz4yJg7oXTEQizG8q-8vC2B69RhKN4WOO6XS0AvvMhgGSGkq64aSJ3dQ"
                alt=""
                className="h-8 w-auto"
              />
              <p>
                <Link className="text-white" href="/optstore">
                  Store
                </Link>
              </p>
            </div>
            <div className="flex items-center my-10 space-x-5">
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEgn6Znvl2a2HObGhEoqPyeJymSTwEqIxV8f7IIQK3sCnu7oyYtZCkSg4XB-SRkV7NaxN7OVjliWj7gsOcc9VFmULUPaex4K3A1oEWf6wNsLfa8y9CcwLEdA52Dh-Hl2OnevhWJVJlI7CAMUpnWT97KEO42TfPhAxgHi7umyV4vGcVoO_XTnyxpNyJasnPg"
                alt=""
                className="h-8 w-auto"
              />
              <p>
                <Link className="text-white" href="/optstore">
                  LuckRoyale
                </Link>
              </p>
            </div>
            <div className="flex items-center space-x-5">
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEj9mP_S5zrE05iA7nZDHHKPCR4xSdtSRPtzr9tu1TMRYbTkG9wNiCq_Ri20Nna07x-B775iuyjcJBplvhELJglNv426Q-hq-SVkXOhxSDrBLoROEbIAxMzxcUSWOaNF5lpgFBf35PUWkcEoyFN-rhZnwh9o4Q8ply2YLZrxTbmzr_zobAF7jEPIIunNH9s"
                alt=""
                className="h-8 w-auto"
              />
              <p>
                <Link className="text-white" href="/Guns">
                  Vault
                </Link>
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
              <img
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhJ85zCrUSpRV7cSOt5Y1VeibTq8106ipzp_Ow_LZxxFvl2BDdUTpR0N5LVWnfhcA8DjymoCzOOgAl_3P4kpI9QXB2MJBEm6DP1n6kbleCpf_8IY_uaucIZpKyAwZjNJd9XzG2GRbyyqMhX5FKrNeKg1UAj0WLoxEA8b9hKg-eXqJi7IralLJYl8fnj2Uk"
                alt=""
                className="h-8 w-auto"
              />
              <p>Select Map</p>
            </div>
            <div>
              <img
                src={mapPaths[mapIndex]}
                className={`h-40 w-auto ${
                  mapIndex !== 0 ? "mx-auto blur-sm" : ""
                }`}
                alt=""
              />

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
                <p className="text-center bg-opacity-40 py-2 ">
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
              onClick={() => setGameTime(60, 1)}
              className={`px-3 text-lg py-1 border border-[#9FC610] rounded-xl ${
                activeButton === 1
                  ? "bg-[#9FC610] text-black"
                  : "text-[#9FC610] hover:bg-[#9FC610] hover:text-black"
              }`}
              disabled={!playerData}
            >
              1 min
            </button>
            <button
              onClick={() => setGameTime(300, 2)}
              className={`px-3 text-lg py-1 border border-[#9FC610] rounded-xl ${
                activeButton === 2
                  ? "bg-[#9FC610] text-black"
                  : "text-[#9FC610] hover:bg-[#9FC610] hover:text-black"
              }`}
              disabled={!playerData}
            >
              5 min
            </button>
            <button
              onClick={() => setGameTime(600, 3)}
              className={`px-3 text-lg py-1 border border-[#9FC610] rounded-xl ${
                activeButton === 3
                  ? "bg-[#9FC610] text-black"
                  : "text-[#9FC610] hover:bg-[#9FC610] hover:text-black"
              }`}
              disabled={!playerData}
            >
              10 min
            </button>
          </div>
          <div className="flex justify-center">
            <Link
              className="playbtm px-10 font-semibold py-2 mt-5 text-xl text-black"
              href="/game"
              onClick={async (e) => {
                e.preventDefault();
                if (playerData) {
                  await startGame();
                } else {
                  setModalIsOpen(true);
                  toast.error("Please complete registration to play.");
                }
              }}
            >
              {playerData ? "Play!" : "Register"}
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Lobby;

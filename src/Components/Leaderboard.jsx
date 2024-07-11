import React, { useState, useEffect } from "react";
import { usePlayersList } from "playroomkit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSomeValue } from "../../store/yourSlice";
import { setgameid } from "../../store/connection";

import axios from "axios";

import { useRoom } from "@huddle01/react/hooks";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

import {
  useLocalVideo,
  useLocalAudio,
  usePeerIds,
} from "@huddle01/react/hooks";

import RemotePeer from "./RemotePeer";

const getRoomIdFromURL = () => {
  const hash = window.location.hash;
  const roomId = hash.split("=")[1];
  return roomId;
};

export const Leaderboard = () => {
  const players = usePlayersList(true);
  const [timer, setTimer] = useState(90);
  const dispatch = useDispatch();
  useEffect(() => {
    setRoomId(getRoomIdFromURL());
  }, [window.location.hash]);
  const [roomId, setRoomId] = useState("");
  const someValue = useSelector((state) => state.yourSlice.someValue);
  const handleButtonClick = () => {
    dispatch(setSomeValue(players));
    dispatch(setgameid(roomId));
  };

  const [huddleRoomID, setHuddleRoomID] = useState("");

  const [huddleToken, setHuddleToken] = useState("");

  const [muted, setMuted] = useState(false);
  const { peerIds } = usePeerIds();

  console.log("room id", roomId);
  console.log("players data", players);

  const playerAddress = "0x324298486F9b811eD5e062275a58363d1B2E93eB";
  console.log("add", playerAddress);
  const [playerdata, setPlayerdata] = useState("");
  console.log("Player Name", playerdata[0]);

  const { stream, enableAudio, disableAudio, changeVideoSource } =
    useLocalAudio();

  const { joinRoom } = useRoom({
    onJoin: () => {
      alert("joined a room");
      console.info("some stuff");
    },
  });

  const createRoomId = async () => {
    const API_KEY = "5t0VTzU1IVTBm74AYyzWPRpRkCbv6M-r";
    const response = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        title: "Huddle01-Test",
        hostWallets: ["0x324298486F9b811eD5e062275a58363d1B2E93eB"],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "5t0VTzU1IVTBm74AYyzWPRpRkCbv6M-r",
        },
      }
    );
    alert(response);
    console.log(response);
    console.log(response.data.data.roomId);
    setHuddleRoomID(response.data.data.roomId);
  };

  const createAccessToken = async () => {
    const accessToken = new AccessToken({
      apiKey: "5t0VTzU1IVTBm74AYyzWPRpRkCbv6M-r",
      roomId: "aoi-lqtl-ibs",
      role: Role.HOST,
      permissions: {
        admin: true,
        canConsume: true,
        canProduce: true,
        canProduceSources: {
          cam: true,
          mic: true,
          screen: true,
        },
        canRecvData: true,
        canSendData: true,
        canUpdateMetadata: true,
      },
    });

    const tempToken = await accessToken.toJwt();

    console.log(tempToken, "temptoken");

    alert(tempToken);

    const res = await joinRoom({
      roomId: "aoi-lqtl-ibs",
      token: tempToken,
    });
    await enableAudio();

    setHuddleToken(tempToken);

    setJoinData((prev) => ({ ...prev, token: tempToken }));
  };

  const handleJoinRoom = async () => {
    await createAccessToken();
    await joinRoom({
      roomId: "aoi-lqtl-ibs",
      token: huddleToken,
    });
    await enableAudio();

    setMuted(true);
  };
  const handleExitRoom = async () => {
    await disableAudio();

    setMuted(false);
  };

  useEffect(() => {
    const addPlayerToGame = () => {
      fetch("https://stellarhunt-be/auth/addPlayer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: roomId,
          userId: playerdata[4],
          name: playerdata[0],
        }),
      })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error adding player:", error));
    };
    addPlayerToGame();
  }, [playerdata, roomId]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Are you sure you want to leave? If you leave the game the bedding amount did't fund.";
      event.returnValue = message;
      return message;
    };
    const handleUnload = () => {
      history.push("/another-page");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedData = localStorage.getItem("myData");
      if (
        storedData !== null &&
        storedData !== "false" &&
        storedData !== "true "
      ) {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 1) {
      var obj = document.getElementById("timer_con");
      if (obj) {
        obj.style.backgroundColor = "rgba(182, 47, 47, 0.99)";
        obj.style.padding = "4px 11px";
        obj.style.borderRadius = "9px";
        obj.style.fontFamily = "cursive";
        obj.style.fontWeight = "bold";
        obj.style.boxShadow = "0px 0px 20px 20px #ff000059";
        obj.style.border = "2px solid rgb(252, 38, 68)";
        obj.style.transition = "background-color 0.5s ease-in-out";
      }
      if (minutes === 0 && remainingSeconds < 1) {
        localStorage.setItem("myData", "false");
        localStorage.setItem("myData", "false");
        handleButtonClick();
        navigate("/result");
      }
    }
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (playerdata) {
      console.log("playerdata[0] from blockchain:", playerdata[0]);
    }
  }, [playerdata]);

  const updatedPlayers = players.map((player, index) => {
    if (index === players.length - 1 && playerdata) {
      console.log("Updating player name to:", playerdata[0]);
      return {
        ...player,
        state: {
          ...player.state,
          profile: {
            ...player.state.profile,
            name: playerdata[0] || player.state.profile.name,
          },
        },
      };
    } else {
      return player;
    }
  });

  console.log("updated players array", updatedPlayers);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 p-4 flex z-10 gap-4">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            top: "11%",
            position: "fixed",
          }}
        >
          <p
            id="timer_con"
            className="absolute"
            style={{
              backgroundColor: "#75b0feab",
              padding: "4px 11px",
              borderRadius: "9px",
              fontFamily: "cursive",
              fontWeight: "bold",
              border: "2px solid #2682fc",
            }}
          >
            Time: {formatTime(timer)}
          </p>

          {!muted && (
            <button
              type="button"
              className="absolute rounded-full border py-3 px-5 text-white bg-blue-600 right-10"
              onClick={handleJoinRoom}
            >
              Unmute{" "}
            </button>
          )}

          {muted && (
            <button
              type="button"
              className="absolute rounded-full border py-3 px-5 text-white bg-blue-600 right-40"
              onClick={handleExitRoom}
            >
              Mute{" "}
            </button>
          )}

          <div className="mt-4 mb-32 grid gap-2 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left invisible">
            {peerIds.map((peerId) =>
              peerId ? <RemotePeer key={peerId} peerId={peerId} /> : null
            )}
          </div>
        </div>

        {updatedPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-opacity-60 backdrop-blur-sm flex items-center rounded-lg gap-2 p-2 min-w-[140px]"
            style={{ backgroundColor: "#75B0FE" }}
          >
            <img
              src={player.state.profile?.photo || ""}
              className="w-10 h-10 border-2 rounded-full"
              style={{
                borderColor: player.state.profile?.color,
              }}
            />
            <div className="flex-grow">
              <h2 className="font-bold text-sm">{player.state.profile.name}</h2>

              <div className="flex text-sm items-center gap-4">
                <p>🔫 {player.state.kills}</p>
                <p>💀 {player.state.deaths}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="fixed top-4 right-4 z-10 text-white"
        onClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      </button>
          
    </>
  );
};

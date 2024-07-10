import React, { useState } from "react";

const Lobby = ({ startGame }) => {
  const [time, setTime] = useState(5);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <div className="flex">
        <div className="w-1/2">
          <p>Player Model (GLB)</p>
          {/* Add player GLB model viewer here */}
        </div>
        <div className="w-1/2">
          <p>Map Model (GLB)</p>
          {/* Add map GLB model viewer here */}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setTime(5)}
          className="m-2 p-2 bg-blue-500 rounded"
        >
          5 mins
        </button>
        <button
          onClick={() => setTime(10)}
          className="m-2 p-2 bg-blue-500 rounded"
        >
          10 mins
        </button>
        <button
          onClick={() => setTime(15)}
          className="m-2 p-2 bg-blue-500 rounded"
        >
          15 mins
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={() => startGame(time)}
          className="p-2 bg-green-500 rounded"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;

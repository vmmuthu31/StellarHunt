import React, { useEffect, useState } from "react";
import "./../styles/result.css";
import { useSelector } from "react-redux";
import Link from "next/link";
import confetti from 'canvas-confetti';

const Result = () => {
  const [playerNames, setPlayerNames] = useState([]);
  const [team, setTeam] = useState([]);
  const playername = "macha";
  const playerValue = useSelector((state) => state.authslice.playerdata);
  const players = useSelector((state) => state.authslice.players);
  const gameid = useSelector((state) => state.authslice.id);

  useEffect(() => {
    const sortedTeam = playerValue
      .map((value, index) => ({
        rank: index + 1,
        name: value.state.profile.name,
        handle: value.state.profile.name,
        img: value.state.profile.photo,
        kudos: value.state.kills,
        deaths: value.state.deaths,
        sent: 31,
      }))
      .sort((a, b) => b.kudos - a.kudos);

    setTeam(sortedTeam);
  }, [playerValue]);

  const [playerdata, setPlayerdata] = useState("");

  console.log("team", team);

  useEffect(() => {
    const winner = team[0];
    const highestKillsPlayer = team[0];
    const gameIdInt = gameid && /^\d/.test(gameid) ? parseInt(gameid) : 0;

    const startGame = async () => {
      const imghash =
        "https://t3.ftcdn.net/jpg/02/82/23/94/360_F_282239447_9JUkxLmUPzBvOrEAXVEx2GpNd1EkPOSO.jpg";

      console.log(
        "game data",
        gameIdInt,
        winner.name,
        highestKillsPlayer.kudos,
        imghash
      );
      //     should be like this if we integrate the startgame funct
      // const response = await startgame({ gameid: gameIdInt, playerNames });
      console.log("response", response);
      // should be like this if we integrate the endGame function
      // const res = await endGame({
      //   gameid: gameIdInt,
      //   winner: playerdata[0],
      //   highestkills: highestKillsPlayer.kudos,
      //   imghash,
      // });

      console.log("res", res);
    };

    startGame();
  }, [team, playerNames, gameid]);

  const [applyed, setApplyed] = useState(false);
  const [myrank, setrank] = useState(false);

  useEffect(() => {
    const matchingPlayer = players.find(
      (player) => player.state.profile?.name === playername
    );
    if (matchingPlayer) {
      console.log("Matching player state:", matchingPlayer.state);
    } else {
      console.log("No matching player found.");
    }
  }, [players, playername]);

  useEffect(() => {
    setApplyed(true);
    var team = playerValue.map((playerValue, index) => {
      return {
        rank: index + 1,
        name: playerValue.state.profile.name,
        handle: playerValue.state.profile.name,
        img: playerValue.state.profile.photo,
        kudos: playerValue.state.kills,
        deaths: playerValue.state.deaths,
        sent: 31,
      };
    });
    team = team.sort((a, b) => {
      b.kudos - a.kudos;
    });
    team.forEach((player, index) => {
      player.rank = index + 1;
    });

    const randomEmoji = () => {
      const emojis = ["👏", "👍", "🙌", "🤩", "🔥", "⭐️", "🏆", "💯"];
      let randomNumber = Math.floor(Math.random() * emojis.length);
      return emojis[randomNumber];
    };
    var class_obj = document.getElementById("list");
    while (class_obj.firstChild) {
      class_obj.removeChild(class_obj.firstChild);
    }
    if (applyed === false) {
      console.log(applyed);
      console.log("the function are called...");
      let newRow = document.createElement("li");
      newRow.classList = "c-list__item";
      newRow.innerHTML = `
                <div className="c-list__grid" style="display: contents;">
                    <div className="u-text--left u-text--small u-text--medium">
                    Rank
                    </div>
                    <div className="u-text--left u-text--small u-text--medium">
                    Name
                    </div>
                    <div className="u-text--right u-text--small u-text--medium">
                    # Kills/Deaths
                    </div>
                </div>`;
      list.appendChild(newRow);
      team.forEach((member) => {
        let newRow = document.createElement("li");
        newRow.classList = "c-list__item";
        newRow.innerHTML = `
                    <div class="c-list__grid" style="display: contents;">
                        <div class="c-flag c-place u-bg--transparent">${member.rank}</div>
                        <div class="c-media">
                            <img class="c-avatar c-media__img" src="${member.img}" />
                            <div class="c-media__content">
                                <div class="c-media__title">${member.name}</div>
                                <a class="c-media__link u-text--small" href="https://instagram.com/${member.handle}" target="_blank">@${member.handle}</a>
                            </div>
                        </div>
                        <div class="u-text--right c-kudos">
                            <div class="u-mt--8">
                                <strong>${member.kudos}</strong>/<strong>${member.deaths}</strong> ${randomEmoji()}
                            </div>
                        </div>
                    </div>
                `;
        if (member.rank === 1) {
          newRow.querySelector(".c-place").classList.add("u-text--dark");
          newRow.querySelector(".c-place").classList.add("u-bg--yellow");
          newRow.querySelector(".c-kudos").classList.add("u-text--yellow");
        } else if (member.rank === 2) {
          newRow.querySelector(".c-place").classList.add("u-text--dark");
          newRow.querySelector(".c-place").classList.add("u-bg--teal");
          newRow.querySelector(".c-kudos").classList.add("u-text--teal");
        } else if (member.rank === 3) {
          newRow.querySelector(".c-place").classList.add("u-text--dark");
          newRow.querySelector(".c-place").classList.add("u-bg--orange");
          newRow.querySelector(".c-kudos").classList.add("u-text--orange");
        }
        list.appendChild(newRow);
      });
      setApplyed(true);
    } else {
      console.log("the function did not called...");
    }

    let winner = team[0];
    team.forEach((player) => {
      if (player.kudos > winner.kudos) {
        winner = player;
      }
    });
    const winnerCard = document.getElementById("winner");
    winnerCard.innerHTML = `
            <div class="u-text-small u-text--medium u-mb--16">MVP of the Match🔥</div>
            <img class="c-avatar c-avatar--lg" src="${winner.img}"/>
            <h3 class="u-mt--16">${winner.name}</h3>
            <span class="u-text--teal u-text--small">${winner.name}</span>
        `;

    // Confetti effect on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <>
      <div className="text-white min-h-screen l-wrapper">
        <h1 className="text-center text-3xl font-bold my-4 glowing-text">Leaderboard</h1>
        <div className="c-header">
          <button className="bg-purple-600 px-5 py-3 rounded-lg r-wrapper lobby-button">
            <Link href="/lobby" style={{ color: '#ffffff' }}>Lobby</Link>
          </button>
        </div>

        <div className="l-grid">
          <div className="l-grid__item l-grid__item--sticky">
            <div className="c-card u-bg--dark u-text--light glowing-card">
              <div className="c-card__body">
                <div className="u-display--flex u-justify--space-between">
                  <div className="u-text--left">
                    <div className="u-text--small">Room</div>
                    <h1>{playerValue[0]?.id}</h1>
                  </div>
                  <div className="u-text--right">
                    <div className="u-text--small">Prize Pool</div>
                    <h2>
                      {playerValue.kills}/{playerValue.deaths}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="c-card glowing-card">
              <div className="c-card__body">
                <div className="u-text--center" id="winner" />
              </div>
            </div>
          </div>
          <div className="l-grid__item">
            <div className="c-card glowing-card">
              <div className="c-card__body">
                <ul className="c-list" id="list">
                  <li className="c-list__item">
                    <div className="c-list__grid">
                      <div className="u-text--left u-text--small u-text--medium">
                        Rank
                      </div>
                      <div className="u-text--left u-text--small u-text--medium">
                        Name
                      </div>
                      <div className="u-text--right u-text--small u-text--medium">
                        # Kills/Deaths
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lobby-button {
          position: fixed;
          top: 25px;
          right: 25px;
        }
        .glowing-card {
          position: relative;
          border: 2px solid transparent;
        }
        .glowing-card::before {
          content: '';
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          background: radial-gradient(circle, violet 0%, transparent 60%);
          border-radius: 10px;
          animation: move-glow 3s infinite linear;
          z-index: -1;
        }
        @keyframes move-glow {
          0% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(20px) translateY(20px);
          }
          100% {
            transform: translateX(0) translateY(0);
          }
        }
        .glowing-text {
          animation: text-glow 1.5s infinite alternate;
        }
        @keyframes text-glow {
          from {
            text-shadow: 0 0 10px #9333ea, 0 0 20px #9333ea, 0 0 30px #9333ea, 0 0 40px #9333ea, 0 0 50px #9333ea, 0 0 60px #9333ea, 0 0 70px #9333ea;
          }
          to {
            text-shadow: 0 0 20px #9333ea, 0 0 30px #9333ea, 0 0 40px #9333ea, 0 0 50px #9333ea, 0 0 60px #9333ea, 0 0 70px #9333ea, 0 0 80px #9333ea;
          }
        }
      `}</style>
    </>
  );
};

export default Result;

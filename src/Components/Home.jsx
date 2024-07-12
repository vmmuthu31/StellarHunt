import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import herobg from "../assets/hero-bg.svg";
import starsvg from "../assets/star.svg";
import left from "../assets/left.svg";
import right from "../assets/right.svg";
import icon from "../assets/icon.svg";
import icon1 from "../assets/icon1.svg";
import icon2 from "../assets/icon2.svg";
import icon3 from "../assets/icon3.svg";
import icon4 from "../assets/icon4.svg";
import icon5 from "../assets/icon5.svg";
import play from "../assets/play.svg";
import g1 from "../assets/g1.svg";
import g2 from "../assets/g2.svg";
import g3 from "../assets/g3.svg";
import g4 from "../assets/g4.png";
import g5 from "../assets/g5.svg";
import Link from "next/link";
import videoSrc from "../assets/stellarhunt.mp4";
import { useDispatch, useSelector } from "react-redux";
import { setVediostate } from "../../store/authslice";

const textStyle = {
  fontSize: "2.5rem",
  width: "15rem",
  textAlign: "center",
  fontWeight: "bold",
  color: "#fff",
  textShadow:
    "0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00, 0 0 20px #00ff00, 0 0 25px #00ff00, 0 0 30px #00ff00, 0 0 35px #00ff00",
  animation: "glow 1.5s infinite alternate",
};

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

function Home() {
  const [showVideo, setShowVideo] = useState(false);
  const dispatch = useDispatch();
  const hasVisited = useSelector((state) => state.authslice.vediostate);
  useEffect(() => {
    if (!hasVisited) {
      setShowVideo(true);
      dispatch(setVediostate(true));
    }
  }, []);

  useEffect(() => {
    if (showVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showVideo]);

  return (
    <div className="">
      <style jsx>{`
        @keyframes vibrate {
          0% {
            transform: translate(0);
          }
          25% {
            transform: translate(-2px, 2px);
          }
          50% {
            transform: translate(2px, -2px);
          }
          75% {
            transform: translate(-2px, -2px);
          }
          100% {
            transform: translate(2px, 2px);
          }
        }

        .shooter-game-ui {
          animation: vibrate 0.1s infinite;
        }

        .video-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .full-screen-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>

      {showVideo && (
        <div className="video-overlay">
          <video
            src={videoSrc}
            autoPlay
            className="full-screen-video"
            muted
            onEnded={() => setShowVideo(false)}
          />
        </div>
      )}

      <main className="min-h-screen bg-[url('./bg.png')] bg-cover bg-center relative overflow-hidden">
        <Navbar />
        <div className="text-container shooter-game-ui">
          <p className="herotxt">
            A New Era &nbsp; &nbsp; &nbsp; &nbsp; Multiplayer
          </p>
          <p className="herotxt">Onchain &nbsp; &nbsp; &nbsp; Adventure</p>
        </div>
        <img src={herobg} alt="Hero Background" className="herobg" />
        <div className="additional-content">
          <p className="highlight-text">Pushing the Limits of Onchain Gaming</p>
          <p className="description-text">
            Immerse yourself in the future of gaming on the Stellar chain.
            Experience epic PvP battles, earn exclusive NFT rewards, and embrace
            gaming realism like never before.
          </p>
        </div>
      </main>
      <div>
        <hr className="border-[#A3C60FE5]" />
        <div className="running-text-container">
          <div className="running-text flex items-center">
            <span className="text-[#A3C60FE5] hrtxt text-3xl mr-2">
              Experience the Future of Gaming on the Stellar Chain!
            </span>
            <img src={starsvg} alt="star" className="inline-block mr-2" />
            <span className="text-[#A3C60FE5] hrtxt text-3xl mr-2">
              Dynamic Challenges Await – Are You Ready to Conquer?
            </span>
            <img src={starsvg} alt="star" className="inline-block mr-2" />
            <span className="text-[#A3C60FE5] hrtxt text-3xl mr-2">
              Join Now and Prove Your Skills!
            </span>
            <img src={starsvg} alt="star" className="inline-block mr-2" />
            <span className="text-[#A3C60FE5] hrtxt text-3xl mr-2">
              Experience the Future of Gaming on the Stellar Chain!
            </span>
            <img src={starsvg} alt="star" className="inline-block mr-2" />
            <span className="text-[#A3C60FE5] hrtxt text-3xl mr-2">
              Dynamic Challenges Await – Are You Ready to Conquer?
            </span>
            <img src={starsvg} alt="star" className="inline-block mr-2" />
            <span className="text-[#A3C60FE5] hrtxt text-3xl mr-2">
              Join Now and Prove Your Skills!
            </span>
            <img src={starsvg} alt="star" className="inline-block mr-2" />
          </div>
        </div>
        <hr className="border-[#A3C60FE5]" />
      </div>
      <div>
        <style jsx>{`
          @keyframes wobble {
            0%,
            100% {
              transform: translateX(0) rotate(0deg);
            }
            15% {
              transform: translateX(-5px) rotate(-5deg);
            }
            30% {
              transform: translateX(5px) rotate(5deg);
            }
            45% {
              transform: translateX(-5px) rotate(-5deg);
            }
            60% {
              transform: translateX(5px) rotate(5deg);
            }
            75% {
              transform: translateX(-5px) rotate(-5deg);
            }
            90% {
              transform: translateX(5px) rotate(5deg);
            }
          }

          .wobble-effect-ui {
            animation: wobble 1s infinite ease-in-out;
          }
        `}</style>

        <div className="flex mt-20 justify-between">
          <img src={left} alt="left" className="left" />
          <div>
            <p className="text-center hero2txt ">
              CONQUER THE FUTURE OF GAMING ON THE STELLAR CHAIN!
            </p>
            <p className="w-[700px] text-[#D6D6D6] herodesc text-center">
              Experience intense multiplayer battles, climb leaderboards for
              exclusive NFT rewards, and enjoy lifelike graphics powered by
              blockchain technology. Enter custom rooms, strategize, and
              dominate countdown-driven challenges for unparalleled gaming
              excitement.
            </p>
          </div>
          <img src={right} alt="right" className="right" />
        </div>
      </div>
      <div>
        <style jsx>{`
          @keyframes zoomInOut {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          .zoom-effect-ui {
            animation: zoomInOut 3s infinite ease-in-out;
          }
        `}</style>
        <style jsx>{`
          .glowing-border {
            position: relative;
            border: 0.8px solid transparent;
          }

          .glowing-border::before,
          .glowing-border::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            border-radius: inherit;
            box-shadow: 0 0 20px 5px #c5f404;
            animation: border-glow 2s linear infinite;
          }

          .glowing-border::after {
            filter: blur(10px);
            opacity: 0.5;
          }

          @keyframes border-glow {
            0% {
              clip-path: polygon(0 0, 0% 0, 0% 100%, 0 100%);
            }
            25% {
              clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%);
            }
            50% {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            }
            75% {
              clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
            }
            100% {
              clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
            }
          }
        `}</style>

        <div className="flex justify-center mt-10 py-10 gap-10 items-center">
          <div className="glowing-border w-[400px] text-center border-x-[0.8px] border-t-[0.2px] p-10 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center ">
            <img src={icon} alt="icon1" className="w-32 h-32 zoom-effect-ui" />
            <p className="text-2xl font-bold">Epic PvP Thrills</p>
            <p className="text-lg text-center">
              Battle in intense multiplayer showdowns with unique avatars.
              Outsmart and conquer your opponents to rise to the top.
            </p>
          </div>
          <div className="text-center w-[400px] glowing-border border-x-[0.8px] border-t-[0.2px] p-10 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center">
            <img src={icon1} alt="icon1" className="w-32 h-32 zoom-effect-ui" />
            <p className="text-2xl font-bold">Exclusive NFT Rewards</p>
            <p className="text-lg text-center">
              Win exclusive NFTs that commemorate your victories. Collect and
              trade these digital assets to enhance your in-game legacy.{" "}
            </p>
          </div>
          <div className="text-center w-[400px] glowing-border border-x-[0.8px] border-t-[0.2px] p-10 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center">
            <img src={icon2} alt="icon1" className="w-32 h-32 zoom-effect-ui" />
            <p className="text-2xl font-bold">Blockchain Realism</p>
            <p className="text-lg text-center">
              Enjoy seamless, lifelike gameplay powered by the Stellar chain.
              Every move is secure, transparent, and part of a stunning visual
              experience.{" "}
            </p>
          </div>
        </div>
        <div className="flex mt-2 justify-center py-10 gap-10 items-center">
          <div className="text-center glowing-border w-[400px] border-x-[0.8px] border-t-[0.2px] p-10 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center">
            <img src={icon3} alt="icon1" className="w-32 h-32 zoom-effect-ui" />
            <p className="text-2xl font-bold">Community-driven Evolution</p>
            <p className="text-lg text-center">
              Influence game development and features through community input.
              Join events and collaborate with other players.
            </p>
          </div>
          <div className="text-center glowing-border w-[400px] border-x-[0.8px] border-t-[0.2px] p-10 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center">
            <img src={icon4} alt="icon1" className="w-32 h-32 zoom-effect-ui" />
            <p className="text-2xl font-bold">Real-world </p>
            <p className="text-lg text-center">
              Blend gaming with reality through AR missions and events. Earn
              real-world rewards linked to your in-game achievements.{" "}
            </p>
          </div>
          <div className="text-center glowing-border border-x-[0.8px] border-t-[0.2px] p-10 rounded-2xl border-[#C5F404] card2 flex flex-col gap-5 items-center">
            <p className="text-xl w-[240px] font-bold">
              Interested in PvP thrills with unique avatars and abilities?
            </p>{" "}
            <img src={icon5} alt="icon1" className="w-32 h-32 zoom-effect-ui" />
            <div>
              <Link href="/lobby">
                <img src={play} alt="play" className="play" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="howitworks" className="flex mt-20 justify-between">
          <img src={left} alt="left" className="left" />
          <div>
            <p className="text-center hero2txt ">HOW STELLARHUNT WORKS? </p>
            <p className="w-[800px] text-[#D6D6D6] herodesc text-center">
              Discover the seamless integration of blockchain technology and
              immersive gameplay with StellarHunt. Here’s how you can dive into
              the adventure:{" "}
            </p>
          </div>
          <img src={right} alt="right" className="right" />
        </div>
      </div>
      <div>
        <style jsx>{`
          @keyframes yAxisMovement {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0);
            }
          }

          .y-axis-movement {
            animation: yAxisMovement 3s infinite ease-in-out;
          }
        `}</style>

        <style jsx>{`
          @keyframes circularMotion {
            0% {
              transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
            }
            25% {
              transform: perspective(1000px) rotateX(10deg) rotateY(10deg);
            }
            50% {
              transform: perspective(1000px) rotateX(0deg) rotateY(20deg);
            }
            75% {
              transform: perspective(1000px) rotateX(-10deg) rotateY(10deg);
            }
            100% {
              transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
            }
          }

          .animate-card {
            animation: circularMotion 5s infinite ease-in-out;
          }
        `}</style>
        <div className="flex mt-40 justify-center py-5 gap-10 items-center">
          <div className="flex flex-col items-center">
            <img
              src={g1}
              alt="g1"
              className="absolute -mt-40 y-axis-movement"
            />
            <div className="text-center w-80 border-l-[2px] border-r-[2px] border-b-[2px] border-t-[0px] p-14 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center animate-card">
              <p className="text-xl w-60 text-center font-bold">
                Choose Your Avatar
              </p>
              <p className="text-lg pt-2 text-center">
                Select from diverse avatars with unique abilities to match your
                playstyle.
              </p>
            </div>
          </div>

          <div className="flex flex-col  items-center">
            <img
              src={g2}
              alt="g1"
              className="absolute -mt-40 y-axis-movement"
            />
            <div className="text-center w-80  border-l-[2px] border-r-[2px] border-b-[2px] border-t-[0px] p-14 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center animate-card">
              <p className="text-xl w-60 text-center font-bold">
                Countdown to Chaos{" "}
              </p>
              <p className="text-lg pt-4 text-center">
                Prepare for intense, time-driven challenges that test your
                skills under pressure.{" "}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={g3}
              alt="g1"
              className="absolute -mt-40 y-axis-movement"
            />
            <div className="text-center w-80   border-l-[2px] border-r-[2px] border-b-[2px] border-t-[0px] p-14 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center animate-card">
              <p className="text-xl w-60 text-center font-bold">
                Enter the Battle Arena{" "}
              </p>
              <p className="text-lg pt-4 text-center">
                Step into the arena and face off against skilled opponents from
                around the world.{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="flex mt-28 align-middle  justify-center py-10 gap-10 items-center">
          <div className="flex flex-col items-center">
            <img
              src={g4}
              alt="g1"
              className="absolute -mt-40 y-axis-movement"
            />
            <div className="text-center  w-80  border-l-[2px] border-r-[2px] border-b-[2px] border-t-[0px] p-14 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center animate-card">
              <p className="text-xl w-60 text-center font-bold">
                Battle for Supremacy{" "}
              </p>
              <p className="text-lg pt-4 text-center">
                Fight your way to the top in epic PvP arenas where only the
                strongest warriors prevail.{" "}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={g5}
              alt="g1"
              className="absolute -mt-40 y-axis-movement"
            />
            <div className="text-center w-80   border-l-[2px] border-r-[2px] border-b-[2px] border-t-[0px]  p-14 rounded-2xl border-[#C5F404] card1 flex flex-col gap-5 items-center animate-card">
              <p className="text-xl w-60 text-center font-bold">
                Claim Your NFT Prize{" "}
              </p>
              <p className=" pt-4 text-lg text-center">
                Win exclusive digital rewards that reflect your in-game
                achievements.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#9FC610] w-full h-6 mt-20" />
    </div>
  );
}

export default Home;

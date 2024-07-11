import navicon from "../assets/navicon.png";
import Link from "next/link";

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
`}</style>;
function Navbar() {
  const howitworks = () => {
    const section = document.getElementById("howitworks");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between md:px-10 md:pt-10">
        <div className="flex gap-10">
          <button
            className="playnowbtn"
            onClick={howitworks}
            style={{ cursor: "pointer" }}
          >
            How it works
          </button>
          <button className="playnowbtn">MarketPlace</button>
        </div>
        <img src={navicon} alt="logo" />
        <div className="flex gap-10">
          <Link href="/lobby">
            <button className="playnowbtn  wobble-effect-ui">Play Now!</button>{" "}
          </Link>
          <button
            className="bg-[#B9FF09] rounded-full text-xl px-10    text-black"
            style={{ cursor: "pointer" }}
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

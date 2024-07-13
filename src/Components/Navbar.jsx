import navicon from "../assets/stellarhunt.png";
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
        <div className="flex items-center   gap-10">
          <Link
            className="text-white"
            href="https://stellarhunt.gitbook.io/stellarhunt"
          >
            <button
              className="playnowbtn"
              onClick={howitworks}
              style={{ cursor: "pointer" }}
            >
              How it works
            </button>
          </Link>
          <Link href="/optstore" className="text-white">
            <button className="playnowbtn">MarketPlace</button>
          </Link>
        </div>
        <img src={navicon} alt="logo" className="h-24 w-auto" />
        <div className="flex items-center gap-10">
          <Link href="/lobby">
            <button className="playnowbtn text-white  wobble-effect-ui">
              Play Now!
            </button>{" "}
          </Link>
          <Link href="/Waitlist">
            <button
              className="bg-[#fcd928] rounded-full text-xl px-10  py-3  text-black"
              style={{ cursor: "pointer" }}
            >
              Join Waitlist
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

import navicon from "../assets/navicon.png";
import { Link } from "react-router-dom";

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
  // const waitlist = () => {
  //   const router = useRouter();
  //   router.push("/waitlist");
  // };

  return (
    <div>
      <div className="flex items-center justify-between md:px-32 md:pt-14">
        <div className="flex gap-20">
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
        <div className="flex gap-20">
          <Link to="/lobby">
            <button className="playnowbtn  wobble-effect-ui">Play Now!</button>{" "}
          </Link>
        </div>
        <button
          className="playnowbtn"
          // onClick={waitlist}
          style={{ cursor: "pointer" }}
        >
          Join Waitlist
        </button>
      </div>
    </div>
  );
}

export default Navbar;

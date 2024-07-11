import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./AssetsShowcase/Experience";
import { Overlay } from "./AssetsShowcase/Overlay";
import OptionHome from "./AssetsShowcase/OptionHome";

function SlideApp(props) {
  return (
    <>
      <Leva hidden />
      <Overlay data={props.data} />
      <div className="root">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience data={props.data} />
        </Canvas>
      </div>
    </>
  );
}

export default SlideApp;

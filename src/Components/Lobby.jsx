import React, { useEffect, useState } from "react";
import { Stats, OrbitControls, Circle } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Link from "next/link";

var map_count = 0;
function Lobby() {
  const map_path = [
    "https://blogger.googleusercontent.com/img/a/AVvXsEiIDKYobYMAxdl5gAtBoE7B8P9G8iB0AYJUfiA0kR0NubthcLBo_LyYjsajGpA0jr6B1mCVB0lG5ZhMnhFYjNtbY5CiE6PJYmlXaAv5-TZ9GFJjnNZhLCulC76CPvjJfPmfIq3_5bvh0U7N7g784SznhnU5qS_uaRzeL2RsDlx39RboomQP1eg_MmahpNY",
    "https://blogger.googleusercontent.com/img/a/AVvXsEgHxU-HB-lQ9ifrEy-ymcHR6aeTkwzBaOsIQ6SXinjXyVVmqCbtY44ZraIGYM86B6DT7vk3jDrQSbdJn61D6jZB3HX3aRSc7EIYnSStvJmZefxCOpcKRZVFqha7jg0dd4i-0qZN-87FqviZbUY3oODu3bvJZK9ytVKnLRYcgFpo9hz4JzK25BmQS5c9TMI",
  ];

  const [map_count, setMap_count] = useState(0);
  var i = 0;
  const [img_v, setImg] = useState(map_path[i]);
  const image_set = (move) => {
    console.log(move, i);
    if (i > map_path.length - 1 || i < 0) {
      i = 0;
    } else {
      if (move === 1) {
        i++;
      } else {
        i--;
      }
    }
    if (move === 1) {
      setImg(map_path[i]);
      localStorage.setItem("map", map_path[i]);
    } else if (move === 2) {
      localStorage.setItem("map", map_path[i]);
      setImg(map_path[i]);
    }
    if (map_path[i] === undefined) {
      setImg(map_path[0]);
    }
    console.log(localStorage.getItem("timed"), localStorage.getItem("map"));
  };
  const gltf = useLoader(GLTFLoader, "./models/Character_Soldier.gltf");
  const [playerdata, setPlayerdata] = useState("");

  const map_names = ["pochinki", "pochinki", "Israel"];
  const updateData = async () => {
    console.log({
      map: localStorage.getItem("map"),
      time: localStorage.getItem("timed"),
    });
    try {
      const response = await fetch(
        "https://block-shotter-api.vercel.app/map_info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            map: localStorage.getItem("map"),
            time: localStorage.getItem("timed"),
          }),
        }
      );

      const data = await response.json();
      console.log("Updated data:", data);
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
  };

  return (
    <>
      <div className="bg-[url('https://blogger.googleusercontent.com/img/a/AVvXsEicOwCW7fWeZ9xLNlLeabY6YZaSndKriwzi7evh6saDDipcRL4_3PjstCbRj-XX8D4T94t_9_R9I7tFVTfp7cUkLDQ-KsxGkuLcTO5o2YjSbhx4P_l-ejYi1S_MjsOv_YVTYwve1iMn6LsmZiinZFCxxCCXOyoOITRutiSjyNkBwDUAML9ZHMgsILPAzTo')] min-h-screen  bg-no-repeat bg-cover">
        <div className="flex items-center space-x-11 text-white text-xl mx-20 py-8">
          <div className="flex homeprofilebg px-3 py-2 items-center space-x-3">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEilxD0f-Y5qYnr3AA8xT_tvMlR7ru7Yl1zxozlEzg-C5oJqOStwAR8OxsgItoWC112TQTgCt4_xylJDmr4v_Z_A3MDUy22L6CAI_Cvw_FnicYCcoXScwCt41T-xiWNZ8JQJyfbXNdygsgY9TxXvH-Yqdg0vqpeMrakh78RxXj5BAT4XwW1a3KsQVhexzog"
              className="h-12 w-auto"
              alt=""
            />
            <p>
              {playerdata[0]} LVL {playerdata[3]?.toString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEispplhVXS52zWgstszpWTDQTrJ7FpVpnN4YjBilPRJ0hmtf0FGRI1-JoXko1x1mIG4Gi7ADUF3Yl9lu5JlsLRFnGUcPJnJzStlHom3K63Wu2QcL-nsJoMq2V66FcenoK7MbQVn_9vg1_8E1Q25wDoQJb2AGKiq4JGDYyknSKoXzYQFFR8LEhpX-R13ad4"
              alt=""
              className="h-8 w-auto"
            />
            <p>{playerdata[1]?.toString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEie2DZwyszxtLdkqYknRhqV0hDa85fb4knhn16GCCa3HO6AB_BHA19-BnWKl5qzuE8oOJ_WVifNg1FdY05UTucSiz36llzpSqUBjYbOriIDtaQV9iLJe0eMs455RVi3wkImTId7l0BqdOamXFulz7jivdeEiXqlhfItGYU-7iDuUgSBWA1PweMDY341yFM"
              alt=""
              className="h-8 w-auto"
            />
            <p>{playerdata[2]?.toString()}</p>
          </div>
        </div>
        <div className="flex  text-white text-2xl font-semibold  justify-between mx-20">
          <div>
            <div className="homebox mt-20 px-16 py-10">
              <div className="flex items-center space-x-5">
                <img
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEhwze50sr7c42qWHWl1ZtWP-h91tRw96mnDxbST2rhMGENwxAH4LRxTWod417CEaB4xQfPVZ-0-kB1XCD2BDn1hwqxTPxNK6Z_Dz8F7Fo8hDjazJX_zXr458VZUPjdzdih1xheqz4yJg7oXTEQizG8q-8vC2B69RhKN4WOO6XS0AvvMhgGSGkq64aSJ3dQ"
                  alt=""
                  className="h-8 w-auto"
                />
                <p>
                  <Link href="/optstore">Store</Link>
                </p>
              </div>
              <div className="flex items-center my-10 space-x-5">
                <img
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEgn6Znvl2a2HObGhEoqPyeJymSTwEqIxV8f7IIQK3sCnu7oyYtZCkSg4XB-SRkV7NaxN7OVjliWj7gsOcc9VFmULUPaex4K3A1oEWf6wNsLfa8y9CcwLEdA52Dh-Hl2OnevhWJVJlI7CAMUpnWT97KEO42TfPhAxgHi7umyV4vGcVoO_XTnyxpNyJasnPg"
                  alt=""
                  className="h-8 w-auto"
                />
                <p>
                  <Link href="/optstore">LuckRoyale</Link>
                </p>
              </div>
              <div className="flex items-center space-x-5">
                <img
                  src="https://blogger.googleusercontent.com/img/a/AVvXsEj9mP_S5zrE05iA7nZDHHKPCR4xSdtSRPtzr9tu1TMRYbTkG9wNiCq_Ri20Nna07x-B775iuyjcJBplvhELJglNv426Q-hq-SVkXOhxSDrBLoROEbIAxMzxcUSWOaNF5lpgFBf35PUWkcEoyFN-rhZnwh9o4Q8ply2YLZrxTbmzr_zobAF7jEPIIunNH9s"
                  alt=""
                  className="h-8 w-auto"
                />
                <p>
                  <Link href="/Guns">Vault</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="root2">
            <Canvas camera={{ fov: 75, position: [0, 1, 5] }} shadows>
              <directionalLight position={[3.3, 1.0, 4.4]} castShadow />
              <primitive object={gltf.scene} position={[0, 1, 0]} castShadow />
              <OrbitControls target={[0, 1, 0]} />
            </Canvas>
          </div>
          <div className="mt-48 ">
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
              <div className="">
                <img src={img_v} className="h-40  w-auto" alt="" />
                <div
                  className="bg-black"
                  style={{
                    display: "flex",
                    background: "",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "nowrap",
                  }}
                >
                  <button
                    className="px-2  bg-[#2f2f2f]"
                    onClick={() => {
                      if (map_count < 2) {
                        image_set(1);
                        setMap_count(map_count + 1);
                      }
                    }}
                  >
                    {">"}
                  </button>
                  <p className="text-center   bg-opacity-40 py-2  w-[68px]">
                    {map_names[map_count]}
                  </p>
                  <button
                    className="px-2 bg-[#2f2f2f]"
                    onClick={() => {
                      if (map_count > 1) {
                        image_set(2);
                        setMap_count(map_count - 1);
                      }
                    }}
                  >
                    {"<"}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="flex justify-between mx-2 items-center mt-3"
              onClick={() => {
                localStorage.setItem("time", "60");
              }}
            >
              <p
                onClick={() => {
                  localStorage.setItem("timed", "60");
                }}
                className="px-3 text-lg hover:text-black hover:bg-[#9FC610] py-1 border border-[#9FC610] rounded-xl text-[#9FC610]"
              >
                1 min
              </p>
              <p
                onClick={() => {
                  localStorage.setItem("timed", "300");
                }}
                className="px-3 text-lg hover:text-black hover:bg-[#9FC610] py-1 border border-[#9FC610] rounded-xl text-[#9FC610]"
              >
                5 min
              </p>
              <p
                onClick={() => {
                  localStorage.setItem("timed", "600");
                }}
                className="px-3 text-lg hover:text-black hover:bg-[#9FC610] py-1 border border-[#9FC610] rounded-xl text-[#9FC610]"
              >
                10 min
              </p>
            </div>
            <div className="flex justify-center">
              <Link
                className="playbtm px-10 font-semibold  py-2 mt-5 text-xl text-black "
                href="/game"
              >
                Play!!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Lobby;

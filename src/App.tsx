// import * as THREE from "three";
// import { useRef, useState } from "react";
// import { Canvas, useFrame, ThreeElements, useLoader } from "@react-three/fiber";
// import { PCDLoader } from "three/addons/loaders/PCDLoader.js";

import { PointCloudData } from "./components/PointCloudData";

// function Box(props: ThreeElements["mesh"]) {
//   const ref = useRef<THREE.Mesh>(null!);
//   const [hovered, hover] = useState(false);
//   const [clicked, click] = useState(false);
//   useFrame((state, delta) => {
//     ref.current.rotation.x += delta;
//   });
//   return (
//     <mesh
//       {...props}
//       ref={ref}
//       scale={clicked ? 1.5 : 1}
//       onClick={(event) => click(!clicked)}
//       onPointerOver={(event) => hover(true)}
//       onPointerOut={(event) => hover(false)}
//     >
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
//     </mesh>
//   );
// }

// function PointCloudData({ url }: { url: string }) {
//   const scene = useLoader(PCDLoader, url);
//   return <primitive object={scene} />;
// }
//

function App() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <PointCloudData url="https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/cloud.js" />
    </div>
  );
}

export default App;

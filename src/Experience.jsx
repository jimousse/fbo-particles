import { OrbitControls } from "@react-three/drei";
import Particles from "./Particles";

export default function Experience() {
  return (
    <>
      <color args={["#030202"]} attach="background" />
      <OrbitControls makeDefault />
      <Particles />
    </>
  );
}

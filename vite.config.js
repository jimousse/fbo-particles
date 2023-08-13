import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default {
  plugins: [react(), glsl()],
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
};

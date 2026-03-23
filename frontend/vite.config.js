import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/submissions": "http://localhost:3000",
      "/exams": "http://localhost:3000",
      "/results": "http://localhost:3000",
      "/questions": "http://localhost:3000",
    },
  },
});

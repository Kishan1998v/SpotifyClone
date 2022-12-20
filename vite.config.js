import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    //   we want to say that root should be src folder
    //   Doing so beacuse we want to keeep all the files inside a folder "src". and we need to tell the vite that
    //   Doing so beacuse we want to keeep all the files inside a folder "src". and we need to tell the vite that
    //we have put the files in the src folder .. So we say root:"src"
    root: "src",
  };
});

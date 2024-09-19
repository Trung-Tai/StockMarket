import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  env: {
    googleClientId: process.env.REACT_APP_GOOGLE_CLIENTID,
    googleClientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
  e2e: {
    baseUrl: "https://eagle-eye-mlo1-git-anh-dinhanhs-projects.vercel.app/",
    setupNodeEvents(on, config) {},
  },
});

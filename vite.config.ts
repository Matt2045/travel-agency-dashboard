import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryReactRouter, type SentryReactRouterBuildOptions} from "@sentry/react-router";


const sentryConfig: SentryReactRouterBuildOptions = {
    org: "9bbb58663a85",
    project: "travel-agency",

    // An auth token is required for uploading source maps;
    // store it in an environment variable to keep it secure.
    authToken: "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",
    // ...
};



export default defineConfig(config => {
    return {
        plugins: [tailwindcss(), tsconfigPaths(), reactRouter(), sentryReactRouter(sentryConfig, config)],
        sentryConfig,
        ssr: {
            noExternal:  [/@syncfusion/]
        }
    };
});

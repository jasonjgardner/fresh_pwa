import type { PluginOptions } from "./types.ts";
import {transform, type Plugin } from "./deps.ts";

/**
 * Endpoint used to register the service worker for the plugin.
 */
export const SERVICE_WORKER_ENDPOINT = "fresh_service_worker";

/**
 * Fresh plugin to easily add PWA support.
 * @param options - Plugin options. {@link PluginOptions}
 * @returns Fresh plugin.
 */
export default function PWAPlugin({
  swSrc,
  manifest,
  compilerOptions,
  scope,
  initialState = {},
}: PluginOptions): Plugin {
  return {
    name: "fresh_pwa",
    entrypoints: {
      "service_worker":
        `data:application/javascript,export default function (state = {}) {
  if ("serviceWorker" in navigator) {
    try {
      navigator.serviceWorker.register("${SERVICE_WORKER_ENDPOINT}", {
        scope: "${scope ?? "/"}",
        ...state,
      });
    } catch (error) {
      console.error(\`Registration failed with \${error}\`);
    }
  }
}`,
    },
    render: (ctx) => {
      const res = ctx.render();
      return {
        scripts: [
          {
            entrypoint: "service_worker",
            state: initialState,
          },
        ],
      };
    },
    routes: [
      {
        path: "/app.webmanifest",
        handler: () => {
          return new Response(
            JSON.stringify(
              {
                "start_url": scope ?? "/",
                ...manifest,
              },
              null,
              2,
            ),
            {
              headers: {
                "Content-Type": "application/manifest+json",
              },
            },
          );
        },
      },
      {
        path: `/${SERVICE_WORKER_ENDPOINT}`,
        handler: async () => {
          const src = await fetch(swSrc);
          const { code } = transform(await src.text(), {
            jsc: {
              target: "es2022",
              parser: {
                syntax: "typescript",
              },
            },
            ...compilerOptions,
          });

          return new Response(code, {
            headers: {
              "Content-Type": "application/javascript",
              "service-worker": "script",
            },
          });
        },
      },
    ],
  };
}

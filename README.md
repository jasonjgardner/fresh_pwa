# Fresh PWA Plugin

Usage:

__fresh.config.ts__
```ts
import { defineConfig } from "$fresh/server.ts";
import PWAPlugin from "https://deno.land/x/fresh_pwa/mod.ts";

export default defineConfig({
  plugins: [
    PWAPlugin({
      // Web app manifest
      manifest: {
        name: "Fresh PWA",
        short_name: "Fresh",
        description: "Fresh PWA example",
        icons: [
          {
            src: "/logo.svg",
            type: "image/svg+xml",
            sizes: "48x48",
          },
        ],
        id: "/?source=pwa",
        start_url: "/?source=pwa",
        background_color: "#86efac",
        display: "standalone",
        scope: "/",
        theme_color: "#86efac",
        shortcuts: [],
      },
      // Worker source URL
      swSrc: new URL("./src/sw.ts", import.meta.url),
      compilerOptions: {
        // SWC compiler option overrides
      },
    }),
  ],
});
```

__routes/\_app.tsx__

```diff
import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
+       <link href="/app.webmanifest" rel="manifest" />
      </head>
    </html>
  );
}
```

__deno.json__
```diff
{
  "tasks": {
-    "start": "deno run -A --watch=static/,routes/ dev.ts",
+    "start": "deno run -A --watch=static/,routes/,src/ dev.ts",
  }
}
```

Create __src/sw.ts__
```ts
self.addEventListener("install", event => {
  // etc.
});
```
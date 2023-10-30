export interface PluginOptions {
  /**
   * URL to the service worker source file.
   */
  swSrc: URL;
  /**
   * Web App Manifest.
   * @see https://developer.mozilla.org/en-US/docs/Web/Manifest
   */
  manifest: Record<string, unknown>;
  /**
   * SWC compiler options. Default target is `es2022`.
   * @see https://swc.rs/docs/configuration/swcrc
   */
  compilerOptions?: Record<string, unknown>;
  /**
   * Scope of the service worker. Default is `/`.
   */
  scope?: string;
  /**
   * Optional initial state to hydrate the service worker.
   */
  initialState?: Record<string, unknown>;
}

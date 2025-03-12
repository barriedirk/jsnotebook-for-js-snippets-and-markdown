// src/global.d.ts
/// <reference types="monaco-editor" />
declare global {
  interface Window {
    // This provides the correct Monaco typings
    monaco: typeof import("monaco-editor");
  }
}

// Ensures that this file is treated as a module
export {};

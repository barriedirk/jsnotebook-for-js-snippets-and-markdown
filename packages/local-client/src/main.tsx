import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import startService from "./blunder/plugins/esbuild.ts";

// @todo, to improve, the issue is
// when there are more than one text code which call at the same time the function startService
const App = lazy(async () => {
  const App = import("./App.tsx");

  await startService();

  return App;
});

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <Suspense fallback={<div>Loading</div>}>
      <App />,
    </Suspense>
  </StrictMode>,
);

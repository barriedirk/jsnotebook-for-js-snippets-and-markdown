import "@/index.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bulmaswatch/superhero/bulmaswatch.min.css";

import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "@state/index";

import { AsyncEsBuild } from "@blunder/plugins/esbuild.ts";

import ErrorBoundary from "@components/ErrorBoundary/ErrorBoundary.tsx";
import Loading from "@components/Splash/Splash.tsx";

const App = lazy(async () => {
  const App = import("./App.tsx");

  await AsyncEsBuild.getInstance();

  return App;
});

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);

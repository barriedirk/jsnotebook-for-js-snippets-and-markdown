import "bulmaswatch/superhero/bulmaswatch.min.css";

import { useRef, useState } from "react";
import { startService } from "../../blunder/plugins/esbuild";
import { unpkgPathPlugin } from "../../blunder/plugins/unpkg-path-plugin";
import { fetchPlugin } from "../../blunder/plugins/fetch-plugin";
import CodeEditor from "../CodeEditor/CodeEditor";

function HowToUseEsBuild() {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [input, setInput] = useState(`
import React from 'react';
import { createRoot } from "react-dom/client";
import 'bulma/css/bulma.css';

const App = () => <h1>Hi There</h1>;
const root = createRoot(document.getElementById('root'));

root.render(<App />);

`);

  const onClick = async () => {
    const esBuildRef = await startService();

    iframe.current!.srcdoc = html;

    const result = await esBuildRef.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        "process.env.NODE_ENV": "'production'",
        global: "window",
      },
    });

    // setCode(result.outputFiles[0].text);
    iframe.current!.contentWindow!.postMessage(result.outputFiles[0].text, "*");
  };

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            // console.log(event.data);
            try{
              eval(event.data);
            } catch (err) {
             const root = document.querySelector('#root');

             root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
             // throw err;
             console.error(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        onChange={(value) => setInput(value)}
      />
      <hr />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button type="button" onClick={onClick}>
          Submit
        </button>
      </div>
      <iframe
        title="coding-preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  );
}

export default HowToUseEsBuild;

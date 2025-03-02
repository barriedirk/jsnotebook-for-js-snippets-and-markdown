import "./Preview.css";

import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

const html = `
    <html>
     <head>
      <style>
        html {background-color: white;}
      </style>
     </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
             const root = document.querySelector('#root');

             root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
      
             console.error(err);
          };

          window.addEventListener('error', (event) => {
            // async errors like setTimeout
            // console.error(event);

            event.preventDefault(); // to avoid repeat twice the error console
            handleError(event.error);
          }, false);

          window.addEventListener('message', (event) => {
            // console.log(event.data);
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    iframe.current!.srcdoc = html;

    setTimeout(() => {
      iframe.current!.contentWindow!.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="coding-preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStatus && (
        <div className="preview-error">
          <h4>Runtime Error</h4>
          {bundlingStatus}
        </div>
      )}
    </div>
  );
};

export default Preview;

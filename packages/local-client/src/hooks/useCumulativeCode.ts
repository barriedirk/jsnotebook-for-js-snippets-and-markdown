import { useTypedSelector } from "./useTypedSelector";

const showFuncNoop = "var show = () => {}";

const showFunc = `
        // See bundler/index.ts
        //  jsxFactory: "_React.createElement",
        //  jsxFragment: "_React.Fragment",

        import _React from 'react';
        import { createRoot as _createRootNode } from "react-dom/client";


        var show = (value) => {
          const $root = document.querySelector('#root');

          if (typeof value === 'object') {

            if (value.$$typeof && value.props) {

             const rootNode = _createRootNode($root);

             rootNode.render(value);

              // ReactDOM.render is deprecated
              // ReactDOM.render(value, $root);
            } else {
              $root.innerHTML = JSON.stringify(value);
            }

          } else {
            $root.innerHTML = value;
          }

        };
`;

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    const cumulativeCode = [];

    for (const c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncNoop);
        }

        cumulativeCode.push(c.content);
      }

      if (c.id === cellId) {
        break;
      }
    }

    return cumulativeCode;
  }).join("\n");
};

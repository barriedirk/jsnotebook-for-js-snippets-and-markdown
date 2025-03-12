import "./resizable.css";

import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  const [innerHeight, setInnerHeigth] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  let resizableProps: ResizableBoxProps;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const listener = () => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        setInnerHeigth(window.innerHeight);
        setInnerWidth(window.innerWidth);

        if (window.innerWidth * 0.7 < width) {
          setWidth(window.innerWidth * 0.7);
        }
      }, 100);
    };

    window.addEventListener("resize", listener);

    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      minConstraints: [innerWidth * 0.2, Infinity],
      maxConstraints: [innerWidth * 0.7, Infinity],
      height: Infinity,
      // width: innerWidth * 0.5,
      width,
      resizeHandles: ["e"],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      onResize: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      className: "resize-vertical",
      minConstraints: [Infinity, 50],
      maxConstraints: [Infinity, innerHeight * 0.9],
      height: 300,
      width: Infinity,
      resizeHandles: ["s"],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;

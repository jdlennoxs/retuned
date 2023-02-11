import { useRef, useState } from "react";

const MouseDownObserver = ({ className, children }) => {
  const ref = useRef(false);
  //   const [mouseDown, setMouseDown] = useState(false);
  const handleEvent = (isMouseDown) => {
    ref.current = isMouseDown;
    // setMouseDown(isMouseDown);
    // if (event.type === "mousedown") {
    //   this.setState({ message: "Mouse Down" });
    //   console.log("down");
    // } else {
    //   this.setState({ message: "Mouse Up" });
    //   console.log("up");
    // }
  };
  const shouldDecorateChild = (child) => {
    return (
      !!child &&
      this.getIsReactComponent(child) &&
      this.props.shouldDecorateChildren
    );
  };

  const decorateChild = (child, props) => {
    return cloneElement(child, props);
  };
  const renderChildrenWithProps = (children, props) => {
    if (typeof children === "function") {
      return children(props);
    }

    return Children.map(children, (child) => {
      return this.shouldDecorateChild(child)
        ? this.decorateChild(child, props)
        : child;
    });
  };

  return (
    <div
      className={className}
      onMouseDown={handleEvent(true)}
      onMouseUp={handleEvent(false)}
      mouseDown={ref.current}
    >
      {children}
    </div>
  );
};
export default MouseDownObserver;

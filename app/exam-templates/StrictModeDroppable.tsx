import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  const sanitizedProps = {
    ...props,
    isDropDisabled: props.isDropDisabled === true,
    isCombineEnabled: props.isCombineEnabled === true,
    ignoreContainerClipping: props.ignoreContainerClipping === true,
  };

  return <Droppable {...sanitizedProps}>{children}</Droppable>;
};

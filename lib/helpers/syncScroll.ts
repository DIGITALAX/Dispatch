import { RefObject } from "react";

const syncScroll = (
  preRef: RefObject<HTMLPreElement> | null,
  textElement: RefObject<HTMLTextAreaElement>
) => {
  if (textElement?.current && preRef?.current) {
    preRef.current.scrollTop = textElement.current.scrollTop;
    preRef.current.scrollLeft = textElement.current.scrollLeft;
  }
};

export default syncScroll;

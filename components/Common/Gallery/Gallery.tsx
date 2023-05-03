import { INFURA_GATEWAY } from "@/lib/constants";
import React, { FunctionComponent, useEffect, useRef } from "react";

const images: string[] = [
  `${INFURA_GATEWAY}/ipfs/QmPqg4kzgy8YhzNaLfuBZZKRfqW1eJALpga5BnaN9hmQt1`,
  `${INFURA_GATEWAY}/ipfs/QmPiei2mqpuicg67JZq4Upa29qoWKZzeA2fkVEdGEx6R9z`,
  `${INFURA_GATEWAY}/ipfs/QmNxET4gxnRduWfDVQocab47KBQja7Y942GU7KFUvFj2H1`,
  `${INFURA_GATEWAY}/ipfs/QmQSk2qtuiMk2Tz829s3ojcKT9Hu4ZBXYmcxUruxZUgoy2`,
  `${INFURA_GATEWAY}/ipfs/QmUEvzAsMQTUPfGCLTb6ykcXsKcfkK9wKSxM5XDJ7uozXW`,
  `${INFURA_GATEWAY}/ipfs/QmNkrAeAdmV5fuQR78xkf13ufcGyt3hUucQBwNHBJPErG1`,
  `${INFURA_GATEWAY}/ipfs/QmebE8idtZkGN6mBVNHkYjuuKWz13EKKgQSnzA5D5xYUwW`,
  `${INFURA_GATEWAY}/ipfs/QmUSKQaRqeiHLjUfPJwuwhJMNp1CdStDAdgUMcdBW56MAT`,
  `${INFURA_GATEWAY}/ipfs/QmPS7uBvR7f3WuDQURDEgZfSL9ydkR1Vy6o3LpX2jrw9NL`,
  `${INFURA_GATEWAY}/ipfs/QmXmbtdi4vsMKEhiQfrhnq13KWqZpq2MPDoibRHJSoSQ1B`,
  `${INFURA_GATEWAY}/ipfs/QmRDynVkyHX65MG6diwmbXTz6KNiWB2W1zvf2FJ5HV3rTV`,
  `${INFURA_GATEWAY}/ipfs/QmQVC9hQbiSdtjxqgQojA5awCS6ty9zUCW8tvjj4YMHMy8`,
  `${INFURA_GATEWAY}/ipfs/QmTLiFsx3eQaELcepmeM3aiF2vvNBXCnRAL8CGf9SY44Ep`,
  `${INFURA_GATEWAY}/ipfs/Qmf7FUfwNqDJH2N8TFHkHfpUPorE1KRrFCsF614N9CxCNW`,
  `${INFURA_GATEWAY}/ipfs/QmfKrFmuTVGhLnqD19XAvWstqxJLmv7Q98nNqd1rGEZbHf`,
  `${INFURA_GATEWAY}/ipfs/QmQW6M42chDzb8GvkfwsyhvxmFqh8SsyXjkXY6XvJ41bkp`,
  `${INFURA_GATEWAY}/ipfs/QmXYxHAG93HFaMarr8B7c96Uu7ZAcJJojeUfg4GdsqoDYa`,
  `${INFURA_GATEWAY}/ipfs/QmaR2euFccMcy2jA3ijHqPUe5gSeAdwG73HbNfdqtGmi1q`,
  `${INFURA_GATEWAY}/ipfs/QmXFK53vEo9QaE4LMEzwScxjSDECtmgBMCAhPEGVR1DKFe`,
  `${INFURA_GATEWAY}/ipfs/QmUzdLgkbHdmDt5qmrKpnJnMj4MdL3fX3UQVjLZidkrER1`,
];

const Gallery: FunctionComponent = (): JSX.Element => {
  const itemEls = useRef(new Array());

  const scaleItems = Array.from({ length: images.length }, (_, i) => -i * 0.3);
  const isMouseOver = Array.from({ length: images.length }, (_, i) => false);

  const xPos = Array.from({ length: images.length }, (_, i) => -50);
  const yPos = Array.from({ length: images.length }, (_, i) => -50);
  const xSteps = Array.from(
    { length: images.length },
    (_, i) => (i % 2 ? 1 : -1) * 0.3
  );
  const ySteps = Array.from(
    { length: images.length },
    (_, i) => (i % 4 == 0 ? 1 : i % 4 == 1 ? -1 : i % 4 == 2 ? -1 : 1) * 0.3
  );

  let currentTimer: any;

  const IsMouseOver = (): boolean => {
    if (isMouseOver.findIndex((item) => item === true) >= 0) return true;
    return false;
  };

  const moveImages = (): void => {
    !IsMouseOver() &&
      itemEls.current.forEach((item, index) => {
        scaleItems[index] += 0.003;
        if (scaleItems[index] > 3) {
          scaleItems[index] = scaleItems[index] - 3;
          xPos[index] = -50;
          yPos[index] = -50;
        } else if (scaleItems[index] > 0) {
          xPos[index] += xSteps[index];
          yPos[index] += ySteps[index];
        }

        if (item) {
          item.style = `transform: scale(${
            scaleItems[index] > 0 ? scaleItems[index] : 0
          }) translate(${xPos[index]}%, ${yPos[index]}%)`;
        }
      });

    currentTimer = setTimeout(() => {
      moveImages();
    }, 30);
  };

  useEffect(() => {
    currentTimer && clearTimeout(currentTimer);
    moveImages();
  }, []);

  return (
    <div
      id="animationGallery"
      className="absolute overflow-hidden w-screen h-screen z-0 opacity-50"
      style={{ height: "100vh", width: "100vw" }}
    >
      {images.map((item, index) => {
        return (
          <img
            className="cursor-pointer absolute top-1/2 left-1/2 origin-homeAnim translate-y-1/2 translate-x-1/2 hover:grayscale"
            key={index}
            src={item}
            ref={(element) => {
              itemEls.current[index] = element;
            }}
            onMouseEnter={(): void => {
              isMouseOver[index] = true;
            }}
            onMouseLeave={(): void => {
              isMouseOver[index] = false;
            }}
          />
        );
      })}
    </div>
  );
};

export default Gallery;

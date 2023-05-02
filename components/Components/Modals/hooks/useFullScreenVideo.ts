import { RefObject, useEffect, useRef } from "react";
import useControls from "../../Tunes/hooks/useControls";

const useFullScreenVideo = () => {
  const videoRef = useRef<RefObject<HTMLElement>>();
  const playerRef = useRef<HTMLVideoElement>();
  const { currentTime } = useControls();

//   console.log({currentTime})

//   useEffect(() => {
//     const player = playerRef.current;
//     if (player) {
//       player.currentTime = currentTime;
//     }
//   }, [currentTime]);

  return { playerRef, videoRef };
};

export default useFullScreenVideo;

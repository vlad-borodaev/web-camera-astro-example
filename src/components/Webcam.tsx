import { useEffect, useRef } from "react";

const useVideo = () => {
  const videoRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const getVideo = (): void => {
    window.navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then((stream: MediaStream) => {
        const video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(console.error);
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataUrl("image/jpeg");

    const link = document.createElement("a");
    link.href = data;
    link.target = "_blank";
    link.setAttribute("download", "myWebcam");
    link.innerHTML = `<img src=${data} alt='thumbnail' />`;

    document.body.appendChild(link);
  };

  const paintOnCanvas = () => {
    const video = videoRef.current;
    const ctx = canvasRef.current.getContext("2d");

    const width = 320;
    const height = 240;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 200);
  };

  const stopVideo = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    for (const track of tracks) {
      track.stop();
    }

    videoRef.current.srcObject = null;
  };

  return {
    videoRef,
    canvasRef,
    getVideo,
    stopVideo,
    takePhoto,
    paintOnCanvas,
  };
};

export default function WebcamComponent() {
  const {
    videoRef,
    canvasRef,
    getVideo,
    stopVideo,
    takePhoto,
    paintOnCanvas,
  } = useVideo();

  useEffect(() => {
    getVideo();
  }, []);

  return (
      <div>
        <video
          ref={videoRef}
          onCanPlay={() => paintOnCanvas()}
        />
        <canvas ref={canvasRef} />
        <div id="photoPlaceholder"></div>
      </div>
  );
};
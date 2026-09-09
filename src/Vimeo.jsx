import { useCallback, useEffect, useRef } from "react";
import "./Vimeo.css";

const useVimeoPlayback = (active) => {
  const iframeRef = useRef(null);

  const updatePlayback = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { method: active ? "play" : "pause" },
      "https://player.vimeo.com"
    );
  }, [active]);

  useEffect(() => {
    updatePlayback();
  }, [updatePlayback]);

  return { iframeRef, updatePlayback };
};

const DisplayBox = ({ video, title, explain, active = true }) => {
  // 일반 Vimeo 링크가 들어올 경우 임베드(플레이어) 링크로 자동 변환
  const embedUrl = video.includes("player.vimeo.com")
    ? video
    : video.replace("vimeo.com/", "player.vimeo.com/video/");
  const { iframeRef, updatePlayback } = useVimeoPlayback(active);

  return (
    <div className="display-box">
      <div className="display-box__video">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="1920"
          height="1080"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          className="display-box__iframe"
          onLoad={updatePlayback}
        ></iframe>
      </div>
      <div className="display-box__text">
        <h2 className="display-box__title">{title}</h2>
        <p className="display-box__explain">{explain}</p>
      </div>
    </div>
  );
};

const DisplayBox_hz = ({ video, title, explain, active = true }) => {
  // 일반 Vimeo 링크가 들어올 경우 임베드(플레이어) 링크로 자동 변환
  const embedUrl = video.includes("player.vimeo.com")
    ? video
    : video.replace("vimeo.com/", "player.vimeo.com/video/");
  const { iframeRef, updatePlayback } = useVimeoPlayback(active);

  return (
    <div className="display-box display-box--horizontal">
      <div className="display-box__video display-box--horizontal__video">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="1080"
          height="1920"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          className="display-box__iframe"
          onLoad={updatePlayback}
        ></iframe>
      </div>
      <div className="display-box__text display-box--horizontal__text">
        <h2 className="display-box__title display-box--horizontal__title">
          {title}
        </h2>
        <p className="display-box__explain">{explain}</p>
      </div>
    </div>
  );
};

export { DisplayBox_hz };
export default DisplayBox;

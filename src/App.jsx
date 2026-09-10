import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import OptionWheel from "./OptionWheel";
import FlowingMenu from "./FlowingMenu";
import DisplayBox, { DisplayBox_hz } from "./Vimeo";

const demoItems = [
  {
    link: "#",
    text: "Groovy Lab",
    text2: "Home",
    image:
      "https://htmlcolorcodes.com/assets/images/colors/red-orange-color-solid-background-1920x1080.png",
  },
  {
    link: "#",
    text: "Summer Project: Artboard Level up",
    text2: "Projects",
    image:
      "https://preview.colorkit.co/color/00bfff.png?size=wallpaper&static=true",
  },
  {
    link: "#",
    text: "Hyunbin, sebin, yeyoung, hyobin, soyul",
    text2: "Members",
    image:
      "https://preview.colorkit.co/color/00bfff.png?size=wallpaper&static=true",
  },
];

const displayItems = [
  {
    video:
      "https://vimeo.com/1224931354?autoplay=1&muted=1&title=0&loop=1&byline=0&controls=0",
    title: "진홍색 풍미",
    explain:
      "토마토의 전통적이면서도 현대적인 풍미를 시각적으로 표현했다. 반으로 가른 방울 토마토 속에 동양 기준, 전통을 상징하는 나무 블럭과 현대를 상징하는 양복을 배치했다. 공이 떨어지면서 클로즈업된 요소와 한자 단어를 적음으로써 아트보드의 특징을 더 강조했다.",
  },
  {
    video:
      "https://vimeo.com/1225553384?autoplay=1&muted=1&title=0&loop=1&byline=0&controls=0",
    aspectRatio: "4 / 5",
    videoWidth: 1080,
    videoHeight: 1350,
    title: "리듬세상 [팬클럽] Remake",
    explain:
      "닌텐도 고전 게임 《리듬세상》의 ‘팬클럽’을 재해석하여 게임 인트로 모션그래픽을 제작하였다. 기존의 픽셀 기반 레트로 스타일에서 벗어나 현대적인 그래픽을 적용했으며, 게임 인트로 특유의 슬로우 모션 연출과 리듬감 있는 움직임을 살렸다.",
  },
  {
    video:
      "https://vimeo.com/1225553418?autoplay=1&muted=1&title=0&loop=1&byline=0&controls=0",
    title: "후쿠오카 교회",
    explain:
      "일본 단기선교 일정 가운데 방문한 후쿠오카 교회. 정성스럽게 알록달록하고 아기자기한 패턴으로 꾸며진 교회의 여러 공간 속에서, 가장 눈에 들어온 곳은 3층 예배당 앞이었습니다. 그곳으로 산뜻하게 들어오는 햇빛을 바라보던 행복했던 기억을 되살리며.",
  },
  {
    video:
      "https://vimeo.com/1225553501?autoplay=1&muted=1&title=0&loop=1&byline=0&controls=0",
    title: "서핑보이",
    explain:
      "여름, 시원, 청량을 컨셉으로 여름의 시원함과 청량함을 표현해줄 수 있는 파란색 컬러를 배경으로 했고 여름을 나타낼수 있는 다양한 요소(ex 수박, 서핑, 코코넛, 파도 등)을 통해 컨셉을 나타냈다. 뒤에 ‘SUMMER’이라는 글자의 형태가 물이 차오르는 듯한 느낌을 주었고 거기에 맞춰서 원 안에 다양한 요소들이 움직이게 두었다.",
  },
  {
    video:
      "https://vimeo.com/1225553446?autoplay=1&muted=1&title=0&loop=1&byline=0&controls=0",
    aspectRatio: "9 / 16",
    videoWidth: 1080,
    videoHeight: 1920,
    title: "황혼",
    explain:
      "일상의 템포와 휴식의 관계성을 디지털 모션 아트 형식으로 탐구한 모션 그래픽이다. 화면 중앙을 지탱하는 신호등과 거리 표지판은 현대 사회가 강요하는 직진과 이동의 기호학적 상징이다. 동심원을 그리며 순환하는 별의 궤적은 멈추지 않고 흘러가는 시간을 정밀하게 시각화하며, 그 아래 교차하는 STOP, Take a Rest, GOOD NIGHT의 메시지는 관객에게 의도적인 일시정지를 제안한다.",
  },
];

const allDisplayPositions = [
  "main",
  "left",
  "bottom-left",
  "bottom-right",
  "right",
];

const getVimeoEmbedUrl = (video) => {
  const embedUrl = video.includes("player.vimeo.com")
    ? video
    : video.replace("vimeo.com/", "player.vimeo.com/video/");

  return `${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autopause=0`;
};

const AllDisplay = ({ items, active }) => {
  const iframeRefs = useRef([]);

  const updatePlayback = useCallback(
    (iframe) => {
      iframe?.contentWindow?.postMessage(
        { method: active ? "play" : "pause" },
        "https://player.vimeo.com"
      );
    },
    [active]
  );

  useEffect(() => {
    iframeRefs.current.forEach(updatePlayback);
  }, [updatePlayback]);

  return (
    <div className="all-display-box">
      <div className="all-display">
        {items.map((item, index) => (
          <div
            key={item.title}
            className={`all-display__video all-display__video--${allDisplayPositions[index]}`}
          >
            <iframe
              ref={(iframe) => {
                iframeRefs.current[index] = iframe;
              }}
              src={getVimeoEmbedUrl(item.video)}
              title={item.title}
              width={item.videoWidth ?? 1920}
              height={item.videoHeight ?? 1080}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="all-display__iframe"
              onLoad={(event) => updatePlayback(event.currentTarget)}
            ></iframe>
          </div>
        ))}
      </div>
      <div className="display-box__text">
        <h2 className="display-box__title">아트보드 레벨업</h2>
        <p className="display-box__explain">
          학기 중 짧은 작업 시간 때문에 시도하기 어려웠던 밀도 높은 화면 구성의
          모션그래픽을 완성해 보는 활동입니다. 먼저 스케치북을 활용해 한 편의
          밀도 높은 작품을 그리고, 이를 2D 벡터 또는 3D 오브젝트 형식으로
          변환하였습니다. 이후 완성된 에셋을 바탕으로 모션 포스터 형식의 모션을
          완성했습니다.
        </p>
      </div>
    </div>
  );
};

function App() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [loadedDisplayIndexes, setLoadedDisplayIndexes] = useState(
    () => new Set()
  );
  const displayPanelRef = useRef(null);
  const activeDisplayRef = useRef(null);

  useLayoutEffect(() => {
    const panel = displayPanelRef.current;
    const activeSlot = activeDisplayRef.current;
    const content = activeSlot?.firstElementChild;

    if (!panel || !content) return undefined;

    const updateDisplayHeight = () => {
      if (!window.matchMedia("(max-width: 768px)").matches) {
        panel.style.removeProperty("--mobile-display-height");
        return;
      }

      const panelStyle = window.getComputedStyle(panel);
      const verticalPadding =
        parseFloat(panelStyle.paddingTop) +
        parseFloat(panelStyle.paddingBottom);

      panel.style.setProperty(
        "--mobile-display-height",
        `${content.getBoundingClientRect().height + verticalPadding}px`
      );
    };

    updateDisplayHeight();

    const resizeObserver = new ResizeObserver(updateDisplayHeight);
    resizeObserver.observe(content);
    window.addEventListener("resize", updateDisplayHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDisplayHeight);
    };
  }, [selectedOptionIndex, loadedDisplayIndexes]);

  const handleOptionChange = (optionIndex) => {
    setSelectedOptionIndex(optionIndex);

    // All 화면은 별도의 AllDisplay가 담당한다.
    if (optionIndex === 0) return;

    const displayIndex = optionIndex - 1;

    setLoadedDisplayIndexes((previousIndexes) => {
      if (previousIndexes.has(displayIndex)) return previousIndexes;

      const nextIndexes = new Set(previousIndexes);
      nextIndexes.add(displayIndex);
      return nextIndexes;
    });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[74px] z-50">
        <FlowingMenu
          items={demoItems}
          speed={8}
          textColor="#e2e2e2"
          bgColor="#131313"
          marqueeBgColor="#e2e2e2"
          marqueeTextColor="#131313"
          borderColor="#ffffff"
        />
      </div>
      <div className="app-shell">
        <div className="app-layout">
          <div className="option-panel">
            <OptionWheel
              items={["All", "Hyunbin", "Sebin", "Yeyoung", "Hyobin", "Soyul"]}
              defaultSelected={0}
              textColor="#e2e2e2"
              activeColor="#ffffff"
              side="left"
              fontSize={3}
              spacing={1.4}
              curve={1}
              tilt={6}
              blur={2}
              fade={0.25}
              smoothing={200}
              inset={100}
              loop={false}
              draggable
              onChange={handleOptionChange}
            />
          </div>
          <div ref={displayPanelRef} className="display-panel">
            <div
              ref={selectedOptionIndex === 0 ? activeDisplayRef : null}
              className="display-cache-slot"
              style={{ display: selectedOptionIndex === 0 ? "flex" : "none" }}
            >
              <AllDisplay
                items={displayItems}
                active={selectedOptionIndex === 0}
              />
            </div>
            {displayItems.map((item, index) => {
              if (!loadedDisplayIndexes.has(index)) return null;

              const DisplayComponent = [1, 4].includes(index)
                ? DisplayBox_hz
                : DisplayBox;
              const isActive = selectedOptionIndex === index + 1;

              return (
                <div
                  key={index}
                  ref={isActive ? activeDisplayRef : null}
                  className="display-cache-slot"
                  style={{ display: isActive ? "flex" : "none" }}
                >
                  <DisplayComponent
                    video={item.video}
                    title={item.title}
                    explain={item.explain}
                    active={isActive}
                    aspectRatio={item.aspectRatio}
                    videoWidth={item.videoWidth}
                    videoHeight={item.videoHeight}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

<iframe
  title="vimeo-player"
  src="https://player.vimeo.com/video/842144954?h=e9568ba443"
  width="640"
  height="360"
  frameborder="0"
  referrerpolicy="strict-origin-when-cross-origin"
  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
  allowfullscreen
></iframe>;

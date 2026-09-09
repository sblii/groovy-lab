import { useState } from "react";
import "./App.css";
import OptionWheel from "./OptionWheel";
import FlowingMenu from "./FlowingMenu";
import DisplayBox from "./Vimeo";

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
      "https://vimeo.com/1224931354?autoplay=1&muted=1?&title=0&loop=1&byline=0&controls=0",
    title: "진홍색 풍미",
    explain:
      "토마토의 전통적이면서도 현대적인 풍미를 시각적으로 표현했다. 반으로 가른 방울 토마토 속에 동양 기준, 전통을 상징하는 나무 블럭과 현대를 상징하는 양복을 배치했다. 공이 떨어지면서 클로즈업된 요소와 한자 단어를 적음으로써 아트보드의 특징을 더 강조했다.",
  },
  {
    video:
      "https://vimeo.com/1036150835?autoplay=1&muted=1?&title=0&loop=1&byline=0&controls=0",
    title: "리듬세상 [팬클럽] Remake",
    explain:
      "닌텐도 고전 게임 《리듬세상》의 ‘팬클럽’을 재해석하여 게임 인트로 모션그래픽을 제작하였다. 기존의 픽셀 기반 레트로 스타일에서 벗어나 현대적인 그래픽을 적용했으며, 게임 인트로 특유의 슬로우 모션 연출과 리듬감 있는 움직임을 살렸다.",
  },
  {
    video:
      "https://vimeo.com/1224931354?autoplay=1&muted=1?&title=0&loop=1&byline=0&controls=0",
    title: "",
    explain: "",
  },
  {
    video:
      "https://vimeo.com/1224931354?autoplay=1&muted=1?&title=0&loop=1&byline=0&controls=0",
    title: "서핑보이",
    explain:
      "여름, 시원, 청량을 컨셉으로 여름의 시원함과 청량함을 표현해줄 수 있는 파란색 컬러를 배경으로 했고 여름을 나타낼수 있는 다양한 요소(ex 수박, 서핑, 코코넛, 파도 등)을 통해 컨셉을 나타냈다. 뒤에 ‘SUMMER’이라는 글자의 형태가 물이 차오르는 듯한 느낌을 주었고 거기에 맞춰서 원 안에 다양한 요소들이 움직이게 두었다.",
  },
  {
    video:
      "https://vimeo.com/1036150835?autoplay=1&muted=1?&title=0&loop=1&byline=0&controls=0",
    title: "황혼",
    explain:
      "일상의 템포와 휴식의 관계성을 디지털 모션 아트 형식으로 탐구한 모션 그래픽이다. 화면 중앙을 지탱하는 신호등과 거리 표지판은 현대 사회가 강요하는 직진과 이동의 기호학적 상징이다. 동심원을 그리며 순환하는 별의 궤적은 멈추지 않고 흘러가는 시간을 정밀하게 시각화하며, 그 아래 교차하는 STOP, Take a Rest, GOOD NIGHT의 메시지는 관객에게 의도적인 일시정지를 제안한다.",
  },
];

function App() {
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
      <div className="w-full h-screen bg-[var(--white)] flex justify-center pt-[76px] pb-[4px] px-[4px]">
        <div className="w-full h-full bg-none flex justify-between gap-[2px]">
          <div className="w-[620px] h-full flex justify-center bg-[var(--black)] rounded-xl">
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
              onChange={(index, item) => console.log(index, item)}
            />
          </div>
          <div className="w-[1260px] h-full flex justify-center bg-[var(--black)] rounded-xl p-[100px]">
            <DisplayBox
              video={displayItems[0].video}
              title={displayItems[0].title}
              explain={displayItems[0].explain}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

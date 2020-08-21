import React, {useEffect, useState, useCallback} from 'react';
import { AnimateLogo } from "./components";
import { getMusicAPI } from "./apis";
import { ReactComponent as SunnySvg } from "./imgs/sunny.svg";
import { ReactComponent as PauseSvg } from "./imgs/pause-primary.svg";
import { ReactComponent as LocationSvg } from "./imgs/icon-location.svg";
import "./App.css";

type YoutubeVideoDetail = {
  video_id: string;
  author: string;
  title: string;
  video_quality: string;
};

type PlayerStatus =
  | "NOT_STARTED"
  | "CLOSED"
  | "PLAYING"
  | "PAUSED"
  | "BUFFERING"
  | "UNKNOWN";

function App() {
  const [showLogo, setShowLogo] = useState<boolean>(true)
  const [location, setLocation] = useState<Position | undefined>(undefined);
  const [music, setMusic] = useState<MusicRecommend>();
  const [videoDetail, setVideoDetail] = useState<
    undefined | YoutubeVideoDetail
  >(undefined);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>("NOT_STARTED");
  const [time, setTime] = useState(new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

  setInterval( () => {
    const currentTime  = new Date()
    .toLocaleString(
      'en-US',
      { hour: 'numeric', minute: 'numeric', hour12: true }
    );
    setTime(currentTime)
  }, 1000);


  setTimeout(() => {
    setShowLogo(false)
  }, 4000);

  const fetchRecommend = useCallback(
    async (latitude: number, longitude: number) => {
      const result = await getMusicAPI(latitude, longitude);
      setMusic(result);
    },
    []
  );

  const getVideoDetail = useCallback(() => {
    chrome.runtime.sendMessage(
      { channel: "GET_VIDEO_DETAIL" },
      (detail: YoutubeVideoDetail) => {
        console.log(detail, "response");
        setVideoDetail(detail);
      }
    );
  }, []);

  const handleClickPlay = useCallback(() => {}, []);

  const registerYoutubeListener = useCallback(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      // console.log("chagned", request);
      switch (request.channel) {
        case "CHANGE_PLAYER_STATUS":
          console.log(request.payload.status);
          setPlayerStatus(request.payload.status);
          return;
        default:
          return null;
      }
    });
  }, []);

  useEffect(() => {
    console.log({music});
  }, [music]);

  useEffect(() => {
    if (location) {
      fetchRecommend(location.coords.latitude, location.coords.longitude);
    }
  }, [fetchRecommend, location]);

  useEffect(() => {
    // getVideoDetail();
    // registerYoutubeListener();
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
      console.log(position);
    });
    console.log("location");
  }, [getVideoDetail, registerYoutubeListener]);

  // const myAudio = new Audio(
  //   // chrome.runtime.getURL(
  //   "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  //   // "https://www.youtube.com/embed/VdeK_VsG9U0"
  //   // )
  // );
  // myAudio.play();

  return (
    <div className="app">
      { showLogo ? (
        <AnimateLogo />
      ) : (
      <>
      {/* <iframe
        title="test"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/VdeK_VsG9U0?autoplay=1"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      /> */}
      <div className="weatherLogoWrapper">
        <SunnySvg />
      </div>
      <div>
        <div className="metaWrapper">
          { time }
          <div className="bar"/>
          <div>
            <LocationSvg />
            {/* TODO: location 정보 추가 */}
            서울특별시, 후암동
          </div>
        </div>
        <div className="textContent">
          <b>약간 흐려진 밤</b>엔<br/>
          감성적인 마음을 위한<br/>
          <b>재즈 음악</b>을.<br/>
        </div>
        <div className="videoPlayerWrapper">
          <div className="leftHideWrapper"/>
          {videoDetail && (
            <div className="videoDetail">
              `${videoDetail.title} - ${videoDetail.author}`
            </div>
          )}
          {/*TODO test용. 제거해야함*/}
          <div className="videoDetail">
            다시 여기 바닷가 - 싹쓰리
          </div>
          {/* TODO: 왼쪽 오른쪽 아이콘 추가*/}
          <div className="playerWrapper">
            <PauseSvg />
            <PauseSvg className="pauseIcon"/>
            <PauseSvg />
          </div>
          <div className="rightHideWrapper"/>
        </div>
      </div>
      {/*<button onClick={handleClickPlay}>click</button>*/}
      </>
      ) }
    </div>
  );
}

export default App;

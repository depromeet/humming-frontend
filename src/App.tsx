import React, { useEffect, useState, useCallback } from "react";
import { AnimateLogo } from "./components";
import { getMusicAPI } from "./apis";
import { ReactComponent as Sunny } from "./imgs/sunny.svg";
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

  console.log(music);

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

  setTimeout(() => {
    setShowLogo(false)
  }, 4000);

  return (
    <div className="App">
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
      <div className="App-weather-logo-wrapper">
        <Sunny />
      </div>
      <div>
        <div className="App-meta-wrapper">
          <div className="App-time">
            { new Date().toLocaleTimeString() }
          </div>
          <div className="App-bar"/>
        </div>
        <div className="App-text-content">
          약간 흐려진 밤엔<br/>
          감성적인 마음을 위한<br/>
          재즈 음악을.<br/>
        </div>
      </div>
      <p>
        {videoDetail && (
          <div>
            <h1>{videoDetail.title}</h1>
            <h2>{videoDetail.author}</h2>
          </div>
        )}
      </p>
      {/*<button onClick={handleClickPlay}>click</button>*/}
      </>
      ) }
    </div>
  );
}

export default App;

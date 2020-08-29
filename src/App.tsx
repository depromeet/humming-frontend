import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AnimateLogo } from "./components";
import { getMusicAPI } from "./apis";
import { ReactComponent as SunnySvg } from "./imgs/sunny.svg";
import { ReactComponent as CloudSvg } from "./imgs/day_cloud.svg";
import { ReactComponent as SnowSvg } from "./imgs/snow.svg";
import { ReactComponent as RainSvg } from "./imgs/rain.svg";
import { ReactComponent as PauseSvg } from "./imgs/pause-primary.svg";
import { ReactComponent as NextSvg } from "./imgs/next.svg";
import { ReactComponent as PrevSvg } from "./imgs/prev.svg";
import { ReactComponent as PlaySvg } from "./imgs/play.svg";
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

export enum WeatherType {
  SUN = 'SUN',
  CLOUD = 'CLOUD',
  RAIN = 'RAIN',
  SNOW = 'SNOW',
}

function App() {
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [playlist, setPlaylist] = useState<string[] | undefined>([]);
  const [location, setLocation] = useState<Position | undefined>(undefined);
  const [music, setMusic] = useState<MusicRecommend>();
  const [videoDetail, setVideoDetail] = useState<
    undefined | YoutubeVideoDetail
  >(undefined);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>("NOT_STARTED");
  const [time, setTime] = useState(
    new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  );

  setInterval(() => {
    const currentTime = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    setTime(currentTime);
  }, 1000);

  setTimeout(() => {
    setShowLogo(false);
  }, 4000);

  const fetchRecommend = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const result = await getMusicAPI(latitude, longitude);
        setMusic(result);
        const playList = result.recommends.map((item) => item.videoId);
        chrome.runtime.sendMessage({
          channel: "SET_PLAYLIST",
          payload: { playList },
        });
      } catch (err) {
        console.log(err);
      }
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
  
  const weater = useMemo(() => {
    switch (music?.weatherStatus) {
      case WeatherType.CLOUD: {
        return {
          text: (
            <>
              <b>약간 흐려진 날</b>엔<br />
              감성적인 마음을 위한
              <br />
              <b>재즈 음악</b>을.
              <br />
            </>
          ),
          icon: <CloudSvg/>
        }
      }
      case WeatherType.RAIN: {
        return {
          text: (
            <>
              <b>비가 오는 날</b>엔<br />
              고즈넉한 분위기를 살려줄
              <br />
              <b>잔잔한 음악</b>을.
              <br />
            </>
          ),
          icon: <RainSvg/>
        }
      }
      case WeatherType.SNOW: {
        return {
          text: (
            <>
              <b>눈이 노는 날</b>엔<br />
              설레는 하루를 위한
              <br />
              <b>크리스마스 음악</b>을.
              <br />
            </>
          ),
          icon: <SnowSvg/>
        }
      }
      case WeatherType.SUN:
      default: {
        return {
          text: (
            <>
              <b>맑은 날</b>엔<br />
              상쾌한 하루를 위한
              <br />
              <b>밝은 음악</b>을.
              <br />
            </>
          ),
          icon: <SunnySvg/>
        }
      }
    }
  }, [music])

  const handleClickPlay = useCallback(() => {
    console.log("click play");
    chrome.runtime.sendMessage({ channel: "PLAY_VIDEO" });
  }, []);

  const handleClickPause = useCallback(() => {
    console.log("click pause");
    chrome.runtime.sendMessage({ channel: "PAUSE_VIDEO" });
  }, []);

  const handleClickPrev = useCallback(() => {
    chrome.runtime.sendMessage({ channel: "PREVIOUS_VIDEO" });
  }, []);

  const handleClickNext = useCallback(() => {
    chrome.runtime.sendMessage({ channel: "NEXT_VIDEO" });
  }, []);

  const registerYoutubeListener = useCallback(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      switch (request.channel) {
        case "CHANGE_PLAYER_STATUS":
          console.log("status", request.payload.status);
          setPlayerStatus(request.payload.status);
          getVideoDetail();
          return;
        default:
          return null;
      }
    });
  }, [getVideoDetail]);

  useEffect(() => {
    console.log({ music });
  }, [music]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { channel: "GET_PLAYER_STATUS" },
      (status: PlayerStatus) => {
        console.log("playerStatus", status);
        setPlayerStatus(status);
      }
    );
    chrome.runtime.sendMessage(
      { channel: "GET_PLAYLIST" },
      (_playlist: string[] | undefined) => {
        console.log("playlist", _playlist);
        setPlaylist(_playlist);
      }
    );
  }, []);

  useEffect(() => {
    console.log(location, playlist);
    if (location && !playlist) {
      console.log("fetch");
      fetchRecommend(location.coords.latitude, location.coords.longitude);
    }
  }, [fetchRecommend, playlist, location]);

  useEffect(() => {
    getVideoDetail();
    registerYoutubeListener();
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
      console.log(position);
    });
    console.log("location");
  }, [getVideoDetail, registerYoutubeListener]);

  return (
    <div className="app">
      {showLogo ? (
        <AnimateLogo />
      ) : (
        <>
          <div className="weatherLogoWrapper">
            { weater.icon }
          </div>
          <div>
            <div className="metaWrapper">
              {time}
              <div className="bar" />
              <div>
                <LocationSvg />
                {/* TODO: location 정보 추가? */}
                서울특별시, 후암동
              </div>
            </div>
            <div className="textContent">
              { weater.text }
            </div>
            <div className="videoPlayerWrapper">
              <div className="leftHideWrapper" />
              {videoDetail && (
                <div className="videoDetail">
                  {videoDetail.title} - {videoDetail.author}
                </div>
              )}
              {/*<div className="videoDetail">[광고 없음] 비오는날 듣기좋은 노래/ 감성돋는 발라드 모음 / 빗소리와 함께 듣는 노래 - 효붕이네</div>*/}
              <div className="playerWrapper">
                <PrevSvg className="prevIcon" onClick={handleClickPrev} />
                { playerStatus === "PLAYING" ? (
                  <PauseSvg className="pauseIcon" onClick={handleClickPause} />
                ) : (
                  <PlaySvg className="pauseIcon" onClick={handleClickPlay} />
                ) }
                <NextSvg className="nextIcon" onClick={handleClickNext} />
              </div>
              <div className="rightHideWrapper" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

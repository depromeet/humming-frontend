console.log("background.js!! loaded!!");

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: undefined,
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
}

function getPlayerStatus(statusCode) {
  switch (statusCode) {
    case -1:
      return "NOT_STARTED";
    case 0:
      return "CLOSED";
    case 1:
      return "PLAYING";
    case 2:
      return "PAUSED";
    case 3:
      return "BUFFERING";
    default:
      return "UNKNOWN";
  }
}

function onPlayerStateChange(event) {
  chrome.runtime.sendMessage({
    channel: "CHANGE_PLAYER_STATUS",
    payload: {
      status: getPlayerStatus(event.data),
    },
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request bg", request);
  console.log("player", player);
  switch (request.channel) {
    case "GET_PLAYER_STATUS":
      return sendResponse(getPlayerStatus(player.getPlayerState()));
    case "GET_VIDEO_DETAIL":
      return sendResponse(player.getVideoData());
    case "STOP_VIDEO":
      player.stopVideo();
      return;
    case "PAUSE_VIDEO":
      player.pauseVideo();
      return;
    case "PLAY_VIDEO":
      player.playVideo();
      return;
    case "NEXT_VIDEO":
      player.nextVideo();
      return;
    case "PREVIOUS_VIDEO":
      player.previousVideo();
      return;
    case "GET_PLAYLIST":
      console.log(player.getPlaylist());
      return sendResponse(player.getPlaylist());
    case "SET_PLAYLIST":
      player.cuePlaylist(request.payload.playList, 0);
      player.playVideo();
      return;
    default:
      return null;
  }
});

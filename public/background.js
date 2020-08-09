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
    videoId: "M7lc1UVf-VE",
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerReady(event) {
  event.target.playVideo();
}

var done = false;

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
  console.log("CHANGE_PLAYER_STATUS");
  chrome.runtime.sendMessage({
    channel: "CHANGE_PLAYER_STATUS",
    payload: {
      status: getPlayerStatus(event.data),
    },
  });
  if (event.data == YT.PlayerState.PLAYING && !done) {
    // setTimeout(stopVideo, 6000);
    done = true;
  }
}
function stopVideo() {
  player.stopVideo();
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  switch (request.channel) {
    case "GET_VIDEO_DETAIL":
      return sendResponse(player.getVideoData());
    default:
      return null;
  }
});

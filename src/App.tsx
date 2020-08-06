import React, { useEffect, useState } from "react";
import { AnimateLogo } from "./components";
import logo from "./imgs/logo.svg";
import "./App.css";

function App() {
  const [location, setLocation] = useState<Position | undefined>(undefined);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
      console.log(position);
    });
    console.log("location");
  }, []);

  const myAudio = new Audio(
    // chrome.runtime.getURL(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    // "https://www.youtube.com/embed/VdeK_VsG9U0"
    // )
  );
  myAudio.play();

  return (
    <div className="App">
      <AnimateLogo />
      <header className="App-header">
        <iframe
          title="test"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/VdeK_VsG9U0?autoplay=1"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {location ? (
            <>
              <div>{location?.coords.latitude}</div>
              <div>{location?.coords.longitude}</div>
            </>
          ) : (
            "no location"
          )}
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;

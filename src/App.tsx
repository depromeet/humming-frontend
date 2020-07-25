import React, { useEffect, useState } from "react";
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
  return (
    <div className="App">
      <header className="App-header">
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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

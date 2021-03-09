import React, { useEffect, useMemo, useState } from "react";
import { Song, Track, Instrument } from "reactronica";
import logo from "./logo.svg";
import "./App.css";
import { useDebounce } from "use-debounce/lib";

const DEFAULT_OCTAVE = 4; // the middle of the piano

const keyboardMap = {
  z: "C4",
  x: "D4",
  c: "E4",
  v: "F4",
  b: "G4",
  n: "A4",
  m: "B4",
  ",": "C5",
  ".": "D5",
};

function App() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [keys, setKeys] = React.useState<{ [key in string]: boolean }>({});

  useEffect(() => {
    setIsPlaying(false);
  }, []);

  const [notes, setNotes] = useState([]);
  const memoizedNotes = useMemo(() => notes, [JSON.stringify(notes)]);
  const [debouncedNotes] = useDebounce(memoizedNotes, 10);
  const handleKeypress = (e) => {
    setKeys((prev) => {
      prev[e.key as string] = e.type === "keydown";
      return prev;
    });
    // setToggle(e.type === "keydown");

    let temp = [];
    Object.keys(keys).forEach((k) => {
      if (keys[k] === true) {
        if (keyboardMap[k]) {
          temp.push({ name: keyboardMap[k] });
        }
      }
    });
    setNotes(temp);
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeypress);
    window.addEventListener("keyup", handleKeypress);
  }, []);

  console.log(notes);

  return (
    <div className="App">
      <Song isPlaying={isPlaying}>
        <Track steps={["C1", "E3", "G3", null]}>
          <Instrument type="synth" />
        </Track>
      </Song>

      <Song>
        <Track>
          <Instrument type="synth" notes={debouncedNotes} />
          {/* <Instrument
            type="sampler"
            notes={sample ? [{ name: sample }] : null}
            samples={{
              Bb0: "/samples/piano/Piano.pp.Bb0.aiff",
              C1: "../samples/drums/kick/kick_kick1.wav",
            }}
          /> */}
        </Track>
      </Song>

      <header className="App-header">
        <button
          style={{
            fontSize: "2rem",
          }}
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
        >
          {isPlaying ? "Stop sound" : "Play sound"}
        </button>

        <br />

        <img src={logo} className="App-logo" alt="logo" />

        <p>
          Edit <code>src/App.js</code> and save to reload.
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

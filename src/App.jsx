import React, { useEffect, useRef, useState } from "react";
import { Soundwave } from "react-bootstrap-icons";
import ExtraControls from "./components/ExtraControls";
import PlayerControls from "./components/PlayerControls";
import Progress from "./components/Progress";
import SongDetails from "./components/SongDetails";
import Volume from "./components/Volume";

import Billi_webp from "./media/images/billy_ha.webp";
import Billi_ogg from "./media/music/Billy_Haley-Rock_Around_the_Clock.ogg";

import Bravo_webp from "./media/images/bravo.webp";
import Bravo_ogg from "./media/music/Bravo-Leningradskij_rok_n_roll.ogg";

import Chaif_webp from "./media/images/chaif.webp";
import Chaif_ogg from "./media/music/CHajf-Rok-n-roll_jetojj_nochi.ogg";
import Elvis_webp from "./media/images/Elvis.webp";
import Elvis_ogg from "./media/music/Elvis_Presley-Jailhouse_Rock.ogg";
import Rich_webp from "./media/images/little_richard.webp";
import Rich_ogg from "./media/music/Little_Richard-Tutti_rutti.ogg";

import Roll_webp from "./media/images/Roling.webp";
import Roll_ogg from "./media/music/Rolling_Stounz-Pokras_V_CHernoe.ogg";

import the_Beatles_webp from "./media/images/the_Beatles.webp";
import the_Beatles_ogg from "./media/music/The_Beatles-Rock_And_Roll_Music.ogg";

const songs = [
  {
    id: 0,
    title: "Rock Around the Clock",
    artist: "Billy Haley",
    image: Billi_webp,
    src: Billi_ogg,
  },
  {
    id: 1,
    title: "Ленинградский рокнролл",
    artist: 'группа "Браво"',
    image: Bravo_webp,
    src: Bravo_ogg,
  },
  {
    id: 2,
    title: "Рокнролл этой ночи",
    artist: 'группа "Чайф" ',
    image: Chaif_webp,
    src: Chaif_ogg,
  },
  {
    id: 3,
    title: "Jailhouse Rock",
    artist: "Elvis Presley",
    image: Elvis_webp,
    src: Elvis_ogg,
  },
  {
    id: 4,
    title: "Tutti Frutti",
    artist: "Little Richard",
    image: Rich_webp,
    src: Rich_ogg,
  },
  {
    id: 5,
    title: "Paint it Black",
    artist: "Rolling Stones",
    image: Roll_webp,
    src: Roll_ogg,
  },
  {
    id: 6,
    title: "The Beatles",
    artist: "Rock And Roll Music",
    image: the_Beatles_webp,
    src: the_Beatles_ogg,
  },
];

class AudioAnalyser {
  constructor(audioElement) {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.source = this.context.createMediaElementSource(audioElement);
    this.analyserNode = this.context.createAnalyser();
    this.source.connect(this.analyserNode);
    this.analyserNode.connect(this.context.destination);
  }
}

function App() {
  const audioRef = useRef();
  const [playlist, setPlaylist] = useState(songs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [songLength, setSongLength] = useState(0);
  const [songFinished, setSongFinished] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [analyser, setAnalyser] = useState(null);
  const [visualizer, setVisualizer] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState(songs);

  const setTimeUpdate = () => {
    const audio = audioRef.current;
    const currentTime = audio.currentTime;
    const progress = currentTime
      ? Number(((currentTime * 100) / audio.duration).toFixed(1))
      : 0;
    setTimeElapsed(currentTime);
    !dragging && setProgress(progress);
  };

  const setLoadedData = async () => {
    const audio = audioRef.current;
    !analyser && setAnalyser(new AudioAnalyser(audio));
    setTimeElapsed(audio.currentTime);
    setSongLength(audio.duration);
  };
  const playSong = async () => {
    await analyser.context.resume();
    setIsPlaying(true);
    await audioRef.current.play();
  };

  const shufflePlaylist = () => {
    setShuffledPlaylist((playlist) => {
      if (playlist.length === 1) return playlist;

      const newPlaylist = playlist.filter(
        (song) => song.id !== playlist[currentSongIndex].id
      );

      let shuffledPlaylist = newPlaylist.sort(() => Math.random() - 0.5);

      shuffledPlaylist = [playlist[currentSongIndex], ...shuffledPlaylist];
      return shuffledPlaylist;
    });
  };

  const next = () => {
    const currentSongId = playlist[currentSongIndex].id;
    const newPlaylist = shuffle ? shuffledPlaylist : songs;
    setPlaylist(newPlaylist);
    setCurrentSongIndex(() => {
      const currentSongIndex = newPlaylist.findIndex(
        (song) => song.id === currentSongId
      );
      const nextIndex = currentSongIndex + 1;
      const newIndex = nextIndex > newPlaylist.length - 1 ? 0 : nextIndex;
      return newIndex;
    });
    playSong();
  };

  const prev = () => {
    const currentSongId = playlist[currentSongIndex].id;
    const newPlaylist = shuffle ? shuffledPlaylist : songs;
    setPlaylist(newPlaylist);
    setCurrentSongIndex(() => {
      const currentSongIndex = newPlaylist.findIndex(
        (song) => song.id === currentSongId
      );
      const prevIndex = currentSongIndex - 1;
      const newIndex = prevIndex < 0 ? newPlaylist.length - 1 : prevIndex;
      return newIndex;
    });
    playSong();
  };

  const updateCurrentTime = (value) => {
    const audio = audioRef.current;
    const currentTime = (value * audio.duration) / 100;
    audio.currentTime = currentTime;
  };

  const progressSeekEnd = (e) => {
    updateCurrentTime(e.target.value);
    setDragging(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const playOrPause = async () => {
      if (isPlaying) {
        await analyser?.context?.resume();
        await audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    };

    playOrPause();
  }, [isPlaying, analyser?.context]);

  useEffect(() => {
    if (shuffle) shufflePlaylist();
  }, [shuffle]);

  useEffect(() => {
    if (songFinished) {
      if (!repeat) next();
      setSongFinished(false);
    }
  }, [songFinished]);

  return (
    <div className="app">
      <audio
        src={playlist[currentSongIndex].src}
        ref={audioRef}
        onTimeUpdate={setTimeUpdate}
        onLoadedData={setLoadedData}
        onEnded={() => setSongFinished(true)}
        loop={repeat}
        crossOrigin="anonymous"
      ></audio>
      <div className="layout">
        <SongDetails
          visualizer={visualizer}
          source={analyser?.source}
          analyser={analyser?.analyserNode}
          currentSongIndex={currentSongIndex}
          song={playlist[currentSongIndex]}
        />
        <ExtraControls>
          <Volume
            value={volume * 100}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
          />
          <button
            aria-label={visualizer ? "Disable visualizer" : "Enable visualizer"}
            onClick={() => setVisualizer((prev) => !prev)}
          >
            <Soundwave color="var(--primary-color)" size={25} />
            {visualizer && <div className="dot" />}
          </button>
        </ExtraControls>
        <Progress
          value={progress}
          onChange={(e) => {
            setProgress(Number(e.target.value));
          }}
          progressSeekStart={() => setDragging(true)}
          progressSeekEnd={progressSeekEnd}
          timeElapsed={formatTime(timeElapsed)}
          songLength={formatTime(songLength)}
        />
        <PlayerControls
          next={next}
          prev={prev}
          isPlaying={isPlaying}
          toggleIsPlaying={() => setIsPlaying((isPlaying) => !isPlaying)}
          shuffle={shuffle}
          toggleShuffle={() => setShuffle((shuffle) => !shuffle)}
          repeat={repeat}
          toggleRepeat={() => setRepeat((repeat) => !repeat)}
        />
      </div>
    </div>
  );
}

export default App;

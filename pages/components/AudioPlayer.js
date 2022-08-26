import React, { useState, useRef, useEffect } from "react";
import classes from "../.././styles/AudioPlayer.module.css";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import {FaPause, FaPlay} from "react-icons/fa"


function AudioPlayer() {
    //state
    const [isPlaying, setIsPlaying]  = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    //references
    const audioPlayer = useRef()     //REFERENCE FOR AUDIO COMPONENT 
    const progressBar = useRef()    //REFERENCE FOR PROGRESS BAR
    const animationRef= useRef()    //REFERENCE FOR ANIMATION

    useEffect(()=>{
      const seconds = Math.floor(audioPlayer.current.duration);
      setDuration(seconds)
      progressBar.current.max = seconds;

    },[audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState])

    const togglePlayPause = () => {

      const prevState = isPlaying
      
      setIsPlaying(!prevState)
      
      if(!prevState){
        
        audioPlayer.current.play()
        //START PLAY ANIMATION
        animationRef.current = requestAnimationFrame(whilePlaying) //RECURSIVE
      }
      else {
        audioPlayer.current.pause()

        cancelAnimationFrame(animationRef.current)
        //PAUSE PLAY ANIMATION
      }

    }

    const calculateTime = (secs) => {

      const minutes = Math.floor(secs / 60)

      const returnedMin = minutes < 10 ? `0${minutes}` : minutes

      const seconds = Math.floor(secs % 60)

      const returnedSeconds = seconds < 10 ? `0${seconds}` : seconds

      return `${returnedMin}:${returnedSeconds}`

    }

    const changePlayerCurrentTime = () => {
      //set progressbar TRACK color
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(progressBar.current.value / duration) * 100}%`
      );

      //set current time of state
      setCurrentTime(progressBar.current.value);
    }

    const changeRange = () => { 

      audioPlayer.current.currentTime = progressBar.current.value 
      
      changePlayerCurrentTime()

    }
    //recursive call
    const whilePlaying = () => {
      // set current time from audioPlayer to progressbar
      progressBar.current.value = audioPlayer.current.currentTime;

      changePlayerCurrentTime();
      //START PLAY ANIMATION
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
    
  return (
    <div className={classes.audioPlayer}>
      <audio
        ref={audioPlayer}
        src="http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3"
        preload="metadata"
      />

      <button className={classes.forwardBackward}>
        <AiOutlineLeft />
        30
      </button>

      <button onClick={togglePlayPause} className={classes.playPause}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <button className={classes.forwardBackward}>
        <AiOutlineRight />
        30
      </button>

      {/* CURRENT TIME */}

      <div className={classes.currentTime}>{calculateTime(currentTime)}</div>

      {/* PROGRESS BAR */}
      <input
        type="range"
        className={classes.progressBar}
        defaultValue="0"
        ref={progressBar}
        onChange={changeRange}
      ></input>

      {/* DURATION */}
      <div className={classes.duration}>
        {duration && !isNaN(duration) && calculateTime(duration)}
      </div>
    </div>
  );
}

export { AudioPlayer };
 

/* ON PLAY CHANGE PROGRESS BAR,  */
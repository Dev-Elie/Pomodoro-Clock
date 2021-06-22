import React,{useState} from "react"
import "./App.css"


const App =()=>{
    const [displayTime,setDisplayTime]=useState(25*60)
    const [breakTime,setBreakTime]=useState(5*60)
    const [sessionTime,setSessionTime]=useState(25*60)
    const [timerOn,setTimerOn]=useState(false)
    const [onBreak,setOnBreak]=useState(false)

    const [breakAudio]= useState(new Audio("./beep.mp3"))

    const playBreakSound = ()=>{
        breakAudio.currentTime=0;
        breakAudio.play();
    }

    const formatTime =(time)=>{
        let mins = Math.floor(time/60)
        let sec = time % 60

        return (mins < 10 ? "0" + mins:mins) + ":" + (sec < 10 ? "0" + sec:sec)

    }

    const changeTime =(amount,type)=>{
        if(type==="break"){
            if(breakTime<=60 && amount<0){
                return
            }
            setBreakTime(prev=> prev + amount)
        }else{
            if(sessionTime<=60 && amount<0){
                return
            }
            setSessionTime(prev=> prev + amount)  
            if(!timerOn){
                setDisplayTime(sessionTime + amount)
            }          
        }
    }


    const controlTime = ()=>{
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;

        if(!timerOn){
            let interval = setInterval(()=>{
                date = new Date().getTime();
                if(date>nextDate){
                    setDisplayTime(prev=>{
                        if(prev<=0 && !onBreakVariable){
                            playBreakSound();
                            onBreakVariable=true;
                            setOnBreak(true);
                            return breakTime;
                        } else if(prev <=0 && onBreakVariable){
                            playBreakSound();
                            onBreakVariable=false;
                            setOnBreak(false);
                            return sessionTime;                            
                        }
                        return prev -1;
                    })
                    nextDate += second;
                }
            },30);
            localStorage.clear();
            localStorage.setItem("interval-id",interval);
        }
        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"))
        }
        setTimerOn(!timerOn)
    };

    const resetTime=()=>{
        setDisplayTime(25*60)
        setBreakTime(5*60)
        setSessionTime(25*60)
    }

    return (
        <div className="text-center">
        <h2>25 + 5 Clock</h2>
        <div className="dual-container">
            <Length 
             title={"Break Length"}
             changeTime= {changeTime} 
             type={"break"}
             time={breakTime}
             formatTime={formatTime}
              id="break-label"/>

            <Length 
             title={"Session Length"}
             changeTime= {changeTime} 
             type={"session"}
             time={sessionTime}
             formatTime={formatTime}
             id="session-label"
              />

        </div>
        <h3> {onBreak ? "Break" : "Session"} </h3>
            <h1> { formatTime(displayTime) } </h1>
                <button type="button" className="btn btn-primary" onClick={controlTime} id="start_stop">
                {timerOn ? (
                    <i class="fa fa-pause-circle-o" aria-hidden="true" ></i>

                ): (
                    <i class="fa fa-play-circle" aria-hidden="true"></i>
                )}
                </button>

                <button type="button" className="btn btn-primary" onClick={resetTime} id="reset">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>

        </div>
        )
}

const Length =({title,changeTime,type,time,formatTime})=>{
    return (

        <div>id="session-length"
            <h3> {title} </h3>
            <div className="time-sets">
                <button
                onClick={()=>changeTime(-60,type)}
                 className="btn btn-info" type="button" id="break-decrement">
                    <i class="fa fa-arrow-down" aria-hidden="true" ></i>
                </button>

                <h3 id="break-length"> {formatTime(time)} </h3>

                <button 
                onClick={()=>changeTime(+60,type)}
                className="btn btn-info" type="button" id="session-increment>
                    <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </button>


            </div>
        </div>

        )
}


export default App;
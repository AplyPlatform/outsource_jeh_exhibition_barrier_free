let audioCtx = null;

const audioElement = document.querySelector("audio");
audioElement.addEventListener(
    "ended",
    () => {
        $("#playButton").show();
        $("#stopButton").hide();
        $("#pauseButton").hide();
    },
    false
);        

$("#playButton").click(function() {                
        if (audioCtx.state === "suspended") {
            audioCtx.resume();                    
        }

        audioElement.play();
        $("#playButton").hide();
        $("#stopButton").show();
        $("#pauseButton").show();
});

$("#stopButton").click(function() {
        audioElement.pause();
        audioElement.currentTime = 0;                
        $("#playButton").show();
        $("#stopButton").hide();
        $("#pauseButton").hide();
});

$("#pauseButton").click(function() {
    audioElement.pause();          
    $("#pauseButton").hide();
    $("#playButton").show();
});

function init() {            
    audioCtx = new AudioContext();
    $("#playButton").show();       
}

$(function() {            
    init();
});
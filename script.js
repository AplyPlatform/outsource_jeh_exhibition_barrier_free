
const audioSource = document.getElementById('audioSource');
const audioElement = document.querySelector("audio");

let audioCtx = null;
let currentId = -1;
let isPaused = false;
let isPlay = false;
let isByStopButton = false;

let endCallback = null,
    canPlayCallback = null;

function reqQRIDdata(id) {
    currentId = id;
    setTextContent();
}

function setTextContent() {
    if (currentId < 0) return;
    setContent(".summary", currentId + ".html");
}

function setEndMent() {
    $("#loaderMent").hide();
    $("#endMent").show();

    setCurAudio("end",
        function() {
            $("#playButton").show();
            $("#stopButton").hide();
            $("#pauseButton").hide();
            $("#endMent").hide();
            isPlay = false;
            isPaused = false;
            isByStopButton = false;
        },
        function() {
            $("#playButton").hide();
            $("#stopButton").hide();
            $("#pauseButton").hide();

            audioElement.play();
    });
}

function realContentPlay() {
    if (currentId < 0) return;

    setCurAudio(currentId, 
        function() {
            setEndMent();
        }, 
        function() {
            $("#playButton").hide();
            $("#stopButton").show();
            $("#pauseButton").show();
            audioElement.play();
            isPlay = true;
            isPaused = false;
            isByStopButton = false;
    });
}

function showLoader() {
    $("#playButton").hide();
    $("#stopButton").hide();
    $("#pauseButton").hide();
    $("#loaderMent").show();
    $("#endMent").hide();

    setCurAudio("wait",
        function () {
            isPlay = false;
            isPaused = false;
            isByStopButton = false;
            $("#loaderMent").hide();
            realContentPlay();
        }, 
        function() {
            isPlay = true;
            isPaused = false;
            isByStopButton = false;
            audioElement.play();            
    });
}

function hideLoader() {
    
}


function setCurAudio(id, fendCallback, fcanPlayCallback) {
    audioElement.pause();
    audioElement.currentTime = 0;

    audioSource.src = id + ".mp3";  
    audioElement.load();

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
        
    endCallback = fendCallback;
    canPlayCallback = fcanPlayCallback;
}

function init() {            
    audioCtx = new AudioContext();

    $("#playButton").show();
    $("#pauseButton").hide();
    $("#stopButton").hide();
    $("#loaderMent").hide();
    $("#endMent").hide();
    
    $("#playButton").click(function() {
        if (isPaused == true) {
            audioElement.play();
            isPlay = false;
            $("#playButton").hide();
            $("#stopButton").show();
            $("#pauseButton").show();
            return;
        }

        showLoader();
    });
    
    $("#stopButton").click(function() {
            isByStopButton = true;
            isPlay = false;
            isPaused = false;

            audioElement.pause();
            audioElement.currentTime = 0;

            $("#playButton").show();
            $("#stopButton").hide();
            $("#pauseButton").hide();
    });
    
    $("#pauseButton").click(function() {
        isPaused = true;
        audioElement.pause();        
        $("#pauseButton").hide();
        $("#playButton").show();
    });

    audioElement.addEventListener(
        "ended",
        () => {
            if (isByStopButton == true) {
                isByStopButton = false;
                return;
            }

            if (endCallback) endCallback()
        },
        false
    );

    audioElement.addEventListener('canplaythrough', function() {        
        
    });

    audioElement.addEventListener('loadeddata', function () {
        if (canPlayCallback) canPlayCallback()
    });

    checkParam();
}

function isSet(value) {
    if (typeof (value) === 'number')
        return true;
    if (value == "" || value == null || value == "undefined" || value == undefined)
        return false;
    return true;
}

function checkParam() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);    
	let qr_id = urlParams.get('i');

	if (isSet(qr_id)) reqQRIDdata(qr_id);
}

async function setContent(targetId, templateName) {
    let pageContent = await loadTemplate(templateName);
    $(targetId).html(pageContent);
}

async function loadTemplate(templateName) {
    const content = await fetch(templateName);
    return content.text();
}


$(function() {            
    init();
});

const audioSource = document.getElementById('audioSource');
const audioElement = document.querySelector("audio");

let audioCtx = null;
let currentId = -1;
let isPaused = false;
let isPlay = false;
let isByStopButton = false;

let endCallback = null;
let canPlayCallback = null;

async function reqQRIDdata(id) {
    currentId = id;
    await setTextContent();    
    let ptitle = $(".title").text()
    dataLayer.push({'event': 'pageview', 'page_title': ptitle });
    $("#mainLoader").hide();
}

async function setTextContent() {    
    await setContent(".summary", "text/" + currentId + ".html");
}

function showLoaderAni() {
    $(".loader_anime").show();
}

function hideLoaderAni() {
    $(".loader_anime").hide();
}

function setEndMent() {
    $("#loaderMent").hide();
    $("#endMent").show();

    let stMent = getRandomVal(1, 4);
    setCurAudio("voice/end/" + stMent,
        function() {
            $("#playButton").show();
            $("#stopButton").hide();
            $("#pauseButton").hide();
            $("#endMent").hide();
            hideLoaderAni();
            isPlay = false;
            isPaused = false;
            isByStopButton = false;
        },
        function() {
            $("#playButton").hide();
            $("#stopButton").hide();
            $("#pauseButton").hide();            
            hideLoaderAni();
            audioElement.play();
    });
}

function realContentPlay() {
    if (currentId < 0) return;

    let realData = "voice/main/" + currentId;
    setCurAudio(realData, 
        function() {
            setEndMent();
        }, 
        function() {
            $("#playButton").hide();
            $("#stopButton").show();
            $("#pauseButton").show();
            showLoaderAni();
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

    let stMent = getRandomVal(1, 3);
    setCurAudio("voice/start/" + stMent,
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

function GA_EVENT(event_name, event_target_name, event_label) {
    if (typeof gtag !== 'undefined') {
      gtag(
          'event', event_name, {
            'event_category': event_target_name,
            'event_label': event_label
          }
      );
    }
}

function init() {            
    audioCtx = new AudioContext();

    $("#playButton").show();
    $("#pauseButton").hide();
    $("#stopButton").hide();
    $("#loaderMent").hide();
    $("#endMent").hide();

    $("#qrScanBtn").click(function() {
        GA_EVENT("qrScanBtn", "click", "service");
        vibrate();
    });
    
    $("#playButton").click(function() {
        GA_EVENT("playButton", "click", "service");
        vibrate();

        if (isPaused == true) {
            audioElement.play();
            isPlay = false;
            $("#playButton").hide();
            $("#stopButton").show();
            $("#pauseButton").show();
            showLoaderAni();            
            return;
        }

        showLoader();
    });
    
    $("#stopButton").click(function() {
        GA_EVENT("stopButton", "click", "service");
        vibrate();

        isByStopButton = true;
        isPlay = false;
        isPaused = false;

        audioElement.pause();
        audioElement.currentTime = 0;

        $("#playButton").show();
        $("#stopButton").hide();
        $("#pauseButton").hide();
        hideLoaderAni();
    });
    
    $("#pauseButton").click(function() {
        GA_EVENT("pauseButton", "click", "service");
        vibrate();

        isPaused = true;
        audioElement.pause();        
        $("#pauseButton").hide();
        $("#playButton").show();
        hideLoaderAni();
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

	if (!isSet(qr_id)) qr_id = "1";

    reqQRIDdata(qr_id);    
}

async function setContent(targetId, templateName) {
    let pageContent = await loadTemplate(templateName);
    $(targetId).html(pageContent);
}

async function loadTemplate(templateName) {
    const content = await fetch(templateName);
    return content.text();
}

function vibrate() {
    const canVibrate = window.navigator.vibrate;
    if (canVibrate) window.navigator.vibrate([10,10,5,5]);
}

function getRandomVal(start, end) {
    const rand_val = Math.floor(Math.random() * end) + start;
    return rand_val;
}

$(function() {
    init();
});
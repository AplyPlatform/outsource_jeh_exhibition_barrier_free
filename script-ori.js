//////////////////////////////////////////////////////////////////////////////////////
/*
Copyright (C) 2023 APLY Inc.
 
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
 
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
 
You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>
*/
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
/*
 voice/main 경로에 [0 ~ n].mp3 파일들이 안내 멘트입니다.
 웹 주소 경로의 마지막에 parameter 값으로 선택되어 재생됩니다.

 예시 : https://eh.aplx.link/?id=1

 1.mp3 파일이 재생됩니다.
*/

// voice/start 경로에 시작 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.
// 시작 멘트 파일의 첫번째 id 입니다.
let start_ment_first_number = 1;

// 시작 멘트 파일의 마지막 id 입니다.
let start_ment_last_number = 3;


// voice/end 경로에 끝맺음 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.

// 끝맺음 멘트 파일의 첫번째 id 입니다.
let end_ment_first_number = 1;

// 끝맺음 멘트 파일의 마지막 id 입니다.
let end_ment_last_number = 4;
//////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////
let audioCtx = null;
let currentId = -1;
let isPaused = false;
let isPlay = false;
let isByStopButton = false;

let endCallback = null;
let canPlayCallback = null;

const audioSource = document.getElementById('audioSource');
const audioElement = document.querySelector("audio");


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

    let stMent = getRandomVal(end_ment_first_number, end_ment_last_number);
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

    let stMent = getRandomVal(start_ment_first_number, start_ment_last_number);
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
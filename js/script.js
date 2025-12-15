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

//  voice/main 폴더에 [0 ~ n].mp3 이름의 음성 파일들이 있습니다.
//  웹주소 경로의 마지막에 ?id=[n] 의 방법으로 입력된 [n]값에 해당하는 mp3파일을 재생합니다.
//
// - 1번 음성 파일(1.mp3) 재생 예시 : https://eh.aplx.link/?id=1
// 
const DEF_VOICE_FILE_EXT                = ".mp3";               // 음성 파일의 확장자
const DEF_VOICE_FILE_PATH               = "voice/main/";        // 설명 멘트 음성 파일 경로
const DEF_VOICE_START_PATH         = "voice/start/";       // 시작 멘트 음성 파일 경로
const DEF_VOICE_END_PATH           = "voice/end/";         // 끝맺음 멘트 음성 파일 경로

//  ment/ 폴더에 [0 ~ n].html 이름의 텍스트 설명 파일들이 있습니다.
//  [n]값에 해당하는 html파일을 읽어와 표시합니다.
//
const DEF_TEXT_MAIN_PATH                = "ment/";              // 설명 텍스트를 포함하는 HTML 파일 경로

//  voice/start 폴더에 시작 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.
//
const DEF_VOICE_START_MENT_FIRST_NUM       = 1;                    // 시작 멘트 파일의 첫번째 id 입니다.
const DEF_VOICE_START_MENT_LAST_NUM        = 4;                    // 시작 멘트 파일의 마지막 id 입니다.


//  voice/end 폴더에 끝맺음 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.
//
const DEF_VOICE_END_MENT_FIRST_NUM         = 1;                    // 끝맺음 멘트 파일의 첫번째 id 입니다.
const DEF_VOICE_END_MENT_LAST_NUM          = 5;                    // 끝맺음 멘트 파일의 마지막 id 입니다.
//////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////
let audioCtx                        = null;
let isPaused                        = false;
let isPlay                          = false;
let isByStopButton                  = false;

let endCallback                     = null;
let canPlayCallback                 = null;

let mentDuration = 0;

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

async function setTextContent(id) {
    GA_EVENT("page_show_" + id, "load", "service");
    return (await setContent(".summary", DEF_TEXT_MAIN_PATH + id + ".html"));
}

function showLoaderAni() {
    $(".loader_anime").show();
    $("#qrScanBtn").hide();
}

function hideLoaderAni() {
    $(".loader_anime").hide();
    $("#qrScanBtn").show();
}

function setEndMent() {
    $("#loaderMent").hide();
    $("#endMent").show();

    let stMent = getRandomVal(DEF_VOICE_END_MENT_FIRST_NUM, DEF_VOICE_END_MENT_LAST_NUM);
    setCurAudio(DEF_VOICE_END_PATH + stMent,
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

function mentScroll(isHow) {
    if (isHow) {
        $('.body').animate({
            scrollTop: 0
        }, 50);

        var targetOffset = $('.body')[0].scrollHeight; // Get the position relative to the parent div                        
        $('.body').animate({
            scrollTop: targetOffset
        }, mentDuration * 1500);
    }
    else {
        $('.body').stop(true, false);
    }
}

function realContentPlay(id) {
    if (id < 0) return;

    let realData = DEF_VOICE_FILE_PATH + id;
    setCurAudio(realData, 
        function() {
            setEndMent();
        }, 
        function() {
            mentDuration = audioElement.duration;            
            audioElement.play();
            mentScroll(true);
            $("#playButton").hide();
            $("#stopButton").show();
            $("#pauseButton").show();
            showLoaderAni();
            isPlay = true;
            isPaused = false;
            isByStopButton = false;
    });
}

function showMentLoader(id) {
    $("#playButton").hide();
    $("#stopButton").hide();
    $("#pauseButton").hide();
    $("#loaderMent").show();
    $("#endMent").hide();

    let stMent = getRandomVal(DEF_VOICE_START_MENT_FIRST_NUM, DEF_VOICE_START_MENT_LAST_NUM);
    setCurAudio(DEF_VOICE_START_PATH + stMent,
        function () {
            isPlay = false;
            isPaused = false;
            isByStopButton = false;
            $("#loaderMent").hide();
            realContentPlay(id);
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

    audioSource.src = id + DEF_VOICE_FILE_EXT;
    audioElement.load();

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
            
    endCallback = fendCallback;
    canPlayCallback = fcanPlayCallback;
}

async function init() {                
    let retId = checkParam();
    
    $("#qrScanBtn").click(function() {
        GA_EVENT("qrScanBtn", "click", "service");
        vibrate();
    });

    let ret = await setTextContent(retId);    
    if (ret == false) {
        $("#mainLoader").hide();
        return;
    }

    audioCtx = new AudioContext();

    $("#playButton").show();
    $("#pauseButton").hide();
    $("#stopButton").hide();
    $("#loaderMent").hide();
    $("#endMent").hide();    

    $(".summary").on('touchstart', function() {
        mentScroll(false);
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

        showMentLoader(retId);
    });
    
    $("#stopButton").click(function() {
        GA_EVENT("stopButton", "click", "service");
        vibrate();

        isByStopButton = true;
        isPlay = false;
        isPaused = false;

        audioElement.pause();
        audioElement.currentTime = 0;
        mentScroll(false);

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
        mentScroll(false);

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

    $("#mainLoader").hide();
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

    return qr_id;
}

async function setContent(targetId, templateName) {
    let pageContent = await loadTemplate(templateName);
    if (pageContent == "") {
        pageContent = "<p class='title text-center text-white'>존재하지 않는 콘텐츠입니다.</p>";
        $(targetId).html(pageContent);
        return false;
    }

    $(targetId).html(pageContent);

    return true;
}

async function loadTemplate(templateName) {
    try {
        const content = await fetch(templateName);
        if (!content.ok) return "";
        
        return content.text();
    }
    catch (error) {
        return "";
    }
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
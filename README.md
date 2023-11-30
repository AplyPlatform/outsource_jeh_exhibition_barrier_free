# 설명 음성 및 텍스트 출력

정은혜 작가 '해의 시선' 전 지원을 위한 배리어프리 서비스 코드


## script.js 파일의 변수들을 아래 내용을 참고해서 수정하세요.

## voice/main 폴더에 [1 ~ n].mp3 이름의 음성 파일들이 있습니다.

웹주소 경로의 마지막에 ?id=[n] 의 방법으로 입력된 [n]값에 해당하는 mp3파일을 재생합니다.

1번 음성 파일(1.mp3) 재생 예시 : https://eh.aplx.link/?id=1
 
const voice_file_ext                = ".mp3";               // 음성 파일의 확장자

const voice_main_path               = "voice/main/";        // 설명 멘트 음성 파일 경로

const voice_start_ment_path         = "voice/start/";       // 시작 멘트 음성 파일 경로

const voice_end_ment_path           = "voice/end/";         // 끝맺음 멘트 음성 파일 경로

## text/ 폴더에 [0 ~ n].html 이름의 텍스트 설명 파일들이 있습니다.

[n]값에 해당하는 html파일을 읽어와 표시합니다.

const text_main_path                = "text/";              // 설명 텍스트를 포함하는 HTML 파일 경로

## voice/start 폴더에 시작 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.

const start_ment_first_number       = 1;                    // 시작 멘트 파일의 첫번째 id 입니다.

const start_ment_last_number        = 3;                    // 시작 멘트 파일의 마지막 id 입니다.

## voice/end 폴더에 끝맺음 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.

const end_ment_first_number         = 1;                    // 끝맺음 멘트 파일의 첫번째 id 입니다.

const end_ment_last_number          = 4;                    // 끝맺음 멘트 파일의 마지막 id 입니다.

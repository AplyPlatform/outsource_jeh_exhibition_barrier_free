## 간단한 설명 음성 출력 및 텍스트 표시를 위한 코드

정은혜 작가 '해의 시선' 전 지원을 위해 사용한 배리어프리 서비스 코드입니다.

전시 작품의 소개나 각종 안내를 위해 음성, 텍스트를 간편하게 표현할 수 있도록 개발된 짧고 간결한 코드입니다.

서비스의 모습은 [https://eh.aplx.link] 경로에서 확인할 수 있습니다.

<br><br>
### script.js 파일의 변수들을 아래 내용을 참고해서 수정하세요.
<br><br>
### ㅁ voice/main 폴더에 [1 ~ n].mp3 이름의 음성 파일들이 있습니다.


웹주소 경로의 마지막에 ?id=[n] 의 방법으로 입력된 [n]값에 해당하는 mp3파일을 재생합니다.


1번 음성 파일(1.mp3) 재생 예시 : https://eh.aplx.link/?id=1
 
const voice_file_ext                = ".mp3";               // 음성 파일의 확장자

const voice_main_path               = "voice/main/";        // 설명 멘트 음성 파일 경로

const voice_start_ment_path         = "voice/start/";       // 시작 멘트 음성 파일 경로

const voice_end_ment_path           = "voice/end/";         // 끝맺음 멘트 음성 파일 경로


<br><br>
### ㅁ text/ 폴더에 [1 ~ n].html 이름의 텍스트 설명 파일들이 있습니다.

[n]값에 해당하는 html파일을 읽어와 표시합니다.

const text_main_path                = "text/";              // 설명 텍스트를 포함하는 HTML 파일 경로


<br><br>
### ㅁ voice/start 폴더에 시작 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.

const start_ment_first_number       = 1;                    // 시작 멘트 파일의 첫번째 id 입니다.

const start_ment_last_number        = 3;                    // 시작 멘트 파일의 마지막 id 입니다.


<br><br>
### ㅁ voice/end 폴더에 끝맺음 멘트 파일들이 존재하고 [id].mp3 파일을 임의로 선택해서 재생합니다.

const end_ment_first_number         = 1;                    // 끝맺음 멘트 파일의 첫번째 id 입니다.

const end_ment_last_number          = 4;                    // 끝맺음 멘트 파일의 마지막 id 입니다.


<br><br>
### ㅁ QR 폴더에 테스트 가능한 QR 코드 이미지 파일들이 있습니다.

QR 코드를 촬영해서 서비스의 동작모습을 확인할 수도 있습니다

Express 설치
>> npm i --save express

*package.json에 scripts속성값추가하면 
>> npm 추가한 속성값
하면 실행하고 싶은 파일을 동작시킬 수 있다.

npx - 최신버전에 해당하는 패키지를 설치하여 실행하고, 실행된 이후에 해당 패키지를 제거
1) 모듈이 업데이트 되었는지 안되었는지 확인 불가능
2) 업데이트를 진행했을 때 변동사항이 생겨 다른 프로젝트에도 영향을 끼칠 수 있음
3) create-react-app 같은 보일러플레이트에는 치명적 - react는 변동이 자주 일어나기 때문

-------------------------------------------------------------------------------------------------
View Engine
>> Nunjucks

npx nodemon -e js,html 파일명.js
>> -e js,html 옵션을 추가함으로써 변경사항에 대해 잘 감지하도록 설정

-------------------------------------------------------------------------------------------------
정적파일
>> 이미지, css, js, etc...


-------------------------------------------------------------------------------------------------
Global View Variable
>> 전역

-------------------------------------------------------------------------------------------------
body-parser
>> parsing: 데이터를 내가 원한느 형태로 '가공'하는 과정
>> parser:  parsing을 수행하는 모듈 혹은 메소드
>> HTTP post,put 요청시 req.body에 들어오는 데이터값을 읽을 수 있는 구문으로
>> 파싱함과 동시에 req.body로 입력해주어 응답 과정에서 요청에 body프로퍼티를 새로이 쓸 수 있게 해주는 미들웨어

-------------------------------------------------------------------------------------------------
REST API
>>데이터 통신 시 사용할 URL 규칙
>>GET /users => 사용자정보
>>POST /users => 사용자추가
>>GET /users/(ID) => 한명만 볼 때
>>PUT /users/(ID) => 한명 수정
>>DELETE /users/(ID) => 삭제

-------------------------------------------------------------------------------------------------
express
routing
view engine
템플릿상속
미들웨어
form(body-parser)
정적파일
Global View Variable
404,500 error handling
nunjucks marcro
express 권장구조
 - app.js
    1)app관련 express 셋팅이 다 모아져 있음
	서버를 띄우는 부분도 있고 나중에 소켓도 추가될 수 있기 때문에
	역할을 분리시켜야 한다.
    2)여러 미들웨어를 클래스화하여 관리
    
참고사이트: https://github.com/parkjunyoung/express-online


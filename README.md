(업데이트 커맨드)
npm i -g npm-check-updates
ncu -u
npm install

npm update

ID 생성 규칙 특수문자 1개

ThunderClient account 생성법 ex:

생성
http://localhost:8000/account/create
{
"username": "JohnDoe",
"email": "johndoe@example.com",
"password": "password@123"
}

삭제
http://localhost:8000//account/delete/ + 해당 uuid

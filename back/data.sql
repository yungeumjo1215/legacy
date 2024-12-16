
CREATE TABLE heritage (
  sn SERIAL PRIMARY KEY,
  no INTEGER,
  ccma_name TEXT,
  ccba_mnm1 TEXT,
  ccba_mnm2 TEXT,
  longitude TEXT,
  latitude TEXT,
  gcode_name TEXT,
  ccbaLcad TEXT,
  image_url TEXT,
  content TEXT
);

INSERT INTO heritage (
  sn, 
  no, 
  ccma_name, 
  ccba_mnm1, 
  ccba_mnm2, 
  longitude, 
  latitude, 
  gcode_name, 
  ccbaLcad, 
  image_url, 
  content
) VALUES
(1, 101, 'National Treasure', 'Sungnyemun Gate', '숭례문', '126.976958', '37.566535', 'Gate', 'Jongno-gu, Seoul', 'http://www.cha.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=11&ccbaAsno=00010000&ccbaCtcd=11', 'Sungnyemun, also known as Namdaemun, is one of the Eight Gates in the Fortress Wall of Seoul, South Korea.'),
(2, 102, 'Treasure', 'Hwangnyongsa Bell', '황룡사 종', '129.030918', '35.835302', 'Bell', 'Gyeongju, Gyeongsangbuk-do', 'http://www.cha.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=12&ccbaAsno=00020000&ccbaCtcd=12', 'The Hwangnyongsa Bell is an important historical artifact associated with the Hwangnyongsa temple.'),
(3, 103, 'Historical Site', 'Gyeongbokgung Palace', '경복궁', '126.976889', '37.579621', 'Palace', 'Jongno-gu, Seoul', 'http://www.cha.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=13&ccbaAsno=00030000&ccbaCtcd=11', 'Gyeongbokgung is the largest of the Five Grand Palaces built during the Joseon Dynasty.'),
(4, 104, 'Natural Monument', 'Jeju Volcanic Island', '제주 화산섬', '126.531188', '33.499621', 'Natural Site', 'Jeju-do', 'http://www.cha.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=14&ccbaAsno=00040000&ccbaCtcd=13', 'Jeju Volcanic Island and Lava Tubes are UNESCO World Heritage Sites.'),
(5, 105, 'Folk Material', 'Andong Mask Dance', '안동 탈춤', '128.516528', '36.568071', 'Festival', 'Andong, Gyeongsangbuk-do', 'http://www.cha.go.kr/cha/SearchKindOpenapiDt.do?ccbaKdcd=15&ccbaAsno=00050000&ccbaCtcd=12', 'The Andong Mask Dance is a traditional Korean cultural performance with historic significance.');
SELECT * FROM heritage

CREATE TABLE festival (

);

SELECT * FROM festival



///////////////////////////////////////NEWFORM////////////////////////////////////////////////////


-- Table: accounts
CREATE TABLE accounts (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'), -- Ensures a basic email format
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE -- Default is not an admin
);

ALTER TABLE accounts ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

SELECT * FROM accounts


obsolete
CREATE TABLE login_log (
    log_id SERIAL PRIMARY KEY,
    admin_uuid UUID NOT NULL REFERENCES accounts(uuid) ON DELETE CASCADE, -- Foreign key ensures valid admin
    client_uuid UUID NOT NULL REFERENCES accounts(uuid) ON DELETE CASCADE, -- Foreign key ensures valid client
    action VARCHAR(20) NOT NULL CHECK (action IN ('LOGIN', 'LOGOUT', 'UPDATE', 'DELETE')), -- Restrict to valid actions
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM login_log
-- Indexes for performance

uuid 는 개인 식별 



유저 테이블 하나만 
//----------------------------------------------------------------------------------------------------------------------------//



CREATE TABLE events (
    eventname TEXT PRIMARY KEY,        -- Unique name of the event
    eventtype TEXT NOT NULL            -- Event type (festival or heritage)
);

-- CREATE TABLE festival_details (
--     eventname TEXT PRIMARY KEY REFERENCES events(eventname) ON DELETE CASCADE, -- Linked to events
--     programContent TEXT NOT NULL,
--     startDate TEXT NOT NULL,
--     endDate TEXT NOT NULL,
--     location TEXT NOT NULL,
--     contact TEXT NOT NULL,
--     sido TEXT NOT NULL,
--     targetAudience TEXT NOT NULL
-- );

-- CREATE TABLE heritage_details (
--     eventname TEXT PRIMARY KEY REFERENCES events(eventname) ON DELETE CASCADE, -- Linked to events
--     ccbaLcad TEXT NOT NULL,
--     ccceName TEXT NOT NULL,
--     content TEXT NOT NULL,
--     imageUrl TEXT NOT NULL
-- );

CREATE TABLE festival_details (
    id SERIAL PRIMARY KEY,
    eventname TEXT UNIQUE NOT NULL,
    program_content TEXT,
    start_date DATE,
    end_date DATE,
    location TEXT,
    contact TEXT,
    sido TEXT,
    target_audience TEXT
);

CREATE TABLE heritage_details (
    id SERIAL PRIMARY KEY,
    eventname TEXT UNIQUE NOT NULL,
    ccba_lcad TEXT,
    ccce_name TEXT,
    content TEXT,
    image_url TEXT
);



-------------------------------------12_06------------------------------------
-- 참조노트 

-- https://earthteacher.tistory.com/36#google_vignette 

--  serial 이냐 uuid 이냐 참조한 링크: 

--  serial = 자동생성 넣으면 자동관리 
-- uuid = uuid 생성된 128비트의 고유 식별자로, 36자리의 숫자 문자열 형태를 표현 


--  xml2js 를사용한 파싱 : xm12js 는 문서를 모두 normalize 해서 모두 소문자로 바뀜 (주의) --



-------------------------------- 왜래키 삭제 join 버전 ----------------------------------------------
	CREATE TABLE accounts (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
    email VARCHAR(100) UNIQUE NOT NULL CHECK (email ~* '^[^@]+@[^@]+\.[^@]+$'), -- Ensures a basic email format
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE -- Default is not an admin
);

-- CREATE TABLE login_log (
--     log_id SERIAL PRIMARY KEY,
--     account_uuid UUID NOT NULL REFERENCES accounts(uuid) ON DELETE CASCADE, -- Foreign key ensures valid client
--     action VARCHAR(20) NOT NULL CHECK (action IN ('LOGIN', 'LOGOUT', 'UPDATE', 'DELETE')), -- Restrict to valid actions
--     timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );



CREATE TABLE login_log (
    log_id SERIAL PRIMARY KEY,
    admin_uuid UUID NOT NULL REFERENCES accounts(uuid) ON DELETE CASCADE, -- Foreign key ensures valid admin
    client_uuid UUID NOT NULL REFERENCES accounts(uuid) ON DELETE CASCADE, -- Foreign key ensures valid client
    action VARCHAR(20) NOT NULL CHECK (action IN ('LOGIN', 'LOGOUT', 'UPDATE', 'DELETE')), -- Restrict to valid actions
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE "festivalsearch" (
	"id" SERIAL NOT NULL,
	"acid" SERIAL NOT NULL,
	"검색연도" VARCHAR(255) NULL,
	"검색월" VARCHAR(255) NULL,
	"행사제목" VARCHAR(100) DEFAULT 'N/A' NULL,
	"행사내용" VARCHAR(255) DEFAULT 'N/A' NULL,
	"시작일" DATE NULL,
	"종료일" DATE NULL,
	"장소" VARCHAR(255) DEFAULT 'N/A' NULL,
	"문의처" VARCHAR(50) DEFAULT 'N/A' NULL,
	"이미지" VARCHAR(500) DEFAULT 'N/A' NULL,
	"방문객" VARCHAR(100) DEFAULT 'N/A' NULL,
	"추가정보" VARCHAR(255) DEFAULT 'N/A' NULL,
	PRIMARY KEY ("축제id")
);

CREATE TABLE "heritagelist" (
	"id" SERIAL NOT NULL,
	"acid" SERIAL NOT NULL,
	"장소" VARCHAR(50) DEFAULT '-' NULL,
	"제목" VARCHAR(50) DEFAULT '-' NULL,
	"내용" VARCHAR(255) DEFAULT '-' NULL,
	"이미지" VARCHAR(500) DEFAULT '-' NULL,
	PRIMARY KEY ("문화재id")
);
SELECT * FROM favoritelist

CREATE TABLE "favoritelist" (
	"id" SERIAL NOT NULL,
	"token" VARCHAR(255) NOT NULL,
	"programName" VARCHAR(200) NULL,
	"programContent" TEXT NULL,
	"location" VARCHAR(200) NULL,
	"startDate" VARCHAR(50) NULL,
	"endDate" VARCHAR(50) NULL,
	"targetAudience" VARCHAR(200) NULL,
	"contact" VARCHAR(50) NULL,
	"imageUrl" VARCHAR(500) NULL,
	"ccbamnm1" VARCHAR(255) NULL,
	"ccbalcad" VARCHAR(255) NULL,
	"content" TEXT NULL,
	"imageurl" VARCHAR(255) NULL,
	"ccce_name" VARCHAR(255) NULL,
	PRIMARY KEY ("id")
);

-------------------------------------------------------------------------
--------------------------- join 설정 연결 -------------------------------
-- 1. Join accounts with login_log
SELECT 
    a.id AS accounts_id, 
    a.username, 
    ll.action, 
    ll.timestamp
FROM 
    accounts a
JOIN 
    login_log ll 


-- 2. Join heritagesearch and accounts

SELECT 
    hs.문화재id AS heritage_id,
    hs.제목 AS heritage_title,
    hs.장소 AS location,
    hs.내용 AS description,
    hs.이미지 AS image_url,
    a.username AS accounts_username,
    a.email AS accounts_email
FROM 
    accounts a
JOIN 
    heritagesearch hs


-- 3. Join festivalsearch and accounts
    SELECT 
    fs.축제id AS festival_id, 
    fs.행사제목 AS festival_title, 
    a.username AS created_by
FROM 
    accounts a 
JOIN 
    festivalsearch fs


-- 4 Join favoritelist with heritagesearch and festivalsearch
SELECT 
    fl.id AS favorite_id, 
    hs.제목 AS heritage_title, 
    fs.행사제목 AS festival_title
FROM 
    favoritelist fl
JOIN 
    heritagesearch hs 
ON 
    CAST(hs.문화재id AS VARCHAR) = fl.문화재id AND hs.acid = fl.문화재acid
JOIN 
    festivalsearch fs 


--5 Join favoritelist and accounts
SELECT 
    fl.id AS favorite_id,
    fl.축제acid AS festival_acid,
    fl.문화재acid AS heritage_acid,
    fl.축제id AS festival_id,
    fl.문화재id AS heritage_id,
    a.username AS account_username,
    a.email AS account_email
FROM 
    accounts a
JOIN 
    favoritelist fl
-------------------------------------------------------------------------------------------
-------------- PK 초기화 및 재설정 
	ALTER TABLE login_log DROP CONSTRAINT login_log_pkey;
	ALTER TABLE login_log ADD CONSTRAINT login_log_pkey PRIMARY KEY (id);
	
	ALTER TABLE heritagesearch DROP CONSTRAINT heritagesearch_pkey;
	ALTER TABLE heritagesearch ADD CONSTRAINT heritagesearch_pkey PRIMARY KEY (문화재id);

	ALTER TABLE festivalsearch ADD CONSTRAINT festivalsearch_pkey PRIMARY KEY (일련번호);

	ALTER TABLE favoritelist DROP CONSTRAINT favoritelist_pkey;
	ALTER TABLE favoritelist ADD CONSTRAINT favoritelist_pkey PRIMARY KEY (id);
--------------------------------------------------------------------------------------

SELECT * FROM accounts
SELECT * FROM favoritelist
SELECT * FROM festivallist
SELECT * FROM heritagelist
SELECT * FROM login_log

-----------------------------------------------------12월 11일 ------------------------

Name(물리명)

CREATE TABLE에 지정하는 테이블 이름이나 열 이름.
길이 제한이 있거나 공백문자를 사용할 수 없는 등의 제약이 따름.
알파벳을 사용해 이름을 지정.

Logical Name(논리명)

설계상의 이름 (한글도 ok)
물리명 만으로는 의미가 전달되지 않는 경우도 많이 논리명이 필요.
실제로 부를 때 사용하는 이름

----------------------------------------------------------------------------------

-----------------------------------------------------12월 11일 ------------------------
-- 4. 외래키 옵션
-- 1) On Delete

--  Cascade : 부모 데이터 삭제 시 자식 데이터도 삭제 

--  Set null : 부모 데이터 삭제 시 자식 테이블의 참조 컬럼을 Null로 업데이트

--  Set default : 부모 데이터 삭제 시 자식 테이블의 참조 컬럼을 Default 값으로 업데이트

--  Restrict : 자식 테이블이 참조하고 있을 경우, 데이터 삭제 불가

--  No Action : Restrict와 동일, 옵션을 지정하지 않았을 경우 자동으로 선택된다.

 
-- 2) On Update

--  Cascade : 부모 데이터 업데이트 시 자식 데이터도 업데이트 

--  Set null : 부모 데이터 업데이트 시 자식 테이블의 참조 컬럼을 Null로 업데이트

--  Set default : 부모 데이터 업데이트 시 자식 테이블의 참조 컬럼을 Default 값으로 업데이트

--  Restrict : 자식 테이블이 참조하고 있을 경우, 업데이트 불가

--  No Action : Restrict와 동일, 옵션을 지정하지 않았을 경우 자동으로 선택된다.
-------------------------------------------------------------------------------------------
-- drop constraint 로 외래키 제거 
---------------------------------------------------------------------------------------------
-- Add account_id to favoritelist
ALTER TABLE favoritelist
ADD COLUMN account_id UUID REFERENCES accounts(uuid) ON DELETE CASCADE;

--die 
ALTER TABLE favoritelist DROP COLUMN token;

SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'favoritelist' AND constraint_type = 'FOREIGN KEY';


ALTER TABLE accounts ADD CONSTRAINT unique_email UNIQUE (email);

ALTER TABLE favoritelist ADD COLUMN email VARCHAR(100);

ALTER TABLE favoritelist
ADD CONSTRAINT fk_favoritelist_email
FOREIGN KEY (email)
REFERENCES accounts (email)
ON DELETE CASCADE;

-------------------------------data 구분법 


SELECT *
FROM favoritelist
WHERE token IS NOT NULL AND token LIKE '%test%';
  

SELECT "token"
       "programName", 
       "programContent", 
       "location", 
       "startDate", 
       "endDate", 
       "targetAudience", 
       "contact", 
       "imageUrl"
FROM favoritelist
WHERE "programName" IS NOT NULL
  AND "programContent" IS NOT NULL
  AND "location" IS NOT NULL
  AND "startDate" IS NOT NULL
  AND "endDate" IS NOT NULL
  AND "targetAudience" IS NOT NULL
  AND "contact" IS NOT NULL
  AND "token" LIKE '%test%';

  

SELECT "token",
       "ccbamnm1", 
       "ccbalcad", 
       "content", 
       "imageUrl"
FROM favoritelist
WHERE "ccbamnm1" IS NOT NULL
  AND "ccbalcad" IS NOT NULL
  AND "content" IS NOT NULL
  AND "imageUrl" IS NOT NULL
  AND "token" LIKE '%test%';




SELECT 
  fav.id AS favoriteid,
  fav.type,

  -- Festival-specific fields
  fl.festivalid,
  fl.programname AS festivalname,
  fl.programcontent AS festivalcontent,
  fl.location AS festivallocation,
  fl.startdate AS festivalstartdate,
  fl.enddate AS festivalenddate,
  fl.targetaudience AS festivaltargetaudience,
  fl.contact AS festivalcontact,
  fl.imageurl AS festivalimageurl,

  -- Heritage-specific fields
  hl.heritageid,
  hl.ccbamnm1 AS heritagename,
  hl.ccbalcad AS heritageaddress,
  hl.content AS heritagecontent,
  hl.imageurl AS heritageimageurl

FROM favoritelist AS fav
LEFT JOIN festivallist AS fl ON fav.f_id = fl.festivalid
LEFT JOIN heritagelist AS hl ON fav.h_id = hl.heritageid
WHERE fav.token = $1;

ALTER TABLE favoritelist
ADD CONSTRAINT unique_favorite_event UNIQUE (token, f_id, type),
ADD CONSTRAINT unique_favorite_heritage UNIQUE (token, h_id, type);









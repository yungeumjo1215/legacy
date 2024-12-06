
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

CREATE TABLE "account" (
	"id"	SERIAL		NOT NULL,
	"is_admin"	BOOLEAN		NULL,
	"last_login"	TIMESTAMP		NULL,
	"email"	VARCHAR(50)		NULL,
	"uuid"	VARCHAR(255)		NULL,
	"username"	VARCHAR(50)		NULL,
	"created_at"	TIMESTAMP		NULL,
	"password"	VARCHAR(255)		NOT NULL
);

CREATE TABLE "login_log" (
	"id"	SERIAL		NOT NULL,
	"acid"	VARCHAR(255)		NOT NULL,
	"uuid"	VARCHAR(255)		NULL,
	"action"	VARCHAR(10)		NULL,
	"timestamp"	TIMESTAMP		NULL
);

CREATE TABLE "festivalsearch" (
	"축제id"	SERIAL		NOT NULL,
	"acid"	VARCHAR(255)		NOT NULL,
	"검색연도"	VARCHAR(255)		NULL,
	"검색월"	VARCHAR(255)		NULL,
	"행사제목"	VARCHAR(100)	DEFAULT 'N/A'	NULL,
	"행사내용"	VARCHAR(255)	DEFAULT 'N/A'	NULL,
	"시작일"	DATE		NULL,
	"종료일"	DATE		NULL,
	"장소"	VARCHAR(255)	DEFAULT 'N/A'	NULL,
	"문의처"	VARCHAR(50)	DEFAULT 'N/A'	NULL,
	"이미지"	VARCHAR(500)	DEFAULT 'N/A'	NULL,
	"방문객"	VARCHAR(100)	DEFAULT 'N/A'	NULL,
	"추가정보"	VARCHAR(255)	DEFAULT 'N/A'	NULL
);

CREATE TABLE "heritagesearch" (
	"문화재id"	SERIAL		NOT NULL,
	"acid"	VARCHAR(255)		NOT NULL,
	"장소"	VARCHAR(50)	DEFAULT '-'	NULL,
	"제목"	VARCHAR(50)	DEFAULT '-'	NULL,
	"내용"	VARCHAR(255)	DEFAULT '-'	NULL,
	"이미지"	VARCHAR(500)	DEFAULT '-'	NULL
);

CREATE TABLE "favoriteList" (
	"id"	SERIAL		NOT NULL,
	"acid"	VARCHAR(255)		NOT NULL,
	"축제acid"	VARCHAR(255)		NOT NULL,
	"문화재acid"	VARCHAR(255)		NOT NULL,
	"축제id"	VARCHAR(255)		NOT NULL,
	"문화재id"	VARCHAR(255)		NOT NULL
);

ALTER TABLE "account" ADD CONSTRAINT "PK_ACCOUNT" PRIMARY KEY (
	"id"
);

ALTER TABLE "login_log" ADD CONSTRAINT "PK_LOGIN_LOG" PRIMARY KEY (
	"id",
	"acid"
);

ALTER TABLE "festivalsearch" ADD CONSTRAINT "PK_FESTIVALSEARCH" PRIMARY KEY (
	"축제id",
	"acid"
);

ALTER TABLE "heritagesearch" ADD CONSTRAINT "PK_HERITAGESEARCH" PRIMARY KEY (
	"문화재id",
	"acid"
);

ALTER TABLE "favoriteList" ADD CONSTRAINT "PK_FAVORITELIST" PRIMARY KEY (
	"id",
	"acid",
	"축제acid",
	"문화재acid",
	"축제id",
	"문화재id"
);

ALTER TABLE "login_log" ADD CONSTRAINT "FK_account_TO_login_log_1" FOREIGN KEY (
	"acid"
)
REFERENCES "account" (
	"id"
);

ALTER TABLE "festivalsearch" ADD CONSTRAINT "FK_account_TO_festivalsearch_1" FOREIGN KEY (
	"acid"
)
REFERENCES "account" (
	"id"
);

ALTER TABLE "heritagesearch" ADD CONSTRAINT "FK_account_TO_heritagesearch_1" FOREIGN KEY (
	"acid"
)
REFERENCES "account" (
	"id"
);

ALTER TABLE "favoriteList" ADD CONSTRAINT "FK_account_TO_favoriteList_1" FOREIGN KEY (
	"acid"
)
REFERENCES "account" (
	"id"
);

ALTER TABLE "favoriteList" ADD CONSTRAINT "FK_festivalsearch_TO_favoriteList_1" FOREIGN KEY (
	"축제acid"
)
REFERENCES "festivalsearch" (
	"acid"
);

ALTER TABLE "favoriteList" ADD CONSTRAINT "FK_festivalsearch_TO_favoriteList_2" FOREIGN KEY (
	"축제id"
)
REFERENCES "festivalsearch" (
	"축제id"
);

ALTER TABLE "favoriteList" ADD CONSTRAINT "FK_heritagesearch_TO_favoriteList_1" FOREIGN KEY (
	"문화재acid"
)
REFERENCES "heritagesearch" (
	"acid"
);

ALTER TABLE "favoriteList" ADD CONSTRAINT "FK_heritagesearch_TO_favoriteList_2" FOREIGN KEY (
	"문화재id"
)
REFERENCES "heritagesearch" (
	"문화재id"
);



-------------------------------- 왜래키 삭제 join 버전 ----------------------------------------------
CREATE TABLE "accounts" (
	"id" SERIAL NOT NULL,
	"is_admin" BOOLEAN NULL,
	"last_login" TIMESTAMP NULL,
	"email" VARCHAR(50) NULL,
	"uuid" VARCHAR(255) NULL,
	"username" VARCHAR(50) NULL,
	"created_at" TIMESTAMP NULL,
	"password" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE "login_log" (
	"id" SERIAL NOT NULL,
	"acid" VARCHAR(255) NOT NULL,
	"uuid" VARCHAR(255) NULL,
	"action" VARCHAR(10) NULL,
	"timestamp" TIMESTAMP NULL,
	PRIMARY KEY ("id", "acid")
);

CREATE TABLE "festivalsearch" (
	"축제id" SERIAL NOT NULL,
	"acid" VARCHAR(255) NOT NULL,
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
	PRIMARY KEY ("축제id", "acid")
);

CREATE TABLE "heritagesearch" (
	"문화재id" SERIAL NOT NULL,
	"acid" VARCHAR(255) NOT NULL,
	"장소" VARCHAR(50) DEFAULT '-' NULL,
	"제목" VARCHAR(50) DEFAULT '-' NULL,
	"내용" VARCHAR(255) DEFAULT '-' NULL,
	"이미지" VARCHAR(500) DEFAULT '-' NULL,
	PRIMARY KEY ("문화재id", "acid")
);
SELECT * FROM favoritelist
CREATE TABLE "favoritelist" (
	"id" SERIAL NOT NULL,
	"acid" VARCHAR(255) NOT NULL,
	"축제acid" VARCHAR(255) NOT NULL,
	"문화재acid" VARCHAR(255) NOT NULL,
	"축제id" VARCHAR(255) NOT NULL,
	"문화재id" VARCHAR(255) NOT NULL,
	PRIMARY KEY ("id", "acid", "축제acid", "문화재acid", "축제id", "문화재id")
);
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
ON 
    CAST(a.id AS VARCHAR) = ll.acid;

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
ON 
    CAST(a.id AS VARCHAR) = hs.acid;

-- 3. Join festivalsearch and accounts
    SELECT 
    fs.축제id AS festival_id, 
    fs.행사제목 AS festival_title, 
    a.username AS created_by
FROM 
    accounts a 
JOIN 
    festivalsearch fs
ON 
    CAST(a.id AS VARCHAR) = fs.acid;

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
ON 
    CAST(fs.축제id AS VARCHAR) = fl.축제id AND fs.acid = fl.축제acid;


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
ON 
    CAST(a.id AS VARCHAR) = fl.acid;

SELECT * FROM accounts
SELECT * FROM favoritelist
SELECT * FROM festivalsearch
SELECT * FROM heritagesearch
SELECT * FROM login_log
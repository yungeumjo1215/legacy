

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
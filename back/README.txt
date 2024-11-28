back/
├── controller/              # Business logic and request handling
│   ├── accountController.js    # Controller for related logic
│   ├── deleteTaskCtrl.js
│   ├── heritageController.js
│   ├── festivalController.js
│   ├── ...
│
├── routes/                  # Route definitions for each API
│   ├── accountRoutes.js    # Routes to define API endpoints
│   ├── heritageRoutes.js
│   ├── festivalRoutes.js
│   ├── ...
│
├── data/                    # Static data files (if applicable)
│   ├── heritageData.js
│   ├── festivalData.js
│   └── ...
│
├── database/                # Database connection setup
│   └── database.js
├── data.sql                 # SQL script for database setup
│
├── utils/                   # Utility functions
│   └── apiUtils.js
│
├── .gitignore               # Ignored files and folders for Git
├── package.json             # Node.js dependencies and scripts
└── README.md                # Project documentation


빨리가기 버튼 
├── http://localhost:8000/heritage  
└── http://localhost:8000/festival
└── http://localhost:8000/pgdb   (먼저 포트 8000 다죽이고 테스트하세요)
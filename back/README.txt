heritageproject/
├── app.js                      # Main application entry point
├── controllers/                # Controllers to handle route logic
│   ├── festivalController.js   # Controller for festival-related logic
│   ├── heritageController.js   # Controller for heritage-related logic
├── routes/                     # Routes to define API endpoints
│   ├── festivalRoutes.js       # Routes for festival endpoints
│   ├── heritageRoutes.js       # Routes for heritage endpoints
├── utils/                      # Utilities for shared helper functions
│   ├── apiUtils.js             # Helper functions for building URLs, etc.
├── data/                       # Mock data or SQL scripts (optional)
│   ├── data.sql                # SQL script for database setup
├── pgClient.js                 # PostgreSQL client for database connections
├── package.json                # Node.js project metadata and dependencies
├── package-lock.json           # Exact versioning of installed dependencies
├── .env                        # Environment variables for secure config
├── .gitignore                  # Specifies files to exclude from version control
└── README.md                   # Documentation for the project
@echo off
REM Leaderboard API Setup Script for Windows
REM This script helps set up the development environment

echo ================================
echo 🎮 Leaderboard API Setup Script
echo ================================

REM Check Node.js
echo.
echo Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18.x or higher.
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Check npm
echo.
echo Checking npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION% found

REM Check Docker
echo.
echo Checking Docker installation...
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('docker -v') do set DOCKER_VERSION=%%i
    echo ✅ Docker found: %DOCKER_VERSION%
    set DOCKER_AVAILABLE=true
) else (
    echo ⚠️  Docker not found. You can still run the app locally with PostgreSQL.
    set DOCKER_AVAILABLE=false
)

REM Install dependencies
echo.
echo Installing npm dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed

REM Setup environment file
echo.
if not exist .env.development (
    echo Creating .env.development from template...
    copy .env.example .env.development
    echo ✅ .env.development created
) else (
    echo ℹ️  .env.development already exists
)

REM Setup with Docker or locally
echo.
echo How would you like to set up the database?
echo 1^) Docker ^(Recommended^)
echo 2^) Local PostgreSQL
set /p choice="Enter choice [1-2]: "

if "%choice%"=="1" (
    if "%DOCKER_AVAILABLE%"=="true" (
        echo.
        echo Starting services with Docker Compose...
        docker-compose up -d
        if %ERRORLEVEL% NEQ 0 (
            echo ❌ Failed to start Docker services
            exit /b 1
        )
        echo.
        echo ✅ Services started!
        echo.
        echo Waiting for database to be ready...
        timeout /t 10 /nobreak >nul
        echo.
        echo 🚀 Setup complete!
        echo.
        echo Services running:
        echo   - API: http://localhost:3000/api
        echo   - PostgreSQL: localhost:5432
        echo.
        echo View logs: docker-compose logs -f
        echo Stop services: docker-compose down
    ) else (
        echo ❌ Docker is not available. Please install Docker or choose option 2.
        exit /b 1
    )
) else if "%choice%"=="2" (
    echo.
    echo Please ensure PostgreSQL is running locally on port 5432
    echo Database name: leaderboard
    echo Username: postgres
    echo Password: postgres
    echo.
    pause
    echo.
    echo Starting application in development mode...
    start /b npm run start:dev
    echo.
    echo ✅ Application started!
    echo.
    echo API available at: http://localhost:3000/api
) else (
    echo Invalid choice. Exiting.
    exit /b 1
)

echo.
echo 📚 Next steps:
echo   1. Test the API: curl http://localhost:3000/api/leaderboard
echo   2. Register a user: See API_EXAMPLES.md
echo   3. Read the documentation: README.md
echo.
echo Happy coding! 🎉
pause

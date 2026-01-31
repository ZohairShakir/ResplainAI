@echo off
echo Installing frontend dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd server
call npm install
cd ..

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo To start the application:
echo   1. Open Terminal 1: cd server && npm run dev
echo   2. Open Terminal 2: npm run dev
echo.

pause

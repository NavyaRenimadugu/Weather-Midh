@echo off
setlocal enabledelayedexpansion

echo Setting API Key...
if "%WEATHER_API_KEY%"=="" (
    echo ERROR: WEATHER_API_KEY environment variable not set
    echo Please set it first:
    echo   set WEATHER_API_KEY=your_api_key_here
    exit /b 1
)

echo API Key is set
echo.
echo Starting Weather API Backend...
echo Server will run on: http://localhost:8080/api
echo.

cd /d "%~dp0"
call %USERPROFILE%\.maven\bin\mvn spring-boot:run

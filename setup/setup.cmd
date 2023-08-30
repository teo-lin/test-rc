@echo off
setlocal EnableDelayedExpansion

:: MANUALLY Open Accounts on:
  :: GitHub: https://github.com 
  :: Google: https://cloud.google.com (for access to GCP - Google Cloud Platform)

:: Check if the script is running as an administrator
net session >nul 2>&1
if %errorLevel% == 1 (
    echo ERROR: This script requires administrator privileges. Please run it as an administrator and try again.
    pause
    exit /b 1
) else ( 
    echo CHECK: Running with administrator privileges 
)

:: Check internet connection
ping 8.8.8.8 -n 1 -w 1000 >nul
if %errorLevel% == 1 (
    echo ERROR: This script requires an active internet connection. Please check your internet connection and try again.
    pause
    exit /b 1
) else ( 
    echo CHECK: Internet connection OK 
)

:: Setup Winget
winget -v >nul 2>&1
if %errorlevel% == 1 (
    curl.exe -o winget.msixbundle -L https://github.com/microsoft/winget-cli/releases/latest/download/winget.msixbundle
    start /wait AppInstaller.exe /install winget.msixbundle
    del winget.msixbundle
    winget upgrade --all
    echo ENDED:
) else (
    echo CHECK: Winget is already installed
)

:: Setup Git
where git > nul
if %errorlevel% equ 0 (
    echo CHECK: Git is already installed.
) else (
    winget install Git.Git
    setx /M PATH "%PATH%;C:\Program Files\Git\bin"
    echo BEGIN: GitHub login

    :: Prompt the user for name and save the input to NAME variable
    set /p "NAME=Enter your name: "
    set /p "EMAIL=Enter your email: "
    :: Remove leading and trailing spaces from EMAIL
    for /f "tokens=* delims= " %%a in ("!EMAIL!") do set "EMAIL=%%a"
    for /f "tokens=* delims= " %%a in ("!NAME!") do set "NAME=%%a"

    :: Set Git configuration if confirmed
    git config --global user.name "!NAME!" 
    git config --global user.email "!EMAIL!" 
    git config --global core.editor "code --wait" 
    git config --global --list

    echo ENDED: GitHub login
)

:: Setup VSCode
where code > nul
if %errorlevel% equ 0 (
    echo CHECK: Visual Studio Code is already installed.
) else (
    REM Install Visual Studio Code using winget
    winget install Microsoft.VisualStudioCode

    REM Add Visual Studio Code bin directory to the system PATH
    setx /M PATH "%PATH%;%LOCALAPPDATA%\Programs\Microsoft VS Code\bin"

    REM Register "Open with VSCode" context menu command for folders
    reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\Open with VSCode\command" /ve /d "\"%LOCALAPPDATA%\\Programs\\Microsoft VS Code\\Code.exe\" \"%V%\"" /f
)
REM Install Visual Studio Code extensions
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-ossdata.vscode-postgresql
code --install-extension esbenp.prettier-vscode

:: Setup Docker
where docker > nul
if %errorlevel% equ 0 (
    echo CHECK: Docker Desktop is already installed.
) else (
    winget install Docker.DockerDesktop
    setx /M PATH "%PATH%;C:\Program Files\Docker\Docker\resources\bin;C:\ProgramData\DockerDesktop\version-bin"
)

:: Setup Postgres
where psql > nul
if %errorlevel% equ 0 (
    echo CHECK: PostgreSQL is already installed.
) else (
    REM Install PostgreSQL using winget
    winget install PostgreSQL.PostgreSQL

    REM Add PostgreSQL bin directory to system PATH
    for /f "tokens=2 delims=." %%v in ('"C:\Program Files\PostgreSQL\psql" --version ^| findstr /r /c:"[0-9]*\.[0-9]*"') do set "PG_VERSION=%%v"
    setx PATH "%PATH%;C:\Program Files\PostgreSQL\%PG_VERSION%\bin" /M

    REM Set PGDATA environment variable
    setx PGDATA "C:\Program Files\PostgreSQL\%PG_VERSION%\data" /M
)

:: Setup dBeaver
where dbeaver > nul
if %errorlevel% equ 0 (
    echo CHECK: DBeaver is already installed.
) else (
    REM Install DBeaver using winget
    winget install dbeaver.dbeaver
)

:: Setup Node.js
where node > nul
if %errorlevel% equ 0 (
    echo CHECK: Node.js is already installed.
) else (
    winget install OpenJS.NodeJS
)
setx /M PATH "%PATH%;C:\Program Files\nodejs"

:: Setup Nest.js
npm list -g @nestjs/cli > nul 2>&1
if %errorlevel% equ 0 (
    echo CHECK: @nestjs/cli is already installed.
) else (
    npm install -g @nestjs/cli
)

:: Choose project config details
set /p MY_MICROSERVICE_NAME=Enter your microservice name: 
set /p MY_DATABASE_NAME=Enter your database name (leave blank to use the same name as the microservice): 
if "%MY_DATABASE_NAME%"=="" set "MY_DATABASE_NAME=%MY_MICROSERVICE_NAME%"

:: Initiate the project
nest new %MY_MICROSERVICE_NAME%
cd %MY_MICROSERVICE_NAME%
git init

:: Install Nest TypeORM and Nest Config
npm install --save @types/dotenv dotenv'
npm install --save @nestjs/redis redis'
npm install --save @hapi/joi nyc mocha'


:: create .env file
(
echo.DB_HOST=localhost
echo.DB_PORT=
) > .env


:: create .dockerfile
(
echo.# Use the official Node.js 20 image as a base image
echo.FROM node:20
echo.
echo.# Set the working directory inside the container
echo.WORKDIR /usr/src/app
echo.
echo.# Copy package.json and package-lock.json to the container
echo.COPY package*.json ./
echo.
echo.# Install dependencies
echo.RUN npm install
echo.
echo.# Copy the rest of the application code to the container
echo.COPY . .
echo.
echo.# Expose the port the application will run on
echo.EXPOSE 3000
echo.
echo.# Command to start the application
echo.CMD [ "npm", "run", "start:prod" ]
) > .dockerfile


:: create docke-compose.yml
(
echo.version: '3'
echo.services:
echo.  my-microservice:
echo.    build: .
echo.    ports:
echo.      - '3000:3000'
) > docker-compose.yml

endlocal
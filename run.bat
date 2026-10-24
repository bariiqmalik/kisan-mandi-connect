@echo off
setlocal
echo ========================================================
echo        Launching Kisan Mandi Connect - Console App       
echo ========================================================

REM Set JAVA_HOME if not already set
if "%JAVA_HOME%"=="" set JAVA_HOME=C:\Program Files\Java\jdk-26.0.1
set PATH=%JAVA_HOME%\bin;C:\Users\Bariq Malik\tools\apache-maven-3.9.6\bin;%PATH%

cd /d "%~dp0"

REM If classes are not yet built, build them
if not exist "target\classes\com\kisan\Main.class" (
    echo Building project with Maven...
    call mvn clean compile
)

REM Run the console application
java -cp target\classes com.kisan.Main

pause

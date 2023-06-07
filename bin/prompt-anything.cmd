@echo off
set NODE_NO_WARNINGS=1
set KENV=%~dp0..
set KNODE=C:\Users\duboisst\.knode
set KIT=C:\Users\duboisst\.kit
set TARGET_PATH=C:\Users\duboisst\.kenv\kenvs\cict-scripts\scripts\prompt-anything.js

%KNODE%\bin\node.exe %KIT%\run\terminal.js %TARGET_PATH% %*

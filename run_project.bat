@echo off

echo Iniciando frontend en localhost:3000...
start cmd /k "cd frontend && npm run dev"

echo Iniciando backend en localhost:2000...
start cmd /k "cd backend && npm start"

echo Ambos servidores han sido iniciados.
pause

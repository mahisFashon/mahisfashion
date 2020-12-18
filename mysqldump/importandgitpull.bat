@echo off 
cd C:\angular-projects\mahisfashion
echo pull changes

git pull
cd C:\angular-projects\mahisfashion\mysqldump
echo import sql db

C:\MAMP\bin\mysql\bin\mysql -f --user=root --password=root mahisfashionnewdb < mahisfashionnewdb.sql
echo Done!
pause
exit
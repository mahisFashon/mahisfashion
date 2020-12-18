@echo off 
cd C:\angular-projects\mahisfashion\mysqldump
echo db dump started

C:\MAMP\bin\mysql\bin\mysqldump --insert-ignore --user=root --password=root mahisfashionnewdb > mahisfashionnewdb.sql
echo db dump done

cd C:\angular-projects\mahisfashion

echo add updated files
git add *
echo commit changes

git commit -m "latest change added in  db"

echo push changes

git push

echo Done!
pause
exit
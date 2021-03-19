cd /var/www/html/mahisfashion/mysqldump
echo db dump started

mysqldump --insert-ignore --user=root --password=root mahisfashionnewdb > mahisfashionnewdb.sql
echo db dump done

cd /var/www/html/mahisfashion/

echo add updated files
git add *
echo commit changes

git commit -m "latest change added in  db"

echo push changes

git push

echo Done!

cd /var/www/html/mahisfashion/
echo pull changes

git pull
cd /var/www/html/mahisfashion/mysqldump
echo import sql db

mysql -f --user=root --password=root mahisfashionnewdb < mahisfashionnewdb.sql
echo Done!

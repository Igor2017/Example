:: Команды аналогичные setup.sh, но для Windows.
set PGPASSWORD=postgres
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -f install.sql -U postgres
set PGPASSWORD=marcus
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -d application -f structure.sql -U marcus
"C:\Program Files\PostgreSQL\12\bin\psql.exe" -d application -f data.sql -U marcus

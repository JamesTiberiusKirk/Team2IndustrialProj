FROM mysql:8

ADD ./db_setup.sql /docker-entrypoint-initdb.d/db_setup.sql
RUN chown -R mysql:mysql /docker-entrypoint-initdb.d/

CMD ["mysqld", "--default-authentication-plugin=mysql_native_password", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]


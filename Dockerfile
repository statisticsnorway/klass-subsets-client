FROM httpd:2.4
COPY ./build/ /usr/local/apache2/htdocs/
COPY ./htaccess /usr/local/apache2/htdocs/.htaccess


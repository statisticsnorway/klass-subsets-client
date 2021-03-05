
#!/bin/sh

set -e

react-env --env /var/.env --dest /usr/share/nginx/html

exec "$@"

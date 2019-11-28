
# Working code, no build

#FROM node:latest
#COPY . /var/www
#WORKDIR /var/www
#RUN npm install
#EXPOSE 3000
#ENTRYPOINT ["npm", "start"]


# After BUILD
# with loadbalancer NGINX

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

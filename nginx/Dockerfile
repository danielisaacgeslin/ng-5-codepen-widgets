FROM nginx

RUN mkdir /home/nginx

RUN chown -R nginx /home/nginx

RUN mkdir -p /etc/nginx
ADD . /etc/nginx

EXPOSE 80
CMD service nginx start

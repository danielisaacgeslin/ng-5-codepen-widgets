FROM nginx

RUN mkdir /home/nginx

RUN chown -R nginx /home/nginx

ADD conf /etc/nginx/
RUN chown -R nginx /etc/nginx

EXPOSE 80
CMD service nginx start

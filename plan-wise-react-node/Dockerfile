FROM nikolaik/python-nodejs:latest
ENV APP_DIR /app/
WORKDIR ${APP_DIR}
COPY . ./
WORKDIR ${APP_DIR}/frontend
RUN npm install --legacy-peer-deps
RUN npm run build
WORKDIR ${APP_DIR}/backend
RUN npm install --legacy-peer-deps
EXPOSE 3000
EXPOSE 8000
CMD ["node", "app"]
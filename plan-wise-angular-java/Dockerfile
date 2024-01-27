# Gamitin ang base image na may Ubuntu
FROM ubuntu:latest
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs
RUN curl -L https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.deb -o openjdk.deb
RUN dpkg -i openjdk.deb
RUN rm openjdk.deb
WORKDIR /app
COPY . .
WORKDIR /app/frontend
RUN npm install
RUN npm run build
WORKDIR /app/backend
RUN ./gradlew build
EXPOSE 8080
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env

WORKDIR /app

COPY . ./
RUN dotnet restore

# I-build ang frontend at backend
WORKDIR /app/frontend
RUN dotnet publish -c Release -o out
WORKDIR /app/backend
RUN dotnet publish -c Release -o out


FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/backend/out .

EXPOSE 5132
ENTRYPOINT ["dotnet", "backend.dll", "--urls", "http://*:5132"]
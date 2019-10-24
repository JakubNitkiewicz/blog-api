# Khorinis API

## Get started
You must have Node.js, PostgresQL and global npm package 'sequelize-cli' installed

### Project setup
You have to rename .env.default to .env default and fill database connection setting and your secrets for JWT.
Recommended token and refresh token duration is 15 minutes and 30 days respectively and those values are set as default. Do not use the same secret for both token and refresh token.
This is the example .env file setup
```
NODE_ENV=DEVELOPMENT

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=SomethingNotStupidAndObvious
DB_NAME=khorinis

TOKEN_SECRET=VerySecretString
REFRESH_TOKEN_SECRET=AnotherVerySecretString
TOKEN_LIFE=15m
REFRESH_TOKEN_LIFE=30d
```

After you have created database specified in .env run following commands
```
npm install
sequelize db:migrate
```

### Run server
```
npm run start
```

### Telegram bot

Utiliza serverless framework y corre en AWS.

Basado en el template: https://github.com/postlight/serverless-typescript-starter

### Probar Local

1. crea un .env y agrega NODE_ENV=DEV
2. Corre: `docker-compose up` para levantar Dynamodb-local
3. Corre: `sls invoke local --function crearLineas`



# Meetup Clone

## API Guide

Read [API Guide](./backend/API-docs-Meetup.md) 

## Misc Commnas

### Heroku

- see details about all postgres databases: `heroku pg:info`
- to drop and recreate database: `heroku pg:reset`
- run migrations on heroku `heroku run npm run sequelize db:migrate`
- run seed on heroku `heroku run npm run sequelize db:seed:all` 

### Run tests
- `npx dotenv npm tests`
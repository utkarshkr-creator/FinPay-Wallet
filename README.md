# Steps to Install the Project Locally
- Clone the repo.
```
git clone 
```
- npm Install
- Run postgress either locally or on the cloud(neon.tech or aiven.io)
```
docker run  -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres 
```
- copy over all .env.example files to .env
- Go to packages/db
  - npx prisma migrate dev "new-db"
  - npx prisma db seed
  - npx prisma generate
- Go to apps/user-app
  - run `npm run dev`
- Try logging in using phone- 1111111111, password-alice (or See seed.ts file in packages/db)

# To approve OnRampTransaction
- cd `apps/bank-webhook`
- npm run dev
- Get the token for one of the OnRampTransaction by running `npx prisma studio` in `packages/db`.
- Send POST request from postman to url:`http://localhost:3003/hdfcWebhook`.
  ```
  {
    "token": "970.4572088875194",
    "user_identifier": 1,
    "amount": "210"
  }
  ```
  

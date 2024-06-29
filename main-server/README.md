# Main Server
This is the main server for code tutor it is in charge of handling requests from the student, teacher UIs and soring results from the code tutor. 
## Tech stack
1.  MongoDB 
2. Prisma 
3. Zod
4. TypeScript. 

The project makes use of a unique folder structure where REST entities are organized into modules.

## Folder Structure

```sh
project-root/
├── src/
│ ├── modules/
│ │ ├── entity/
│ │ │ ├── entity.controller.ts
│ │ │ ├── entity.router.ts
│ │ │ ├── entity.schema.ts
│ │ │ ├── entity.test.ts
│ │ │ ├── index.ts
│ │ │
│ │ └── anotherEntity/
│ │ ├── anotherEntity.controller.ts
│ │ ├── anotherEntity.router.ts
│ │ ├── anotherEntity.schema.ts
│ │ ├── anotherEntity.test.ts
│ │ ├── index.ts
│ │
│ ├── index.ts
│ ├── app.ts
│ ├── config/
│ │ ├── db.ts
│ │ 
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.ts
│ │ ├── error.middleware.ts
│ │ ├── teacher.middleware.ts
│ │
│ ├── utils/
│ ├── responseHandler.ts
│
├── .env
├── package.json
├── tsconfig.json
├── prisma/
│ ├── schema.prisma
│ ├── seed.ts
│
└── README.md
```

## Installation

### Prerequisites

- Node.js
- npm
- nvm
- typescript
- tsx

### Steps to Install

1. **Clone the repository**:
    ```sh
    git clone https://github.com/code-tutor/main-server.git
    cd main-server
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:

    ```env
    DATABASE_URL=your-database-url
    JWT_SECRET=your-jwt-secret
    USER=your-user
    PASS=your-password
    UPLOADTHING_SECRET=your-uploadthing-secret
    UPLOADTHING_APP_ID=your-uploadthing-app-id
    ```

4. **Generate Prisma Client**:
    ```sh
    npm run prisma:generate
    ```
5. **Start the development server**:
    ```sh
    npm run dev
    ```



### Creating a New Module

To create a new module, run the following script:

```sh
npm run generate:module entity-name
```

This script will create a new module with the necessary files and folder structure.

## API Endpoints
Swagger docs still being developed.
# Requirements

For Docker setup:

- Docker
- Docker Compose

For local development:

- Node.js 22+
- PostgreSQL
- npm

# Commands

|   Action     |    Command    |
|--------------|---------------|
|   **Generate Secret Key**    |   ```node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"```   |
|   **Start API Server(Dev)**    |   ```npm run dev```   |
|   **Start API Server(Prod)**    |   ```npm start```   |
|   **Create Migration**    |   ```npx sequelize-cli migration:generate --name migration-file-name-here-in-this-format```   |
|   **Run Migration**    |   ```npm run migrate```   |
|   **Create Seed**    |   ``` npx sequelize-cli seed:generate --name seeding-file-name-here-in-this-format```   |
|   **Run Seeding**    |   ```npm run seed```   |

# Setting Up
- SSH to the Linux server
- Use Git Clone to clone this repo
- Then run the below commands:
```
cd task-management-api-nodejs
sudo chmod +x docker-up.sh
./docker-up.sh
```
- Hit the URL http://<Your-Public-IP>:3333


# API Routes

## Home
>|   Action |    Request Type    |   Link    |   Request Body    |
>|----------|--------------------|-----------|-------------------|
>|   **HOME**    |   ``GET``   |   http://127.0.0.1:3333/    |  None |

## Health
>|   Action |    Request Type    |   Link    |   Request Body    |
>|----------|--------------------|-----------|-------------------|
>|   **HEALTHY**    |   ``GET``   |   http://127.0.0.1:3333/health    |  None |
>|   **READY**    |   ``GET``   |   http://127.0.0.1:3333/health/ready    |  None |

## Auth
>|   Action |    Request Type    |   Link    |   Request Body    |
>|----------|--------------------|-----------|-------------------|
>|   **LOGIN**    |   ``POST``   |   http://127.0.0.1:3333/api/v1/login    |  [JSON](#login-request-body) |

## Tasks
>|   Action |    Request Type    |   Link    |   Request Body    |
>|----------|--------------------|-----------|-------------------|
>|   **LIST**    |   ``GET``   |   http://127.0.0.1:3333/api/v1/tasks    |  None |
>|   **READ**    |   ``GET``   |   http://127.0.0.1:3333/api/v1/tasks/1    |  None |
>|   **CREATE**    |   ``POST``   |   http://127.0.0.1:3333/api/v1/tasks/    |  [JSON](#create-task-request-body) |
>|   **UPDATE**    |   ``PUT``   |   http://127.0.0.1:3333/api/v1/tasks/1    |  [JSON](#update-task-request-body) |
>|   **DELETE**    |   ``DELETE``   |   http://127.0.0.1:3333/api/v1/tasks/1    |  None |

### Pagination

```text
GET /api/v1/tasks?page=1&limit=10
```

### Search by Title

```text
GET /api/v1/tasks?search=project
```

### Filter by Status

```text
GET /api/v1/tasks?status=true
```

### Combined Example

```text
GET /api/v1/tasks?page=1&limit=10&search=project&status=true
```

# Request Bodies
## Login Request Body
```
{
    "userid": "tester",
    "password": "Pass@123789"
}
```
## Create Task Request Body
```
{
    "title": "Testing the new Task API",
    "description": "This is a test create request for TASK API"
}
```
## Update Task Request Body
```
{
    "title": "Updating the new Task API",
    "description": "This is a test update request for TASK API",
    "status": false
}
```
- **Frontend:** React (default port: `5173`)
- **Backend:** FastAPI (default port: `8000`)
- **Database:** MongoDB (default port: `27017`)
- **Database UI:** Mongo Express (default port: `8081`)

---

## Prerequisites

Before starting, make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/) (optional, for cloning the repo)

---

## Setup and Running Locally

Follow these steps to set up and run the project on your machine:

### Clone the Repository (if shared via Git):
```bash
    git clone <repository-url>
    cd <project-directory>
```

### Run the following command to build and start all services:
```bash
    docker-compose up --build
```

### Access the Services:

Once the services are running, access them at:

* Frontend: http://localhost:5173
* Backend: http://localhost:8000
* Backend documentation (existing routes):: http://localhost:8000/docs
* Mongo Express: http://localhost:8081 (login with username: admin, password: admin)
* MongoDB: Connect via a client (e.g., MongoDB Compass) at mongodb://localhost:27017


### Stop the Services:

To stop the services, press Ctrl+C in the terminal, then run:
```bash
    docker-compose down
```

To remove volumes (e.g., clear MongoDB data), use:
]
```bash
    docker-compose down -v
```

---

## Deploying to a Server

### Set Up the Server


Install Docker and Docker Compose

### Upload the Project
Via SCP:

```bash
    scp -r . user@your-server-ip:/path/to/project
```


Or clone via Git:

```bash
    git clone <repository-url>
    cd <project-directory>
```


### Configure Environment (optional)
Edit .env or docker-compose.yml for production values

Open ports in your firewall: 8000, 5173, 8081, 27017

### Run in Production Mode
```bash
    docker-compose up --build -d
    -d runs in background
```


###  Access Remotely
Replace <server-ip> with your server’s IP:

Frontend: http://<server-ip>:5173

Backend: http://<server-ip>:8000

Mongo Express: http://<server-ip>:8081
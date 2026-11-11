# BookMovies – Frontend

A React-based frontend for **BookMovies**, a full-stack movie ticket booking application. The application provides an interface for discovering movies and shows, selecting seats, managing bookings, and accessing administrative functionality.

**Live Application:** [https://bookmovies-web.vercel.app](https://bookmovies-web.vercel.app)  
**Backend Repository:** [BookMovies – Backend](https://github.com/bagadivenkatramesh/BookMovies)  
**Frontend Repository:** [BookMovies – Frontend](https://github.com/bagadivenkatramesh/BookMovies-Frontend)

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend UI development |
| Vite 8 | Development server and build tool |
| React Router 7 | Client-side routing |
| Axios | HTTP requests and backend integration |
| JavaScript | Application programming language |
| ESLint | Code quality and linting |
| Vercel | Frontend deployment |

## Features

- **User Authentication:** Registration and login.
- **JWT Integration:** Authenticated API communication using JWT tokens.
- **Movie Discovery:** Browse available movies.
- **Show Discovery:** Explore available shows.
- **Seat Selection:** Select seats while making a booking.
- **Booking Management:** Interact with the backend booking functionality.
- **Admin Management:** Access administrative functionality through protected backend APIs.
- **Client-Side Routing:** Navigate between application pages using React Router.
- **Backend Integration:** Communicate with the Spring Boot backend through Axios.

## Application Architecture

The frontend communicates with the Spring Boot backend through REST APIs.

```text
       React Application
              |
              v
       React Components
              |
              v
       Axios API Client
              |
              v
     Spring Boot REST APIs
              |
              v
         MySQL Database
```

JWT tokens are included in authenticated API requests through the Axios request interceptor.

## Backend Integration

The frontend is integrated with the separately deployed Spring Boot backend.

**Production Backend URL:**

```text
https://bookmovies-production.up.railway.app
```

The backend API base URL is configurable through an environment variable.

### Environment Variables

Create a `.env` file in the frontend project root:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

For production, the frontend uses:

```dotenv
VITE_API_BASE_URL=https://bookmovies-production.up.railway.app
```

The production environment variable is configured in Vercel.

Do not commit environment files containing private credentials.

## Local Setup

### Prerequisites

- Node.js
- npm
- Git
- A running instance of the BookMovies backend

### 1. Clone the repository

```bash
git clone https://github.com/bagadivenkatramesh/BookMovies-Frontend.git
cd BookMovies-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend URL

Create a `.env` file in the project root:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

Ensure that the backend is running and accessible at the configured URL.

### 4. Start the development server

```bash
npm run dev
```

Vite starts the frontend development server, typically at:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

### 6. Run lint checks

```bash
npm run lint
```

## Deployment

The frontend is deployed on **Vercel**, while the backend and MySQL database are hosted separately on **Railway**.

| Component | Platform |
|---|---|
| React frontend | Vercel |
| Spring Boot backend | Railway |
| MySQL database | Railway |

The frontend communicates with the deployed backend using the production API base URL configured in Vercel.

## Related Repository

[BookMovies – Spring Boot Backend](https://github.com/bagadivenkatramesh/BookMovies)
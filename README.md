# AI Notes App

A full-stack application for managing personal notes with AI-powered sentiment analysis.

## Overview

AI Notes App is a modern note-taking application that leverages AI to analyze the sentiment of your notes. Built with a React frontend and Express/Node.js backend, it provides a clean interface for creating, organizing, and analyzing personal notes.

## Features

- **User Authentication**: Secure registration and login system
- **Note Management**: Create, read, update, and delete personal notes
- **Sentiment Analysis**: AI-powered analysis to categorize notes as positive, negative, or neutral
- **Real-time Feedback**: Immediate sentiment feedback when creating or editing notes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- React Router v7
- Tailwind CSS
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Sentiment.js for natural language processing
- Winston for logging
- Express Validator for request validation

### DevOps
- Docker & Docker Compose for containerization
- MongoDB for data persistence

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Docker and Docker Compose (for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```
   git clone https://github.com/Mukhil-Padmanabhan/ai-notes-app.git
   cd ai-notes-app
   ```

2. **Backend Setup**
   ```
   cd backend
   npm install
   ```
   
   Create a `.env.local` file with these variables:
   ```
   MONGO_URI=mongodb://localhost:27017/ai-notes
   PORT=9000
   JWT_SECRET=your_secret_key
   ```

3. **Frontend Setup**
   ```
   cd frontend
   npm install
   ```
   
   Create a `.env.local` file with:
   ```
   VITE_API_URL=http://localhost:9000
   ```

4. **Start Development Servers**
   
   For backend:
   ```
   cd backend
   npm run dev
   ```
   
   For frontend:
   ```
   cd frontend
   npm run dev
   ```

### Running with MongoDB in Docker (Hybrid Approach)

If you want to run only MongoDB in Docker but run the frontend and backend locally:

1. **Start MongoDB container**
   ```
   docker run -d -p 27017:27017 --name mongo-dev mongo
   ```

2. **Run the backend and frontend locally**
   ```
   # Terminal 1
   cd frontend
   npm run dev
   
   # Terminal 2
   cd backend
   npm run dev
   ```

This approach combines the benefits of local development with a containerized database.

### Docker Deployment

1. **Using Docker Compose**
   ```
   docker-compose up --build
   ```
   
   This will build and start the MongoDB database, backend, and frontend containers.

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9000
   - API Documentation: http://localhost:9000/api-docs
2. **Github Actions**
   The workflow for the automatic Test execution can be found here https://github.com/Mukhil-Padmanabhan/ai-notes-app/actions
## API Documentation

The API is documented using Swagger UI and is available at `/api-docs` when the server is running.

### Main Endpoints

- **Authentication**
  - POST `/api/auth/register` - Register a new user
  - POST `/api/auth/login` - Login a user

- **Notes**
  - GET `/api/notes` - Get all notes for the authenticated user
  - POST `/api/notes` - Create a new note
  - PUT `/api/notes/:id` - Update a note
  - DELETE `/api/notes/:id` - Delete a note
  - GET `/api/notes/:id/analyze` - Analyze sentiment of a note

## Testing

The project includes test suites for both frontend and backend.
- Frontend and Backend tests done with over 80% coverage.
- Test Cases listed to conduct Manual Testing
- Intgration tests of the NLP module with the APIs
- Postman test suite can be found here - https://github.com/Mukhil-Padmanabhan/ai-notes-app/blob/main/AINotes.postman_collection.json 

### Backend Tests
```
cd backend
npm run test
```

### Frontend Tests
```
cd frontend
npm run test
```

## License

MIT

## Author
Mukhil Padmanabhan


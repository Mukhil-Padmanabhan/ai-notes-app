# AI Notes App

A full-stack application for managing personal notes with AI-powered sentiment analysis.

## Overview

AI Notes App is a smart, easy-to-use note-taking app that helps you stay organized while understanding how you feel. It’s built with a React frontend and an Express/Node.js backend. Just jot down your thoughts, and the app uses AI to analyze the sentiment behind your words—helping you gain insights into your emotions over time. Perfect for journaling, planning, or simply capturing your day.

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

### Running the application with Docker alone (Recommended)

1. **Using Docker Compose**
   ```
   docker compose up --build
   ```
   
   This will build and start the MongoDB database, backend, and frontend containers.

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9000
   - API Documentation: http://localhost:9000/api-docs

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
   npm i
   npm run dev
   
   # Terminal 2
   cd backend
   npm i
   npm run dev
   ```

This approach combines the benefits of local development with a containerized database.


**Github Actions**
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
- Frontend and Backend unit tests were  done with over 80% coverage.
- Test Cases listed to conduct Manual Testing.
- Intgration tests of the NLP module with the APIs.
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

## Future Improvements
- Adding provision for refreshing JWT tokens on expiry.
- Adding a logout API to blacklist the unexpired JWT tokens ( The stateless nature of JWT would no longer exist as we would need to store it in the DB. Also would need a job to periodically clear the blackisted tokens )
- Adding redis to cache notes.
- In case the amount of notes increases largely, add batched processing of the notes (Pagination / load on demand).
- Encoding the Note's content for better user privacy.
- Provision to lock notes.
- Provision to add attachments / media.
- Provision to share Notes.
- User Profile module with various customizations and settings
- To have more modular approach and for scaling ML and NLP features, have them as seperate microservice and probably use something advanced like emotion-roberta for Emotional analysis


## License

MIT

## Author
Mukhil Padmanabhan


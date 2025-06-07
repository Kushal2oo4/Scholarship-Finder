# Scholarship Finder

Scholarship Finder is a web application designed to help students find scholarships that match their qualifications, location, and field of study. The app scrapes scholarship data from various sources and provides an easy-to-use interface for users to search and apply for scholarships.

## Features

- **Scholarship Search**: Search for scholarships based on course, GPA, and location.
- **User Authentication**: Secure user registration and login functionality.
- **Real-Time Updates**: Automatically updates the scholarship database using web scraping.
- **Responsive Design**: Frontend built with a user-friendly interface for seamless navigation.

## Tech Stack

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing scholarship and user data.
- **Mongoose**: ODM for MongoDB.
- **dotenv**: For managing environment variables.
- **Web Scraping**: Custom scraper for fetching scholarship data.

### Frontend
- **React.js**: Frontend library for building the user interface.
- **Axios**: For making API requests to the backend.

### Other Tools
- **CORS**: Middleware for handling cross-origin requests.
- **Git**: Version control system for managing the project.

## Installation

### Prerequisites
- Node.js and npm installed
- MongoDB instance running
- Git installed

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/scholarship-finder.git
   cd scholarship-finder

### .env content
PORT=(your port)
MONGO_URI=(mongo database url)
JWT_SECRET=(JWT key)

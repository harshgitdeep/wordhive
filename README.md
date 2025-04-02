# WordHive - MERN Blogging Website

WordHive is a full-stack blog application built using the MERN (MongoDB, Express, React, Node.js) stack. The application allows users to create, read, update, and delete blog posts with a fully functional authentication system.

### Live : https://wordhive.vercel.app/

## Screenshot

<img width="768" alt="Screenshot 2024-05-20 091710" src="https://github.com/harshgitdeep/wordhive/assets/88957566/6a9db435-2c38-414b-858b-3d1f65f895c4">

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication and authorization with JWT
- CRUD operations for blog posts
- Responsive design using React
- Image upload functionality with Cloudinary
- RESTful API design
- Form validation on both client and server sides

## Tech Stack

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express.js, Mongoose, JWT
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **Styling**: CSS, Bootstrap

## Installation

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running
- Cloudinary account for image uploads

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/wordhive.git
   cd wordhive
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Set the following environment variables in your terminal:

   ```sh
   export MONGO_URI=your_mongodb_connection_string
   export JWT_SECRET=your_jwt_secret
   export CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   export CLOUDINARY_API_KEY=your_cloudinary_api_key
   export CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Install frontend dependencies:

   ```bash
   cd ../frontend
   npm install
   ```

2. Start the frontend development server:

   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new user or login with existing credentials.
3. Create, read, update, and delete blog posts.
4. Upload images to Cloudinary when creating or updating posts.

## Folder Structure

```bash
wordhive/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.js
    │   ├── index.js
    │   └── package.json
```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in an existing user

### Blog Posts

- `POST /api/posts`: Create a new post
- `GET /api/posts`: Get all posts
- `GET /api/posts/:id`: Get a single post by ID
- `PUT /api/posts/:id`: Update a post by ID
- `DELETE /api/posts/:id`: Delete a post by ID

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

<a href="https://wordhive.vercel.app/">
<p align="center">
  <img src="https://github.com/harshgitdeep/wordhive/assets/88957566/d62c795f-7b56-4728-bb88-e68dcc00c161" alt="c2e9cc1da429b1af111d6ad752aaaf74">
</p>
</a>

## License

This project is licensed under the MIT License. 

# Group Chat Application

This is a simple group chat application built using the MERN stack (MongoDB, Express, React, Node.js) with ES6+ features. The application supports user management, group management, and group messaging functionalities.

## Features

- **User Management**: Admins can create and edit users.
- **Authentication**: Users can register, login, and logout.
- **Group Management**: Users can create, delete, search groups, and add members to groups.
- **Group Messaging**: Users can send messages in groups and like messages.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/group-chat.git
    cd group-chat
    ```

2.  Install dependencies for both frontend and backend:
    cd backend
    npm install

        

    Set up environment variables:

3.  Set up environment variables:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
4.  Run the server:
    npm start

// Running Tests //

    cd backend
    npm test

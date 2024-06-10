
## npm install to install all the dependencies that were used in this project

## npm run dev

## here is the postman api collection link

# User Management API

This API provides endpoints for user management, including registration, login, logout, profile retrieval, profile update, and user deletion.

## Base URL
`http://localhost:8000/api/v1`

## Endpoints

### 1. Register a New User

- **URL**: `/users/register`
- **Method**: `POST`
- **Description**: Registers a new user.

#### Request Body

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}

### 2. Login User

- **URL**: `/users/login`
- **Method**: `POST`
- **Description**: Login a user.

#### Request Body

{
  "email": "john.doe@example.com",
  "password": "password123"
}

### 3. Logout User

- **URL**: `/users/logout`
- **Method**: `GET`
- **Description**: Logout the user.

### 4. Get User Details

- **URL**: `/users/getuser`
- **Method**: `GET`
- **Description**: Get User Details.

### 5. Update User Profile

- **URL**: `/users/updateprofile`
- **Method**: `PATCH`
- **Description**: Update user profile.

#### Request Body

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}

### 6. Delete User

- **URL**: `/users/delete-user`
- **Method**: `DELETE`
- **Description**: Delete the user.


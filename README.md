# 📚 Ebook REST API

A robust RESTful API backend service for managing ebooks, built with Node.js, Express, TypeScript, and MongoDB.

## ✨ Features

- 📚 Complete ebook management system
- 🔐 JWT-based authentication
- 📁 File uploads with Cloudinary storage
- 🛡️ TypeScript for type safety
- 📝 MongoDB with Mongoose ODM
- ⚡ Input validation & error handling
- 🔒 Secure password hashing with bcrypt

## 🛠️ Tech Stack

- Node.js & Express.js
- TypeScript 5.0+
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Cloudinary
- Multer
- bcrypt
- ESLint & Prettier

## 📌 API Documentation

### Authentication

#### Register User

```http
POST /api/users/register
Content-Type: application/json
```

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Responses:**

`201 Created`

```json
{
  "message": "success",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```http
POST /api/users/login
Content-Type: application/json
```

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Responses:**

`200 OK`

```json
{
  "message": "sucess",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Books

#### Create Book

```http
POST /api/books
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request:**

```json
{
  "title": "The Great Book",
  "description": "An amazing book about programming",
  "genre": "Non-Fiction",
  "coverImage": "[File Upload]",
  "bookFile": "[File Upload]"
}
```

**Responses:**

`201 Created`

```json
{
  "message": "success",
  "book": {
    "id": "507f1f77bcf86cd799439011",
    "title": "The Great Book",
    "description": "An amazing book about programming",
    "genre": "Non-Fiction",
    "coverImageUrl": "https://cloudinary.com/...",
    "file": "https://cloudinary.com/...",
    "author": "507f1f77bcf86cd799439011",
    "createdAt": "2023-10-29T10:00:00.000Z"
  }
}
```

#### Get All Books

```http
GET /api/books
```

**Response:**

`200 OK`

```json
{
  "message": "success",
  "books": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "The Great Book",
      "description": "An amazing book about programming",
      "genre": "Non-Fiction",
      "coverImageUrl": "https://cloudinary.com/...",
      "author": {
        "id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      }
    }
  ]
}
```

#### Get Single Book

```http
GET /api/books/:bookId
```

**Responses:**

`200 OK`

```json
{
  "message": "success",
  "book": {
    "id": "507f1f77bcf86cd799439011",
    "title": "The Great Book",
    "description": "An amazing book about programming",
    "genre": "Fiction",
    "coverImageUrl": "https://cloudinary.com/...",
    "bookFileUrl": "https://cloudinary.com/...",
    "author": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe"
    }
  }
}
```

#### Update Book

```http
PATCH /api/books/:bookId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**

```json
{
  "title": "Updated Title",
  "genre": "Fiction"
}
```

**Responses:**

`200 OK`

```json
{
  "message": "success",
  "book": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Updated Title",
    "genre": "Fiction"
  }
}
```

#### Delete Book

```http
DELETE /api/books/:bookId
Authorization: Bearer <token>
```

**Responses:**

`204 OK`

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB
- Cloudinary account

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ebook-api
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

CLIENT_DOMAIN=http://localhost:3000
```

4. Start development server:

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app.ts            # Express app setup
├── book/            # Book module
│   ├── bookController.ts
│   ├── bookModel.ts
│   └── bookRouter.ts
├── user/            # User module
│   ├── userController.ts
│   ├── userModel.ts
│   └── userRouter.ts
├── config/          # Configuration
├── middlewares/     # Custom middlewares
└── utils/           # Helper functions
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## ⚠️ Error Codes

- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Invalid/missing token)
- `403` - Forbidden (Not allowed)
- `404` - Not Found
- `500` - Internal Server Error

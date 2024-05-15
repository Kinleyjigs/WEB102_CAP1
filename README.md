# About this Repo 

This is a simple HTTP server built with Node.js that handles CRUD operations for a resource.

## Getting Started
## Clone this repository

```bash
git clone https://github.com/Kinleyjigs/WEB102_CAP1.git
```

## Prerequisites
- Node.js installed on your machine.

## Usage
1. Start the server by running:

```bash
node server.js
```
2. Once the server is running, you can perform CRUD operations on postman using HTTP methods (GET, POST, PUT, DELETE) on the specified endpoints.

## Endpoints
- GET /resource: Retrieve all records.
- POST /resource: Create a new resource.
- PUT /resource/:id: Update an existing resource by its ID.
- DELETE /resource/:id: Delete a resource by its ID.

## Error Handling
The server handles various error scenarios and provides appropriate error messages:

- Error reading data: This error occurs when there's an issue reading the data from the file.
- Error creating resource: This error occurs when there's an issue creating a new resource.
- Error updating resource: This error occurs when there's an issue updating an existing resource.
- Error deleting resource: This error occurs when there's an issue deleting a resource.
- Internal Server Error: This error indicates a general server error, typically when handling requests.
- Invalid JSON data: This error occurs when the JSON data provided in the request body is not valid.

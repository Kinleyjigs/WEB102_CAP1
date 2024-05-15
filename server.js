const http = require("http");
const fs = require("fs");

const PORT = 3000;
const DATA_FILE = 'data.json';

// Function to handle CRUD operations for the resource
const resourceHandler = {
    // Read operation
    read: async () => {
        try {
            const data = await fs.promises.readFile(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading data:', error);
            throw error;
        }
    },

    // Create operation
    create: async (newResource) => {
        try {
            const data = await resourceHandler.read();
            data.push(newResource);
            await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error creating resource:', error);
            throw error;
        }
    },

    // Update operation
    update: async (id, updatedResource) => {
        try {
            const data = await resourceHandler.read();
            const index = data.findIndex(resource => resource.id === id);
            if (index !== -1) {
                data[index] = { ...data[index], ...updatedResource };
                await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error('Error updating resource:', error);
            throw error;
        }
    },

    // Delete operation
    delete: async (id) => {
        try {
            const data = await resourceHandler.read();
            const updatedData = data.filter(resource => resource.id !== id);
            await fs.promises.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2));
        } catch (error) {
            console.error('Error deleting resource:', error);
            throw error;
        }
    }
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');

    // Handle different HTTP methods
    switch (req.method) {
        case 'GET':
            if (req.url === '/resource') {
                // GET /resource: Retrieve all resources
                resourceHandler.read()
                    .then((data) => {
                        res.statusCode = 200;
                        res.end(JSON.stringify(data));
                    })
                    .catch((error) => {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    });
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
            break;
        case 'POST':
            if (req.url === '/resource') {
                // POST /resource: Create a new resource
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const newResource = JSON.parse(body);
                        resourceHandler.create(newResource)
                            .then(() => {
                                res.statusCode = 201;
                                res.end(JSON.stringify({ message: 'Resource created successfully' }));
                            })
                            .catch((error) => {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                            });
                    } catch (err) {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
                    }
                });
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
            break;
        case 'PUT':
            if (req.url.startsWith('/resource/')) {
                // PUT /resource/:id: Update an existing resource by its ID
                const id = parseInt(req.url.split('/')[2]);
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    try {
                        const updatedResource = JSON.parse(body);
                        resourceHandler.update(id, updatedResource)
                            .then(() => {
                                res.statusCode = 200;
                                res.end(JSON.stringify({ message: 'Resource updated successfully' }));
                            })
                            .catch((error) => {
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                            });
                    } catch (err) {
                        res.statusCode = 400;
                        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
                    }
                });
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
            break;
        case 'DELETE':
            if (req.url.startsWith('/resource/')) {
                // DELETE /resource/:id: Delete a resource by its ID
                const id = parseInt(req.url.split('/')[2]);
                resourceHandler.delete(id)
                    .then(() => {
                        res.statusCode = 200;
                        res.end(JSON.stringify({ message: 'Resource deleted successfully' }));
                    })
                    .catch((error) => {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    });
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Endpoint not found' }));
            }
            break;
        default:
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

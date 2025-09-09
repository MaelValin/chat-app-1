import express from 'express';
import twig from 'twig';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set Twig as the view engine
app.set('view engine', 'twig');
app.set('views', `${__dirname}/views`);

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Chat Application!');
});

// Route to render the chat page
app.get('/chat', (req, res) => {
    res.render('chat', { title: 'Chat Application' });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user joining with a pseudo
    socket.on('join', (pseudo) => {
        socket.pseudo = pseudo;
        console.log(`${pseudo} joined the chat`);
    });

    socket.on('chat message', (data) => {
        io.emit('chat message', { pseudo: socket.pseudo, message: data.message });
    });

    socket.on('disconnect', () => {
        console.log(`${socket.pseudo || 'A user'} disconnected`);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
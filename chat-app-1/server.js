import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { renderFile } from 'twig';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Twig config
app.set('view engine', 'twig');
app.set('views', './views');
app.engine('twig', renderFile);

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', (req, res) => {
  res.render('index');
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  socket.on('setPseudo', (pseudo) => {
    console.log(`Pseudo défini : ${pseudo}`);
    socket.pseudo = pseudo;
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { pseudo: socket.pseudo, message: msg });
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

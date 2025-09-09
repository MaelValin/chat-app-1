const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { renderFile } = require('twig');
const path = require('path');

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
  res.render('index.twig');
});

// Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur connecté');
  
    socket.on('chat message', (data) => {
      io.emit('chat message', {
        pseudo: data.pseudo,
        message: data.message
      });
    });
  
    socket.on('disconnect', () => {
      console.log('Un utilisateur déconnecté');
    });
});  

// Lancement du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

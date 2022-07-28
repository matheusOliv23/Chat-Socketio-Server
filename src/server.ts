import express from "express";
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado ${socket.id}`);

  socket.on("join_room", (data) => {
    //evento para receber os dados do front end com a informação da sala
    socket.join(data);
    console.log(`Usuario com o ID: ${socket.id} entrou na sala ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado ${socket.id}`);
  });
});

server.listen(3001, () => console.log("Servidor funcionando"));

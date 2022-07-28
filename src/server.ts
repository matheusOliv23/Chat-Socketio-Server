import express, { Router, Request, Response } from "express";
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./models/message");
const dotenv = require("dotenv");
const route = Router();
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());
app.use(route);

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "Mensagens " });
});

// Socketio
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Estabelecer uma conexão
io.on("connection", (socket) => {
  console.log(`Usuario conectado ${socket.id}`);

  Message.find().then((result) => {
    socket.emit("output-message", result);
  });

  // Entrar na sala
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`Usuario com o ID: ${socket.id} entrou na sala ${data}`);
  });

  // enviar/receber mensagem
  socket.on("send_message", (data) => {
    const msg = new Message(data);

    //socket.to(data.room).emit("receive_message", msg);
    msg.save().then(() => {
      io.emit("receive_message", msg);
    });
  });

  socket.on("disconnect", () => {
    console.log(`Usuario desconectado ${socket.id}`);
  });
});

// Configuração para o dotenv
dotenv.config();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

// Conectar ao servidor do MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(process.env.PORT || 5000, () =>
      console.log(`Servidor rodando na porta ${process.env.PORT || 5000}!`)
    );
  })
  .catch((error) =>
    console.log("Não foi possível se conectar ao servidor: ", error)
  );

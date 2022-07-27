import express from "express";

import { Router, Request, Response } from "express";

const app = express();

const route = Router();

const http = require("http");
const cors = require("cors");

app.use(cors());

app.use(express.json());

const server = http.createServer(app);

server.listen(3333, () => "server running on port 3333");

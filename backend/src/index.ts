const express = require('express');
import { Request, Response } from "express";

const app = express();

const PORT = 3000

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get("/api/chat", (req: Request, res: Response) => {
    res.send("Hi, how may I help you today?");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
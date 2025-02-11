import express from 'express';
import cors from 'cors';
import { app, server } from './socket.io.js';

import UserRouter from './routes/user.router.js';
import ConversationRouter from './routes/conversation.router.js';
import MessageRouter from './routes/message.router.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:3000"] 
}));

// Routes
app.use('/user', UserRouter);
app.use('/conversations', ConversationRouter);
app.use('/message', MessageRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import UserRouter from './routes/user.router.js';
import ConversationRouter from './routes/conversation.router.js';
import MessageRouter from './routes/message.router.js';
    
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.use('/user',UserRouter);
app.use('/conversations',ConversationRouter);
app.use('/message',MessageRouter);


app.listen(3001);
console.log("server invoked at link http://localhost:3001");
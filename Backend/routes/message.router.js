import express from 'express';
const router  = express.Router();

import * as MessageRouter from '../controller/message.controller.js';

router.post('/save', MessageRouter.save);
router.get('/fetch/:conversationId', MessageRouter.fetch);

export default router;
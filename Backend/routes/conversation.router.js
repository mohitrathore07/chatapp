import express from "express";
const router = express.Router();

import * as conversationRouter from '../controller/conversation.controller.js';

router.post("/save" , conversationRouter.save);
router.get("/fetch/:userId" , conversationRouter.fetch);

export default router;
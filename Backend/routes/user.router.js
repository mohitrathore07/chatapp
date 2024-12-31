import express from "express";
const router = express.Router();

import * as usercontroller from '../controller/user.controller.js';

router.post("/register" , usercontroller.register);
router.post("/login" , usercontroller.login);
router.get("/fetch/:userId" , usercontroller.fetch);

export default router;
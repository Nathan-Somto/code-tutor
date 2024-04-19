import express, { Request, Response, NextFunction } from "express";
import { createuser } from "./user.controller";
import { auth } from "../../middleware/auth.middleware";

const router = express.Router();
router.use(auth);
router.post("/", createuser);
export default router;

import express from "express";
import { createtopic } from "./topic.controller";
import levelsRouter from "../level";
const router = express.Router();
router.post("/", createtopic);
router.patch("/:topicId/order");
router.use('/:topicId/levels', levelsRouter);
export default router;

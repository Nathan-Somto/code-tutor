import express from "express";
//import { createlevel } from "./level.controller";
const router = express.Router();
// teacher ui
router.get('/levels');
router.post("/quiz");
router.post("/lesson");
router.post("/code-challenge");
// student ui
router.get('/:levelId');
router.get('/:levelId/code-submissions');
export default router;

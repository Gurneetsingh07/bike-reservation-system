import express from "express";
import {addBike} from "../controllers/bikeControllers.js"


const router = express.Router();

router.post("/", addBike);
export default router;
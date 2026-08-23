import express from "express";
import { addBike, updateBike, deleteBike, getBikes } from "../controllers/bikeControllers.js"
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js"


const router = express.Router();
router.get("/", authenticate, getBikes)
router.post("/", authenticate, authorizeRoles("manager"), addBike);
router.put("/:id", authenticate, authorizeRoles("manager"), updateBike);
router.delete("/:id", authenticate, authorizeRoles("manager"), deleteBike)
export default router;
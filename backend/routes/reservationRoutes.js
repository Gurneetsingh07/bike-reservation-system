import express from "express";
import { cancelReservation, createReservation, rateReservation,getReservationsByBike } from "../controllers/reservationControllers.js"
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reserve", authenticate, createReservation);
router.patch("/cancel/:reservationId", authenticate, cancelReservation)
router.patch("/rate/:reservationId",authenticate,rateReservation);
router.get("/bike/:bikeId", authenticate, authorizeRoles("manager"), getReservationsByBike);


export default router;

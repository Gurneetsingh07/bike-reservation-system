import express from "express";
import { cancelReservation, createReservation, rateReservation,getReservationsByBike ,getReservations} from "../controllers/reservationControllers.js"
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/reserve", authenticate, createReservation);
router.get("/my", authenticate, getReservations);
router.patch("/cancel/:reservationId", authenticate, cancelReservation)
router.patch("/rate/:reservationId",authenticate,rateReservation);
router.get("/bike/:bikeId", authenticate, authorizeRoles("manager"), getReservationsByBike);


export default router;

import express from "express"
import { login, signup, logout, updateUser, deleteUser, createUser,getUsers } from "../controllers/userControllers.js"
import {
    authenticate,
    authorizeRoles
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post( "/",authenticate,authorizeRoles("manager"),createUser);
router.put("/:id",authenticate,authorizeRoles("manager"),updateUser);
router.delete("/:id",authenticate,authorizeRoles("manager"),deleteUser);
router.get("/",authenticate,authorizeRoles("manager"),getUsers)

export default router;

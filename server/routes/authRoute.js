import { Router } from "express";
import { changePassword, login, Session } from "../controllers/authController";
import { protect } from "../middleware/auth";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/session', protect, Session);
authRouter.post('/change-password', protect, changePassword);

export default authRouter;
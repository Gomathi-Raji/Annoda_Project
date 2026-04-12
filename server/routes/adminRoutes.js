import express from "express";
import {
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  requireAdminAuth
} from "../config/adminAuth.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", requireAdminAuth, getAdminSession);
router.post("/logout", requireAdminAuth, logoutAdmin);

export default router;
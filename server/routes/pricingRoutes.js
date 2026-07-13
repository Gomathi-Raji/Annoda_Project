import express from "express";
import { getPricing, updatePricing } from "../controllers/pricingController.js";
import { requireAdminAuth } from "../config/adminAuth.js";

const router = express.Router();

router.get("/", getPricing);
router.put("/", requireAdminAuth, updatePricing);

export default router;

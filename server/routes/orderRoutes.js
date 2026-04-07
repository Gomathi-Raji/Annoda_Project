import express from "express";
import { requireAdminAuth } from "../config/adminAuth.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").post(createOrder).get(requireAdminAuth, getAllOrders);
router.route("/:id").get(requireAdminAuth, getOrderById).put(requireAdminAuth, updateOrderStatus);

export default router;
import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").post(createOrder).get(getAllOrders);
router.route("/:id").get(getOrderById).put(updateOrderStatus);

export default router;
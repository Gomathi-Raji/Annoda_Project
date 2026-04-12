import express from "express";
import { requireAdminAuth } from "../config/adminAuth.js";
import {
  exportOrdersCsv,
  exportOrdersExcel,
  exportOrdersPdf
} from "../controllers/exportController.js";

const router = express.Router();

router.get("/csv", requireAdminAuth, exportOrdersCsv);
router.get("/excel", requireAdminAuth, exportOrdersExcel);
router.get("/pdf", requireAdminAuth, exportOrdersPdf);

export default router;
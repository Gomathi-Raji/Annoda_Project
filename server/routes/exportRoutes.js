import express from "express";
import {
  exportOrdersCsv,
  exportOrdersExcel,
  exportOrdersPdf
} from "../controllers/exportController.js";

const router = express.Router();

router.get("/csv", exportOrdersCsv);
router.get("/excel", exportOrdersExcel);
router.get("/pdf", exportOrdersPdf);

export default router;
import { Router } from "express";
import * as locationControllers from "../controllers/locationControllers";

const router = Router();

router.get("/countries", locationControllers.getCountries);
router.post("/regions", locationControllers.getRegions);
router.post("/cities", locationControllers.getCities);

export default router;

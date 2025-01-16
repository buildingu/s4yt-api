import { Router } from "express";
import * as locationControllers from "../controllers/locationControllers";

const router = Router();

router.post("/cities", locationControllers.getCities);
router.get("/countries", locationControllers.getCountries);
router.post("/regions", locationControllers.getRegions);

export default router;

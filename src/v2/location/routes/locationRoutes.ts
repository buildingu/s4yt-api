import { Router } from "express";
import * as locationControllers from "../controllers/locationControllers";

const router = Router();

router.get("/getCities", locationControllers.getCities);
router.get("/getCountry", locationControllers.getCountry);
router.get("/getRegion", locationControllers.getRegion);

export default router;

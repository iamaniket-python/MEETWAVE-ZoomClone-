import { Router } from "express";
import { addToHistory, getUserHistory, authentication } from "../controllers/UserAuthentication.js";
import { register } from "../controllers/UserAuthentication.js";

const router =Router();

router.route("/signin").post(signin)
router.route('/register').post(register)
router.route("/add_to_activity").post(addToHistory)
router.route('/get_all_activity').get(getUserHistory)


export default router;
import { Router } from "express";
const router = Router();
router.post("/signin", (req, res) => {
  console.log("herere");

  res.json("ok");
});
export default router;

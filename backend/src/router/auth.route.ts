import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
  console.log("herere");

  res.json("ok");
});
export default router;

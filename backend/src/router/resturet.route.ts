import { restaurantSchema } from "./../schema/resturent.schema";
import { RestaurantServices } from "@/services/implementation/resturent.services";
import { Router } from "express";
import { uploads } from "@/config";
import { RestaurantController } from "@/controller/resturent.controller";
const router = Router();
const restaurantService = new RestaurantServices();
const restaurantCotnroller = new RestaurantController(restaurantService);
import varifyTocken from "@/middleware/varify-tocken";
import { validate } from "@/middleware/validate.middleware";
import { updateRestaurantSchema } from "@/schema/resturent.update.schema";
router.get("/", restaurantCotnroller.getRestaurent.bind(restaurantCotnroller));
router.post(
  "/add",
  uploads.array("images", 6),
  validate(restaurantSchema),
  varifyTocken("user"),
  restaurantCotnroller.addRestaurent.bind(restaurantCotnroller)
);
router.put(
  "/update/:resturentid",
  uploads.array("images", 6),
  validate(updateRestaurantSchema),
  varifyTocken("user"),
  restaurantCotnroller.updateRestaurent.bind(restaurantCotnroller)
);
router.get(
  "/my-restaurant",
  varifyTocken("user"),
  restaurantCotnroller.getMyResturents.bind(restaurantCotnroller)
);
router.get("/:id", restaurantCotnroller.getById.bind(restaurantCotnroller));
router.delete(
  "/:id",
  varifyTocken("user"),
  restaurantCotnroller.deleteRestaurent.bind(restaurantCotnroller)
);

export default router;

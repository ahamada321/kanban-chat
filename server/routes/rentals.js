const express = require("express");
const router = express.Router();

const UserCtrl = require("./controllers/user");
const RentalCtrl = require("./controllers/rental");

router.get(
  "/favourite",
  UserCtrl.authMiddleware,
  RentalCtrl.getUserFavouriteRentals
);

router.get(
  "/favourite/:id",
  UserCtrl.authMiddleware,
  RentalCtrl.toggleFavourite
);

router.get("/manage", UserCtrl.authMiddleware, RentalCtrl.getOwnerRentals);

router.get("/:id", RentalCtrl.getRentalById);

router.delete("/:id", UserCtrl.authMiddleware, RentalCtrl.deleteRental);

router.patch("/:id", UserCtrl.authMiddleware, RentalCtrl.updateRental);

router.post("/create", UserCtrl.authMiddleware, RentalCtrl.createRental);

router.post("", RentalCtrl.getRentals);

module.exports = router;

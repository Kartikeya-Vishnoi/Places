const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../Middleware/file-upload")

const placesControllers = require("../controllers/places-controller");
const checkAuth = require("../Middleware/check-auth");

const router = express.Router();


router.get("/:pid", placesControllers.getPlaceById);
router.get("/user/:uid", placesControllers.getPlacesByUserId);

//Protection route, it validates the incoming requests to access protected paths 
router.use(checkAuth)

router.post(
  "/",
  fileUpload.single('image'),
  //fileUpload ek multer object ko return karta hai jo ki ek group of middlewares hote hain,
  //fileUpload.single unhi middlewares mein se ek hai
  //'image' key batati hai ki file upcoming request mein kis key se mapped hai, here i.e is 'image'
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);
router.patch(
  "/:pid",
  [
    check("title").not().isEmpty(), 
    check("description").isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
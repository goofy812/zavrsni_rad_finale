const express = require("express");
const router = express.Router();
const controller = require("../controllers/korisniciController");
const { authenticate, isAdmin } = require("../middleware/auth");
router.get("/check/:id", controller.checkAdmin);
router.get("/", authenticate, isAdmin, controller.getAdmins);
router.post("/:id", authenticate, isAdmin, controller.addAdmin);
router.delete("/:id", authenticate, isAdmin, controller.removeAdmin);
module.exports = router;

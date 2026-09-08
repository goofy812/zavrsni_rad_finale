const express = require("express");
const router = express.Router();
const controller = require("../controllers/korisniciController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.get("/", authenticate, isAdmin, controller.getAll);
router.get("/:id", authenticate, controller.getOne);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.delete);
router.post("/", authenticate, isAdmin, controller.create);
module.exports = router;

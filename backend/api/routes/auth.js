const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/prijava", authController.login);
router.post("/registracija", authController.register);

module.exports = router;

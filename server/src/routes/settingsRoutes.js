"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsController_1 = require("../controllers/settingsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', settingsController_1.getSettings);
router.put('/', auth_1.protect, auth_1.adminOnly, settingsController_1.updateSettings);
exports.default = router;

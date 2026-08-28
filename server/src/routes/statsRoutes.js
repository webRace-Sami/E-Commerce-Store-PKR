"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = require("../controllers/statsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/admin', auth_1.protect, auth_1.adminOnly, statsController_1.getAdminStats);
exports.default = router;

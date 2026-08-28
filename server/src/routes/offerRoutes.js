"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const offerController_1 = require("../controllers/offerController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public: Get active promo offers
router.get('/', offerController_1.getActiveOffers);
// Admin-only protected routes
router.get('/all', auth_1.protect, auth_1.adminOnly, offerController_1.getAllOffers);
router.post('/', auth_1.protect, auth_1.adminOnly, offerController_1.createOffer);
router.put('/:id', auth_1.protect, auth_1.adminOnly, offerController_1.updateOffer);
router.delete('/:id', auth_1.protect, auth_1.adminOnly, offerController_1.deleteOffer);
exports.default = router;

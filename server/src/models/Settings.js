"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const settingsSchema = new mongoose_1.Schema({
    storeName: { type: String, default: 'SM*Store' },
    adminEmail: { type: String, default: 'samiullahnawaz942@gmail.com' },
    phone: { type: String, default: '+92 300 1234567' },
    shippingFee: { type: Number, default: 350 },
    freeShippingThreshold: { type: Number, default: 50000 },
    taxRate: { type: Number, default: 0 },
    currency: { type: String, default: 'PKR' },
    address: { type: String, default: 'Karachi, Pakistan' }
}, { timestamps: true });
exports.SettingsModel = mongoose_1.default.model('Settings', settingsSchema);

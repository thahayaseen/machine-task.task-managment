"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    get PORT() {
        console.log(process.env.PORT);
        return process.env.PORT || 4000;
    },
    get MONGO_URL() {
        return process.env.MONGO_URL;
    }
};
//# sourceMappingURL=env.config.js.map
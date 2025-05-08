"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const env_config_1 = require("./config/env.config");
const mongo_config_1 = require("./config/mongo.config");
console.log(env_config_1.env.PORT, 'nums is');
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongo_config_1.connectDB)();
    app.listen(env_config_1.env.PORT, () => {
        console.log("Server started at " + env_config_1.env.PORT);
    });
});
startServer();
//# sourceMappingURL=index.js.map
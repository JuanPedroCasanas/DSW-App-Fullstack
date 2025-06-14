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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var express_1 = require("express");
var core_1 = require("@mikro-orm/core");
var db_1 = require("./orm/db");
var cors_1 = require("cors");
var Occupation_1 = require("./model/entities/Occupation");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var port = 3000;
app.use(function (req, res, next) {
    core_1.RequestContext.create((0, db_1.getORM)().em, next);
});
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.post('/addOccupation', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, occupation, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = req.body.name;
                if (!name) {
                    return [2 /*return*/, res.status(400).json({ message: 'Name is required' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                occupation = new Occupation_1.Occupation(name);
                return [4 /*yield*/, (0, db_1.getORM)().em.persistAndFlush(occupation)];
            case 2:
                _a.sent();
                res.status(201).json({ message: 'Occupation added', occupation: occupation });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res.status(500).json({ message: 'Failed to add occupation' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/getOccupations', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var occupations, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_1.getORM)().em.find(Occupation_1.Occupation, {})];
            case 1:
                occupations = _a.sent();
                res.json(occupations);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error(error_2);
                res.status(500).json({ message: 'Failed to fetch occupations' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.use(function (_, res) {
    return res.status(404).send({ message: 'Resource not found' });
});
function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.initORM)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, db_1.syncSchema)()];
                case 2:
                    _a.sent(); // ⚠️Don't use this in production
                    app.listen(port, function () {
                        console.log("App listening on http://localhost:".concat(port));
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start().catch(function (err) {
    console.error('Failed to start app:', err);
});

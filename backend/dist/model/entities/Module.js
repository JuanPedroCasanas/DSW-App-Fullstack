"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const core_1 = require("@mikro-orm/core");
const Professional_1 = require("./Professional");
const ConsultingRoom_1 = require("./ConsultingRoom");
const ModuleType_1 = require("./ModuleType");
let Module = class Module {
};
exports.Module = Module;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Module.prototype, "idModule", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Module.prototype, "day", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Module.prototype, "startTime", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], Module.prototype, "validMonth", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Professional_1.Professional),
    __metadata("design:type", Professional_1.Professional)
], Module.prototype, "professional", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => ConsultingRoom_1.ConsultingRoom),
    __metadata("design:type", ConsultingRoom_1.ConsultingRoom)
], Module.prototype, "consultingRoom", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => ModuleType_1.ModuleType),
    __metadata("design:type", ModuleType_1.ModuleType)
], Module.prototype, "moduleType", void 0);
exports.Module = Module = __decorate([
    (0, core_1.Entity)()
], Module);
//# sourceMappingURL=Module.js.map
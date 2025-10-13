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
exports.ModuleType = void 0;
const core_1 = require("@mikro-orm/core");
const Module_1 = require("./Module");
// Tipo de módulo
// id, nombre, duracion en horas
let ModuleType = class ModuleType {
    constructor(name, duration) {
        this.modules = new core_1.Collection(this);
        this.name = name;
        this.duration = duration;
    }
};
exports.ModuleType = ModuleType;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], ModuleType.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], ModuleType.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
], ModuleType.prototype, "duration", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Module_1.Module, module => module.moduleType),
    __metadata("design:type", Object)
], ModuleType.prototype, "modules", void 0);
exports.ModuleType = ModuleType = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, Number])
], ModuleType);
//# sourceMappingURL=ModuleType.js.map
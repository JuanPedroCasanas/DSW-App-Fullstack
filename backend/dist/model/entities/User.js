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
exports.User = void 0;
const core_1 = require("@mikro-orm/core");
const core_2 = require("@mikro-orm/core");
const LegalGuardian_1 = require("./LegalGuardian");
const Patient_1 = require("./Patient");
const Professional_1 = require("./Professional");
const UserRole_1 = require("../enums/UserRole");
let User = class User {
    checkRole() {
        if (!this.patient && !this.legalGuardian && !this.professional) {
            throw new Error("El usuario debe tener al menos un rol asignado.");
        }
    }
};
exports.User = User;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], User.prototype, "idUser", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "mail", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, core_1.Enum)(() => UserRole_1.UserRole),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, core_2.OneToOne)(() => Patient_1.Patient, { nullable: true }),
    __metadata("design:type", Patient_1.Patient)
], User.prototype, "patient", void 0);
__decorate([
    (0, core_2.OneToOne)(() => LegalGuardian_1.LegalGuardian, { nullable: true }),
    __metadata("design:type", LegalGuardian_1.LegalGuardian)
], User.prototype, "legalGuardian", void 0);
__decorate([
    (0, core_2.OneToOne)(() => Professional_1.Professional, { nullable: true }),
    __metadata("design:type", Professional_1.Professional)
], User.prototype, "professional", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    (0, core_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "checkRole", null);
exports.User = User = __decorate([
    (0, core_1.Entity)()
], User);
//# sourceMappingURL=User.js.map
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
    assignAndCheckRole() {
        if (this.patient)
            this.role = UserRole_1.UserRole.Patient;
        else if (this.legalGuardian)
            this.role = UserRole_1.UserRole.LegalGuardian;
        else if (this.professional)
            this.role = UserRole_1.UserRole.Professional;
        else
            throw new Error("El usuario debe tener al menos un rol asignado.");
    }
    constructor(mail, password) {
        this.mail = mail;
        this.password = password;
        this.isActive = true;
    }
};
exports.User = User;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "mail", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, core_1.Enum)(() => UserRole_1.UserRole),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, core_2.OneToOne)(() => Professional_1.Professional, (p) => p.user, { owner: true, nullable: true, cascade: [core_1.Cascade.PERSIST] }),
    __metadata("design:type", Professional_1.Professional)
], User.prototype, "professional", void 0);
__decorate([
    (0, core_2.OneToOne)(() => Patient_1.Patient, (p) => p.user, { owner: true, nullable: true, cascade: [core_1.Cascade.PERSIST] }),
    __metadata("design:type", Patient_1.Patient)
], User.prototype, "patient", void 0);
__decorate([
    (0, core_2.OneToOne)(() => LegalGuardian_1.LegalGuardian, (lg) => lg.user, { owner: true, nullable: true, cascade: [core_1.Cascade.PERSIST] }),
    __metadata("design:type", LegalGuardian_1.LegalGuardian)
], User.prototype, "legalGuardian", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    (0, core_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "assignAndCheckRole", null);
exports.User = User = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String])
], User);
//# sourceMappingURL=User.js.map
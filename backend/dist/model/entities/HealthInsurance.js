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
exports.HealthInsurance = void 0;
const core_1 = require("@mikro-orm/core");
const Appointment_1 = require("./Appointment");
const Professional_1 = require("./Professional");
const Patient_1 = require("./Patient");
const core_2 = require("@mikro-orm/core");
const LegalGuardian_1 = require("./LegalGuardian");
let HealthInsurance = class HealthInsurance {
    constructor(name) {
        this.appointments = new core_2.Collection(this);
        this.professionals = new core_2.Collection(this);
        this.patients = new core_2.Collection(this);
        this.legalGuardians = new core_2.Collection(this);
        this.name = name;
        this.isActive = true;
    }
};
exports.HealthInsurance = HealthInsurance;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], HealthInsurance.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Boolean)
], HealthInsurance.prototype, "isActive", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], HealthInsurance.prototype, "name", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Appointment_1.Appointment, appointment => appointment.healthInsurance),
    __metadata("design:type", Object)
], HealthInsurance.prototype, "appointments", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Professional_1.Professional, professional => professional.healthInsurances),
    __metadata("design:type", Object)
], HealthInsurance.prototype, "professionals", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Patient_1.Patient, patient => patient.healthInsurance),
    __metadata("design:type", Object)
], HealthInsurance.prototype, "patients", void 0);
__decorate([
    (0, core_1.OneToMany)(() => LegalGuardian_1.LegalGuardian, legalGuardian => legalGuardian.healthInsurance),
    __metadata("design:type", Object)
], HealthInsurance.prototype, "legalGuardians", void 0);
exports.HealthInsurance = HealthInsurance = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String])
], HealthInsurance);
//# sourceMappingURL=HealthInsurance.js.map
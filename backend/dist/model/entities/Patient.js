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
exports.Patient = void 0;
const core_1 = require("@mikro-orm/core");
const Appointment_1 = require("./Appointment");
const core_2 = require("@mikro-orm/core");
const HealthInsurance_1 = require("./HealthInsurance");
let Patient = class Patient {
    constructor(name) {
        this.appointments = new core_2.Collection(this);
        this.healthInsurances = new core_2.Collection(this);
        this.dependents = new core_2.Collection(this);
        this.firstName = name;
    }
};
exports.Patient = Patient;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Patient.prototype, "idPatient", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Patient.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Patient.prototype, "lastName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], Patient.prototype, "birthdate", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Patient.prototype, "telephone", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Patient.prototype, "mail", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Patient.prototype, "type", void 0);
__decorate([
    (0, core_2.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.patient),
    __metadata("design:type", Object)
], Patient.prototype, "appointments", void 0);
__decorate([
    (0, core_2.ManyToMany)(() => HealthInsurance_1.HealthInsurance, (healthInsurance) => healthInsurance.patients, { owner: true }),
    __metadata("design:type", Object)
], Patient.prototype, "healthInsurances", void 0);
__decorate([
    (0, core_2.ManyToOne)(() => Patient, { nullable: true }),
    __metadata("design:type", Patient)
], Patient.prototype, "legalGuardian", void 0);
__decorate([
    (0, core_2.OneToMany)(() => Patient, (patient) => patient.legalGuardian),
    __metadata("design:type", Object)
], Patient.prototype, "dependents", void 0);
exports.Patient = Patient = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String])
], Patient);
//# sourceMappingURL=Patient.js.map
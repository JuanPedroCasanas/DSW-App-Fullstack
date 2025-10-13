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
exports.Appointment = void 0;
const core_1 = require("@mikro-orm/core");
const Professional_1 = require("./Professional");
const Patient_1 = require("./Patient");
const HealthInsurance_1 = require("./HealthInsurance");
const LegalGuardian_1 = require("./LegalGuardian");
const AppointmentStatus_1 = require("../enums/AppointmentStatus");
const Module_1 = require("./Module");
let Appointment = class Appointment {
    constructor(module, startTime, endTime, professional, status, healthInsurance, patient, legalGuardian) {
        this.module = module;
        this.startTime = startTime;
        this.endTime = endTime;
        this.professional = professional;
        this.patient = patient;
        this.healthInsurance = healthInsurance;
        this.legalGuardian = legalGuardian;
        this.status = status;
    }
};
exports.Appointment = Appointment;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp without time zone' }),
    __metadata("design:type", Date)
], Appointment.prototype, "startTime", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'timestamp without time zone' }) //Calculado, siempre será startTime + 1 hora
    ,
    __metadata("design:type", Date)
], Appointment.prototype, "endTime", void 0);
__decorate([
    (0, core_1.Enum)(() => AppointmentStatus_1.AppointmentStatus),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", Module_1.Module)
], Appointment.prototype, "module", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", Professional_1.Professional)
], Appointment.prototype, "professional", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Patient_1.Patient, { nullable: true }),
    __metadata("design:type", Patient_1.Patient)
], Appointment.prototype, "patient", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => LegalGuardian_1.LegalGuardian, { nullable: true }),
    __metadata("design:type", LegalGuardian_1.LegalGuardian)
], Appointment.prototype, "legalGuardian", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => HealthInsurance_1.HealthInsurance, { nullable: true }),
    __metadata("design:type", HealthInsurance_1.HealthInsurance)
], Appointment.prototype, "healthInsurance", void 0);
exports.Appointment = Appointment = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Module_1.Module, Date, Date, Professional_1.Professional, String, HealthInsurance_1.HealthInsurance, Patient_1.Patient, LegalGuardian_1.LegalGuardian])
], Appointment);
//# sourceMappingURL=Appointment.js.map
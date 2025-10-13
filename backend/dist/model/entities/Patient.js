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
const LegalGuardian_1 = require("./LegalGuardian");
const User_1 = require("./User");
let Patient = class Patient {
    constructor(firstName, lastName, birthdate, healthInsurance, telephone, legalGuardian) {
        this.appointments = new core_2.Collection(this);
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.telephone = telephone;
        this.legalGuardian = legalGuardian;
        this.healthInsurance = healthInsurance;
        this.isActive = true;
    }
};
exports.Patient = Patient;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Patient.prototype, "id", void 0);
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
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "telephone", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Boolean)
], Patient.prototype, "isActive", void 0);
__decorate([
    (0, core_2.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.patient),
    __metadata("design:type", Object)
], Patient.prototype, "appointments", void 0);
__decorate([
    (0, core_2.ManyToOne)(() => HealthInsurance_1.HealthInsurance),
    __metadata("design:type", HealthInsurance_1.HealthInsurance)
], Patient.prototype, "healthInsurance", void 0);
__decorate([
    (0, core_2.ManyToOne)(() => LegalGuardian_1.LegalGuardian, { nullable: true }),
    __metadata("design:type", LegalGuardian_1.LegalGuardian)
], Patient.prototype, "legalGuardian", void 0);
__decorate([
    (0, core_2.OneToOne)(() => User_1.User, (u) => u.patient),
    __metadata("design:type", User_1.User)
], Patient.prototype, "user", void 0);
exports.Patient = Patient = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Date, HealthInsurance_1.HealthInsurance, String, LegalGuardian_1.LegalGuardian])
], Patient);
//# sourceMappingURL=Patient.js.map
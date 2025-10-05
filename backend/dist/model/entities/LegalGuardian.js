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
exports.LegalGuardian = void 0;
const core_1 = require("@mikro-orm/core");
const Appointment_1 = require("./Appointment");
const core_2 = require("@mikro-orm/core");
const Patient_1 = require("./Patient");
const User_1 = require("./User");
let LegalGuardian = class LegalGuardian {
    constructor(firstName, lastName, birthdate, telephone, mail) {
        this.appointments = new core_2.Collection(this);
        //@ManyToMany(() => HealthInsurance, (healthInsurance: HealthInsurance) => healthInsurance.patients, {owner: true})
        //healthInsurances = new Collection<HealthInsurance>(this);
        this.guardedPatients = new core_2.Collection(this);
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.telephone = telephone;
        this.mail = mail;
    }
};
exports.LegalGuardian = LegalGuardian;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], LegalGuardian.prototype, "idLegalGuardian", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], LegalGuardian.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], LegalGuardian.prototype, "lastName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], LegalGuardian.prototype, "birthdate", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], LegalGuardian.prototype, "telephone", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], LegalGuardian.prototype, "mail", void 0);
__decorate([
    (0, core_2.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.legalGuardian),
    __metadata("design:type", Object)
], LegalGuardian.prototype, "appointments", void 0);
__decorate([
    (0, core_2.OneToMany)(() => Patient_1.Patient, (patient) => patient.legalGuardian),
    __metadata("design:type", Object)
], LegalGuardian.prototype, "guardedPatients", void 0);
__decorate([
    (0, core_2.OneToOne)(() => User_1.User, (u) => u.legalGuardian),
    __metadata("design:type", User_1.User)
], LegalGuardian.prototype, "user", void 0);
exports.LegalGuardian = LegalGuardian = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, Date, String, String])
], LegalGuardian);
//# sourceMappingURL=LegalGuardian.js.map
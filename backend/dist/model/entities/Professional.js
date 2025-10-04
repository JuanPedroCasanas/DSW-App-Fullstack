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
exports.Professional = void 0;
const core_1 = require("@mikro-orm/core");
const Appointment_1 = require("./Appointment");
const Occupation_1 = require("./Occupation");
const Module_1 = require("./Module");
const HealthInsurance_1 = require("./HealthInsurance");
const User_1 = require("./User");
let Professional = class Professional {
    constructor(firstName, lastName, telephone, email, occupation) {
        this.modules = new core_1.Collection(this);
        this.appointments = new core_1.Collection(this);
        this.healthInsurances = new core_1.Collection(this);
        this.firstName = firstName;
        this.lastName = lastName;
        this.telephone = telephone;
        this.email = email;
        this.occupation = occupation;
    }
};
exports.Professional = Professional;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Professional.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Professional.prototype, "firstName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Professional.prototype, "lastName", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Professional.prototype, "email", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Professional.prototype, "telephone", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", Occupation_1.Occupation)
], Professional.prototype, "occupation", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Module_1.Module, module => module.professional),
    __metadata("design:type", Object)
], Professional.prototype, "modules", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.professional),
    __metadata("design:type", Object)
], Professional.prototype, "appointments", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => HealthInsurance_1.HealthInsurance, healthInsurance => healthInsurance.professionals, { owner: true }),
    __metadata("design:type", Object)
], Professional.prototype, "healthInsurances", void 0);
__decorate([
    (0, core_1.OneToOne)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Professional.prototype, "user", void 0);
exports.Professional = Professional = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, String, Occupation_1.Occupation])
], Professional);
//# sourceMappingURL=Professional.js.map
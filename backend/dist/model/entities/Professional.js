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
const Specialty_1 = require("./Specialty");
const ConsultingRoom_1 = require("./ConsultingRoom");
const Appointment_1 = require("./Appointment");
let Professional = class Professional {
    constructor() {
        this.appointments = new core_1.Collection(this);
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
], Professional.prototype, "phone", void 0);
__decorate([
    (0, core_1.ManyToOne)(),
    __metadata("design:type", Specialty_1.Specialty)
], Professional.prototype, "specialty", void 0);
__decorate([
    (0, core_1.ManyToMany)(),
    __metadata("design:type", ConsultingRoom_1.ConsultingRoom)
], Professional.prototype, "consultingRoom", void 0);
__decorate([
    (0, core_1.OneToMany)(() => Appointment_1.Appointment, (appointment) => appointment.professional),
    __metadata("design:type", Object)
], Professional.prototype, "appointments", void 0);
exports.Professional = Professional = __decorate([
    (0, core_1.Entity)()
], Professional);
//# sourceMappingURL=Professional.js.map
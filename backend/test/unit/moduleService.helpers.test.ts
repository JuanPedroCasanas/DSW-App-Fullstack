import { describe, it, expect } from 'vitest';
import ModuleService from '../../src/services/ModuleService';
import { DayOfWeek } from '../../src/utils/enums/DayOfWeek';

describe('ModuleService.calculateHours', () => {
  it('calcula correctamente horas en el mismo día', () => {
    const result = ModuleService.calculateHours('08:00', '12:00');
    expect(result).toBe(4);
  });
});

it('calcula correctamente horas cuando cruza medianoche', () => {
  const result = ModuleService.calculateHours('22:00', '02:00');
  expect(result).toBe(4);
});

describe('ModuleService.getDatesForDayOfWeek', () => {
  it('devuelve solo fechas correspondientes al día solicitado', () => {
    const dates = ModuleService.getDatesForDayOfWeek(
      DayOfWeek.Monday,
      9,     // septiembre
      2025
    );

    expect(dates.length).toBeGreaterThan(3);

    dates.forEach(date => {
      expect(date.getDay()).toBe(1); // Monday
    });
  });
});

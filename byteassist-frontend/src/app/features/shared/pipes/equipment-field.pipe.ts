// equipment-field.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Equipment } from '../../shared/models/equipment.model';

@Pipe({
  name: 'equipmentField',
  standalone: true
})
export class EquipmentFieldPipe implements PipeTransform {
  transform(equipment: string | Equipment | null, fieldName: keyof Equipment): string {
    if (typeof equipment === 'object' && equipment !== null) {
      return equipment[fieldName] ?? '';
    }
    return equipment ?? '';
  }
}

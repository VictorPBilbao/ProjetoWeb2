import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dividePor100',
  standalone: true,
})
export class DividePor100Pipe implements PipeTransform {
  transform(value: number | string): string {
    const numero = typeof value === 'string' ? parseFloat(value) : value;
    const dividido = numero / 100;

    return dividido.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds',
})
export class MinuteSecondsPipe implements PipeTransform {
  transform(value: number): string {
    const r = Math.floor(value / 60);
    return `${r.toString().padStart(2, '0')}:${(value - 60 * r).toString().padStart(2, '0')}`
  }
}

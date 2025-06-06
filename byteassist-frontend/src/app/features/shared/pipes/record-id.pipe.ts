import { Pipe, PipeTransform } from '@angular/core';
import { RecordidService } from '../../services/utils/recordid.service';

@Pipe({
  name: 'getRecordId',
  standalone: true
})
export class RecordIdPipe implements PipeTransform {
  constructor(private readonly recordIdService: RecordidService) {}

  transform(value: any): string {
    // if its not a string do nothing
    if (typeof value !== 'string') {
      return value;
    }
    return this.recordIdService.getId(value) as string;
  }
}

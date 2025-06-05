import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RecordidService {
  constructor() {}

  public getId(recordId: string): {} {
    // If recordId is empty or null, return empty string
    if (!recordId) {
      return '';
    }

    // Check if the string contains a colon (e.g., "Task:BYTE-1234")
    const colonIndex = recordId.indexOf(':');

    // If no colon found, return the string as is (assuming it's already an ID)
    if (colonIndex === -1) {
      return recordId;
    }

    // Extract the part after the colon
    let id = recordId.substring(colonIndex + 1);

    // Check if the ID is enclosed in angular brackets and remove them if present
    if (id.startsWith('⟨') && id.endsWith('⟩')) {
      id = id.substring(1, id.length - 1);
    }

    return id;
  }
}

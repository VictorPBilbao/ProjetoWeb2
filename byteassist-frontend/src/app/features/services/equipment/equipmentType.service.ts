import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { EquipmentType } from '../../shared/models/equipmentType.model';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../utils/loading.service';
import { RecordidService } from '../utils/recordid.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentTypeService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api/equipment-type';
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly recordIdService = inject(RecordidService);

  constructor() { }

  /**
   * Get all equipment types
   * @returns Observable<EquipmentType[]>
   */
  getAllEquipmentTypes(): Observable<EquipmentType[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show();
    return this.http.get<EquipmentType[]>(this.apiUrl, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  /**
   * Get all active equipment types
   * @returns Observable<EquipmentType[]>
   */
  getAllActiveEquipmentTypes(): Observable<EquipmentType[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show();
    return this.http.get<EquipmentType[]>(`${this.apiUrl}/active`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  /**
   * Get equipment type by ID
   * @param id - Equipment type ID
   * @returns Observable<EquipmentType>
   */
  getEquipmentTypeById(id: string): Observable<EquipmentType> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show();
    return this.http.get<EquipmentType>(`${this.apiUrl}/${this.recordIdService.getId(id)}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  /**
   * Create a new equipment type
   * @param equipmentType - Equipment type data
   * @param categoria - Category parameter for the endpoint
   * @returns Observable<EquipmentType>
   */
  createEquipmentType(equipmentType: EquipmentType, categoria: string): Observable<EquipmentType> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    // Remove id from payload for creation
    const { id, ...equipmentTypePayload } = equipmentType;

    this.loadingService.show();
    return this.http.post<EquipmentType>(`${this.apiUrl}/${categoria}`, equipmentTypePayload, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  /**
   * Update an equipment type
   * @param equipmentType - Equipment type data with ID
   * @returns Observable<EquipmentType>
   */
  updateEquipmentType(equipmentType: EquipmentType): Observable<EquipmentType> {
    if (!equipmentType.id) {
      throw new Error('Equipment type ID is required for update');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    // Remove id from payload for update
    const { id, ...equipmentTypePayload } = equipmentType;

    this.loadingService.show();
    return this.http.patch<EquipmentType>(`${this.apiUrl}/${this.recordIdService.getId(id)}`, equipmentTypePayload, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }

  /**
   * Delete an equipment type
   * @param id - Equipment type ID
   * @returns Observable<void>
   */
  deleteEquipmentType(id: string): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show();
    return this.http.delete<void>(`${this.apiUrl}/${this.recordIdService.getId(id)}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide())
      );
  }
}

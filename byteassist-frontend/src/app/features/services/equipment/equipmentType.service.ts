import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, finalize, catchError } from 'rxjs';
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

  getAllEquipmentTypes(): Observable<EquipmentType[]> {
    const headers = this.createHeaders();

    this.loadingService.show();
    return this.http.get<EquipmentType[]>(this.apiUrl, { headers })
      .pipe(
        catchError(error => throwError(() => error)),
        finalize(() => this.loadingService.hide())
      );
  }

  getAllActiveEquipmentTypes(): Observable<EquipmentType[]> {
    const headers = this.createHeaders();

    this.loadingService.show();
    return this.http.get<EquipmentType[]>(`${this.apiUrl}/active`, { headers })
      .pipe(
        catchError(error => throwError(() => error)),
        finalize(() => this.loadingService.hide())
      );
  }

  getEquipmentTypeById(id: string): Observable<EquipmentType> {
    const headers = this.createHeaders();

    this.loadingService.show();
    return this.http.get<EquipmentType>(`${this.apiUrl}/${this.recordIdService.getId(id)}`, { headers })
      .pipe(
        catchError(error => throwError(() => error)),
        finalize(() => this.loadingService.hide())
      );
  }

  createEquipmentType(equipmentType: EquipmentType, categoria: string): Observable<EquipmentType> {
    const headers = this.createHeaders();
    const { id, createdAt, ...equipmentTypePayload } = equipmentType;

    this.loadingService.show();
    return this.http.post<EquipmentType>(`${this.apiUrl}/${categoria}`, equipmentTypePayload, { headers })
      .pipe(
        catchError(error => throwError(() => error)),
        finalize(() => this.loadingService.hide())
      );
  }

  updateEquipmentType(equipmentType: EquipmentType): Observable<EquipmentType> {
    if (!equipmentType.id) {
      throw new Error('Equipment type ID is required for update');
    }

    const headers = this.createHeaders();
    const { id, createdAt, ...equipmentTypePayload } = equipmentType;

    this.loadingService.show();
    return this.http.patch<EquipmentType>(`${this.apiUrl}/${this.recordIdService.getId(id)}`, equipmentTypePayload, { headers })
      .pipe(
        catchError(error => throwError(() => error)),
        finalize(() => this.loadingService.hide())
      );
  }

  deleteEquipmentType(id: string): Observable<void> {
    const headers = this.createHeaders();

    this.loadingService.show();
    return this.http.delete<void>(`${this.apiUrl}/${this.recordIdService.getId(id)}`, { headers })
      .pipe(
        catchError(error => throwError(() => error)),
        finalize(() => this.loadingService.hide())
      );
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Equipment } from '../../shared/models/equipment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';
  private readonly token;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.token = this.authService.getToken();
  }

  public createEquipment(
    equipment: Equipment,
    expand?: string | string[]
  ): Observable<Equipment> {
    const params: any = {};
    if (expand) {
      params.expand = Array.isArray(expand) ? expand.join(',') : expand;
    }
    return this.http.post<Equipment>(`${this.apiUrl}/equipment`, equipment, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      params,
    });
  }
}

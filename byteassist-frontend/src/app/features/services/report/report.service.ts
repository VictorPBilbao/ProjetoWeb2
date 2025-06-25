import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = 'https://byteassist-backend.fly.dev';

  /**
   * Generates a PDF report with revenue data by period and category
   * @param startDate Optional start date in yyyy-mm-dd format
   * @param endDate Optional end date in yyyy-mm-dd format
   * @returns Observable<Blob> containing the PDF file
   */
  generateReportPdf(startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams();

    if (startDate) {
      params = params.set('start', startDate);
    }

    if (endDate) {
      params = params.set('end', endDate);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get(`${this.baseUrl}/api/report/daily-report`, {
      params: params,
      headers: headers,
      responseType: 'blob'
    });
  }
}

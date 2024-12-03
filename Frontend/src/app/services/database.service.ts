import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private apiUrl = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {}

  getData(limit: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}`);
  }

  getDataByTaxDistrict(taxDistrict: string, limit = 10): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?taxDistrict=${taxDistrict}&limit=${limit}`,
    );
  }

  getDataByLocatorNumber(locatorNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?locatorNumber=${locatorNumber}`);
  }

  getPaginatedData(limit: number, offset: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&offset=${offset}`);
  }

  getSortedData(
    sortBy: string,
    order: 'ASC' | 'DESC',
    limit: number = 10,
    offset: number = 0,
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?sortBy=${sortBy}&order=${order}&limit=${limit}&offset=${offset}`,
    );
  }

  getFilteredData(params: any, limit: number = 10, offset: number = 0): Observable<any> {
    params.limit = limit.toString(); // Add limit to params
    params.offset = offset.toString(); // Add offset to params

    let httpParams = new HttpParams();

    Object.keys(params).forEach((key) => {
      if (params[key]) {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }
}

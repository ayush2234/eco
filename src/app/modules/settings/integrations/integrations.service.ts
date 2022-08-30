import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  // Private
  private _erps: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _integrations: BehaviorSubject<any | null> = new BehaviorSubject(
    null
  );

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for installed integration
   */
  get erps$(): Observable<any> {
    return this._erps.asObservable();
  }

  /**
   * Getter for available integrations
   */
  get integrations$(): Observable<any> {
    return this._integrations.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get installed integrations
   */
  getConnections(): Observable<any> {
    return this._httpClient
      .get('api/connections/df1e061d-b785-4168-ac18-489625071b02')
      .pipe(
        tap((response: any) => {
          this._erps.next(response?.erps);
          this._integrations.next(response?.integrations);
        })
      );
  }
}

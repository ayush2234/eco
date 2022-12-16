// -----------------------------------------------------------------------------------------------------
// @ LOCAL STORAGE UTILITIES
// -----------------------------------------------------------------------------------------------------

export class LocalStorageUtils {
  /**
   * Constructor
   */
  constructor() {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  static get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  static set accessToken(value) {
    localStorage.setItem('accessToken', value);
  }

  static get tokenExpirationDate(): number {
    return +localStorage.getItem('tokenExpirationDate') ?? 0;
  }

  static set tokenExpirationDate(expirationDate: number) {
    expirationDate &&
      localStorage.setItem('tokenExpirationDate', expirationDate.toString());
  }

  static get companyId(): string {
    return localStorage.getItem('companyId') ?? '';
  }

  static set companyId(value) {
    localStorage.setItem('companyId', value);
  }
}
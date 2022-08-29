import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { ApiUtils } from './api.utils';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  /**
   * Constructor
   */
  constructor(private _authService: AuthService) {}

  /**
   * Intercept
   *
   * @param req
   * @param next
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request object
    let newReq = req.clone();

    // Request
    if (newReq.body && !(newReq.body instanceof FormData)) {
      newReq = newReq.clone({
        body: ApiUtils.toApiObject(req.body),
      });
    }

    // Response
    return next.handle(newReq).pipe(
      map(res => {
        if (res instanceof HttpResponse) {
          let newRes = res.clone();
          newRes = res.clone({ body: ApiUtils.toUiObject(res.body) });

          return newRes;
        }

        return res;
      }),
      catchError(error => {
        // Catch "401 Unauthorized" responses
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 || error.status === 403)
        ) {
          // Sign out
          this._authService.signOut();

          // Reload the app
          location.reload();
        }

        return throwError(error);
      })
    );
  }
}

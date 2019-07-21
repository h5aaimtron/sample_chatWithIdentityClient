import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoginModel } from '../models/login-model';
import { UserTokenModel } from '../models/user-token-model';
import { environment } from 'src/environments/environment';
import { RegisterModel } from '../models/register-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Login request sent to api.
   * @param model 
   */
  login(model: LoginModel) {
    return this.httpClient.post(environment.basePath + "/api/authz/token", model).pipe(
      tap(() => console.log("Login Request Processed")),
      catchError(this.handleError("loginError"))
    );
  }

  /**
   * Register a new user account.
   * @param model 
   */
  register(model: RegisterModel) {
    return this.httpClient.post(environment.basePath + "/api/authz/register", model).pipe(
      tap(() => console.log("Register Request Processed")),
      catchError(this.handleError("registerError"))
    )
  }

  /**
   * Log message to browser console.
   * @param message 
   */
  log(message: string) {
    console.log(message);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

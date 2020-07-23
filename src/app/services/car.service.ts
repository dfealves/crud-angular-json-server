import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Car } from '../interface/car';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  url = 'http://localhost:3000/cars';

  constructor(private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' }),
  };

  getCars(): Observable<Car[]> {
    return this.httpClient
      .get<Car[]>(this.url)
      .pipe(retry(2), catchError(this.handleError));
  }

  getCarById(id: number): Observable<Car> {
    return this.httpClient
      .get<Car>(`${this.url}/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }
  saveCar(car: Car): Observable<Car> {
    return this.httpClient
      .post<Car>(this.url, JSON.stringify(car), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  updateCar(car: Car): Observable<Car> {
    return this.httpClient
      .put<Car>(`${this.url}/${car.id}`, JSON.stringify(car), this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteCar(car: Car) {
    return this.httpClient
      .delete<Car>(`${this.url}/${car.id}`, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      //erro no lado do client
      errorMessage = error.error.message;
    } else {
      //erro lado servidor
      (errorMessage = `Código do erro: ${error.status}`),
        +`Mensagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

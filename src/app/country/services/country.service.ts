import { CountryMapper } from './../mappers/country.mapper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RESTCountry } from '../models/rest-countries.interfaces';
import { catchError, map, Observable } from 'rxjs';
import { Country } from '../models/country.interface';

const TAG = 'COUNTRY SERVICE';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _http = inject(HttpClient);

  public searchByCapital(query: string): Observable<Country[]> {
    return this._http
      .get<RESTCountry[]>(
        `${environment.apiUrl}/capital/${query.toLocaleLowerCase()}`
      )
      .pipe(
        map(CountryMapper.mapCountryItemsToCountryArray),
        catchError((err: HttpErrorResponse) => {
          console.error(`Error in ${TAG}:`, err.error.message);
          throw new Error(`No se encontró el país con la capital ${query}`);
        }) // Se puede hacer así o con un return throwError(() => new Error(err.error.message))
      );
  }
}

// Es lo mismo:
// map((countries) => {
//   return CountryMapper.mapCountryItemsToCountryArray(countries);
// })

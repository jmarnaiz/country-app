import { CountryMapper } from './../mappers/country.mapper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RESTCountry } from '../models/rest-countries.interfaces';
import { catchError, map, Observable } from 'rxjs';
import { Country } from '../models/country.interface';

const TAG = 'COUNTRY SERVICE';

export enum SearchType {
  Capital = 'capital',
  Country = 'name',
  Code = 'alpha',
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _http = inject(HttpClient);

  public searchBy(query: string, type: SearchType): Observable<Country[]> {
    return this._http
      .get<RESTCountry[]>(
        `${environment.apiUrl}/${type}/${query.toLocaleLowerCase()}`
      )
      .pipe(
        map(CountryMapper.mapCountryItemsToCountryArray),
        // delay(2000),
        catchError((err: HttpErrorResponse) => {
          console.error(`Error in ${TAG}:`, err);
          throw new Error(`No se encontró el país ${query}`);
        })
      );
  }
}

// Es lo mismo:
// map((countries) => {
//   return CountryMapper.mapCountryItemsToCountryArray(countries);
// })

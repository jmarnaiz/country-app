import { CountryMapper } from './../mappers/country.mapper';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RESTCountry } from '../models/rest-countries.interfaces';
import { catchError, map, Observable, of, tap } from 'rxjs';
import type { Country } from '../models/country.interface';

const TAG = 'COUNTRY SERVICE';

export enum SearchType {
  Capital = 'capital',
  Country = 'name',
  Code = 'alpha',
  Region = 'region',
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _http = inject(HttpClient);
  private _queryCacheCountries = new Map<string, Country[]>(); // Cache

  public searchBy(query: string, type: SearchType): Observable<Country[]> {
    if (this._queryCacheCountries.has(query))
      return of(this._queryCacheCountries.get(query)!);
    // En la condición del if ya me aseguro que que esa clave existe en el
    //  mapa, por lo que puedo usar el operador "!" luego
    return this._http
      .get<RESTCountry[]>(
        `${environment.apiUrl}/${type}/${query.toLocaleLowerCase()}`
      )
      .pipe(
        map(CountryMapper.mapCountryItemsToCountryArray),
        tap((countries) => {
          this._queryCacheCountries.set(query, countries);
        }),
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

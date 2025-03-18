import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService, SearchType } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import type { Region } from '../../models/region.interface';
import { ActivatedRoute, Router } from '@angular/router';

const REGIONS: Region[] = [
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
  'Antarctic',
];

/*
  This function validates the query parameters and returns the region if it is valid.
  Otherwise, it returns the default region, which is Europe.
*/
const validateQueryParams = (queryParams: string): Region => {
  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[queryParams.toLocaleLowerCase()] ?? 'Europe';
};

@Component({
  selector: 'by-region',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export default class ByRegionComponent {
  private _countryService = inject(CountryService);

  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  queryParam = (this._activatedRoute.snapshot.queryParamMap.get('region') ??
    '') as Region;

  selectedRegion = linkedSignal<Region>(() =>
    validateQueryParams(this.queryParam)
  );
  public regions: Region[] = REGIONS;

  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      console.log('Request', { request: request.region });
      if (!request.region) return of([]);
      this._router.navigate(['/country/by-region'], {
        queryParams: { region: request.region },
      });
      return this._countryService.searchBy(request.region, SearchType.Region);
    },
  });
}

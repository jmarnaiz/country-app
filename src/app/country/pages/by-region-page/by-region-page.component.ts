import { Component } from '@angular/core';
import { CountryListComponent } from '../../components/country-list/country-list.component';

@Component({
  selector: 'by-region',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export default class ByRegionComponent {}

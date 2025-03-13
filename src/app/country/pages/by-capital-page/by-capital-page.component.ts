import { Component, inject, signal } from '@angular/core';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryListComponent } from '../../components/country-list/country-list.component';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.interface';

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  private _countryService = inject(CountryService);

  // Manera "tradicional" de hacerlo:
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearch(value: string) {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.isError.set(null);
    this._countryService.searchByCapital(value).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      error: (errorMsg: string) => {
        this.isLoading.set(false);
        this.countries.set([]);
        this.isError.set(errorMsg);
      },
    });
  }
}

// Esto da error porque el this hace referencia al objeto que llama a la función, en este caso al objeto que llama a la función subscribe,
// que es un objeto de tipo Subscription, y no al objeto de tipo ByCapitalPageComponent.
// Para solucionar esto, se puede utilizar una función de flecha en lugar de una función anónima, ya que las funciones de flecha no tienen
// su propio this y utilizan el this del contexto en el que fueron creadas.
//   error(err) {
//   this.isLoading.set(false);
//   this.isError.set(err.message);
// },

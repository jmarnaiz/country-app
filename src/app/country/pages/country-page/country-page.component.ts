import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService, SearchType } from '../../services/country.service';
import { map } from 'rxjs';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { CountryInfoComponent } from './country-info/country-info.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-country-page',
  imports: [NotFoundComponent, CountryInfoComponent, NgClass],
  templateUrl: './country-page.component.html',
})
export default class CountryPageComponent {
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  private _countryService = inject(CountryService);

  countryResource = rxResource({
    request: () => ({ code: this.countryCode }),
    loader: ({ request }) => {
      return this._countryService
        .searchBy(request.code, SearchType.Code)
        .pipe(map((countries) => countries[0]));
    },
  });

  /**
   * Usamos un snapshot porque no necesitamos que nuestra ruta sea
   * dinámica. Si por ejemplo, en esta vista tuviésemos un botón para
   * avanzar al siguiente país, como seguiría siendo el mismo componente,
   * countruCode no cambaría, por lo que no necesitaríamos un observable.
   * Sería algo así:
   *
   * counryCode = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['code']))
  );
   */
}

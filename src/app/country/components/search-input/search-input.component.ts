import {
  Component,
  effect,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';

const DEFAULT_TIME_DEBOUNCER: number = 300;

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  search_placeholder = input<string>('Buscar');

  query = output<string>();
  debounceTime = input(DEFAULT_TIME_DEBOUNCER);

  initialValue = input<string>('');

  /* Cuando tenemos una señal que es producto de una combinación
  de otra señal o señales, tenemos que usar linkedSignal. Esto nos
  permite inicializar la señal con el valor del cáclulo de otra señal

  inputValue = signal<string>(this.initialValue());
  */

  inputValue = linkedSignal<string>(() => this.initialValue());

  /*
  La diferencia entre computed y LinkedSignal es que computed devuelve
  una señal de SOLO lectura mientras LinkedSignal devuelve una 'writable
  */

  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.query.emit(value);
    }, this.debounceTime()); // 500ms

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  // Angular, cuando detecta que hay una señal dentro del efecto y cambia,
  // disopara este efecto.
}

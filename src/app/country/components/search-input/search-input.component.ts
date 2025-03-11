import { Component, input, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  imports: [],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  search_placeholder = input<string>('Buscar');
  query = output<string>();

  onSearch(value: string) {
    this.query.emit(value);
  }
}

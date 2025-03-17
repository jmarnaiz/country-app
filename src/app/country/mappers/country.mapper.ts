import { Country } from '../models/country.interface';
import { RESTCountry } from '../models/rest-countries.interfaces';

export class CountryMapper {
  static mapRestCountryToCountry(country: RESTCountry): Country {
    return {
      code: country.cca2,
      flag: country.flag,
      flagSvg: country.flags.svg,
      name: country.translations['spa']?.official ?? country.name.common,
      population: country.population,
      area: country.area,
      capital: country.capital?.join(', ') ?? 'N/A',
    };
  }

  static mapCountryItemsToCountryArray(countries: RESTCountry[]): Country[] {
    return countries.map(CountryMapper.mapRestCountryToCountry);
  }
}

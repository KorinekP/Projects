interface Country {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        common: string;
        official: string;
      };
    };
  };
  flags: {
    png: string;
    alt: string;
  };
  population: number;
  region: string;
  subregion: string;
  capital: string;
  tld: string;
  currencies: {
    [code: string]: {
      name: string;
      symbol: string;
    };
  };
  languages: {
    [code: string]: string;
  };
  borders: string[];
  cca3: string;
}

export default Country;

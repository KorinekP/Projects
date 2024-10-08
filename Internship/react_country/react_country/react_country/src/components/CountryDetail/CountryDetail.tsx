import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Country from '../../country.interface';

function CountryDetail({ countries }: { countries: Country[] }) {
  const { name } = useParams<{ name: string }>(); 

  const country = countries.find(country => country.name.common === name);

  if (!country) {
    return <div>Country not found!</div>;
  }

  const currencyCodes = Object.keys(country.currencies);
  const languageCodes = Object.keys(country.languages);

  const getNativeName = (languageCode: string) => {
    return country.name.nativeName[languageCode]?.common || country.name.common;
  };

  let bordersSection = null;
  if (country.borders && country.borders.length > 0) {
    bordersSection = (
      <>
        <p>Borders:</p>
        <ul className='details__borders'>
          {country.borders.map(borderCode => {
            const borderCountry = countries.find(c => c.cca3 === borderCode);
            return (
              <li className="details__borders__element" key={borderCode}>
                <Link className="details__borders__link" to={`/country/${borderCountry?.name.common}`}>
                  {borderCountry?.name.common || "Unknown"}
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    );
  } else {
    bordersSection = <p>No bordering countries.</p>;
  }

  return (
    <div className='details'>
      <img className='details details__flag' src={country.flags.png} alt={country.flags.alt} />
      <h1 className='details details__title'>{country.name.common}</h1>
      <p className='details details__info'>Native Name: {getNativeName(languageCodes[0])}</p>
      <p className='details details__info'>Population: {country.population}</p>
      <p className='details details__info'>Region: {country.region}</p>
      <p className='details details__info'>Sub-Region: {country.subregion}</p>
      <p className='details details__info'>Capital: {country.capital}</p>
      <p className='details details__info'>Top level domain: {country.tld}</p>
      <p className='details details__info'>Currencies: {currencyCodes.join(', ')}</p>
      <p className='details details__info'>Languages: {languageCodes.map(languageCode => country.languages[languageCode]).join(', ')}</p>
      {bordersSection}
      <Link className="details details__return" to={"/"}>Return</Link>
    </div>
  );
}

export default CountryDetail;

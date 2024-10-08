import React from 'react';
import { Link } from 'react-router-dom';
import Country from '../../country.interface';

function List({ countries }: { countries: Country[] }) {
  return (
    <div className='list'>
      {countries.map(country => (
        <div key={country.name.common} className="list__element">
          <img src={country.flags.png} alt={country.flags.alt} className="list__element__flag"/>
          <div>
            <Link className="list__element__title" to={`/country/${country.name.common}`}>{country.name.common}</Link>
            <p className="list__element__detail">Population: {country.population}</p>
            <p className="list__element__detail">Region: {country.region}</p>
            <p className="list__element__detail">Capital: {country.capital}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default List;

// pages/characters/index.js
import React, { useEffect, useState } from 'react';
import withAuth from '../../hoc/withAuth';
import Link from 'next/link';
import "../../app/globals.css";
type Character = {
  name: string,
  height: number,
  mass: number,
  birth_year: string,
  gender: string,
  url: string
};

const CharactersPage: React.FC = () => {
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchAllCharacters = async () => {
      let allData: Character[] = [];
      let page = 1;
      let data;

      do {
        const res = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        data = await res.json();
        allData = allData.concat(data.results);
        page += 1;
      } while (data.next);

      setAllCharacters(allData);
    };

    fetchAllCharacters();
  }, []);

  useEffect(() => {
    let filteredCharacters = allCharacters.filter(character =>
      character.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (sort === 'name') {
      filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'height') {
      filteredCharacters.sort((a, b) => a.height - b.height);
    } else if (sort === 'mass') {
      filteredCharacters.sort((a, b) => a.mass - b.mass);
    }

    setCharacters(filteredCharacters.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage));
  }, [allCharacters, pageNum, filter, sort]);

  return (
    <div className='body'>
      <h1>Star Wars Characters</h1>
      <div className='display'>
        <input className='display--filter'
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name"
        />
        <select className='display--selection' onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="name">Sort by Name</option>
          <option value="height">Sort by Height</option>
          <option value="mass">Sort by Mass</option>
        </select>
      </div>
      <ul className='display--list'>
        {characters.map((character: Character) => (
          <li className='display--list--element' key={character.name}>
            <Link href={`/dashboard/${character.url.split('/')[5]}`}>
              {character.name}
            </Link>
          </li>
        ))}
      </ul>
      <button className='display--button' onClick={() => setPageNum(pageNum - 1)} disabled={pageNum === 1}>Previous</button>
      <button className='display--button' onClick={() => setPageNum(pageNum + 1)} disabled={characters.length < itemsPerPage}>Next</button>
    </div>
  );
};

export default withAuth(CharactersPage);

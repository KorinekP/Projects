// pages/characters/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import withAuth from '@/hoc/withAuth';
import Link from 'next/link';
import "../../../app/globals.css"
type Character = {
  name: string,
  height: number,
  mass: number,
  birth_year: string,
  gender: string,
};

const CharacterDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState<Character | null>(null);
  useEffect(() => {
    if (id) {
      const fetchCharacter = async () => {
        const res = await fetch(`https://swapi.dev/api/people/${id}/`);
        const data = await res.json();
        setCharacter(data);
      };

      fetchCharacter();
    }
  }, [id]);

  if (!character) return <div>Loading...</div>;

  return (
    <div className='body'>
      <div className='detail'>
      <h1 className='detail--title'>{character.name}</h1>
      <p className='detail--info'>Height: {character.height}</p>
      <p className='detail--info'>Mass: {character.mass}</p>
      <p className='detail--info'>Birth Year: {character.birth_year}</p>
      <p className='detail--info'>Gender: {character.gender}</p>
      <button className='detail--button' onClick={() => {router.push("/dashboard");}}>Back</button>
      </div>
    </div>
  );
};

export default withAuth(CharacterDetail);

import React, { useState } from 'react';
import fireIcon from "../icons/fire.svg";
import waterIcon from "../icons/water.svg";
import airIcon from "../icons/air.svg";
import earthIcon from "../icons/earth.svg";
import aticon from "../icons/attack.svg";
import deficon from "../icons/defense.svg";
import trashcion from "../icons/trash-can.svg"

type Monster = {
  name: string;
  attack: number;
  defense: number;
  element: string;
}

interface ListProps {
  monsters: Monster[];
  SetMonsters: React.Dispatch<React.SetStateAction<Monster[]>>;
}

function List({ monsters, SetMonsters }: ListProps) {
  const [filter, setFilter] = useState<string>("");

  // Function to handle monster deletion
  function handleDelete(index: number) {
    const updatedMonsters = monsters.filter((_, i) => i !== index);
    SetMonsters(updatedMonsters);
  }

  // Function to filter monsters based on search query
  function filterMonsters(monster: Monster) {
    return monster.name.toLowerCase().includes(filter.toLowerCase());
  }

  return (
    <div>
      <h2>Monsters</h2>
      <input
        type="text"
        placeholder="Search monsters..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {monsters.filter(filterMonsters).map((monster, index) => (
        <section className="list list__element" key={index}>
          <h1><img className="img img__icon--big" src={getElementIcon(monster.element)} alt={monster.element} /> <span>{monster.name}</span></h1>
          <p><img className="img img__icon" src={aticon} alt="Attack" /> {monster.attack} <img className="img img__icon" src={deficon} alt="Defense" /> {monster.defense} </p>
          <p><span onClick={() => handleDelete(index)}><img className="img img__icon" src={trashcion} alt="delete" /></span></p>
        </section>
      ))}
    </div>
  );
}

function getElementIcon(element: string): string {
  switch (element) {
    case 'fire':
      return fireIcon;
    case 'water':
      return waterIcon;
    case 'air':
      return airIcon;
    case 'earth':
      return earthIcon;
    default:
      return "";
  }
}

export default List;

import ElementPicker from "./ElementPicker";
import StatPicker from "./StatPicker";
import aticon from "../icons/attack.svg";
import deficon from "../icons/defense.svg";
import { useState } from "react";

type Monster = {
  name: string;
  attack: number;
  defense: number;
  element: string;
}

interface FormProps {
  monsters: Monster[];
  SetMonsters: React.Dispatch<React.SetStateAction<Monster[]>>;
}

function Form({ monsters, SetMonsters }: FormProps) {
  const [Prototype, SetPrototype] = useState({
    name: "",
    attack: 0,
    defense: 0,
    element: "fire"
  });

  function AdjustName(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value || "";
    SetPrototype({ ...Prototype, name: value });
  }

  function AddMonster(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    SetMonsters([...monsters, Prototype]);

    SetPrototype({
      name: "",
      attack: 0,
      defense: 0,
      element: "fire"
    });
  }

  const isNameEmpty = Prototype.name.trim() === "";

  return (
    <>
      <h2>Create Monster</h2>
      <form className="form" onSubmit={AddMonster}>
        <ElementPicker Prototype={Prototype} SetPrototype={SetPrototype} />
        <input
          id="nameinput"
          type="text"
          value={Prototype.name}
          onChange={AdjustName}
          placeholder="Name"
        />
        <StatPicker
          choice="attack"
          icon={aticon}
          inputId="attackInput"
          Prototype={Prototype}
          SetPrototype={SetPrototype}
        />
        <StatPicker
          choice="defense"
          icon={deficon}
          inputId="defenseInput"
          Prototype={Prototype}
          SetPrototype={SetPrototype}
        />
        <button type="submit" disabled={isNameEmpty}>
          Submit
        </button>
      </form>
    </>
  );
}

export default Form;

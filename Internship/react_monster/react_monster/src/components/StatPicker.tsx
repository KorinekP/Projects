import React from 'react';
type Monster = {
  name:string,
  attack:number,
  defense:number,
  element:string
}

interface StatPickerProps {
  choice: string;
  icon: string;
  inputId: string;
  Prototype: Monster;
  SetPrototype: React.Dispatch<React.SetStateAction<Monster>>;
}

function StatPicker({ choice, icon, inputId, Prototype, SetPrototype }: StatPickerProps) {
  function AdjustStat(event: React.ChangeEvent<HTMLInputElement>) {
    let value = parseInt(event.target.value, 10) || 0;
    if(value<0) value = 0;
    SetPrototype({ ...Prototype, [choice]: value });
  }
  return (
    <div className="input input__stat">
      <img className="img img__icon" src={icon} alt={choice}/>
      <input className="input input__num" type="number" id={inputId} value={Prototype[choice as keyof Monster]} onChange={AdjustStat}/>
    </div>
  );
}

export default StatPicker;

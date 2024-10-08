import left from "../icons/arrow-left.svg";
import right from "../icons/arrow-right.svg";
import fireIcon from "../icons/fire.svg";
import waterIcon from "../icons/water.svg";
import airIcon from "../icons/air.svg";
import earthIcon from "../icons/earth.svg";

type Monster = {
  name: string;
  attack: number;
  defense: number;
  element: string;
}

interface ElementPickerProps {
  Prototype: Monster;
  SetPrototype: React.Dispatch<React.SetStateAction<Monster>>;
}

function ElementPicker({ Prototype, SetPrototype }: ElementPickerProps) {
  function cycle(modifier: number) {
    const elements: string[] = ["fire", "water", "earth", "air"];
    let temp: number = elements.indexOf(Prototype.element) + modifier;
    if (temp === -1) temp = elements.length - 1;
    if (temp === elements.length) temp = 0;
    SetPrototype({ ...Prototype, element: elements[temp] });
  }

  const elementIcons: { [key: string]: string } = {
    fire: fireIcon,
    water: waterIcon,
    air: airIcon,
    earth: earthIcon
  };

  return (
    <div>
      <img
        className="img img__icon--big"
        src={left}
        alt="leftarrow"
        onClick={() => cycle(-1)}
      />
      <img
        className="img img__icon--big"
        src={elementIcons[Prototype.element]}
        alt={Prototype.element}
      />
      <img
        className="img img__icon--big"
        src={right}
        alt="rightarrow"
        onClick={() => cycle(1)}
      />
    </div>
  );
}

export default ElementPicker;

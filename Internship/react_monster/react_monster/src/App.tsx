import './App.css'
import Title from './components/Title'
import Form from './components/Form'
import List from './components/List'
import { useState } from 'react'
function App() {
  type Monster = {
    name:string,
    attack:number,
    defense:number,
    element:string
  }
  const exampleone : Monster = {
    name:"FlameWheel",
    attack:12,
    defense:3,
    element:"fire"
  }
  const exampletwo : Monster = {
    name:"EarthGolem",
    attack:2,
    defense:15,
    element:"earth"
  }
  const examplethree : Monster = {
    name:"IceSentinel",
    attack:7,
    defense:7,
    element:"water"
  }
  const [Monsters,SetMonsters] = useState([exampleone,exampletwo,examplethree]);
  return (
    <div className="app__body">
      <Title></Title>
      <Form monsters={Monsters} SetMonsters={SetMonsters}></Form>
      <List monsters={Monsters} SetMonsters={SetMonsters}></List>
    </div>
  )
}

export default App

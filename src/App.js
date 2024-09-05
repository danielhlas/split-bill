import { useState } from "react"

const initialFriends = [
  {
    id: 118836,
    name: "David",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Anna",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Tomáš",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App(){
  const [openAddFriendForm, setAddFriendForm] = useState(false) 
  const [allFriends, setAllFriends] = useState(initialFriends)
  const [selectedPerson, setSelectedPerson] = useState("")

  const onePerson = allFriends.reduce(function(acc, i){
    if (i.id === selectedPerson) return i
    else return acc
  }, 0)

  return <>
  <h1>Split Bill</h1>
  <div className="app">
    <div className="sidebar">
      <FriendGroup allFriends={allFriends} selectedPerson={selectedPerson} setSelectedPerson={setSelectedPerson}/>
      {openAddFriendForm && <AddFriendForm allFriends={allFriends} setAllFriends={setAllFriends}/>}

      <button className="button" onClick={() => setAddFriendForm(!openAddFriendForm)}>{openAddFriendForm ? "Close" : "Add friend"}</button>
    </div>
    {selectedPerson && <InputsForm onePerson={onePerson} allFriends={allFriends} setAllFriends={setAllFriends}/>}
  </div>
</>
}


////////////////
function FriendGroup({allFriends, selectedPerson, setSelectedPerson}) {
  return(<ul>
    {allFriends.map((obj) => <Friend obj={obj} key={obj.id} selectedPerson={selectedPerson} setSelectedPerson={setSelectedPerson} />)}
  </ul>)
}


////////////////
function Friend({obj, selectedPerson, setSelectedPerson}) {
return <li> 
  <img src={obj.image} alt={obj.name}/>
  <h3>{obj.name}</h3>
  {obj.balance === 0 && <p>You and {obj.name} are even!</p>}
  {obj.balance > 0 && <p className="green">{obj.name} owns you {obj.balance}€</p>}
  {obj.balance < 0 && <p className="red">You own {obj.name} {Math.abs(obj.balance)}€</p>}
  <button className="button" onClick={() => setSelectedPerson(obj.id === selectedPerson ? "" : obj.id)}>
    {obj.id === selectedPerson ? "Close" : "Select"}
  </button>
</li>
}

////////////////
function AddFriendForm({allFriends, setAllFriends}){
  const [friendName, setFriendName] = useState("")
  const [imgUrl, setImgUrl] = useState("https://i.pravatar.cc/48") 


  function addFriend(e, ){
    e.preventDefault()

    const newFriend = {id: crypto.randomUUID(), name: friendName, image: imgUrl, balance:0}
    setFriendName("")
    setImgUrl("https://i.pravatar.cc/48")
    setAllFriends([...allFriends, newFriend])
  }

  return <>
  <form className="form-add-friend">
    <label>- Friend name</label>
    <input type="text" value={friendName} onChange={(e)=>setFriendName(e.target.value)}/>

    <label>- Image URL</label>
    <input type="text" value={imgUrl} onChange={(e)=>setImgUrl(e.target.value)}/>

    <button className="button" onClick={addFriend}>Add</button>
  </form>
</>
}


////////////////
function InputsForm({onePerson, allFriends, setAllFriends}){
  const [billValue, setBillValue] = useState("") 
  const [myExpense, setMyExpense] = useState("") 
  const [payingPerson, setPayingPerson] = useState("you") 
  const difference = Number(billValue)-Number(myExpense)

  function calc(e){
    e.preventDefault()
    
    if (payingPerson === "you") {
      setAllFriends(allFriends.map(
        friend => friend.id === onePerson.id ? {...friend, balance: friend.balance + difference} : friend
      ))
    }
    else {
    setAllFriends(allFriends.map(
      friend => friend.id === onePerson.id ? {...friend, balance: friend.balance - difference} : friend
    ))
    }

   setBillValue("")
   setMyExpense("")
  }


  return(<form className="form-split-bill">
    <h2>Split bill with {onePerson.name}</h2>
      <label>- Bill value</label>
      <input type="text" value={billValue} onChange={(e) => setBillValue(e.target.value)}/>

      <label>- Your expense</label>
      <input type="text" value={myExpense} onChange={(e) => Number(e.target.value) < billValue ? setMyExpense(e.target.value) : window.confirm("Your expense has to be lower then bill value.") }/>

      <label>- {onePerson.name} Expense</label>
      <input type="text" value={billValue-myExpense} disabled/>

      <label>- Who is paying today?</label>
      <select className="select" onChange={(e) => setPayingPerson(e.target.value)}>
        <option value="you">You</option>
        <option value="anotherPerson">{onePerson.name}</option>
      </select>

      <button className="button" onClick={calc}>Split bill</button>
    </form>)
}
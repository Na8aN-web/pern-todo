import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

function App() {
  const [tasks, setTasks] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(null)
  const userEmail = cookies.Email
  const authToken = cookies.AuthToken

  const getData = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/todos/${userEmail}`)
      const json = await response.json();
      setTasks(json)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if(authToken){
      getData();
    }
  }, [])
  console.log(tasks)

  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div className="app">
      {!authToken && <Auth />}
      {
        authToken && 
        <>
          <ListHeader listName={'TODO LIST'} getData={getData} />
          <p className="user-email">Welcome back {userEmail}</p>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>
      }

    </div>
  );
}

export default App;

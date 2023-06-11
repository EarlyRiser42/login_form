import AppRouter from "./AppRouter";
import {useState} from "react";
import {authService} from "../fbase";

function App() {
  const auth = authService;
  const [login, setlogin] = useState(authService.currentUser);
  return <AppRouter login={login} />
}

export default App;

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bulmaswatch/superhero/bulmaswatch.min.css";

import { Provider } from "react-redux";
import { store } from "./state";

import CellList from "./components/CellList/CellList";

export default function App() {
  return (
    <Provider store={store}>
      <CellList />
    </Provider>
  );
}

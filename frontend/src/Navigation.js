import { NavLink } from "react-router-dom";
import "./Navigation.css";
export function Navigation() {
  return (
    <nav>
      <NavLink to="/admin/grading">Grading</NavLink>
      <NavLink to="/admin/teams">Teams</NavLink>
      <NavLink to="/admin/results">Results</NavLink>
      <NavLink to="/game">Game page</NavLink>
      <NavLink to="/answer">Submit answer</NavLink>
    </nav>
  );
}

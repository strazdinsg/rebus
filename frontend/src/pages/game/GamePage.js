import "./GamePage.css";

/**
 * A page showing all the available challenges for the team.
 * @returns {JSX.Element}
 * @constructor
 */
export function GamePage() {
  return (
    <main>
      <h1>Challenges</h1>
      <section id="challenges">
        <button>1</button>
        <button>2</button>
        <button className="solved">3</button>
        <button>4</button>
        <button className="solved">5</button>
        <button>6</button>
      </section>
    </main>
  );
}

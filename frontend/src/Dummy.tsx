import React, { useState, useReducer } from "react";
import axios from "axios";

type State = {
  error: string | null;
  greeting: string | null;
};

const initialState: State = {
  error: null,
  greeting: null,
};

type Action = {
  type: string;
  greeting: string | null;
  error: string | null;
};

function greetingReducer(state: State, action: Action) {
  switch (action.type) {
    case "SUCCESS": {
      return {
        error: null,
        greeting: action.greeting,
      };
    }
    case "ERROR": {
      return {
        error: action.error,
        greeting: null,
      };
    }
    default: {
      return state;
    }
  }
}

/**
 * A dummy component for testing only.
 * Code adapted from https://testing-library.com/docs/react-testing-library/example-intro
 * @param props Properties to pass in (the URL)
 * @constructor
 */
export default function Dummy(props: { url: string }) {
  const [{ error, greeting }, dispatch] = useReducer(
    greetingReducer,
    initialState
  );
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchGreeting = async (url: string) =>
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        const { greeting } = data;
        const g: string = `${greeting}`;
        dispatch({ type: "SUCCESS", greeting: g, error: null });
        setButtonClicked(true);
      })
      .catch((error) => {
        dispatch({ type: "ERROR", error: error, greeting: null });
      });

  const buttonText = buttonClicked ? "Ok" : "Load Greeting";

  return (
    <div>
      <button onClick={() => fetchGreeting(props.url)} disabled={buttonClicked}>
        {buttonText}
      </button>
      {greeting && <h1>{greeting}</h1>}
      {error && <p role="alert">Oops, failed to fetch!</p>}
    </div>
  );
}

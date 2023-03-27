import { createContext } from "react";

// TODO - convert all contexts to Redux slices

/**
 * Store the user answers here
 * @type {React.Context<{answers: *[], setAnswers: function([])}>}
 */
export const AnswerContext = createContext({
  answers: [],
  setAnswers: function (answers) {},
});

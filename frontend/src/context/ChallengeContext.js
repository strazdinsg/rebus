import { createContext } from "react";

// TODO - load challenges from backend

/**
 * A list of challenges
 */
export const ChallengeContext = createContext([
  {
    id: 1,
    submitted: false,
    question:
      "I am something that everyone has, yet no one can see it. I am precious, but cannot be bought. I am light as a feather, yet can weigh a person down. What am I?",
  },
  { id: 2, submitted: false, question: "Second quest" },
  { id: 3, submitted: true, question: "Another quest" },
  { id: 4, submitted: false, question: "Foursquare" },
  { id: 5, submitted: true, question: "Pentagon" },
]);

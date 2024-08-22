import { http, HttpResponse } from "msw";
import { API_V2_BASE_URL } from "../api-v2/apiClient";
import { API_V1_BASE_URL } from "../api-v1/apiClient";

/**
 * Mocks for the API requests.
 */
export const handlers = [
  http.get(API_V2_BASE_URL + "/challenges", () => {
    return HttpResponse.json(challenges);
  }),
  http.get(API_V1_BASE_URL + "/answers/my", () => {
    return HttpResponse.json(answers);
  }),
  http.get(API_V1_BASE_URL + "/teams", () => {
    return HttpResponse.json(teams);
  }),
  http.get("https://www.example.com/greeting", () => {
    return HttpResponse.json({
      greeting: "Hello, world!",
    });
  }),
];

const challenges = [
  {
    id: 1,
    question: "What is the answer to life, the universe, and everything?",
    maxScore: 100,
  },
  {
    id: 2,
    question: "What is the capital of France?",
    maxScore: 10,
  },
];

const answers = {
  answers: [
    {
      answer: "42",
      challengeId: 1,
      imageUrl: null,
      score: null,
    },
    {
      answer: "Paris",
      challengeId: 2,
      imageUrl: null,
      score: null,
    },
  ],
  teamId: 1,
};

const teams = [
  {
    id: 1,
    name: "Team 1",
  },
  {
    id: 2,
    name: "Team 2",
  },
  {
    id: 3,
    name: "Team 3",
  },
];

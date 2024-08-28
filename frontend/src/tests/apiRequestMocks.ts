import { http, HttpResponse } from "msw";
import { API_V2_BASE_URL } from "../api-v2/apiClient";
import { API_V1_BASE_URL } from "../api-v1/apiClient";

type HttpResponseDto<T> = {
  status: "SUCCESS" | "ERROR";
  data: T;
  message: string;
};

/**
 * Mocks for the API requests.
 */
export const handlers = [
  http.get(API_V2_BASE_URL + "/challenges", () => {
    return HttpResponse.json(successResponse(mockChallenges));
  }),
  http.get(API_V1_BASE_URL + "/answers/my", () => {
    return HttpResponse.json(successResponse(mockAnswers));
  }),
  http.get(API_V2_BASE_URL + "/answers/my", () => {
    return HttpResponse.json(successResponse(mockAnswers));
  }),
  http.get(API_V1_BASE_URL + "/teams", () => {
    return HttpResponse.json(successResponse(mockTeams));
  }),
  http.get("https://www.example.com/greeting", () => {
    return HttpResponse.json({
      greeting: "Hello, world!",
    });
  }),
];

function successResponse<T>(data: T): HttpResponseDto<T> {
  return {
    status: "SUCCESS",
    data: data,
    message: "",
  };
}

/**
 * The default challenges for the tests.
 */
export const mockChallenges = [
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

/**
 * The default answers for the tests.
 */
export const mockAnswers = {
  answers: [
    {
      answer: "42",
      challengeId: 1,
      imageUrl:
        "https://mycyprustravel.com/wp-content/uploads/2018/04/Forty-Two-Bar-e1529047298193.jpg",
    },
    {
      answer: "Paris",
      challengeId: 2,
      imageUrl: null,
    },
  ],
  teamId: 1,
};

/**
 * The default teams for the tests.
 */
export const mockTeams = [
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

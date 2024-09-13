import { User } from "./model/user";
import {
  getEnvOrCrash,
  loadEnvironmentVariables,
} from "../common/utils/environment";
import { Challenge } from "./model/challenge";
import { Answer } from "./model/answer";
import { Op } from "sequelize";

loadEnvironmentVariables();

/**
 * Insert test data into the database.
 */
export async function insertTestData() {
  await insertTestUsers();
  await insertTestChallenges();
  await insertTestAnswers();
}

async function insertTestUsers() {
  const userName = getEnvOrCrash("USER_NAME");
  const userPin = getEnvOrCrash("USER_NAME");
  const adminName = getEnvOrCrash("ADMIN_NAME");
  const adminPin = getEnvOrCrash("ADMIN_PIN");

  await User.bulkCreate([
    {
      name: adminName,
      pin: adminPin,
      isAdmin: true,
    },
    {
      name: userName,
      pin: userPin,
      isAdmin: false,
    },
    {
      name: "John",
      pin: "6677",
      isAdmin: false,
    },
  ]);
}

async function insertTestChallenges() {
  await Challenge.bulkCreate([
    {
      question: "First challenge",
      maxScore: 10,
    },
    {
      question: "Second challenge",
      maxScore: 20,
    },
    {
      question: "Third challenge",
      maxScore: 30,
    },
    {
      question: "Fourth challenge",
      maxScore: 40,
    },
  ]);
}

async function insertTestAnswers() {
  console.log("Creating answers");

  const challenges = await Challenge.findAll({
    where: {
      id: [1, 2, 3],
    },
  });
  const users = await User.findAll();

  for (const challenge of challenges) {
    for (const user of users) {
      let score: number | null = challenge.id + user.id;
      if (score % 2 === 0) {
        score = null;
      }

      await Answer.create({
        userId: user.id,
        challengeId: challenge.id,
        answer: `Answer to challenge ${challenge.id} by user ${user.id}`,
        score: score,
      });
    }
  }
}

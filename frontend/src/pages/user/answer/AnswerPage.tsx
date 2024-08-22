import "./AnswerPage.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { useChallenges } from "../../../queries/challengeQueries";
import { useMyAnswers } from "../../../queries/answerQueries";
import { AnswerDto, ChallengeDto } from "../../../api-v1/models";
import { MainAppBar } from "../../../components/MainAppBar";
import { AnswerSubmitForm } from "./AnswerSubmitForm";

/**
 * A page where the team can submit an answer for one specific challenge.
 * @param props The props for the component
 * @param props.challengeId The ID of the challenge to display
 * @constructor
 */
export function AnswerPage(props: { challengeId: number }) {
  const challenges = useChallenges();
  const myAnswers = useMyAnswers();
  const user = useContext(UserContext).user;
  const userId = user !== null ? user.id : -1;
  const challenge = challenges.data
    ? getSelectedChallenge(challenges.data.data, props.challengeId)
    : null;
  const question = challenge ? challenge.question : "";

  const navigate = useNavigate();

  let mainContent = null;

  if (challenges.isPending || myAnswers.isPending) {
    mainContent = "Loading...";
  }

  if (challenges.error) {
    mainContent = "Could not load challenges, contact the developer";
  }

  if (!challenges.data) {
    mainContent = "No challenges found";
  }

  if (userId == null || challenge == null) {
    mainContent = "Loading challenge data...";
  }

  if (!mainContent) {
    mainContent = (
      <AnswerSubmitForm
        userId={userId}
        challengeId={props.challengeId}
        question={question}
        submittedAnswer={findChallengeAnswer()}
      />
    );
  }

  return (
    <>
      <MainAppBar
        title={`Challenge ${props.challengeId}`}
        onBackClicked={goBack}
      />
      <main>{mainContent}</main>
    </>
  );

  function getSelectedChallenge(
    challenges: ChallengeDto[],
    id: number | null
  ): ChallengeDto | null {
    let challenge: ChallengeDto | null = null;
    if (id) {
      challenge = challenges.find((challenge) => challenge.id === id) || null;
    }
    return challenge;
  }

  function goBack() {
    navigate(-1);
  }

  /**
   * Find answer for this particular challenge
   * @return {null|string}
   */
  function findChallengeAnswer(): AnswerDto | null {
    let answer = null;
    if (myAnswers.data && props.challengeId > 0) {
      const myAnswerList = myAnswers.data.data?.answers || [];
      answer =
        myAnswerList.find((a) => a.challengeId === props.challengeId) || null;
    }
    return answer;
  }
}

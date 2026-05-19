import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRandomPuzzle, submitAnswer } from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";

const PuzzlePage = () => {
  const [searchParams] = useSearchParams();
  const { token } = useContext(AuthContext);
  const [puzzle, setPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    const fetchPuzzle = async () => {
      if (!token) return;

      try {
        const difficulty = searchParams.get("difficulty");
        const data = await getRandomPuzzle(token, difficulty);
        const puzzleData = data.data.puzzle;

        setPuzzle({
          ...puzzleData,
          _id: puzzleData.id,
        });
        setAttempts(data.data.attemptInfo?.attemptsCount || 0);
        setHintVisible(false);
      } catch (err) {
        console.error("Failed to fetch puzzle:", err);
        setFeedback("Failed to load puzzle. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPuzzle();
  }, [searchParams, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!puzzle || !token) return;

    try {
      setLoading(true);
      const result = await submitAnswer(token, puzzle._id, answer);
      const answerResult = result.data;
      setFeedback(answerResult.isCorrect ? "Correct! Well done!" : "Incorrect. Try again.");
      setAttempts(answerResult.attemptsCount);
      if (answerResult.hint) {
        setPuzzle((currentPuzzle) => ({
          ...currentPuzzle,
          hint: answerResult.hint,
          hintUnlocked: answerResult.hintUnlocked,
        }));
      }
      if (answerResult.isCorrect) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      setFeedback(err.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  const handleHint = () => {
    if (!puzzle?.hint) {
      setFeedback("Hint unlocks after 3 attempts.");
      return;
    }

    setHintVisible(true);
  };

  if (loading && !puzzle) {
    return <Loader />;
  }

  if (!puzzle) {
    return <p className="text-text-secondary">No puzzle available</p>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Movie Puzzle</h1>

      {/* Nested puzzle description box */}
      <div
        className="p-4 mb-6 rounded border border-card-border"
        style={{ backgroundColor: "#0f0f0f" }}
      >
        <p className="text-white whitespace-pre-line">{puzzle.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="answer" className="block mb-2 text-sm text-text-secondary">
            Your Answer
          </label>
          <input
            type="text"
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full bg-transparent border border-card-border focus:border-white focus:outline-none rounded px-3 py-2 text-white placeholder-text-tertiary transition-colors duration-200"
            placeholder="Enter the movie name"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Answer"}
        </Button>
      </form>

      {feedback && (
        <p className={`mt-4 text-sm ${feedback.includes("Correct") ? "text-success" : "text-error"}`}>
          {feedback}
        </p>
      )}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-text-secondary text-sm">Attempts: {attempts}</p>
        <Button onClick={handleHint} disabled={hintVisible}>
          {hintVisible ? "Hint Shown" : "Get Hint"}
        </Button>
      </div>

      {hintVisible && puzzle.hint && (
        <p className="mt-4 text-sm text-text-secondary">
          Hint: <span className="text-white">{puzzle.hint}</span>
        </p>
      )}
    </Card>
  );
};

export default PuzzlePage;

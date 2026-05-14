import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { getLeaderboard } from "../api/api";

const HomePage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-white mb-4">Movie Puzzle Game</h1>
        <p className="text-text-secondary mb-6">
          Test your movie knowledge by solving puzzles! Guess the movie based on clues and
          descriptions.
        </p>
        <Link to="/puzzle">
          <Button>Start Game</Button>
        </Link>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">Choose Difficulty</h2>
        <div className="flex space-x-4 justify-center">
          <Link to="/puzzle?difficulty=easy">
            <Button>Easy</Button>
          </Link>
          <Link to="/puzzle?difficulty=medium">
            <Button>Medium</Button>
          </Link>
          <Link to="/puzzle?difficulty=hard">
            <Button>Hard</Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-white mb-4">Leaderboard</h2>
        {loading ? (
          <p className="text-text-secondary">Loading...</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <div
                  key={entry._id}
                  className="flex justify-between items-center p-3 border border-card-border rounded"
                >
                  <span className="text-white">
                    {index + 1}. {entry.username}
                  </span>
                  <span className="text-text-secondary">{entry.totalScore} points</span>
                </div>
              ))
            ) : (
              <p className="text-text-secondary">No entries yet</p>
            )}
          </div>
        )}
        <div className="mt-4">
          <Link to="/leaderboard">
            <Button>View Full Leaderboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;
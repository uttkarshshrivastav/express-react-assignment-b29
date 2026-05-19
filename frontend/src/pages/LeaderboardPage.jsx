import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getLeaderboard, getMyRank } from "../api/api";
import Card from "../components/Card";
import Loader from "../components/Loader";

const LeaderboardPage = () => {
  const { user, token } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardData, myRankData] = await Promise.all([
          getLeaderboard(),
          token ? getMyRank(token) : Promise.resolve(null),
        ]);
        setLeaderboard(leaderboardData.data.leaderboard);
        setMyRank(myRankData?.data || null);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Card className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white">
              <th className="p-3 text-center text-sm font-bold text-white">Rank</th>
              <th className="p-3 text-center text-sm font-bold text-white">Username</th>
              <th className="p-3 text-center text-sm font-bold text-white">Score</th>
              <th className="p-3 text-center text-sm font-bold text-white">Puzzles Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr
                key={entry.userId}
                className={`border-b border-white hover:bg-card-bg transition-colors duration-150 ${
                  user?._id === entry.userId || user?.id === entry.userId ? "border-l-2 border-l-white" : ""
                }`}
              >
                <td className="p-3 text-white">{entry.rank || index + 1}</td>
                <td className="p-3 text-white">{entry.username}</td>
                <td className="p-3 text-white">{entry.totalScore}</td>
                <td className="p-3 text-white">{entry.puzzlesSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {myRank && user && (
        <div className="mt-6 p-4 border border-white rounded">
          <h2 className="text-lg font-bold text-white mb-2">Your Rank</h2>
          <p className="text-text-secondary text-sm">
            {myRank.rank}. {myRank.user.username} - {myRank.user.totalScore} points ({myRank.user.puzzlesSolved} puzzles solved)
          </p>
        </div>
      )}
    </Card>
  );
};

export default LeaderboardPage;

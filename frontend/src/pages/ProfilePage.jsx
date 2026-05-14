import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";

const ProfilePage = () => {
  const { user, token, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(!user);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user && token) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const data = await getProfile(token);
          setProfile(data);
          setUsername(data.username);
          setEmail(data.email);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const updatedData = await updateProfile(token, { username, email });
      setProfile(updatedData);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!profile) {
    return <p className="text-text-secondary">Failed to load profile</p>;
  }

  return (
    <Card className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

      {message && (
        <p className="mb-4 text-success text-sm">{message}</p>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-3">Statistics</h2>
        <div className="space-y-1">
          <p className="text-text-secondary text-sm">Score: <span className="text-white">{profile.totalScore}</span></p>
          <p className="text-text-secondary text-sm">Puzzles Solved: <span className="text-white">{profile.puzzlesSolved}</span></p>
          <p className="text-text-secondary text-sm">Rank: <span className="text-white">Coming soon</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-2 text-sm text-text-secondary">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent border border-card-border focus:border-white focus:outline-none rounded px-3 py-2 text-white placeholder-text-tertiary transition-colors duration-200"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm text-text-secondary">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-card-border focus:border-white focus:outline-none rounded px-3 py-2 text-white placeholder-text-tertiary transition-colors duration-200"
            required
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Card>
  );
};

export default ProfilePage;
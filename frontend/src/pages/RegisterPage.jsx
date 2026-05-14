import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { register } from "../api/api";
import Card from "../components/Card";
import Button from "../components/Button";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await register({ username, email, password });
      login(data.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
      {error && <p className="text-error text-sm mb-4">{error}</p>}
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
            placeholder="yourname"
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
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm text-text-secondary">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-card-border focus:border-white focus:outline-none rounded px-3 py-2 text-white placeholder-text-tertiary transition-colors duration-200"
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-text-secondary text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-white hover:text-text-secondary transition-colors duration-200">
          Login
        </Link>
      </p>
    </Card>
  );
};

export default RegisterPage;
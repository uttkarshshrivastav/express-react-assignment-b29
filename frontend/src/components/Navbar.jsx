import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-black border-b border-card-border py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white hover:text-text-secondary transition-colors duration-200">
          Movie Puzzle Game
        </Link>
        <div className="flex space-x-6 items-center">
          {user ? (
            <>
              <Link to="/puzzle" className="text-white hover:text-text-secondary transition-colors duration-200">
                Play
              </Link>
              <Link to="/leaderboard" className="text-white hover:text-text-secondary transition-colors duration-200">
                Leaderboard
              </Link>
              <Link to="/profile" className="text-white hover:text-text-secondary transition-colors duration-200">
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-transparent border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-black transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-text-secondary transition-colors duration-200">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-transparent border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-black transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
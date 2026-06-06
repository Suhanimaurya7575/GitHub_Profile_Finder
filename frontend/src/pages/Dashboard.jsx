import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [githubUser, setGithubUser] = useState(null);

  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);

  const searchGithubUser = async () => {
    setLoading(true);
    setError("");

    if (!username.trim()) {
      setError("Please enter a GitHub username");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/github/${username}`);

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setGithubUser(null);
        setRepos([]);
        setLoading(false);
        return;
      }

      setError("");
      setGithubUser(data.user);
      setRepos(data.repos);

      setSearchHistory((prev) => {
        const updated = [
          username,
          ...prev.filter((item) => item !== username),
        ].slice(0, 5);

        localStorage.setItem("searchHistory", JSON.stringify(updated));

        return updated;
      });
      setLoading(false);
    } catch (error) {
      console.log(error);

      setError("Something went wrong");
      setGithubUser(null);
      setRepos([]);
      setLoading(false);
    }
  };
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/profile", {
        headers: {
          Authorization: token,
        },
      });

      setUser(response.data);
    } catch (error) {
      navigate("/login");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (profileLoading) {
    return (
      <div className="loading-screen">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1> GitHub Profile Finder</h1>
       
         
           <div className="dashboard-card1">
                  <h2>Hey, {user?.fullName}  </h2>
           </div>
        

        {user && (
          <>
            <div className="user-info">
              <div className="info-row">
                <span>Full Name</span>
                <strong>{user.fullName}</strong>
              </div>

              <div className="info-row">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="info-row">
                <span> Username</span>
                <strong>@{user.userName}</strong>
              </div>
            </div>
            <div className="github-search">
              <input
                type="text"
                placeholder="Enter GitHub Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchGithubUser();
                  }
                }}
              />
              <button
                className="search-btn"
                onClick={searchGithubUser}
                disabled={loading}
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    <FaSearch />
                    Search
                  </>
                )}
              </button>
            </div>
            {error && <p className="error">{error}</p>}
            {searchHistory.length > 0 && (
              <div className="history-container">
                <h4>Recent Searches</h4>

                <div className="history-list">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      className="history-btn"
                      onClick={() => {
                        setUsername(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {githubUser && (
              <div className="github-card">
                <img
                  src={githubUser.avatar_url}
                  alt={githubUser.login}
                  className="github-avatar"
                />
                <h2>{githubUser.name} </h2>
                <p>@{githubUser.login} </p>
                <p className="bio">{githubUser.bio}</p>
                <div className="profile-details">
                  <p>{githubUser.location || "Location not available"}</p>

                  <p>{githubUser.company || "No company added"}</p>

                  <p>
                    Joined:{" "}
                    {new Date(githubUser.created_at).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={githubUser.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="profile-btn"
                >
                  View GitHub Profile
                </a>
                <div className="stats">
                  <div className="stat-box">
                    <h3>{githubUser.followers} </h3>
                    <p>Followers</p>
                  </div>

                  <div className="stat-box">
                    <h3>{githubUser.following} </h3>
                    <p>Following</p>
                  </div>

                  <div className="stat-box">
                    <h3>{githubUser.public_repos} </h3>
                    <p>Repositories</p>
                  </div>
                </div>

                {repos.length > 0 && (
                  <div className="repos-section">
                    <h2>Repositories</h2>

                    {repos.slice(0, 5).map((repo) => (
                      <div key={repo.id} className="repo-card">
                        <h3>{repo.name}</h3>

                        <p>{repo.description || "No description available"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

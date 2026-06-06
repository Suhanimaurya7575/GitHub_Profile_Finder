import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "User-Agent": "GitHub-Profile-Finder",
        },
      }),

      axios.get(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "User-Agent": "GitHub-Profile-Finder",
        },
      }),
    ]);

    res.json({
      user: userResponse.data,
      repos: reposResponse.data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

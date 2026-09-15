import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError("That username or password wasn't recognized.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-serif text-2xl text-paper">Adhere Intelligence</div>
          <div className="text-white/50 text-sm mt-1">Compliance workspace sign in</div>
        </div>
        <form onSubmit={handleSubmit} className="bg-paper px-8 py-8 rounded-sm">
          <label className="block text-sm text-ink mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-ink focus:border-ink"
            autoComplete="username"
            required
          />
          <label className="block text-sm text-ink mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-2 bg-white text-ink focus:border-ink"
            autoComplete="current-password"
            required
          />
          {error && <p className="text-gap text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-ink text-paper py-2 rounded-sm text-sm font-medium hover:bg-ink-light disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

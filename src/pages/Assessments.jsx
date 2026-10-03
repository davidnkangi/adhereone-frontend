import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Assessments() {
  const [assessments, setAssessments] = useState(null);
  const [frameworks, setFrameworks] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [frameworkId, setFrameworkId] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function loadAssessments() {
    api.get("/assessments/").then((res) => setAssessments(res.data.results || res.data));
  }

  useEffect(() => {
    loadAssessments();
    api.get("/frameworks/frameworks/").then((res) => setFrameworks(res.data.results || res.data));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/assessments/", {
        name,
        framework: Number(frameworkId),
        target_completion_date: targetDate || null,
      });
      navigate(`/assessments/${data.id}`);
    } catch {
      setError("Couldn't create that assessment. Check the fields and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Assessments</h1>
          <p className="text-muted text-sm mt-1">Every assessment cycle, by framework.</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="border border-ink text-ink text-sm px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors"
        >
          New Assessment
        </button>
      </header>

      {showNew && (
        <form
          onSubmit={handleCreate}
          className="border border-line rounded-sm p-5 mb-6 bg-white max-w-lg"
        >
          <div className="font-serif text-lg text-ink mb-4">New Assessment</div>

          <label className="block text-sm text-ink mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Q1 2027 HIPAA Readiness Assessment"
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <label className="block text-sm text-ink mb-1">Framework</label>
          <select
            value={frameworkId}
            onChange={(e) => setFrameworkId(e.target.value)}
            required
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          >
            <option value="">Select a framework…</option>
            {frameworks.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.code.toUpperCase()})
              </option>
            ))}
          </select>

          <label className="block text-sm text-ink mb-1">Target completion date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          {error && <p className="text-gap text-sm mb-3">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-paper text-sm px-4 py-2 rounded-sm hover:bg-ink-light disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="text-sm px-4 py-2 text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="w-full text-sm border-t border-line">
        <thead>
          <tr className="text-left text-muted border-b border-line">
            <th className="py-2 font-normal">Name</th>
            <th className="py-2 font-normal">Framework</th>
            <th className="py-2 font-normal">Started</th>
            <th className="py-2 font-normal">Completion</th>
            <th className="py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {assessments?.map((a) => (
            <tr key={a.id} className="border-b border-line hover:bg-white">
              <td className="py-3">
                <Link to={`/assessments/${a.id}`} className="text-ink hover:underline">
                  {a.name}
                </Link>
              </td>
              <td className="py-3 font-mono text-xs uppercase text-muted">{a.framework_code}</td>
              <td className="py-3 text-muted">{a.started_on}</td>
              <td className="py-3 text-muted">{a.completion_pct}%</td>
              <td className="py-3 text-muted">{a.is_locked ? "Locked (audit)" : "Open"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {assessments && assessments.length === 0 && !showNew && (
        <div className="border border-line rounded-sm p-8 text-center mt-4">
          <p className="text-ink font-serif text-lg mb-1">No assessments yet</p>
          <p className="text-muted text-sm">Create one above to begin tracking gaps.</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Overview() {
  const [assessments, setAssessments] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/assessments/")
      .then((res) => setAssessments(res.data.results || res.data))
      .catch(() => setError("Couldn't load assessments."));
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-serif text-2xl text-ink">Compliance Overview</h1>
        <p className="text-muted text-sm mt-1">
          Current posture across every active framework.
        </p>
      </header>

      {error && <p className="text-gap text-sm">{error}</p>}

      {!assessments && !error && (
        <p className="text-muted text-sm">Loading…</p>
      )}

      {assessments && assessments.length === 0 && (
        <div className="border border-line rounded-sm p-8 text-center">
          <p className="text-ink font-serif text-lg mb-1">No assessments yet</p>
          <p className="text-muted text-sm">
            Start one from the Assessments tab to begin tracking gaps.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assessments?.map((a) => (
          <Link
            to={`/assessments/${a.id}`}
            key={a.id}
            className="block border border-line rounded-sm p-5 hover:border-ink transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-muted mb-2">
              {a.framework_code}
            </div>
            <div className="font-serif text-lg text-ink mb-3">{a.name}</div>
            <div className="w-full h-1.5 bg-line rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-compliant"
                style={{ width: `${a.completion_pct}%` }}
              />
            </div>
            <div className="text-sm text-muted">
              {a.completion_pct}% controls compliant
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

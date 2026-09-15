import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Assessments() {
  const [assessments, setAssessments] = useState(null);

  useEffect(() => {
    api.get("/assessments/").then((res) => setAssessments(res.data.results || res.data));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Assessments</h1>
        <p className="text-muted text-sm mt-1">Every assessment cycle, by framework.</p>
      </header>

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
    </div>
  );
}

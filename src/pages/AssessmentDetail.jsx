import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import StatusDot from "../components/StatusDot";

const STATUS_OPTIONS = [
  "not_started",
  "in_progress",
  "compliant",
  "gap",
  "compensating",
  "not_applicable",
];

export default function AssessmentDetail() {
  const { id } = useParams();
  const [findings, setFindings] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [packageResult, setPackageResult] = useState(null);

  useEffect(() => {
    api.get(`/assessments/findings/?assessment=${id}`).then((res) =>
      setFindings(res.data.results || res.data)
    );
  }, [id]);

  async function updateStatus(findingId, status) {
    const { data } = await api.patch(`/assessments/findings/${findingId}/`, { status });
    setFindings((prev) => prev.map((f) => (f.id === findingId ? data : f)));
  }

  async function generateAuditPackage() {
    setGenerating(true);
    try {
      const { data } = await api.post("/reports/audit-packages/", { assessment: id });
      setPackageResult(data);
    } catch {
      setPackageResult({ error: true });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Findings Register</h1>
          <p className="text-muted text-sm mt-1">
            Every control in this assessment, its status, and remediation owner.
          </p>
        </div>
        <button
          onClick={generateAuditPackage}
          disabled={generating}
          className="border border-ink text-ink text-sm px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate Audit Package"}
        </button>
      </header>

      {packageResult && !packageResult.error && (
        <div className="border border-compliant/40 bg-compliant/5 text-sm text-ink rounded-sm px-4 py-3 mb-6">
          Audit package generated and locked as of this moment. Package ID:{" "}
          <span className="font-mono text-xs">{packageResult.id}</span>
        </div>
      )}
      {packageResult?.error && (
        <div className="border border-gap/40 bg-gap/5 text-sm text-ink rounded-sm px-4 py-3 mb-6">
          Couldn't generate the audit package. Check that the assessment isn't already locked.
        </div>
      )}

      <table className="w-full text-sm border-t border-line">
        <thead>
          <tr className="text-left text-muted border-b border-line">
            <th className="py-2 font-normal">Control</th>
            <th className="py-2 font-normal">Status</th>
            <th className="py-2 font-normal">Remediation due</th>
          </tr>
        </thead>
        <tbody>
          {findings?.map((f) => (
            <tr key={f.id} className="border-b border-line align-top">
              <td className="py-3 pr-4">
                <div className="font-mono text-xs text-muted mb-0.5">{f.control_code}</div>
                <div className="text-ink">{f.control_title}</div>
              </td>
              <td className="py-3 pr-4">
                <select
                  value={f.status}
                  onChange={(e) => updateStatus(f.id, e.target.value)}
                  className="border border-line rounded-sm text-sm px-2 py-1 bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <div className="mt-1">
                  <StatusDot status={f.status} />
                </div>
              </td>
              <td className="py-3 text-muted">{f.remediation_due_date || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

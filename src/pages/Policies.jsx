import { useEffect, useState } from "react";
import api from "../api/client";

export default function Policies() {
  const [policies, setPolicies] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [orgName, setOrgName] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadPolicies() {
    api.get("/policies/").then((res) => setPolicies(res.data.results || res.data));
  }

  useEffect(() => {
    loadPolicies();
    api.get("/policies/templates/").then((res) => setTemplates(res.data));
  }, []);

  async function handleGenerate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/policies/generate/", {
        template_id: Number(selectedTemplate),
        organization_name: orgName,
        effective_date: effectiveDate || null,
      });
      setShowGenerate(false);
      setSelectedTemplate("");
      setOrgName("");
      setEffectiveDate("");
      loadPolicies();
    } catch {
      setError("Couldn't generate that policy. Check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Policies</h1>
          <p className="text-muted text-sm mt-1">
            Generated from Adhere's master template library, then yours to customize.
          </p>
        </div>
        <button
          onClick={() => setShowGenerate(true)}
          className="border border-ink text-ink text-sm px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors"
        >
          Generate from Template
        </button>
      </header>

      {showGenerate && (
        <form
          onSubmit={handleGenerate}
          className="border border-line rounded-sm p-5 mb-6 bg-white max-w-lg"
        >
          <div className="font-serif text-lg text-ink mb-4">Generate a Policy</div>

          <label className="block text-sm text-ink mb-1">Template</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            required
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          >
            <option value="">Select a template…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.category})
              </option>
            ))}
          </select>

          <label className="block text-sm text-ink mb-1">Organization name</label>
          <input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            placeholder="e.g. Demo Healthcare Client"
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <label className="block text-sm text-ink mb-1">Effective date</label>
          <input
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          {error && <p className="text-gap text-sm mb-3">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-paper text-sm px-4 py-2 rounded-sm hover:bg-ink-light disabled:opacity-50"
            >
              {submitting ? "Generating…" : "Generate"}
            </button>
            <button
              type="button"
              onClick={() => setShowGenerate(false)}
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
            <th className="py-2 font-normal">Title</th>
            <th className="py-2 font-normal">Category</th>
            <th className="py-2 font-normal">Status</th>
            <th className="py-2 font-normal">Version</th>
            <th className="py-2 font-normal">Effective</th>
            <th className="py-2 font-normal">Next review</th>
          </tr>
        </thead>
        <tbody>
          {policies?.map((p) => (
            <tr key={p.id} className="border-b border-line hover:bg-white">
              <td className="py-3 text-ink">{p.title}</td>
              <td className="py-3 text-muted">{p.category || "—"}</td>
              <td className="py-3 text-muted capitalize">{p.status.replace("_", " ")}</td>
              <td className="py-3 text-muted">v{p.version}</td>
              <td className="py-3 text-muted">{p.effective_date || "—"}</td>
              <td className="py-3 text-muted">{p.next_review_date || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {policies && policies.length === 0 && !showGenerate && (
        <div className="border border-line rounded-sm p-8 text-center mt-4">
          <p className="text-ink font-serif text-lg mb-1">No policies yet</p>
          <p className="text-muted text-sm">
            Generate one from the master template library to get started.
          </p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

const STATUS_OPTIONS = [
  ["draft", "Draft"],
  ["under_review", "Under Review"],
  ["published", "Published"],
  ["retired", "Retired"],
];

export default function PolicyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/policies/${id}/`).then((res) => {
      setPolicy(res.data);
      setForm({
        title: res.data.title,
        category: res.data.category || "",
        status: res.data.status,
        body_markdown: res.data.body_markdown,
        effective_date: res.data.effective_date || "",
        review_cycle_days: res.data.review_cycle_days || "",
      });
    });
  }, [id]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const { data } = await api.patch(`/policies/${id}/`, {
        ...form,
        effective_date: form.effective_date || null,
        review_cycle_days: form.review_cycle_days || null,
      });
      setPolicy(data);
      setSaved(true);
    } catch {
      setError("Couldn't save your changes. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!policy || !form) {
    return <div className="text-muted text-sm">Loading…</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate("/policies")}
        className="text-sm text-muted hover:text-ink mb-4"
      >
        ← Back to Policies
      </button>

      <header className="mb-6">
        <h1 className="font-serif text-2xl text-ink">{policy.title}</h1>
        <p className="text-muted text-sm mt-1">
          v{policy.version}
          {policy.source_template_title && ` — generated from "${policy.source_template_title}"`}
        </p>
      </header>

      <form onSubmit={handleSave} className="max-w-3xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-ink mb-1">Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              required
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Category</label>
            <input
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-ink mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
            >
              {STATUS_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Effective date</label>
            <input
              type="date"
              value={form.effective_date}
              onChange={(e) => updateField("effective_date", e.target.value)}
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-ink mb-1">Review cycle (days)</label>
            <input
              type="number"
              min="1"
              value={form.review_cycle_days}
              onChange={(e) => updateField("review_cycle_days", e.target.value)}
              placeholder="e.g. 365"
              className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
            />
          </div>
        </div>

        <label className="block text-sm text-ink mb-1">Policy text</label>
        <textarea
          value={form.body_markdown}
          onChange={(e) => updateField("body_markdown", e.target.value)}
          rows={20}
          className="w-full border border-line rounded-sm px-3 py-3 mb-4 bg-white text-sm font-mono leading-relaxed"
        />

        {error && <p className="text-gap text-sm mb-3">{error}</p>}
        {saved && <p className="text-compliant text-sm mb-3">Saved.</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-paper text-sm px-4 py-2 rounded-sm hover:bg-ink-light disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

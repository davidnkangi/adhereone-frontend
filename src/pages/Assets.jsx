import { useEffect, useState } from "react";
import api from "../api/client";

const ASSET_TYPES = [
  ["hardware", "Hardware / Endpoint"],
  ["server", "Server"],
  ["network_device", "Network Device"],
  ["cloud_service", "Cloud Service"],
  ["application", "Application / Software"],
  ["database", "Database"],
  ["data_store", "Data Store / Repository"],
  ["mobile_device", "Mobile Device"],
  ["other", "Other"],
];

const CRITICALITIES = ["low", "medium", "high", "critical"];
const STATUSES = [
  ["active", "Active"],
  ["retired", "Retired"],
  ["in_maintenance", "In Maintenance"],
];

const emptyForm = {
  asset_tag: "",
  name: "",
  asset_type: "",
  description: "",
  location: "",
  vendor: "",
  criticality: "medium",
  status: "active",
  stores_or_processes_phi: false,
  stores_or_processes_cui: false,
};

export default function Assets() {
  const [assets, setAssets] = useState(null);
  const [scopeOnly, setScopeOnly] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadAssets() {
    const url = scopeOnly ? "/assets/in-scope/" : "/assets/";
    api.get(url).then((res) => setAssets(res.data.results || res.data));
  }

  useEffect(() => {
    loadAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeOnly]);

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/assets/", form);
      setShowNew(false);
      setForm(emptyForm);
      loadAssets();
    } catch (err) {
      const detail = err?.response?.data;
      setError(
        detail && typeof detail === "object"
          ? Object.entries(detail)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(" ") : msgs}`)
              .join(" ")
          : "Couldn't save that asset. Check the fields and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Asset Inventory</h1>
          <p className="text-muted text-sm mt-1">
            Every hardware, software, and cloud asset in scope.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={scopeOnly}
              onChange={(e) => setScopeOnly(e.target.checked)}
            />
            ePHI / CUI in scope only
          </label>
          <button
            onClick={() => setShowNew(true)}
            className="border border-ink text-ink text-sm px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors"
          >
            Add Asset
          </button>
        </div>
      </header>

      {showNew && (
        <form
          onSubmit={handleCreate}
          className="border border-line rounded-sm p-5 mb-6 bg-white max-w-lg"
        >
          <div className="font-serif text-lg text-ink mb-4">Add Asset</div>

          <label className="block text-sm text-ink mb-1">Asset tag</label>
          <input
            value={form.asset_tag}
            onChange={(e) => updateField("asset_tag", e.target.value)}
            required
            placeholder="e.g. LAPTOP-0142"
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <label className="block text-sm text-ink mb-1">Name</label>
          <input
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            placeholder="e.g. Finance team laptop — J. Doe"
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <label className="block text-sm text-ink mb-1">Type</label>
          <select
            value={form.asset_type}
            onChange={(e) => updateField("asset_type", e.target.value)}
            required
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          >
            <option value="">Select a type…</option>
            {ASSET_TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-ink mb-1">Criticality</label>
              <select
                value={form.criticality}
                onChange={(e) => updateField("criticality", e.target.value)}
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm capitalize"
              >
                {CRITICALITIES.map((c) => (
                  <option key={c} value={c} className="capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
              >
                {STATUSES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-ink mb-1">Location (optional)</label>
              <input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. HQ — 3rd floor, or us-east-1"
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-ink mb-1">Vendor (optional)</label>
              <input
                value={form.vendor}
                onChange={(e) => updateField("vendor", e.target.value)}
                placeholder="e.g. Dell, AWS"
                className="w-full border border-line rounded-sm px-3 py-2 bg-white text-sm"
              />
            </div>
          </div>

          <label className="block text-sm text-ink mb-1">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={2}
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.stores_or_processes_phi}
                onChange={(e) => updateField("stores_or_processes_phi", e.target.checked)}
              />
              Stores/processes ePHI
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.stores_or_processes_cui}
                onChange={(e) => updateField("stores_or_processes_cui", e.target.checked)}
              />
              Stores/processes CUI
            </label>
          </div>

          {error && <p className="text-gap text-sm mb-3">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-paper text-sm px-4 py-2 rounded-sm hover:bg-ink-light disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNew(false);
                setForm(emptyForm);
                setError("");
              }}
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
            <th className="py-2 font-normal">Tag</th>
            <th className="py-2 font-normal">Name</th>
            <th className="py-2 font-normal">Type</th>
            <th className="py-2 font-normal">Criticality</th>
            <th className="py-2 font-normal">Scope</th>
            <th className="py-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {assets?.map((a) => (
            <tr key={a.id} className="border-b border-line hover:bg-white">
              <td className="py-3 font-mono text-xs">{a.asset_tag}</td>
              <td className="py-3 text-ink">{a.name}</td>
              <td className="py-3 text-muted capitalize">{a.asset_type.replace("_", " ")}</td>
              <td className="py-3 text-muted capitalize">{a.criticality}</td>
              <td className="py-3 text-muted">
                {a.stores_or_processes_phi && "ePHI "}
                {a.stores_or_processes_cui && "CUI"}
                {!a.stores_or_processes_phi && !a.stores_or_processes_cui && "—"}
              </td>
              <td className="py-3 text-muted capitalize">{a.status.replace("_", " ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {assets && assets.length === 0 && !showNew && (
        <div className="border border-line rounded-sm p-8 text-center mt-4">
          <p className="text-ink font-serif text-lg mb-1">No assets yet</p>
          <p className="text-muted text-sm">Add one above to start your inventory.</p>
        </div>
      )}
    </div>
  );
}

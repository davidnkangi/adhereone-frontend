import { useEffect, useState } from "react";
import api from "../api/client";

export default function Evidence() {
  const [evidence, setEvidence] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [reviewCycleDays, setReviewCycleDays] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function loadEvidence() {
    api.get("/evidence/").then((res) => setEvidence(res.data.results || res.data));
  }

  useEffect(() => {
    loadEvidence();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      if (reviewCycleDays) formData.append("review_cycle_days", reviewCycleDays);
      await api.post("/evidence/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowUpload(false);
      setTitle("");
      setFile(null);
      setReviewCycleDays("");
      loadEvidence();
    } catch {
      setError("Couldn't upload that file. Check the fields and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Evidence</h1>
          <p className="text-muted text-sm mt-1">
            Uploaded artifacts and their renewal status.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="border border-ink text-ink text-sm px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors"
        >
          Upload Evidence
        </button>
      </header>

      {showUpload && (
        <form
          onSubmit={handleUpload}
          className="border border-line rounded-sm p-5 mb-6 bg-white max-w-lg"
        >
          <div className="font-serif text-lg text-ink mb-4">Upload Evidence</div>

          <label className="block text-sm text-ink mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Q3 Access Review Export"
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <label className="block text-sm text-ink mb-1">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          <label className="block text-sm text-ink mb-1">
            Review cycle (days, optional)
          </label>
          <input
            type="number"
            min="1"
            value={reviewCycleDays}
            onChange={(e) => setReviewCycleDays(e.target.value)}
            placeholder="e.g. 90 for quarterly, 365 for annual"
            className="w-full border border-line rounded-sm px-3 py-2 mb-4 bg-white text-sm"
          />

          {error && <p className="text-gap text-sm mb-3">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-paper text-sm px-4 py-2 rounded-sm hover:bg-ink-light disabled:opacity-50"
            >
              {submitting ? "Uploading…" : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => setShowUpload(false)}
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
            <th className="py-2 font-normal">Version</th>
            <th className="py-2 font-normal">Uploaded</th>
            <th className="py-2 font-normal">Expires</th>
          </tr>
        </thead>
        <tbody>
          {evidence?.map((e) => (
            <tr key={e.id} className="border-b border-line hover:bg-white">
              <td className="py-3">
                <a href={e.file} target="_blank" rel="noreferrer" className="text-ink hover:underline">
                  {e.title}
                </a>
              </td>
              <td className="py-3 text-muted">v{e.version}</td>
              <td className="py-3 text-muted">{e.uploaded_on?.slice(0, 10)}</td>
              <td className="py-3">
                {e.expires_on ? (
                  <span className={e.is_expiring_soon ? "text-pending" : "text-muted"}>
                    {e.expires_on}
                    {e.is_expiring_soon && " — renewal due soon"}
                  </span>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {evidence && evidence.length === 0 && !showUpload && (
        <div className="border border-line rounded-sm p-8 text-center mt-4">
          <p className="text-ink font-serif text-lg mb-1">No evidence yet</p>
          <p className="text-muted text-sm">Upload a file above to get started.</p>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api/client";

export default function Evidence() {
  const [evidence, setEvidence] = useState(null);

  useEffect(() => {
    api.get("/evidence/").then((res) => setEvidence(res.data.results || res.data));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Evidence</h1>
        <p className="text-muted text-sm mt-1">
          Uploaded artifacts and their renewal status.
        </p>
      </header>

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
    </div>
  );
}

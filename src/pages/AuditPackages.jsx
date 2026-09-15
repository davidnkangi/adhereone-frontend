import { useEffect, useState } from "react";
import api from "../api/client";

export default function AuditPackages() {
  const [packages, setPackages] = useState(null);

  useEffect(() => {
    api.get("/reports/audit-packages/").then((res) => setPackages(res.data.results || res.data));
  }, []);

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Audit Packages</h1>
        <p className="text-muted text-sm mt-1">
          Frozen, point-in-time snapshots generated for auditors.
        </p>
      </header>

      <table className="w-full text-sm border-t border-line">
        <thead>
          <tr className="text-left text-muted border-b border-line">
            <th className="py-2 font-normal">Package ID</th>
            <th className="py-2 font-normal">Framework</th>
            <th className="py-2 font-normal">Generated</th>
          </tr>
        </thead>
        <tbody>
          {packages?.map((p) => (
            <tr key={p.id} className="border-b border-line hover:bg-white">
              <td className="py-3 font-mono text-xs">{p.id}</td>
              <td className="py-3 text-muted uppercase text-xs">{p.snapshot?.framework}</td>
              <td className="py-3 text-muted">{p.generated_on?.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

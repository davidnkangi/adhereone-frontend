import { useEffect, useState } from "react";
import api from "../api/client";

export default function Assets() {
  const [assets, setAssets] = useState(null);
  const [scopeOnly, setScopeOnly] = useState(false);

  useEffect(() => {
    const url = scopeOnly ? "/assets/in-scope/" : "/assets/";
    api.get(url).then((res) => setAssets(res.data.results || res.data));
  }, [scopeOnly]);

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-ink">Asset Inventory</h1>
          <p className="text-muted text-sm mt-1">
            Every hardware, software, and cloud asset in scope.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={scopeOnly}
            onChange={(e) => setScopeOnly(e.target.checked)}
          />
          ePHI / CUI in scope only
        </label>
      </header>

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
    </div>
  );
}

const STATUS_STYLES = {
  compliant: { color: "bg-compliant", label: "Compliant" },
  gap: { color: "bg-gap", label: "Gap Identified" },
  in_progress: { color: "bg-pending", label: "In Progress" },
  not_started: { color: "bg-muted", label: "Not Started" },
  compensating: { color: "bg-pending", label: "Compensating Control" },
  not_applicable: { color: "bg-muted", label: "Not Applicable" },
};

export default function StatusDot({ status }) {
  const style = STATUS_STYLES[status] || { color: "bg-muted", label: status };
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${style.color}`} />
      {style.label}
    </span>
  );
}

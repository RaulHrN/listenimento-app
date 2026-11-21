import { STATUS_COLORS, statusLabel, type ItemStatus, type MediaType } from '@acervo/core';

export function StatusBadge({ status, mediaType }: { status: ItemStatus; mediaType: MediaType }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ color, backgroundColor: `${color}1a` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {statusLabel(status, mediaType)}
    </span>
  );
}

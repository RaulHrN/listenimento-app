import { STATUS_COLORS, statusLabel, type ItemStatus, type MediaType } from '@listenimento/core';

/** Carimbo de status, como o carimbo da bilheteria no ingresso. */
export function StatusBadge({ status, mediaType }: { status: ItemStatus; mediaType: MediaType }) {
  return (
    <span className="stamp" style={{ color: STATUS_COLORS[status] }}>
      {statusLabel(status, mediaType)}
    </span>
  );
}

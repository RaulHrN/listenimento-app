import { statusLabel, type ItemStatus, type MediaType } from '@listenimento/core';

/** Status em versaletes com um ponto na cor do tema atual (--st-<status>). */
export function StatusBadge({ status, mediaType, className = '' }: { status: ItemStatus; mediaType: MediaType; className?: string }) {
  return (
    <span className={`tag ${className}`} style={{ color: `var(--st-${status})` }}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(status, mediaType)}
    </span>
  );
}

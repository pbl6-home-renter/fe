export type ParsedAuditMetadataEntry =
  { kind: 'changedFields'; fields: string[] } | { kind: 'lockReason'; value: string } | { kind: 'note'; value: string };

/**
 * Extracts known human-readable entries from audit log metadata without exposing raw JSON.
 */
export const parseAuditLogMetadata = (
  metadata: Record<string, unknown> | null | undefined,
): ParsedAuditMetadataEntry[] => {
  if (!metadata || typeof metadata !== 'object') return [];

  const entries: ParsedAuditMetadataEntry[] = [];

  if (Array.isArray(metadata.changedFields)) {
    const fields = metadata.changedFields.filter(
      (field): field is string => typeof field === 'string' && field.trim().length > 0,
    );
    if (fields.length > 0) {
      entries.push({ kind: 'changedFields', fields });
    }
  }

  if (typeof metadata.lockReason === 'string' && metadata.lockReason.trim().length > 0) {
    entries.push({ kind: 'lockReason', value: metadata.lockReason.trim() });
  }

  if (typeof metadata.note === 'string' && metadata.note.trim().length > 0) {
    entries.push({ kind: 'note', value: metadata.note.trim() });
  }

  return entries;
};

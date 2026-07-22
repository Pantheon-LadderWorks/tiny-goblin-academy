export const ACADEMY_LEDGER_EVENT_MESSAGE = 'tga:ledger-event' as const;
export const ACADEMY_LEDGER_SNAPSHOT_MESSAGE = 'tga:ledger-snapshot' as const;
export const ACADEMY_LEDGER_REQUEST_MESSAGE = 'tga:ledger-request-snapshot' as const;

export type AcademyLedgerEvent = Readonly<{
  gameId: string;
  runId: string;
  sequence: number;
  eventId: string;
  kind: string;
  title: string;
  summary: string;
  phase?: string;
  turn?: number;
  details?: Readonly<Record<string, unknown>>;
}>;

export type AcademyLedgerEventMessage = Readonly<{
  type: typeof ACADEMY_LEDGER_EVENT_MESSAGE;
  event: AcademyLedgerEvent;
}>;

export type AcademyLedgerSnapshotMessage = Readonly<{
  type: typeof ACADEMY_LEDGER_SNAPSHOT_MESSAGE;
  gameId: string;
  runId: string;
  events: readonly AcademyLedgerEvent[];
}>;

export type AcademyLedgerSnapshotRequest = Readonly<{
  type: typeof ACADEMY_LEDGER_REQUEST_MESSAGE;
  gameId: string;
}>;

export type AcademyLedgerInboundMessage =
  | AcademyLedgerEventMessage
  | AcademyLedgerSnapshotMessage;

export type AcademyLedgerMessage =
  | AcademyLedgerInboundMessage
  | AcademyLedgerSnapshotRequest;

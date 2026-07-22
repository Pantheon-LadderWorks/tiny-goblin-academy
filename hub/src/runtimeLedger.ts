import {
  ACADEMY_LEDGER_EVENT_MESSAGE,
  ACADEMY_LEDGER_REQUEST_MESSAGE,
  ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
  type AcademyLedgerEvent,
  type AcademyLedgerInboundMessage,
  type AcademyLedgerSnapshotRequest,
} from '../../contracts/academy-ledger';

const MAX_LEDGER_EVENTS = 300;
const MAX_TEXT_LENGTH = 600;

export type AcademyLedgerProjection = Readonly<{
  gameId: string;
  runId: string | null;
  events: readonly AcademyLedgerEvent[];
}>;

const isNonEmptyText = (value: unknown): value is string => (
  typeof value === 'string'
  && value.trim().length > 0
  && value.length <= MAX_TEXT_LENGTH
);

const isPlainRecord = (value: unknown): value is Record<string, unknown> => (
  Boolean(value)
  && typeof value === 'object'
  && !Array.isArray(value)
);

const freezeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return Object.freeze(value.map(freezeValue));
  if (isPlainRecord(value)) {
    return Object.freeze(Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, freezeValue(nested)]),
    ));
  }
  return value;
};

const parseEvent = (
  value: unknown,
  activeGameId: string,
  expectedRunId?: string,
): AcademyLedgerEvent | null => {
  if (!isPlainRecord(value)) return null;
  if (value.gameId !== activeGameId) return null;
  if (!isNonEmptyText(value.runId)) return null;
  if (expectedRunId && value.runId !== expectedRunId) return null;
  if (!Number.isInteger(value.sequence) || Number(value.sequence) < 1) return null;
  if (!isNonEmptyText(value.eventId)) return null;
  if (!isNonEmptyText(value.kind)) return null;
  if (!isNonEmptyText(value.title)) return null;
  if (!isNonEmptyText(value.summary)) return null;
  if (value.phase !== undefined && !isNonEmptyText(value.phase)) return null;
  if (value.turn !== undefined && (!Number.isInteger(value.turn) || Number(value.turn) < 1)) return null;
  if (value.details !== undefined && !isPlainRecord(value.details)) return null;

  return Object.freeze({
    gameId: activeGameId,
    runId: value.runId,
    sequence: Number(value.sequence),
    eventId: value.eventId,
    kind: value.kind,
    title: value.title,
    summary: value.summary,
    phase: value.phase as string | undefined,
    turn: value.turn as number | undefined,
    details: value.details
      ? freezeValue(value.details) as Readonly<Record<string, unknown>>
      : undefined,
  });
};

export const parseAcademyLedgerMessage = (
  value: unknown,
  activeGameId: string,
): AcademyLedgerInboundMessage | null => {
  if (!isPlainRecord(value)) return null;

  if (value.type === ACADEMY_LEDGER_EVENT_MESSAGE) {
    const event = parseEvent(value.event, activeGameId);
    return event
      ? Object.freeze({ type: ACADEMY_LEDGER_EVENT_MESSAGE, event })
      : null;
  }

  if (value.type !== ACADEMY_LEDGER_SNAPSHOT_MESSAGE) return null;
  if (value.gameId !== activeGameId) return null;
  if (!isNonEmptyText(value.runId)) return null;
  if (!Array.isArray(value.events) || value.events.length > MAX_LEDGER_EVENTS) return null;

  const events: AcademyLedgerEvent[] = [];
  const eventIds = new Set<string>();
  const sequences = new Set<number>();
  for (const candidate of value.events) {
    const event = parseEvent(candidate, activeGameId, value.runId);
    if (!event) return null;
    if (eventIds.has(event.eventId) || sequences.has(event.sequence)) return null;
    eventIds.add(event.eventId);
    sequences.add(event.sequence);
    events.push(event);
  }
  events.sort((left, right) => left.sequence - right.sequence);

  return Object.freeze({
    type: ACADEMY_LEDGER_SNAPSHOT_MESSAGE,
    gameId: activeGameId,
    runId: value.runId,
    events: Object.freeze(events),
  });
};

export const createEmptyLedgerProjection = (
  gameId: string,
): AcademyLedgerProjection => Object.freeze({
  gameId,
  runId: null,
  events: Object.freeze([]),
});

export const applyAcademyLedgerMessage = (
  projection: AcademyLedgerProjection,
  message: AcademyLedgerInboundMessage,
): AcademyLedgerProjection => {
  if (message.type === ACADEMY_LEDGER_SNAPSHOT_MESSAGE) {
    return Object.freeze({
      gameId: message.gameId,
      runId: message.runId,
      events: Object.freeze([...message.events].sort((left, right) => left.sequence - right.sequence)),
    });
  }

  const { event } = message;
  if (event.gameId !== projection.gameId) return projection;
  if (projection.runId !== event.runId) {
    return Object.freeze({
      gameId: projection.gameId,
      runId: event.runId,
      events: Object.freeze([event]),
    });
  }
  if (projection.events.some((existing) => existing.eventId === event.eventId)) return projection;
  if (projection.events.some((existing) => existing.sequence === event.sequence)) return projection;

  return Object.freeze({
    gameId: projection.gameId,
    runId: projection.runId,
    events: Object.freeze(
      [...projection.events, event].sort((left, right) => left.sequence - right.sequence),
    ),
  });
};

export const createAcademyLedgerSnapshotRequest = (
  gameId: string,
): AcademyLedgerSnapshotRequest => Object.freeze({
  type: ACADEMY_LEDGER_REQUEST_MESSAGE,
  gameId,
});

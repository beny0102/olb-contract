/*
 * GENERATED FILE - do not edit.
 * Source: schema/*.schema.json. Rebuild with `npm run build`.
 *  */

/**
 * One entry in a game's append-only event log. The union is discriminated by `type`; envelope fields are shared by every branch.
 */
export type Event =
  | GameStartEvent
  | GameEndEvent
  | LineupSetEvent
  | SubstitutionEvent
  | PitchEvent
  | BallInPlayEvent
  | RunnerEvent
  | InningEndEvent
  | DiscrepancyEvent
  | AmendmentEvent
  | NoteEvent;
export type GameStartEvent = Envelope & {
  type: "game.start";
  payload: GameStartPayload;
  [k: string]: unknown;
};
export type GameEndEvent = Envelope & {
  type: "game.end";
  payload: GameEndPayload;
  [k: string]: unknown;
};
export type LineupSetEvent = Envelope & {
  type: "lineup.set";
  payload: LineupSetPayload;
  [k: string]: unknown;
};
export type SubstitutionEvent = Envelope & {
  type: "substitution";
  payload: SubstitutionPayload;
  [k: string]: unknown;
};
export type PitchEvent = Envelope & {
  type: "pitch";
  payload: PitchPayload;
  [k: string]: unknown;
};
export type BallInPlayEvent = Envelope & {
  type: "ball_in_play";
  payload: BallInPlayPayload;
  [k: string]: unknown;
};
export type RunnerEvent = Envelope & {
  type: "runner";
  payload: RunnerPayload;
  [k: string]: unknown;
};
export type InningEndEvent = Envelope & {
  type: "inning.end";
  payload: InningEndPayload;
  [k: string]: unknown;
};
export type DiscrepancyEvent = Envelope & {
  type: "discrepancy";
  payload: DiscrepancyPayload;
  [k: string]: unknown;
};
export type AmendmentEvent = Envelope & {
  type: "amendment";
  payload: AmendmentPayload;
  [k: string]: unknown;
};
export type NoteEvent = Envelope & {
  type: "note";
  payload: NotePayload;
  [k: string]: unknown;
};

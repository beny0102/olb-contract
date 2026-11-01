/*
 * GENERATED FILE - do not edit.
 * Source: schema/*.schema.json. Rebuild with `npm run build`.
 *  */

/**
 * The WebSocket envelope. Clients and servers both use it; direction is implied by message type. Every subscriber receives a snapshot before any delta.
 */
export type RealtimeMessage =
  SubscribeMessage | PingMessage | SnapshotMessage | EventMessage | HeartbeatMessage | ByeMessage;
/**
 * UUIDv7: time-ordered, lowercase, RFC 9562. v4 identifiers are rejected on purpose so that the log stays sortable by creation time.
 */
export type Uuid = string;
export type HalfInning = "top" | "bottom";
export type TeamSide = "home" | "away";
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
export type GameStartEvent = Event__Envelope & {
  type: "game.start";
  payload: Event__GameStartPayload;
  [k: string]: unknown;
};
/**
 * RFC 3339 timestamp with an explicit offset. UTC (Z) is preferred.
 */
export type Timestamp = string;
/**
 * Where the data came from. Drives the authority rules in the whitepaper (7.2).
 */
export type Source = "human" | "sim" | "vision" | "import";
/**
 * Producer's confidence. Human assertions are 1. Estimated or measured values are lower.
 */
export type Confidence = number;
export type GameEndEvent = Event__Envelope & {
  type: "game.end";
  payload: Event__GameEndPayload;
  [k: string]: unknown;
};
export type LineupSetEvent = Event__Envelope & {
  type: "lineup.set";
  payload: Event__LineupSetPayload;
  [k: string]: unknown;
};
/**
 * Scorekeeping position codes: 1 pitcher, 2 catcher, 3 first base, 4 second base, 5 third base, 6 shortstop, 7 left field, 8 center field, 9 right field; DH/PH/PR for designated hitter, pinch hitter, pinch runner.
 */
export type FieldingPosition = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "DH" | "PH" | "PR";
export type SubstitutionEvent = Event__Envelope & {
  type: "substitution";
  payload: Event__SubstitutionPayload;
  [k: string]: unknown;
};
export type PitchEvent = Event__Envelope & {
  type: "pitch";
  payload: Event__PitchPayload;
  [k: string]: unknown;
};
export type BallInPlayEvent = Event__Envelope & {
  type: "ball_in_play";
  payload: Event__BallInPlayPayload;
  [k: string]: unknown;
};
export type RunnerEvent = Event__Envelope & {
  type: "runner";
  payload: Event__RunnerPayload;
  [k: string]: unknown;
};
export type InningEndEvent = Event__Envelope & {
  type: "inning.end";
  payload: Event__InningEndPayload;
  [k: string]: unknown;
};
export type DiscrepancyEvent = Event__Envelope & {
  type: "discrepancy";
  payload: Event__DiscrepancyPayload;
  [k: string]: unknown;
};
export type AmendmentEvent = Event__Envelope & {
  type: "amendment";
  payload: Event__AmendmentPayload;
  [k: string]: unknown;
};
export type NoteEvent = Event__Envelope & {
  type: "note";
  payload: Event__NotePayload;
  [k: string]: unknown;
};

export interface SubscribeMessage {
  type: "subscribe";
  gameId: Uuid;
  /**
   * Resume point. If the sequence has been evicted from the ring buffer, the server answers with a snapshot instead.
   */
  fromSeq?: number;
  [k: string]: unknown;
}
export interface PingMessage {
  type: "ping";
  [k: string]: unknown;
}
export interface SnapshotMessage {
  type: "snapshot";
  gameId: Uuid;
  seq: number;
  state: GameState;
  [k: string]: unknown;
}
/**
 * Derived game state, as sent in a realtime snapshot. This is a projection of the event log, never an input.
 */
export interface GameState {
  status: "scheduled" | "live" | "final" | "suspended" | "forfeit";
  inning: number;
  half: HalfInning;
  outs: number;
  count: Count;
  bases: Bases;
  score: Score;
  battingTeam: TeamSide;
  lastSeq: number;
  [k: string]: unknown;
}
/**
 * Ball-strike count at the moment the event was recorded.
 */
export interface Count {
  balls: number;
  strikes: number;
  [k: string]: unknown;
}
/**
 * Runner occupancy. null means empty.
 */
export interface Bases {
  first: Uuid | null;
  second: Uuid | null;
  third: Uuid | null;
  [k: string]: unknown;
}
export interface Score {
  home: number;
  away: number;
  [k: string]: unknown;
}
export interface EventMessage {
  type: "event";
  gameId: Uuid;
  seq: number;
  event: Event;
  [k: string]: unknown;
}
/**
 * Fields present on every event, regardless of type.
 */
export interface Event__Envelope {
  contract: "olb.event/1";
  id: Uuid;
  gameId: Uuid;
  /**
   * Dense, gap-free, assigned by the single writer holding the game lock.
   */
  seq: number;
  occurredAt: Timestamp;
  recordedAt: Timestamp;
  source: Source;
  confidence?: Confidence;
  actor: Actor;
  /**
   * Set when this event corrects an earlier one. The original is never mutated.
   */
  revisionOf?: Uuid | null;
  [k: string]: unknown;
}
/**
 * Who or what produced an event.
 */
export interface Actor {
  kind: "user" | "service" | "system";
  id: string;
  [k: string]: unknown;
}
export interface Event__GameStartPayload {
  venue?: string;
  fieldCondition?: "dry" | "wet" | "unknown";
  /**
   * @maxItems 6
   */
  umpires?:
    | []
    | [
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        }
      ]
    | [
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        }
      ]
    | [
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        }
      ]
    | [
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        }
      ]
    | [
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        }
      ]
    | [
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        },
        {
          name: string;
          role?: "plate" | "first" | "second" | "third" | "left" | "right";
          [k: string]: unknown;
        }
      ];
  startedAt?: Timestamp;
  [k: string]: unknown;
}
export interface Event__GameEndPayload {
  reason: "completed" | "forfeit" | "suspended" | "rain" | "darkness" | "other";
  finalScore: Score;
  [k: string]: unknown;
}
export interface Event__LineupSetPayload {
  team: TeamSide;
  /**
   * @minItems 9
   * @maxItems 12
   */
  battingOrder:
    | [
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position: FieldingPosition;
          [k: string]: unknown;
        }
      ];
  pitcher?: Uuid;
  [k: string]: unknown;
}
export interface Event__SubstitutionPayload {
  team: TeamSide;
  playerIn: Uuid;
  playerOut: Uuid;
  position: FieldingPosition;
  battingSlot: number;
  reason?: "injury" | "tactical" | "pitch_count" | "other";
  [k: string]: unknown;
}
export interface Event__PitchPayload {
  pitchNo: number;
  batter: Uuid;
  pitcher: Uuid;
  count: Count;
  /**
   * Retrosheet pitch-sequence subset: ball, called strike, swinging strike, foul, foul tip, in play, pitchout, swinging on pitchout.
   */
  call: "B" | "C" | "S" | "F" | "T" | "X" | "P" | "Q";
  /**
   * Free-form pitch classification (FF, SL, CU, CH...). Stored verbatim; no vocabulary is enforced in v1.
   */
  pitchType?: string;
  trackRef?: Uuid;
  [k: string]: unknown;
}
export interface Event__BallInPlayPayload {
  batter: Uuid;
  /**
   * Retrosheet-style event code with modifiers, e.g. S8, D7/L, HR/F, E5/G, FC6.
   */
  code: string;
  description?: string;
  /**
   * @maxItems 9
   */
  fielders?:
    | []
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          position?: FieldingPosition;
          role: "assist" | "putout" | "error";
          [k: string]: unknown;
        }
      ];
  runsBattedIn: number;
  /**
   * @maxItems 4
   */
  runnersAdvanced?:
    | []
    | [
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        }
      ]
    | [
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        },
        {
          player: Uuid;
          from: "1" | "2" | "3" | "B";
          to: "1" | "2" | "3" | "B" | "H";
          on?: "hit" | "error" | "walk" | "sacrifice" | "steal" | "wild_pitch" | "passed_ball" | "balk" | "other";
          [k: string]: unknown;
        }
      ];
  trackRef?: Uuid;
  /**
   * Verbatim input as received, retained so a parser bug is recoverable without re-watching video.
   */
  raw?: string;
  [k: string]: unknown;
}
export interface Event__RunnerPayload {
  player: Uuid;
  from: "1" | "2" | "3";
  to: "1" | "2" | "3" | "H";
  kind: "steal" | "caught_stealing" | "pickoff" | "wild_pitch" | "passed_ball" | "balk" | "other";
  out: boolean;
  [k: string]: unknown;
}
export interface Event__InningEndPayload {
  inning: number;
  half: HalfInning;
  runsScored: number;
  outs: number;
  [k: string]: unknown;
}
export interface Event__DiscrepancyPayload {
  targetSeq: number;
  field: string;
  humanValue?: unknown;
  machineValue?: unknown;
  status: "open" | "resolved";
  resolution?: string;
  [k: string]: unknown;
}
export interface Event__AmendmentPayload {
  targetSeq: number;
  reason: "data_entry" | "rule_misapplication" | "official_scoring" | "video_review" | "other";
  note?: string;
  replacement?: unknown;
  [k: string]: unknown;
}
export interface Event__NotePayload {
  text: string;
  /**
   * @maxItems 10
   */
  tags?:
    | []
    | [string]
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
    | [string, string, string, string, string, string]
    | [string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string];
  [k: string]: unknown;
}
export interface HeartbeatMessage {
  type: "heartbeat";
  serverTime: Timestamp;
  [k: string]: unknown;
}
export interface ByeMessage {
  type: "bye";
  /**
   * Sent before the server closes a connection. A slow client is dropped rather than buffered unboundedly.
   */
  reason: "backpressure" | "server_shutdown" | "game_finished" | "slow_client" | "error";
  [k: string]: unknown;
}

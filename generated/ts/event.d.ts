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
  | NoteEvent
  | InterferenceEvent
  | EjectionEvent
  | GameSuspendEvent
  | GameResumeEvent;
export type GameStartEvent = Envelope & {
  type: "game.start";
  payload: GameStartPayload;
  [k: string]: unknown;
};
/**
 * UUIDv7: time-ordered, lowercase, RFC 9562. v4 identifiers are rejected on purpose so that the log stays sortable by creation time.
 */
export type Uuid = string;
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
export type TeamSide = "home" | "away";
/**
 * Scorekeeping position codes: 1 pitcher, 2 catcher, 3 first base, 4 second base, 5 third base, 6 shortstop, 7 left field, 8 center field, 9 right field; DH/PH/PR for designated hitter, pinch hitter, pinch runner.
 */
export type FieldingPosition = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "DH" | "PH" | "PR";
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
export type RunnerPayload = {
  player: Uuid;
  from: "1" | "2" | "3" | "bench";
  to: "1" | "2" | "3" | "H";
  kind: "steal" | "caught_stealing" | "pickoff" | "wild_pitch" | "passed_ball" | "balk" | "placed" | "other";
  out: boolean;
  [k: string]: unknown;
};
export type InningEndEvent = Envelope & {
  type: "inning.end";
  payload: InningEndPayload;
  [k: string]: unknown;
};
export type HalfInning = "top" | "bottom";
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
export type InterferenceEvent = Envelope & {
  type: "interference";
  payload: InterferencePayload;
  [k: string]: unknown;
};
export type EjectionEvent = Envelope & {
  type: "ejection";
  payload: EjectionPayload;
  [k: string]: unknown;
};
export type GameSuspendEvent = Envelope & {
  type: "game.suspend";
  payload: GameSuspendPayload;
  [k: string]: unknown;
};
export type GameResumeEvent = Envelope & {
  type: "game.resume";
  payload: GameResumePayload;
  [k: string]: unknown;
};

/**
 * Fields present on every event, regardless of type.
 */
export interface Envelope {
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
export interface GameStartPayload {
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
  rules?: RulesProfile;
  [k: string]: unknown;
}
/**
 * Game-specific playing rules pinned by game.start.
 */
export interface RulesProfile {
  innings?: number;
  mercy?: boolean;
  inningLimit?: number | null;
  dh?: boolean;
  courtesyRunner?: boolean;
  pitchLimit?: number | null;
  extraInningsPlacedRunner?: boolean;
  [k: string]: unknown;
}
export interface GameEndPayload {
  reason: "completed" | "forfeit" | "suspended" | "rain" | "darkness" | "other";
  finalScore: Score;
  [k: string]: unknown;
}
export interface Score {
  home: number;
  away: number;
  [k: string]: unknown;
}
export interface LineupSetPayload {
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
  /**
   * True when the side bats with a designated hitter.
   */
  dh?: boolean;
  [k: string]: unknown;
}
export interface SubstitutionPayload {
  team: TeamSide;
  playerIn: Uuid;
  playerOut: Uuid;
  position: FieldingPosition;
  battingSlot: number;
  reason?: "injury" | "tactical" | "pitch_count" | "courtesy" | "reentry" | "other";
  /**
   * Marks a re-entry into the same batting slot. Complements reason `reentry`.
   */
  reentry?: boolean;
  [k: string]: unknown;
}
export interface PitchPayload {
  pitchNo: number;
  batter: Uuid;
  pitcher: Uuid;
  count: Count;
  /**
   * Retrosheet pitch-sequence subset: ball, called strike, swinging strike, foul, foul tip, in play, pitchout, swinging on pitchout, hit by pitch, intentional ball.
   */
  call: "B" | "C" | "S" | "F" | "T" | "X" | "P" | "Q" | "H" | "I";
  /**
   * Free-form pitch classification (FF, SL, CU, CH...). Stored verbatim; no vocabulary is enforced in v1.
   */
  pitchType?: string;
  trackRef?: Uuid;
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
export interface BallInPlayPayload {
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
export interface InningEndPayload {
  inning: number;
  half: HalfInning;
  runsScored: number;
  outs: number;
  [k: string]: unknown;
}
export interface DiscrepancyPayload {
  targetSeq: number;
  field: string;
  humanValue?: unknown;
  machineValue?: unknown;
  status: "open" | "resolved";
  resolution?: string;
  [k: string]: unknown;
}
export interface AmendmentPayload {
  targetSeq: number;
  reason: "data_entry" | "rule_misapplication" | "official_scoring" | "video_review" | "other";
  note?: string;
  replacement?: unknown;
  [k: string]: unknown;
}
export interface NotePayload {
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
/**
 * Batter interference that awards first base and advances forced runners.
 */
export interface InterferencePayload {
  batter: Uuid;
  kind: "catcher" | "obstruction" | "other";
  fielder?: Uuid;
  description?: string;
  [k: string]: unknown;
}
/**
 * Removes a person from the game. Audit only; the fold does not change state.
 */
export interface EjectionPayload {
  person: Uuid;
  role: "player" | "coach" | "manager" | "umpire" | "other";
  reason: string;
  [k: string]: unknown;
}
export interface GameSuspendPayload {
  reason: string;
  at?: Timestamp;
  [k: string]: unknown;
}
export interface GameResumePayload {
  at?: Timestamp;
  [k: string]: unknown;
}

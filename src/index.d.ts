import type { Event } from "../generated/ts/event";
import type { RealtimeMessage } from "../generated/ts/realtime";
import type { Track } from "../generated/ts/track";

export type { Event, RealtimeMessage, Track };

export interface ValidationResult {
  valid: boolean;
  errors?: string;
}

export declare function validate(kind: "event" | "track" | "realtime", value: unknown): ValidationResult;

export declare function isEvent(value: unknown): value is Event;
export declare function parseEvent(value: unknown): Event;

export declare function isTrack(value: unknown): value is Track;
export declare function parseTrack(value: unknown): Track;

export declare function isRealtimeMessage(value: unknown): value is RealtimeMessage;
export declare function parseRealtimeMessage(value: unknown): RealtimeMessage;

export declare const schemas: {
  event: Record<string, unknown>;
  track: Record<string, unknown>;
  realtime: Record<string, unknown>;
};

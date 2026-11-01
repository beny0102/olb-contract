import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import eventSchema from "../dist/schema/event.schema.json" with { type: "json" };
import realtimeSchema from "../dist/schema/realtime.schema.json" with { type: "json" };
import trackSchema from "../dist/schema/track.schema.json" with { type: "json" };

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const validators = {
  event: ajv.compile(eventSchema),
  track: ajv.compile(trackSchema),
  realtime: ajv.compile(realtimeSchema),
};

function describe(errors) {
  return errors
    .map((error) => `${error.instancePath || "/"} ${error.message}`)
    .join("; ");
}

function validate(kind, value) {
  const valid = validators[kind](value);
  return valid ? { valid: true } : { valid: false, errors: describe(validators[kind].errors) };
}

/** True when the value is a structurally valid event. Unknown fields are allowed. */
export function isEvent(value) {
  return validators.event(value);
}

/** Same check, but throws a readable error instead of returning a boolean. */
export function parseEvent(value) {
  if (!validators.event(value)) {
    throw new Error(`invalid olb.event/1: ${describe(validators.event.errors)}`);
  }
  return value;
}

export function isTrack(value) {
  return validators.track(value);
}

export function parseTrack(value) {
  if (!validators.track(value)) {
    throw new Error(`invalid olb.track/1: ${describe(validators.track.errors)}`);
  }
  return value;
}

export function isRealtimeMessage(value) {
  return validators.realtime(value);
}

export function parseRealtimeMessage(value) {
  if (!validators.realtime(value)) {
    throw new Error(`invalid olb.realtime/1: ${describe(validators.realtime.errors)}`);
  }
  return value;
}

export { validate };
export const schemas = {
  event: eventSchema,
  track: trackSchema,
  realtime: realtimeSchema,
};

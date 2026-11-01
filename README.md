# olb-contract

**The wire contract for [Open League Baseball](https://github.com/beny0102/olb).**

Every component of the platform — scorekeeper app, league API, vision worker, simulator, viewer — speaks this schema and nothing else. It is the only compatibility surface in the project, which is why it is versioned, published and tested on its own.

> Status: `0.1.0`, alpha. The shapes are stable enough to build against; field-level details may still change before `1.0.0`.

## What is in the box

| Schema | Media type | Purpose |
| --- | --- | --- |
| `event` | `olb.event/1` | One entry in a game's append-only event log |
| `track` | `olb.track/1` | Spatial telemetry for one object over one time window |
| `realtime` | — | WebSocket envelope: subscribe, snapshot, delta, heartbeat, bye |
| `common` | — | Shared value objects: UUIDv7, timestamps, vectors, game state |

Three properties are deliberate and worth knowing before you use it:

1. **Events are append-only.** Corrections are new events with `revisionOf` set. Nothing is mutated, ever.
2. **Every measurement carries uncertainty.** A track sample without `sigma` is rejected — a point without an error estimate is not a measurement.
3. **Unknown fields are allowed.** A consumer built against `1.0` accepts payloads from `1.4` that added fields. New *event types* are ignored, not fatal.

## Install

```bash
npm install @olb/contract      # TypeScript types + Ajv validators
pip install olb-contract       # Pydantic models + JSON Schema validation
```

## TypeScript

```ts
import { parseEvent, isRealtimeMessage } from "@olb/contract";
import type { Event, PitchEvent } from "@olb/contract/types";

const event: Event = parseEvent(incoming); // throws with a readable path on failure

if (event.type === "pitch") {
  const pitch = event as PitchEvent; // narrowed by the discriminated union
  console.log(pitch.payload.call, pitch.payload.count);
}

if (isRealtimeMessage(message) && message.type === "snapshot") {
  console.log(message.state.inning, message.state.score);
}
```

Types are plain `.d.ts` files, so they work in any TypeScript project without a runtime dependency. The validators use Ajv 2020-12 and run in Node, browsers and Workers.

## Python

```python
from olb_contract import parse_event, validate

validate(document, "event")        # raises jsonschema.ValidationError
event = parse_event(document)      # returns a Pydantic model
print(event.type, event.seq)

from olb_contract.event import PitchEvent

if isinstance(event, PitchEvent):
    print(event.payload.call.value)
```

The wheel ships its own copy of the bundled schemas, so validation works offline and without the repository.

## Coordinates and units

Non-negotiable, because every downstream bug traces back here:

- **Origin**: rear point (apex) of home plate, ground plane.
- **+x**: toward first base. **+y**: toward center field. **+z**: up.
- **Units**: metres, seconds, m/s internally; mph/km/h only at display time.
- **Handedness**: right-handed.

Statcast data is published in feet with its own convention. Import adapters convert and record the original values; mixed units never enter storage.

## Source of truth and generated code

```
schema/*.schema.json          ← the only files edited by hand
        │
        ├── npm run build
        ▼
dist/schema/*.schema.json     self-contained schemas (external $refs inlined)
generated/ts/*.d.ts           TypeScript types
generated/python/**/*.py      Pydantic models
```

Generated output is **committed**. CI rebuilds it and fails on any diff, so the published types cannot drift from the schemas. See [ADR 0002](https://github.com/beny0102/olb/blob/main/docs/adr/0002-repository-topology.md) for why this repository exists separately.

### Building

Requires Node 20.10+ and `datamodel-codegen` (installed directly, or available through `uv`).

```bash
npm install
npm run build      # regenerate dist/ and generated/
npm test           # build + conformance suite
npm run check      # build + fail if generated output is stale
```

## Conformance fixtures

`fixtures/` is the compatibility test that every consumer runs:

| Directory | Meaning |
| --- | --- |
| `valid/` | Must be accepted |
| `invalid/` | Must be rejected, for the stated reason |
| `forward/` | Produced by a later minor version; must still be accepted |

If your scorer, tracker or viewer passes the same fixtures, it is compatible with the contract — as a test result, not a claim.

## Versioning

- Semantic versioning of the package; the **major version is part of the media type** (`olb.event/1`).
- Within a major: additive only. New optional fields, new event types.
- Deprecation: at least two minor releases of notice and a migration note.
- Breaking changes: new major, written migration path, no silent coercion.
- A consumer that does not recognise an event type logs it and skips it. That behaviour is tested with a "future payload" fixture, not assumed.

## Related repositories

| Repository | Role |
| --- | --- |
| [`olb`](https://github.com/beny0102/olb) | Whitepaper, ADRs, compose profiles, acceptance suite |
| `olb-api` | League ERP, state machine, realtime gateway |
| `olb-web` | Public viewer |
| `olb-scorer` | Scorekeeper PWA |
| `olb-vision` | Calibration and pitch tracking |
| `olb-sim` | Synthetic games with ground truth |

## License

[Apache-2.0](LICENSE). DCO sign-off, no CLA.

/*
 * GENERATED FILE - do not edit.
 * Source: schema/*.schema.json. Rebuild with `npm run build`.
 *  */

/**
 * Spatial telemetry for one object over one contiguous time window. Tracks are referenced by events and never rewrite them. Only the pitch kind is in scope for v1.
 */
export interface Track {
  contract: "olb.track/1";
  id: Uuid;
  gameId: Uuid;
  kind: "pitch" | "batted_ball" | "player" | "bat";
  /**
   * Tracks cannot claim human provenance: a human does not produce samples.
   */
  source: "vision" | "sim" | "import";
  /**
   * The time base the samples are expressed in. Frames are never assumed to be evenly spaced.
   */
  clock: {
    type: "synthetic" | "ntp" | "monotonic";
    epoch: Timestamp;
    /**
     * Nominal samples per second. Informational only.
     */
    rate?: number;
    /**
     * Measured clock error across cameras, in milliseconds. Absent means unknown.
     */
    syncErrorMs?: number;
    [k: string]: unknown;
  };
  /**
   * `field` means the canonical coordinate system. `camera:<id>` means uncalibrated 2D image coordinates.
   */
  frame: string;
  /**
   * @minItems 1
   * @maxItems 20000
   */
  samples: [
    {
      /**
       * Seconds since the clock epoch.
       */
      t: number;
      p: Vec3;
      sigma: NonNegativeVec3;
      [k: string]: unknown;
    },
    ...{
      /**
       * Seconds since the clock epoch.
       */
      t: number;
      p: Vec3;
      sigma: NonNegativeVec3;
      [k: string]: unknown;
    }[]
  ];
  /**
   * Derived summary of the samples. Absent when the raw samples are insufficient to fit.
   */
  fit?: {
    model: string;
    release?: Vec3;
    plate?: Vec3;
    speedMph?: number;
    spinRpm?: number;
    /**
     * Horizontal break in metres, positive toward first base.
     */
    breakIn?: number;
    /**
     * Vertical break in metres, positive upward, relative to a gravity-only path.
     */
    breakVert?: number;
    [k: string]: unknown;
  };
  /**
   * Producer identification. Required so that a bad model version is traceable.
   */
  model: {
    name: string;
    version: Semver;
    [k: string]: unknown;
  };
  quality: {
    /**
     * RMS of the trajectory fit, in metres.
     */
    rms: number;
    inliers: number;
    cameras: number;
    calibrationId?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

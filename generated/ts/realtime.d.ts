/*
 * GENERATED FILE - do not edit.
 * Source: schema/*.schema.json. Rebuild with `npm run build`.
 *  */

/**
 * The WebSocket envelope. Clients and servers both use it; direction is implied by message type. Every subscriber receives a snapshot before any delta.
 */
export type RealtimeMessage =
  SubscribeMessage | PingMessage | SnapshotMessage | EventMessage | HeartbeatMessage | ByeMessage;

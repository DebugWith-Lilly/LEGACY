// LEGACY biometric bridge — SIMULATED.
//
// Mirrors the contract of a certified fingerprint-reader SDK:
//  • no fingerprint image, ridge data or raw template ever reaches the app,
//  • enrolment returns an opaque reference only,
//  • verification returns a result object (match code + score), never biometric data.
// When real hardware is attached, this module is the single place that changes.

export const READER_DEVICE = "LEGACY Secure Reader";
export const READER_MODEL = "LGC-R2";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randomHex(length) {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");
}

/** Opaque reference for a simulated enrolment. Contains no biometric data. */
export function newTemplateReference() {
  return `bio_tpl_lgc_${randomHex(12)}`;
}

export function maskReference(reference) {
  if (!reference) return "—";
  return `bio_tpl_•••• ${reference.slice(-4).toUpperCase()}`;
}

/** Reader handshake. */
export async function connectReader() {
  await sleep(850);
  return {
    connected: true,
    device: READER_DEVICE,
    model: READER_MODEL,
    firmware: "2.4.1",
    secure_element: true,
  };
}

/**
 * Simulated multi-placement enrolment.
 * onScan(placementNumber, ridgeQuality) fires after each placement.
 * failAt = index of the placement that should fail (demo control).
 */
export async function enrolFingerprint({ onScan, scans = 5, failAt = null } = {}) {
  const quality = [];
  for (let i = 0; i < scans; i += 1) {
    await sleep(720);
    if (failAt === i) {
      return {
        ok: false,
        reason: "LOW_QUALITY",
        message:
          "Ridge quality too low on that placement. Clean the reader and place the same finger flat, covering the sensor.",
        at: i + 1,
        quality,
      };
    }
    const score = 89 + Math.round(Math.random() * 9);
    quality.push(score);
    if (onScan) onScan(i + 1, score);
  }
  await sleep(520);
  return {
    ok: true,
    reference: newTemplateReference(),
    quality_score: Math.round(quality.reduce((a, b) => a + b, 0) / quality.length),
  };
}

/**
 * Simulated one-to-one match against the enrolled reference.
 * simulate: "match" | "mismatch" | "noread" (demo controls only).
 */
export async function verifyFingerprint({ reference, simulate = "match" } = {}) {
  await sleep(1450);
  if (!reference) {
    return { verified: false, result_code: "NOT_ENROLLED", match_score: 0 };
  }
  if (simulate === "noread") {
    return { verified: false, result_code: "READER_UNAVAILABLE", match_score: 0 };
  }
  if (simulate === "mismatch") {
    return {
      verified: false,
      result_code: "NO_MATCH",
      match_score: 14 + Math.round(Math.random() * 11),
      reference_tail: reference.slice(-4).toUpperCase(),
    };
  }
  return {
    verified: true,
    result_code: "MATCH",
    match_score: Number((97 + Math.random() * 2.7).toFixed(1)),
    reference_tail: reference.slice(-4).toUpperCase(),
  };
}
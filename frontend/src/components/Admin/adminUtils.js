// ─── Utility Helpers ──────────────────────────────────────────────────────────
// These helpers are used by both HackathonForm and AdminTeamCard.

// A fixed set of background colors for avatar initials
const INITIALS_COLORS = [
  "#1a3a5c",
  "#2d1a5c",
  "#1a3d2b",
  "#3d2a1a",
  "#1a3040",
  "#3d1a2a",
];

/**
 * Returns a consistent background color based on the first character of a name.
 * @param {string} name - e.g. "Web3 Warriors"
 * @returns {string} - hex color string
 */
export const getColor = (name = "") =>
  INITIALS_COLORS[name.charCodeAt(0) % INITIALS_COLORS.length];

/**
 * Extracts up to 2 uppercase initials from a name.
 * @param {string} name - e.g. "Sarah Chen"
 * @returns {string} - e.g. "SC"
 */
export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

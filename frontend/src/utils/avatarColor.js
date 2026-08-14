// Deterministically generates a vibrant background color and initial based on username
const PALETTES = [
  { bg: "bg-amber-500", text: "text-white", border: "border-amber-400" },
  { bg: "bg-emerald-600", text: "text-white", border: "border-emerald-500" },
  { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-500" },
  { bg: "bg-rose-600", text: "text-white", border: "border-rose-500" },
  { bg: "bg-cyan-600", text: "text-white", border: "border-cyan-500" },
  { bg: "bg-violet-600", text: "text-white", border: "border-violet-500" },
  { bg: "bg-orange-600", text: "text-white", border: "border-orange-500" },
  { bg: "bg-teal-600", text: "text-white", border: "border-teal-500" },
  { bg: "bg-pink-600", text: "text-white", border: "border-pink-500" },
  { bg: "bg-blue-600", text: "text-white", border: "border-blue-500" },
];

export function getUserAvatarStyle(username = "") {
  const cleanName = (username || "W").trim();
  const firstChar = cleanName.charAt(0).toUpperCase();
  const charCode = firstChar.charCodeAt(0);
  const index = Math.abs(charCode) % PALETTES.length;

  return {
    initial: firstChar,
    palette: PALETTES[index],
  };
}

export default function getCoordinates(ev, c) {
  return /touch/.test(ev.type)
    ? (ev.originalEvent || ev).changedTouches[0]["page" + c]
    : ev["page" + c];
}

export default function() {
  let room = localStorage.getItem("channel");

  if (!room) {
    room = prompt("Enter a room");

    if (room !== "") {
      localStorage.setItem("channel", room);
    }
  }

  return room;
}

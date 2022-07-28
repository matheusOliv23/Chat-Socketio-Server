const RoomSchema = mongoose.Schema;

const roomSchema = new Schema({
  title: { type: String, required: true },
  members: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  messages: [{ type: mongoose.Types.ObjectId, required: true, ref: "Message" }],
});

module.exports = mongoose.model("Room", roomSchema);

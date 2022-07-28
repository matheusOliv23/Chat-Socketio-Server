const Message = require("../models/message");

const sendMessage = async (req, res, next) => {
  const { username, message, image, date, uid } = req.body;

  // Create message
  const newMessage = new Message({
    username,
    message,
    date,
  });

  try {
    const sess = await mongoose.starSession();
    sess.startTransaction();
    await newMessage.save({ session: sess });
  } catch (error) {
    return next(new Error("Envio de mensagem falhou"));
  }

  res.json({ message: "Mensagem enviada" });
};

exports.sendMessage = sendMessage;

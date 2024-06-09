import Message from '../models/Message.js';
import Group from '../models/Group.js';

export const sendMessage = async (req, res) => {
  const { groupId, content } = req.body;
  const userId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const newMessage = new Message({ groupId, userId, content });
    await newMessage.save();

    group.messages.push(newMessage._id);
    await group.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeMessage = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (!message.likes.includes(userId)) {
      message.likes.push(userId);
      await message.save();
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

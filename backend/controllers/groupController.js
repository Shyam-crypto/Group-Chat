import Group from '../models/Group.js';

export const createGroup = async (req, res) => {
  const { name, members } = req.body;

  try {
    const newGroup = new Group({ name, members });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    await Group.findByIdAndDelete(id);
    res.status(200).json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchGroups = async (req, res) => {
  const { name } = req.query;

  try {
    const groups = await Group.find({ name: new RegExp(name, 'i') });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addMember = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

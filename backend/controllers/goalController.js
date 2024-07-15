const asyncHandler = require("express-async-handler");
const Goal = require("../model/goalModel"); // Ensure this path is correct
const User = require("../model/userModel");
// @desc GET goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
});

// @desc Create a new goal
// @route POST /api/goals
// @access Private
const setGoals = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error("Please add a text field");
  }

  const goal = await Goal.create({
    text,
    user: req.user.id,
  });

  res.status(201).json(goal);
});

// @desc Update a goal
// @route PUT /api/goals/:id
// @access Private
const updateGoals = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let goal = await Goal.findById(id);

  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  const user = await User.findById(req.user.id);

  //Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Make sure the logged in user match  the goal user
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  goal = await Goal.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(goal);
});

// @desc Delete a goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoals = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const goal = await Goal.findById(id);

  // Check if the goal exists
  if (!goal) {
    res.status(404);
    throw new Error("Goal not found");
  }

  // Check if the authenticated user owns the goal
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Delete the goal
  await Goal.findByIdAndDelete(id);

  res.status(200).json({ success: true });
});

module.exports = {
  getGoals,
  setGoals,
  updateGoals,
  deleteGoals,
};

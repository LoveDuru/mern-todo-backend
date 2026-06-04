import List from "../model/listSchema.js";

export const list = async (req, res) => {
  const userId = req.user.id;

  try {
    const newList = await List.find({ user: userId });

    return res.status(200).json(newList);
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const createPost = async (req, res) => {
  const { title, description, completed } = req.body;

  const userId = req.user.id;
  const list = new List({ title, description, completed, user: userId });

  try {
    await list.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const getTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const todo = await List.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    if (todo.user.toString() !== userId) {
      return res.status(403).json({ message: "can only retrieve your todo" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const updateList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, completed } = req.body;

  try {
    const todo = await List.findById(id);
    if (!todo) {
      return res.status(404).json({ message: "no todo found" });
    }
    if (todo.user.toString() !== userId) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const updatedTodo = await List.findByIdAndUpdate(
      id,
      { title, description, completed },
      {
        returnDocument: "after",
      }
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const deletedTodo = await List.findOneAndDelete({ _id: id, user: userId });

    if (!deletedTodo) {
      return res
        .status(404)
        .json({ message: "Todo not found or unauthorized" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

const express = require("express");
const jwt = require("jsonwebtoken");
const habbits = express.Router();

const {
  getAllHabbits,
  getUserHabbits,
  getHabbitByID,
  createHabbit,
  updateHabbit,
  deleteHabbit,
} = require("../queries/habbitsQueries");

const { getUserByID } = require("../queries/usersQueries");

const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

const JSK = process.env.JWT_SECRET;

habbits.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  try {
    const allHabbits = await getAllHabbits();
    console.log("=== GET all habbits", allHabbits, "===");

    if (allHabbits) {
      res.status(200).json({ payload: allHabbits });
    } else {
      res.status(404).json({ error: "Cannot find any habbits" });
    }
  } catch (error) {
    console.error("habbits.GET /", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
});

habbits.get(
  "/user",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const userHabbits = await getUserHabbits(decoded.user.id);
      console.log("=== GET user habbits", userHabbits, "===");

      if (userHabbits) {
        res.status(200).json({ payload: userHabbits });
      } else {
        res.status(404).json({ error: "Cannot find any habbits" });
      }
    } catch (error) {
      console.error("habbits.GET /user", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

habbits.get(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const checkUser = await getUserByID(decoded.user.id);
      const getHabbit = await getHabbitByID(id);
      console.log("=== GET habbit by ID", getHabbit, "===");

      if (getHabbit) {
        if (checkUser.id === getHabbit.user_id) {
          res.status(200).json({ payload: getHabbit });
        } else {
          res.status(401).json({ error: "User does not own this habbit" });
        }
      } else {
        res.status(404).json({ error: "Habbit not found" });
      }
    } catch (error) {
      console.error("habbits.GET /:id", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

habbits.post(
  "/create",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const newHabbitData = {
      user_id: decoded.user.id,
      habit_name: req.body.habit_name,
      habit_task: req.body.habit_task,
      habit_task_completed: req.body.habit_task_completed,
      habit_category: req.body.habit_category,
      habit_interval: req.body.habit_interval,
      habit_progress: req.body.habit_progress,
      times_per_interval: req.body.times_per_interval,
      start_date: req.body.start_date,
      last_completed_date: req.body.last_completed_date,
      end_date: req.body.end_date,
      is_active: req.body.is_active,
      habit_completed: req.body.habit_completed,
    };

    try {
      const createdHabbit = await createHabbit(newHabbitData);
      console.log("=== POST habbit", createdHabbit, "===");

      if (createdHabbit) {
        res.status(200).json({ payload: createdHabbit });
      } else {
        res.status(404).json({ error: "habbit not created" });
      }
    } catch (error) {
      console.error("habbits.POST /create", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

habbits.put(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const updatedHabbitData = {
      habit_name: req.body.habit_name,
      habit_task: req.body.habit_task,
      habit_task_completed: req.body.habit_task_completed,
      habit_category: req.body.habit_category,
      habit_interval: req.body.habit_interval,
      habit_progress: req.body.habit_progress,
      times_per_interval: req.body.times_per_interval,
      start_date: req.body.start_date,
      last_completed_date: req.body.last_completed_date,
      end_date: req.body.end_date,
      is_active: req.body.is_active,
      habit_completed: req.body.habit_completed,
    };

    try {
      const checkUser = await getUserByID(decoded.user.id);
      const getHabbit = await getHabbitByID(id);

      if (getHabbit) {
        if (checkUser.id === getHabbit.user_id) {
          const updatedHabbit = await updateHabbit(id, updatedHabbitData);
          console.log("=== PUT habbit", updatedHabbit, "===");

          if (updatedHabbit) {
            res.status(200).json({ payload: updatedHabbit });
          } else {
            res.status(404).json({ error: "habbit not updated" });
          }
        } else {
          res.status(404).json({ error: "Uer does not own this habbit" });
        }
      } else {
        res.status(401).json({ error: "habbit not found" });
      }
    } catch (error) {
      console.error("habbits.PUT /:id", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

habbits.delete(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);

    try {
      const checkUser = await getUserByID(decoded.user.id);
      const getHabbit = await getHabbitByID(id);

      if (checkUser.id === getHabbit.user_id) {
        if (getHabbit) {
          const deletedHabbit = await deleteHabbit(id);
          console.log("=== DELETE habbit", deletedHabbit, "===");

          if (deletedHabbit) {
            res.status(200).json({ payload: deletedHabbit });
          } else {
            res.status(404).json({ error: "habbit not deleted" });
          }
        } else {
          res.status(404).json({ error: "habbit not found" });
        }
      } else {
        res.status(401).json({ error: "Uer does not own this habbit" });
      }
    } catch (error) {
      console.error("habbits.DELETE /:id", { error });
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = habbits;

import { Loadout } from "../models/loadoutModel.js";
import { LoadoutLike } from "../models/likeModel.js";
import { classEnums } from "../utls/enums.js";
import { Item } from "../models/itemModel.js";

const getAll = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  try {
    const [loadouts, totalItems] = await Promise.all([
      Loadout.find().skip(skip).limit(limit).lean(),
      Loadout.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalItems / limit);

    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const loadoutids = loadouts.map((loadout) => loadout._id);

    const likes = await LoadoutLike.find({
      userId: req.userId,
      loadoutId: {
        $in: loadoutids,
      },
    }).lean();

    const likesSet = new Set(likes.map((like) => like.loadoutId.toString()));

    const loadoutsWithLikes = loadouts.map((loadout) => ({
      ...loadout,
      isLiked: likesSet.has(loadout._id.toString()) ? true : false,
    }));

    return res.status(200).json({
      loadouts: loadoutsWithLikes,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getPopular = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = limit * (page - 1);

  try {
    const [loadouts, totalItems] = await Promise.all([
      Loadout.find({})
        .sort({ likeCount: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Loadout.countDocuments(),
    ]);
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const loadoutIds = loadouts.map((loadout) => loadout._id);

    const likes = await LoadoutLike.find({
      userId: req.userId,
      loadoutId: {
        $in: loadoutIds,
      },
    }).lean();

    const likesSet = new Set(likes.map((like) => like.loadoutId.toString()));

    const loadoutsWithLikes = loadouts.map((loadout) => ({
      ...loadout,
      isLiked: likesSet.has(loadout._id.toString()),
    }));

    return res.status(200).json({
      loadouts: loadoutsWithLikes,
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({
        error: "Id is required",
      });
    }

    const loadout = await Loadout.findById(id).lean();

    if (!loadout) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    loadout.isLiked = false;

    const exist = await LoadoutLike.exists({
      userId: req.userId,
      loadoutId: loadout._id,
    });

    if (exist) {
      loadout.isLiked = true;
    }

    return res.status(200).json(loadout);
  } catch (error) {
    next(error);
  }
};

const deleteOne = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({
        error: "Id is required",
      });
    }
    const loadoutToBeDeleted = await Loadout.findById(id);

    if (req.userId.toString() !== loadoutToBeDeleted.owner.toString()) {
      return res.status(401).json({
        error: "Unauthorized action",
      });
    }

    const deleted = await Loadout.deleteOne({ _id: id });
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const createLoadout = async (req, res, next) => {
  const {
    title,
    loadoutClass,
    primarySlot,
    secondarySlot,
    gadgetSlot,
    throwableSlot,
  } = req.body;

  try {
    if (!classEnums.includes(loadoutClass)) {
      return res.status(400).json({ error: "Invalid class" });
    }

    const itemIds = [
      primarySlot,
      secondarySlot,
      gadgetSlot,
      throwableSlot,
    ].filter(Boolean);

    const items = await Item.find({
      _id: { $in: itemIds },
    }).lean();

    if (items.length !== itemIds.length) {
      return res.status(400).json({ error: "One or more item id is invalid" });
    }

    for (const item of items) {
      const classCorrect =
        item.classRestriction.includes(loadoutClass) ||
        item.classRestriction.includes("All");
      if (!classCorrect) {
        return res.status(400).json({
          error: "One or more item class does not match loadout class",
        });
      }
    }

    const createdLoadout = await Loadout.create({
      title,
      owner: req.userId,
      loadoutClass,
      primarySlot,
      secondarySlot,
      gadgetSlot,
      throwableSlot,
    });

    return res.status(201).json(createdLoadout);
  } catch (error) {
    next(error);
  }
};

const editLoadout = async (req, res, next) => {
  const id = req.params.id;
  const {
    title,
    loadoutClass,
    primarySlot,
    secondarySlot,
    gadgetSlot,
    throwableSlot,
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    if (loadoutClass) {
      if (!classEnums.includes(loadoutClass)) {
        return res.status(400).json({ error: "Invalid class" });
      }
    }

    const itemIds = [
      primarySlot,
      secondarySlot,
      gadgetSlot,
      throwableSlot,
    ].filter(Boolean);

    const items = await Item.find({
      _id: { $in: itemIds },
    }).lean();

    if (items.length !== itemIds.length) {
      return res.status(400).json({ error: "One or more item id is invalid" });
    }

    for (const item of items) {
      const classCorrect =
        item.classRestriction.includes(loadoutClass) ||
        item.classRestriction.includes("All");
      if (!classCorrect) {
        return res.status(400).json({
          error: "One or more item class does not match loadout class",
        });
      }
    }
    const loadoutToBeEdited = await Loadout.findById(id);

    if (!loadoutToBeEdited) {
      return res.status(404).json({
        error: "Loadout not found",
      });
    }

    if (loadoutToBeEdited.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({
        error: "Unauthorized action",
      });
    }

    const updatedLoadout = await Loadout.findByIdAndUpdate(
      id,
      {
        title,
        loadoutClass,
        primarySlot,
        secondarySlot,
        gadgetSlot,
        throwableSlot,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    return res.status(200).json(updatedLoadout);
  } catch (error) {
    next(error);
  }
};

const likeLoadout = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({
        error: "Id is required",
      });
    }

    const loadout = await Loadout.findByIdAndUpdate(id, {
      $inc: { likes: 1 },
    });

    if (!loadout) {
      return res.status(404).json({
        error: "Loadout not found",
      });
    }

    const existingLike = await LoadoutLike.findOne({
      userId: req.userId,
      loadoutId: id,
    });

    if (existingLike) {
      return res.status(200).json({
        message: "Loadout liked.",
      });
    }

    await LoadoutLike.create({
      userId: req.userId,
      loadoutId: id,
    });

    const updatedLoadout = await Loadout.findByIdAndUpdate(
      id,
      {
        $inc: { likeCount: 1 },
      },
      {
        returnDocument: "after",
      },
    );

    return res.status(200).json({ message: "Loadout liked." });
  } catch (error) {
    next(error);
  }
};

export {
  getAll,
  getOne,
  deleteOne,
  createLoadout,
  editLoadout,
  likeLoadout,
  getPopular,
};

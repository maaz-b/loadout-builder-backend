import { Item } from "../models/itemModel.js";

const getAllItems = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  try {
    const items = await Item.find().skip(skip).limit(limit);
    const totalItems = await Item.countDocuments();

    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getItem = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ error: "No items found for this id" });
    }

    return res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }
    const item = await Item.findByIdAndDelete(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  const { name, itemType, category, classRestriction, stats } = req.body;

  try {
    const newItem = !stats
      ? {
          name,
          itemType,
          category,
          classRestriction,
        }
      : {
          name,
          itemType,
          category,
          classRestriction,
          stats: {
            damage: stats.damage,
            rpm: stats.rps,
            magazineSize: stats.magazineSize,
            effectiveRange: stats.effectiveRange,
          },
        };

    const createdItem = await Item.create(newItem);

    return res.status(200).json(createdItem);
  } catch (error) {
    next(error);
  }
};

const editItem = async (req, res, next) => {
  const id = req.params.id;
  const { name, itemType, category, classRestriction, stats } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Id is required" });
    }

    const newItem = !stats
      ? {
          name,
          itemType,
          category,
          classRestriction,
        }
      : {
          name,
          itemType,
          category,
          classRestriction,
          stats: {
            damage: stats.damage,
            rpm: stats.rpm,
            magazineSize: stats.magazineSize,
            effectiveRange: stats.effectiveRange,
          },
        };

    const replacedItem = await Item.findByIdAndUpdate(id, newItem, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(replacedItem);
  } catch (error) {
    next(error);
  }
};

export { getAllItems, getItem, deleteItem, createItem, editItem };

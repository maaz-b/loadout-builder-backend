import { Schema, model } from "mongoose";

const loadoutLikeSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loadoutId: {
      type: Schema.Types.ObjectId,
      ref: "Loadout",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

loadoutLikeSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id;
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const LoadoutLike = model("LoadoutLike", loadoutLikeSchema);

export { LoadoutLike };

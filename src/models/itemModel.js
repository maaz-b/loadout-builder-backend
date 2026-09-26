import { Schema, model } from "mongoose";

const itemSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ["Weapon", "Gadget", "Throwable"],
    },
    category: {
      type: String,
      required: true,
    },
    classRestriction: [
      {
        type: String,
        required: true,
        enum: ["Assault", "Engineer", "Support", "Recon", "All"],
      },
    ],

    stats: {
      damage: {
        type: Number,
      },
      rpm: {
        type: Number,
      },
      magazineSize: {
        type: Number,
      },
      effectiveRange: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

itemSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id;
    delete returnedObj._id;
    delete returnedObj.__V;
  },
});

const Item = model("Item", itemSchema);

export { Item };

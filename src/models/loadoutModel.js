import { Schema, model } from "mongoose";

const loadoutSchema = Schema(
  {
    title: {
      type: String,
      default: "Custom Loadout",
    },
    class: {
      type: String,
      required: true,
      enum: ["Assault", "Engineer", "Support", "Recon"],
    },
    primarySlot: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    secondarySlot: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    gadgetSlot: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    throwableSlot: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  },
  { timestamps: true },
);

loadoutSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id;
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

const Loadout = model("Loadout", loadoutSchema);

export { Loadout };

import { Schema, model } from "mongoose";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: (props) => `${props} is not a valid email.`,
      },
    },

    name: {
      type: String,
      required: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    verificationCode: {
      type: String,
    },

    verificationCodeExpiry: {
      type: Date,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    savedBuilds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Loadout",
        },
      ],
      validator: [
        function (val) {
          return val.length <= 200;
        },
      ],
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;

    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
    delete returnedObject.verificationCode;
    delete returnedObject.verificationCodeExpiry;
  },
});

const User = model("user", userSchema);

export { User };

import { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IAccount {
  userId: Schema.Types.ObjectId;
  name: string;
  password?: string;
  profileImage?: string;
  provider?: string;
  providerAccountId?: string;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    password: { type: String },
    profileImage: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String }, // external id
  },
  { timestamps: true }
);

AccountSchema.pre("save", async function (this: IAccount & Document) {
  // Only hash the password if it has been modified (or is new)
  if (this.password && this.isModified("password")) {
    try {
      // Generate a salt with a cost factor (e.g., 10)
      const salt = await bcrypt.genSalt(10);
      // Hash the password with the generated salt
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      throw new Error(`Something went wrong creating the account for ${this.userId}`);
    }
  }
});

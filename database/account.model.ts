import { Document, model, models, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAccount {
  userId: Schema.Types.ObjectId;
  name: string;
  password?: string;
  image?: string;
  provider?: string;
  providerAccountId?: string;
}

// The Document (Data + Methods)
export interface IAccountDocument extends IAccount, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const AccountSchema = new Schema<IAccountDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    password: { type: String },
    image: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String }, // external id
  },
  { timestamps: true }
);

// The Middleware
// 'IAccount & Document' means: "The data in my interface PLUS Mongoose methods"
AccountSchema.pre('save', async function (this: IAccount & Document) {
  // Only hash the password if it has been modified (or is new)
  if (this.password && this.isModified('password')) {
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

// The custom method
AccountSchema.methods.comparePassword = async function (this: IAccountDocument, candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password || '');
};

const Account = models?.Account || model<IAccountDocument>('Account', AccountSchema);

export default Account;

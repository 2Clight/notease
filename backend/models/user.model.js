import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant', // Each user belongs to exactly one tenant (company)
    required: true,
  },
}, { timestamps: true });



//method to compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//placed last because it is the final step in the model definition
const User= mongoose.model("User", userSchema);



export default User;
import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator";


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [4, "Name should have more than 4 characters"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [6, "Password should be greater than 5 characters"],
    },
    refreshToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre( "save", async function ( next ) {
  if ( this.isModified( "password" ) ) {
    console.log("before update: ", this.password);
    this.password = await bcrypt.hash(this.password, 10);
    console.log("after update: ", this.password);
  }
    return next()
})

userSchema.methods.isPasswordCorrect = async function ( password ) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};





export const User = model("User", userSchema)
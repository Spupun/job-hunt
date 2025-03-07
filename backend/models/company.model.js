import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  website: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[a-zA-Z0-9-_.]+\.[a-zA-Z]+/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  location: { type: String, required: true, trim: true },
  logo: { type: String, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, default: Date.now },
});

const Company = mongoose.model("Company", companySchema);

export { Company }; // Named export

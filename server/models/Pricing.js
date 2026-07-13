import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema({
  basePrice: {
    type: Number,
    required: true,
    default: 499
  },
  typeAdditions: {
    type: Map,
    of: Number,
    default: {}
  },
  sizeAdditions: {
    type: Map,
    of: Number,
    default: {}
  },
  fabricAdditions: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

pricingSchema.statics.getOrCreate = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      basePrice: 499,
      typeAdditions: {
        "Crew Neck": 0,
        "V-Neck": 50,
        "Polo": 100,
        "Long Sleeve": 120,
        "Tank Top": -30
      },
      sizeAdditions: {
        "S": 0,
        "M": 0,
        "L": 0,
        "XL": 50
      },
      fabricAdditions: {
        "Cotton": 0,
        "Polyester": -50,
        "Cotton Blend": 20,
        "Organic Cotton": 80
      }
    });
  }
  return config;
};

const Pricing = mongoose.model("Pricing", pricingSchema);
export default Pricing;

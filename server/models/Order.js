import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const designSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },
    text: {
      type: String,
      trim: true,
      default: ""
    },
    previewImage: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    index: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: productSchema,
    required: true
  },
  design: {
    type: designSchema,
    default: () => ({})
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ["Pending", "Contacted", "Completed"],
    default: "Pending"
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

orderSchema.pre("validate", async function preValidate(next) {
  if (this.orderId) {
    next();
    return;
  }

  let isUnique = false;

  while (!isUnique) {
    const candidate = `ORD${Math.floor(10000 + Math.random() * 90000)}`;
    const existingOrder = await mongoose.models.Order.findOne({ orderId: candidate });

    if (!existingOrder) {
      this.orderId = candidate;
      isUnique = true;
    }
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
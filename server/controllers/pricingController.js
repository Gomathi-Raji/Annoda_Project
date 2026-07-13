import Pricing from "../models/Pricing.js";

export const getPricing = async (req, res, next) => {
  try {
    const pricing = await Pricing.getOrCreate();
    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

export const updatePricing = async (req, res, next) => {
  try {
    const { basePrice, typeAdditions, sizeAdditions, fabricAdditions } = req.body;
    
    let pricing = await Pricing.findOne();
    if (!pricing) {
      pricing = new Pricing();
    }
    
    if (basePrice !== undefined) pricing.basePrice = basePrice;
    if (typeAdditions !== undefined) pricing.typeAdditions = typeAdditions;
    if (sizeAdditions !== undefined) pricing.sizeAdditions = sizeAdditions;
    if (fabricAdditions !== undefined) pricing.fabricAdditions = fabricAdditions;
    
    await pricing.save();
    
    res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    next(error);
  }
};

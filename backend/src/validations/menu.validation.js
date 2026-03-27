const { z } = require("zod");

const createMenuSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
    price: z.number().positive("Price must be positive"),
    description: z.string().max(500).optional(),
    ingredients: z.array(z.string()).optional(),
    isVegetarian: z.boolean().optional(),
    isVegan: z.boolean().optional(),
    isGlutenFree: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
    isSpecial: z.boolean().optional(),
    preparationTime: z.number().int().positive().optional(),
  }),
});

const updateMenuSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid menu ID"),
  }),
  body: createMenuSchema.shape.body.partial(),
});

module.exports = {
  createMenuSchema,
  updateMenuSchema,
};

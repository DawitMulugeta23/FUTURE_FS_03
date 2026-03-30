// validations/service.validation.js
const { z } = require("zod");

const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500),
    price: z.number().min(0, "Price cannot be negative").optional(),
    duration: z
      .number()
      .min(5, "Duration must be at least 5 minutes")
      .max(480)
      .optional(),
    category: z
      .enum(["food", "beverage", "event", "catering", "special", "other"])
      .optional(),
    isAvailable: z.boolean().optional(),
    isPopular: z.boolean().optional(),
    requirements: z.string().max(500).optional(),
    includes: z.array(z.string()).optional(),
    maxCapacity: z.number().min(1).nullable().optional(),
    bookingRequired: z.boolean().optional(),
  }),
});

const updateServiceSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid service ID"),
  }),
  body: createServiceSchema.shape.body.partial(),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};

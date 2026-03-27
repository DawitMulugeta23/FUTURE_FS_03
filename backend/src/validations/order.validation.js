const { z } = require("zod");

const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          menuItem: z
            .string()
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid menu item ID"),
          quantity: z.number().int().min(1, "Quantity must be at least 1"),
          specialInstructions: z.string().max(200).optional(),
        }),
      )
      .min(1, "At least one item is required"),
    paymentMethod: z.enum(["cash", "card", "online"]),
    specialInstructions: z.string().max(500).optional(),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID"),
  }),
  body: z.object({
    status: z.enum([
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ]),
  }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};

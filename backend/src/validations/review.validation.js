const { z } = require("zod");

const createReviewSchema = z.object({
  body: z.object({
    menuItem: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid menu item ID")
      .optional(),
    rating: z.number().int().min(1).max(5),
    title: z.string().max(100).optional(),
    comment: z
      .string()
      .min(10, "Comment must be at least 10 characters")
      .max(500),
  }),
});

const updateReviewSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid review ID"),
  }),
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().max(100).optional(),
    comment: z.string().min(10).max(500).optional(),
  }),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
};

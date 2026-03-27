const { z } = require("zod");

const createReservationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    time: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    guests: z.number().int().min(1).max(20),
    specialRequests: z.string().max(500).optional(),
  }),
});

const updateReservationStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid reservation ID"),
  }),
  body: z.object({
    status: z.enum([
      "confirmed",
      "seated",
      "completed",
      "cancelled",
      "no_show",
    ]),
  }),
});

module.exports = {
  createReservationSchema,
  updateReservationStatusSchema,
};

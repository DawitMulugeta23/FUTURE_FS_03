module.exports = {
  USER_ROLES: {
    CUSTOMER: "customer",
    STAFF: "staff",
    ADMIN: "admin",
  },

  ORDER_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PREPARING: "preparing",
    READY: "ready",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
  },

  PAYMENT_METHODS: {
    CASH: "cash",
    CARD: "card",
    ONLINE: "online",
  },

  PAYMENT_STATUS: {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
  },

  RESERVATION_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    SEATED: "seated",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    NO_SHOW: "no_show",
  },

  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  MESSAGES: {
    SUCCESS: "Operation successful",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    NOT_FOUND: "Resource not found",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Access forbidden",
    VALIDATION_ERROR: "Validation error",
    SERVER_ERROR: "Internal server error",
  },
};


/**
 * Reusable Zod request-validation middleware.
 *
 * Usage:
 * validate(schema)
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(422).json({
        success: false,
        message: "Request validation failed.",
        errors,
      });
    }

    // Replace the request body with validated and transformed data.
    req.body = result.data;

    next();
  };
};

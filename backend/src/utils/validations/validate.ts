import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
          const message = err.errors.map(e => e.message).join(", ");
          return res.status(400).json({ message });
      }
      next(err);
    }
  };

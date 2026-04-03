import { ZodObject, type ZodRawShape } from "zod";
import { GlobalErrorHandler } from "./GlobalErrorHandler.js";

export function validationErrorHandler<TPayload>(
  zodSchema: ZodObject<ZodRawShape>,
  payload: TPayload,
) {
  const validatePayload = zodSchema.safeParse(payload);
  if (!validatePayload.success) {
    const errors = validatePayload.error.issues.map(
      (error) => `${error.path.join(",") ?? "UnknownPath"}:${error.message} `,
    );
    // console.log(validatePayload.error.issues);
    throw new GlobalErrorHandler("ValidateError", errors.join(","), 400, true);
  } else {
    return validatePayload.data as TPayload;
  }
}

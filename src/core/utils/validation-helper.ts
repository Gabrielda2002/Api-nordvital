import { validate, ValidationError as ClassValidatorError } from "class-validator";
import type { ValidatorOptions } from "class-validator";
import { ValidationError } from "./custom-errors";

export async function validateEntity<T extends object>(
  entity: T,
  options: ValidatorOptions = {},
): Promise<void> {
  const errors = await validate(entity, { stopAtFirstError: true, ...options });

  if (errors.length > 0) {
    const messages = errors
      .map((error: ClassValidatorError) =>
        Object.values(error.constraints || {}).join(", ")
      )
      .filter(Boolean);

    throw new ValidationError(messages.join("; "));
  }
}

export function formatValidationErrors(errors: ClassValidatorError[]): string[] {
  return errors
    .map((error) => Object.values(error.constraints || {}).join(", "))
    .filter(Boolean);
}

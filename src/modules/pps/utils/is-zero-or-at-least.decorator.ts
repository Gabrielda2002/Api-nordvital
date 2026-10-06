import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function IsZeroOrAtLeast(minimum: number, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "isZeroOrAtLeast",
            target: object.constructor,
            propertyName,
            constraints: [minimum],
            options: validationOptions,
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    const [min] = args.constraints as [number];
                    return value === 0 || (typeof value === "number" && value >= min);
                },
                defaultMessage(args: ValidationArguments) {
                    const [min] = args.constraints as [number];
                    return `El valor debe ser 0 o mayor/igual a ${min}`;
                },
            },
        });
    };
}

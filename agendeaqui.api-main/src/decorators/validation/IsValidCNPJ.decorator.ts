import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidCNPJ(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidCNPJ',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        async validate(value: string) {
          const { isValid } = await import('@fnando/cnpj');
          return isValid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid CNPJ.`;
        },
      },
    });
  };
}

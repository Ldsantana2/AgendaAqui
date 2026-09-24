import { isValid } from '@fnando/cpf';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isValid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid CPF.`;
        },
      },
    });
  };
}

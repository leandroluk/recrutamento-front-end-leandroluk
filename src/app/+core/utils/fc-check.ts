import { FormControl, AbstractControl } from "@angular/forms";

export interface Validator<T extends FormControl> {
    (c: T): { [error: string]: any };
}

export class FcCheck {

    public static required(fieldName?: string): Validator<FormControl> {
        return (c: FormControl) =>
            !!c.value ? null : { required: `O campo ${!!fieldName ? `"${fieldName}"` : ''} não pode ser vazio.` };
    }

    public static email(fieldName?: string): Validator<FormControl> {
        return (c: FormControl) =>
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(c.value) ?
                null : { email: `O campo  ${!!fieldName ? `"${fieldName}"` : ''} não é um e-mail válido.` };
    }

    public static digit(fieldName?: string): Validator<FormControl> {
        return (c: FormControl) =>
            /\d/.test(c.value) ? null : { digit: `O campo  ${!!fieldName ? `"${fieldName}"` : ''} não é um dígito válido.` };
    }

    public static cep(fieldName?: string): Validator<FormControl> {
        return (c: FormControl) =>
            /^(\d){8}$/.test(c.value) ? null : { cep: `O campo  ${!!fieldName ? `"${fieldName}"` : ''} não é um cep válido.` }
    }

    public static date(fieldName?: string): Validator<FormControl> {
        return (c: FormControl) =>
            Date.parse(c.value) ? null : { date: `O campo ${!!fieldName ? `"${fieldName}"` : ''} não é uma data válida.` }
    }

    public static match(otherControlName: string, fieldNames?: string[]): Validator<FormControl> {

        let thisControl: FormControl;
        let otherControl: FormControl;

        return (control: FormControl) => {

            if (!control.parent) {
                return null;
            }

            if (!thisControl) {

                thisControl = control;

                let formGroup = control.parent.controls;
                otherControl = control.parent.get(otherControlName) as FormControl;

                if (!otherControl) {
                    throw new Error('FcCheck.match: other control is not found in parent group');
                }

                otherControl.valueChanges.subscribe(() => {
                    thisControl.updateValueAndValidity()
                });

            }

            if (thisControl.value !== otherControl.value) {
                if (!!fieldNames && fieldNames.length === 2) {
                    return { match: `Os campos "${fieldNames[0]}" e "${fieldNames[1]}" não são iguais.` }
                } else {
                    return { match: `Os campos de validação não são iguais.` }
                }
            }
            return null;
        }

    }

}

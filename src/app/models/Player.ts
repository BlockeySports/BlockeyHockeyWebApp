// tslint:disable: variable-name
export class Player {
    id?: string;
    name?: string;
    name_history?: {
        name?: string,
        changedToAt: number;
    }[];
    properties?: {
        name?: string,
        value?: string;
    }[];
}

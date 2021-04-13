export class Role {
    id?: string;                // the unique identifier for this role
    name?: string;              // the text that is displayed in the pill
    description?: string;       // a description of what the role means
    background?: string;        // the background color of the pill
    color?: string;             // the color of the text
    rank?: number;              // the role's priority ranking (highest = 1)
}

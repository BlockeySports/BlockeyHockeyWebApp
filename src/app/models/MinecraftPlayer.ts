// tslint:disable: variable-name
export class MinecraftPlayer {
    uuid?: string;
    username?: string;
    username_history?: {
        username?: string,
        changed_at?: Date | null;
    }[];
    textures?: {
        slim?: boolean,
        custom?: boolean,
        skin: {
            url?: string,
            data?: string,
        },
        cape?: {
            url?: string | null,
            data?: string | null,
        },
        raw?: {
            value?: string,
            signature?: string,
        },
    };
    legacy?: boolean | null;
    demo?: boolean | null;
    created_at?: Date | null;
}

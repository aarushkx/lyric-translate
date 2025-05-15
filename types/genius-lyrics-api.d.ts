declare module "genius-lyrics-api" {
    export interface Options {
        apiKey: string;
        title: string;
        artist?: string;
        optimizeQuery?: boolean;
    }

    export interface Song {
        id: number;
        title: string;
        url: string;
        lyrics: string;
        albumArt: string;
    }

    export function getLyrics(options: Options): Promise<string | null>;
    export function getSong(options: Options): Promise<Song | null>;
}

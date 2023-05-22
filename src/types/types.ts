export interface Character {
    name: string;
    image: string;
    status: string;
    species: string;
    episode:string[];
}

export interface Episode {
    id: number;
    name: string;
    episode: string;
}

export interface Location{
    id:number,
    name: string,
    type: string,
    dimension: string
    residents:string[]
}
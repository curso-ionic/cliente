export interface Tag {
    nombre: string;
    posiciones: number[];
}

export interface ArchivoAudio {
    nombre: string;
    tags: Tag[];
}

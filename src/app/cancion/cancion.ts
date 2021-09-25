export class Cancion {
    id: number;
    titulo: string;
    minutos: number;
    segundos: number;
    interprete: string;
    albumes: Array<any>;
    esCompartido: boolean;
    comentarios: Array<any>;

    constructor(
        id: number,
        titulo: string,
        minutos: number,
        segundos: number,
        interprete: string,
        albumes: Array<any>,
        esCompartido: boolean,
        comentarios: Array<any>
    ){
        this.id = id,
        this.titulo = titulo,
        this.minutos = minutos,
        this.segundos = segundos,
        this.interprete = interprete,
        this.albumes = albumes,
        this.esCompartido = esCompartido,
        this.comentarios = comentarios
    }
}


export const tipoAdl = (tipo: number) => {
    switch (tipo) {
        case 5:
            return 'Vaso de planta com água'
        case 6:
            return 'Vaso de planta(diversos)'
        case 7:
            return 'Prato/Pingadeira'
        case 8 | 26:
            return 'Consumo animal'
        case 9 | 24:
            return 'Depósito para construção'
        case 10 | 25:
            return 'Depósito para horticultura'
        case 11:
            return 'Piscina desmontável'
        case 12 | 30:
            return 'Lata, frasco, plático utilizáveis'
        case 13:
            return 'Garrafas retornáveis'
        case 14:
            return 'Balde/Regador'
        case 15:
            return 'Bandeja geladeira, ar condicionado'
        case 16:
            return 'Material de Construção'
        case 18:
            return 'Ralo interno'
        case 19:
            return 'Ralo externo'
        case 20:
            return 'Laje'
        case 21:
            return 'Calha'
        case 22:
            return 'Vaso santitário/Cx descarga'
        case 23:
            return 'Piscina'
        case 28:
            return 'Pneu'
        case 29:
            return 'Outros correlatos'
        case 31:
            return 'Garrafa descartável'
        case 32:
            return 'Lona, encerado, plástico'
        case 33:
            return 'Entulho de construção'
        case 34:
            return 'Peças/Sucatas'
        case 35:
            return 'Masseira'
        case 36:
            return 'Barco'
        case 38:
            return 'Oco de árvore e bambu'
        case 39:
            return 'Bromélias'
        default:
            return 'outros'
    }
};

export const adlModalInfo = (adl:any) => {
    return `<div id="content">
                <h3>Detalhes ADL</h3>
                <p>
                    <strong>Endereço: </strong>${adl.endereco_completo} </br>
                    <strong>Área: </strong>${adl.area} </br>
                    <strong>Quarteirão: </strong>${adl.quart} </br>
                    <strong>Tipo: </strong>${tipoAdl(adl.tipo)} </br>
                    <strong>AEG: </strong>${adl.aeg} </br>
                    <strong>ALB: </strong>${adl.alb} </br>
                    <strong>CULEX: </strong>${adl.culex} </br>
                    <strong>PUPA: </strong>${adl.pupa} </br>
                    <strong>Mês/Ano: </strong>${adl.mes_ano} </br>
                </p>
            </div>`;
}
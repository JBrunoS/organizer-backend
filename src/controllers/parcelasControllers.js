const connection = require('../database/connection');


module.exports = {

    async index(request, response){
        const { id } = request.params;

        const parcelas = await connection('parcelas')
        .innerJoin('pagamentos', 'pagamentos.id', 'parcelas.pagamento_id')
        .where({'pagamento_id': id})
        .select('parcelas.*', 'pagamentos.valor_total', 'pagamentos.valor_restante', 'pagamentos.titulo', 'pagamentos.descricao', 'pagamentos.numero_parcelas', 'pagamentos.categoria')
        .orderBy('parcelas.id');

        return response.json(parcelas)

    },

    async parcelas(request, response){
        const { id } = request.params;

        const parcelas = await connection('parcelas')
        .innerJoin('pagamentos', 'pagamentos.id', 'parcelas.pagamento_id')
        .where({'pagamentos.user_id': id})
        .select('parcelas.*', 'pagamentos.valor_total', 'pagamentos.valor_restante', 'pagamentos.titulo', 'pagamentos.descricao', 'pagamentos.numero_parcelas', 'pagamentos.categoria')
        .orderBy('parcelas.id');

        return response.json(parcelas)
    },

    async adicionaPagamento(request, response){
        const pagamento_id = request.headers.authorization;
        const {status, valor_parcela} = request.body;
        const { id } = request.params;

        const parcela = await connection('parcelas')
        .where({'id': id, 'pagamento_id': pagamento_id})
        .update({
            'status': status
        })

        if (parcela) {

            const pagamento = await connection('pagamentos')
            .where('id', pagamento_id)
            .select('valor_restante')
            .first();

            
            const valor_restante = pagamento.valor_restante;
            
            if (valor_restante == 0 && status) {
                
                return response.json('Ops, estou em zero. Fui movido para uma outra tela');
            }

            

            if (status) {
                await connection('pagamentos')
                .where('id', pagamento_id)
                .decrement('valor_restante', valor_parcela)
            }

            if (!status) {
                await connection('pagamentos')
                .where('id', pagamento_id)
                .increment('valor_restante', valor_parcela)
            }

            

            
        }

        return response.json(parcela)
    
    },

    async sumContasPagar(request, response){
        const { id } = request.params;

        const gastos = await connection('parcelas')
        .innerJoin('pagamentos', 'parcelas.pagamento_id', 'pagamentos.id')
        .where({'parcelas.status': false, 'pagamentos.user_id': id, 'pagamentos.categoria': 1})
        .sumDistinct('pagamentos.valor_restante as contasPagar')
        

        return response.json(gastos);
    },

    async sumContasReceber(request, response){
        const { id } = request.params;

        const receitas = await connection('parcelas')
        .innerJoin('pagamentos', 'parcelas.pagamento_id', 'pagamentos.id')
        .where({'parcelas.status': false, 'pagamentos.user_id': id, 'pagamentos.categoria': 2})
        .sumDistinct('pagamentos.valor_restante as contasReceber')

        return response.json(receitas);
    },
}
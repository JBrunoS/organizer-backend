const crypto = require('crypto');

const connection = require('../database/connection')

module.exports = {
    async index(request, response){
        const user_id = request.headers.authorization;

        const pagamentos = await connection('pagamentos')
        .where({'user_id': user_id, 'status': false})
        .select('*')

        return response.json(pagamentos);
    },

    async arquivados(request, response){
        const user_id = request.headers.authorization;

        const pagamentos = await connection('pagamentos')
        .where({'user_id': user_id, 'status': true})
        .select('*')
        .orderBy('categoria', 'desc')

        return response.json(pagamentos);
    },

    async create(request, response){
        const { 
            categoria, 
            titulo, 
            descricao, 
            valor_total, 
            numero_parcelas, 
            dia_pagamento, 
            comeca_pagar} = request.body;
        
        const user_id = request.headers.authorization;
        
        const id = crypto.randomBytes(4).toString('HEX');

        const pagamento = await connection('pagamentos')
        .insert({
            id,
            categoria,
            titulo, 
            descricao,
            valor_total,
            valor_restante: valor_total,
            numero_parcelas,
            dia_pagamento,
            comeca_pagar,
            status: false,
            user_id
        });

        if(pagamento){
            let parcela = parseFloat((valor_total / numero_parcelas).toFixed(2))
            let diferenca = parseFloat((valor_total - (parcela * numero_parcelas)).toFixed(2));

            const array = [];

            let dia = parseInt(String(comeca_pagar).substring(0, 2));
            let mes = parseInt(String(comeca_pagar).substring(3, 5));
            let ano = parseInt( String(comeca_pagar).substring(6, 10));

            for (let i = 0; i < numero_parcelas; i++) {
                if(i > 0){
                    mes = mes + 1;
                }

                if (mes > 12) {
                    mes = 0;
                    mes = mes + 1;
                    ano = ano + 1;
                }

                let date = String(dia) + '/' + String(mes) + '/' + String(ano);
                array.push(date);
            }

            for (let i = 0; i < array.length; i++) {
                
                if(i == numero_parcelas - 1){
                    parcela = parcela + diferenca;
                }

                await connection('parcelas')
                .insert({
                    status: false,
                    valor_parcela: parcela,
                    numero_parcela: i + 1,
                    data_parcela: array[i],
                    pagamento_id: id 
                })

            }    
            return response.json(`Pronto, tá inserido o pagamento ${pagamento_id}`)
        }
        return response.json({error: 'Não foi possível'});
        

    },

    async delete(request, response){
        const { id } = request.params;
        

        const parcelas = await connection('parcelas')
        .where({'pagamento_id': id})
        .delete();

        if(parcelas){
            await connection('pagamentos')
            .where({'id': id,})
            .delete();


            return response.json({message: 'Excluído com sucesso!'})
        }

        if(!parcelas){
            await connection('pagamentos')
            .where({'id': id,})
            .delete();


            return response.json({message: 'Excluído com sucesso!'})
        }

        return response.json({error: 'Não foi possível excluir'})
    },

    async put(request, response){
        const {id} = request.params;
        const {categoria, titulo, descricao} = request.body;
        

        const pagamento = await connection('pagamentos')
        .where({'id': id})
        .select()
        .first();

        if (pagamento) {
            await connection('pagamentos')
            .where({'id': id})
            .update({
                'categoria': categoria,
                'titulo': titulo,
                'descricao': descricao
            })

            return response.json('atualizado com sucesso')
        }

        return response.json('Não foi possível atualizar!')
    },

    async confirmaPagamento(request, response){
        const { id } = request.params;
        const { valor_restante } = request.body;

        await connection('pagamentos')
        .where({'id': id})
        .update({
            'status': true
        })
        .decrement({
            'valor_restante' : valor_restante
        })

        await connection('parcelas')
        .where({'pagamento_id': id})
        .update({
            'status': true
        })

        return response.json({message: 'Movido para os arquivados!'})
    }, 

    async carregaPagamentos(request, response){
        const user_id = request.headers.authorization;

        const pagamentos = await connection('pagamentos')
        .where({'user_id': user_id, 'status': false, 'categoria': 1})
        .select('*')

        return response.json(pagamentos);

    },

    async carregaReceitas(request, response){
        const user_id = request.headers.authorization;

        const pagamentos = await connection('pagamentos')
        .where({'user_id': user_id, 'status': false, 'categoria': 2})
        .select('*')

        return response.json(pagamentos);
    },

    async totalSaidas(request, response){
        const { id } = request.params;

        const gastos = await connection('parcelas')
        .innerJoin('pagamentos', 'parcelas.pagamento_id', 'pagamentos.id')
        .where({'parcelas.status': true, 'pagamentos.user_id': id, 'pagamentos.categoria': 1})
        .sum('parcelas.valor_parcela as total')
        
        

        return response.json(gastos);
    },
    
    async totalEntradas(request, response){
        const { id } = request.params;

        const receitas = await connection('parcelas')
        .innerJoin('pagamentos', 'parcelas.pagamento_id', 'pagamentos.id')
        .where({'parcelas.status': true, 'pagamentos.user_id': id, 'pagamentos.categoria': 2})
        .sum('parcelas.valor_parcela as total')
        

        return response.json(receitas);
    },



}
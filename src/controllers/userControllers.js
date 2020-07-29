const connection = require('../database/connection');


module.exports = {
    async index(request, response){
        const users = await connection('users')
        .select('*');

        return response.json(users);
    },

    async create( request, response){
        const { nome_usuario, email, telefone, senha} = request.body;

        const user = await connection('users')
        .where({'email': email, })
        .orWhere({'telefone': telefone})
        .select()
        .first();

        if (!user) {
            await connection('users')
            .insert({
                nome_usuario,
                email, 
                telefone,
                senha
            })

            return response.json({message: "Cadastrado com sucesso!"})
        }

        return response.status(401).json({error: "Um usuário com este email ou telefone já está cadastrado"});

    },

    async login(request, response){
        const {login, senha} = request.body;

        const user = await connection('users')
        .where({'email': login, 'senha': senha})
        .orWhere({'telefone': login, 'senha': senha})
        .select('*')
        .first();

        if (!user) {
            return response.status(401).json({error: "usuário não encontrado"})
        }

        return response.json(user);
    }
}
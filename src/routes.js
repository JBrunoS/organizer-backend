const express = require('express')

const routes = express.Router();

const userControllers = require('./controllers/userControllers')
const pagamentoControllers = require('./controllers/pagamentoControllers')
const parcelasControllers = require('./controllers/parcelasControllers')


routes.get('/user', userControllers.index);
routes.post('/user/register', userControllers.create);
routes.post('/user/login', userControllers.login);

routes.get('/pagamentos', pagamentoControllers.carregaPagamentos);
routes.get('/pagamentos/carregareceitas', pagamentoControllers.carregaReceitas);
routes.get('/pagamentos/arquivados', pagamentoControllers.arquivados);
routes.post('/pagamentos', pagamentoControllers.create);
routes.delete('/pagamentos/:id', pagamentoControllers.delete);
routes.put('/pagamentos/status/:id', pagamentoControllers.confirmaPagamento)
routes.put('/pagamentos/:id', pagamentoControllers.put)
routes.get('/pagamentos/gastostotais/:id', pagamentoControllers.totalSaidas)
routes.get('/pagamentos/receitastotais/:id', pagamentoControllers.totalEntradas)

routes.get('/parcelas/pagamento/:id', parcelasControllers.index);
routes.get('/parcelas/parcelas/:id', parcelasControllers.parcelas);
routes.put('/parcelas/:id', parcelasControllers.adicionaPagamento);
routes.get('/parcelas/gastos/:id', parcelasControllers.sumContasPagar);
routes.get('/parcelas/receitas/:id', parcelasControllers.sumContasReceber);


module.exports = routes;
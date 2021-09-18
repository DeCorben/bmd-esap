import fastify from 'fastify';
import path from 'path';
import statFast from 'fastify-static';
import esap from './esapCore/index.mjs';

fastify()
    .then((server) => {
        return server.register(statFast,{
            root: path.resolve(path.dirname('.'),'dist'),
        });
    })
    .then((server) => server.get('/', (req, res) => {
        res.sendFile('index.html');
    }))
    .then((server) => server.get('/esap/flat', (req, res) => {
        esap.flat().then((flat) => { res.send(flat); });
    }))
    .then((server) => server.get('/esap/nest', (req, res) => {
        esap.nest().then((nest) => { res.send(nest); });
    }))
    .then((server) => server.post('/esap/point', (req,res) => {
        esap.point(req.body.address.split(';')).then((house) => { res.send(house); });
    }))
    .then((server) => server.post('/esap/step', (req,res) => {
        esap.step(req.body.address.split(';')).then((answer) => { res.send(answer) });
    }))
    .then((server) => server.get('/esap/compound', (req,res) => {
        esap.compound().then((answer) => { res.send(answer) });
    }))
    .then((server) => server.get('/esap/tools', (req,res) => {
        esap.tools().then((answer) => { res.send(answer) });
    }))
    .then((server) => server.get('/esap/materials', (req,res) => {
        esap.materials().then((answer) => { res.send(answer) });
    }))
    .then((server) => server.listen(process.env.PORT))
    .then(() => {console.log(`${process.env.APPNAME} listening on port ${process.env.PORT}`);});

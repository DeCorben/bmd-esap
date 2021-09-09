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
        esap.flat()
            .then((flat) => {
                res.send(flat);
            });
    }))
    .then((server) => server.get('/esap/nest', (req, res) => {
        esap.next()
            .then((next) => {
                res.send(nest);
            })
    }))
    .then((server) => server.listen(process.env.PORT))
    .then(() => {console.log(`${process.env.APPNAME} listening on port ${process.env.PORT}`);});

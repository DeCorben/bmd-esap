import path from 'path';
import fs from 'fs/promises';
import flatten from 'flat';

const transcribe = async () => fs.readFile(path.join(path.dirname('.'),'../../Making/picnic.json'))
    .then((buffer) => {
        return JSON.parse(buffer.toString());
    });

const core = {
    flat: async () => transcribe()
            .then((proj) => {
                return flatten(proj);
            })
            .then((flat) => {
                return Object.fromEntries(Object.entries(flat).filter((v) => v[0].match(/.*steps\.\d+(.name)?$/)));
            })
            .then((thin) => {
                return Object.keys(thin).map((v) => {
                    return `${thin[v]}`;
                })
            }),
    nest: async ()=> transcribe(),
};

export default core;

import path from 'path';
import fs from 'fs/promises';
import flatten from 'flat';

const burn = (data) => {
    return fs.writeFile(projFile,JSON.stringify(data,null,'  '))
};
const follow = (address,chart) => {
    let house = chart;
    for (const n of address) {
        if (!house.steps) {
            break;
        }
        if (house.name !== n) {
            for (const s of house.steps) {
                if (s !== null && typeof s === 'object' && s.name === n) {
                    house = s;
                    break;
                }
            }
        }
    }
    return house;
};
const invalidAddress = (address) => {
    //validate address
    if (!Array.isArray(address)) {
        return {
            message: 'Invalid project address',
        };
    }
    return null;
};
const mapSteps = (proj) => {
    if (proj.steps) {
        if (typeof proj.steps[0] === 'string') {
            return proj.steps.map((v) => `${proj.name};${v}`);
        }
        return proj.steps.map((v) => mapSteps(v)).flat().map((v) => `${proj.name};${v}`);
    }
    // this really shouldn't happen
    return null;
};
const projFile = path.join(path.dirname('.'),'../../Making/picnic.json');
const surfaceTools = (obj) => {
    let tools = Object.entries(flatten(obj))
        .filter((v) => v[0].match(/.+tools.*/))
        .map((v) => v[1]);
    obj.tools = [...new Set(tools)];
    return obj;
};
const transcribe = () => fs.readFile(projFile)
    .then((buffer) => {
        return JSON.parse(buffer.toString());
    });

const core = {
    compound: async () => {
        // compound/addressed flat list
        return mapSteps(await transcribe());
    },
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
    materials: ()=> {
        // aggregate materials list to top level
        return 'Not yet';
    },
    nest: async ()=> transcribe(),
    point: async (address) => {
        let invalid = invalidAddress(address);
        if (invalid) { return invalid; };
        return {
            address: address.join(';'),
            sub: follow(address, await transcribe()),
        };
    },
    step: async (address) => {
        // next from supplied address
        let invalid = invalidAddress(address);
        if (invalid) { return invalid; };
        let base = await transcribe();
        let list = mapSteps(base).map((v) => {
            let bits = v.split(';');
            bits.shift();
            bits.pop();
            return bits.join(';');
        });
        let pos = list.indexOf(address.join(';'));
        if (list.length-1 >= pos+1) {
            pos += 1;
        }
        return {
            address: list[pos],
            sub: follow(list[pos].split(';'),base),
        };
    },
    tools: async ()=> {
        // aggregate tools to top level
        let proj = surfaceTools(await transcribe());
        burn(proj);
        return proj;
    },
};

export default core;

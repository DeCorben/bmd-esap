import path from 'path';
import fs from 'fs/promises';
import flatten from 'flat';

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
const transcribe = async () => fs.readFile(path.join(path.dirname('.'),'../../Making/picnic.json'))
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
        return follow(address, await transcribe());
    },
    step: async (address) => {
        // next from supplied address
        let invalid = invalidAddress(address);
        if (invalid) { return invalid; };
        let coor = address;
        let base = await transcribe();
        let current = follow(coor, base);
        if (current.steps) { return current.steps[0] };
        coor.pop();
        return 'Unfinished';
    },
    tools: ()=> {
        // aggregate tools to top level
        return 'Not yet';
    },
};

export default core;

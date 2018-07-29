const typeSymbol = Symbol('Type');
const typeValue = Symbol('Device');
function Device ({name, mac, ip}) {
    if (!name) {
        throw new Error('Missing option: name');
    }
    if (!mac) {
        throw new Error('Missing option: mac');
    }
    if (!ip) {
        throw new Error('Missing option: ip');
    }
    return {
        name: name,
        mac: mac,
        ip: ip,
        [typeSymbol]: typeValue,
    }
}

function checkType (device) {
    return device[typeSymbol] === typeValue
}

Device.checkType = checkType;
module.exports = Device;
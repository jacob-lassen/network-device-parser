const R = require('ramda');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');
const onlineDevices = require('../src/onlineDevices');
const Device = require('../src/Device');
const nock = require('nock');

chai.use(chaiAsPromised);
const {expect} = chai;

const testOptions = {
    host: '192.168.0.1',
    port: 80,
    user: 'admin',
    password: 'password',
}

const fixturePath = path.join(__dirname, 'fixtures');
const primeResponse = (fixture, nockOptions) => {
    const html = fs.readFileSync(path.join(fixturePath, fixture), 'utf8');
    return nock(`http://${testOptions.host}`)
        .get('/landiscover.html')
        .reply(200, html);
}

describe('onlineDevices', () => {
    it('Should pack return value in a promise', () => {
        primeResponse('3Devices.html');
        const result = onlineDevices(testOptions);
        expect(result).to.be.a('promise');
    });

    it('Should return an array', async () => {
        primeResponse('3Devices.html');
        const result = await onlineDevices(testOptions);
        expect(result).to.be.an('array');
    });

    it('Should reject when host options is missing', () => {
        const options = R.pick(['port', 'user', 'password'], testOptions);
        return expect(onlineDevices(options)).to.eventually.be.rejectedWith('Missing option: host');
    });

    it('Should reject when port options is missing', () => {
        const options = R.pick(['host', 'user', 'password'], testOptions);
        return expect(onlineDevices(options)).to.eventually.be.rejectedWith('Missing option: port');
    });

    it('Should reject when user options is missing', () => {
        const options = R.pick(['host', 'port', 'password'], testOptions);
        return expect(onlineDevices(options)).to.eventually.be.rejectedWith('Missing option: user');
    });

    it('Should reject when password options is missing', () => {
        const options = R.pick(['host', 'port', 'user'], testOptions);
        return expect(onlineDevices(options)).to.eventually.be.rejectedWith('Missing option: password');
    });

    it('Should fetch from route landiscover', async () => {
        const endPointSpy = primeResponse('noDevices.html');
        await onlineDevices(testOptions);
        expect(endPointSpy.isDone()).to.be.true;
    });

    it('Should fetch device markup with basic auth', async () => {
        const nockOptions = {
            reqheaders: {
                'authorization': /Basic.*/,
            }
        }
        const endPointSpy = primeResponse('noDevices.html', nockOptions)
        await onlineDevices(testOptions);
        expect(endPointSpy.isDone()).to.be.true;
    });

    it('Should return empty array when no devices are online', async () => {
        primeResponse('noDevices.html');
        const result = await onlineDevices(testOptions);
        expect(result).to.have.length.of(0);
    })

    it('Should return all online devices', async () => {
        primeResponse('3Devices.html');
        const result = await onlineDevices(testOptions);
        expect(result).to.have.length.of(3);
    })

    it('Should return all device objects', async () => {
        primeResponse('3Devices.html');
        const result = await onlineDevices(testOptions);
        result.forEach((device) => {
            expect(Device.checkType(device)).to.be.true;
        });
    })
});
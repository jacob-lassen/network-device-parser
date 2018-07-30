const {expect} = require('chai');
const Device = require('../src/Device');

describe('Device', () => {
    it('Should be a function', () => {
        expect(Device).to.be.an('function');
    });

    it('Should require name', () => {
        const invalidOptions = {
            mac: 'f4:f5:d8:5f:f4:48',
            ip: '192.168.0.5',
        };
        callWrapper = () => Device(invalidOptions);
        expect(callWrapper).to.throw('Missing option: name');
    });

    it('Should require mac', () => {
        const invalidOptions = {
            name: 'deviceName',
            ip: '192.168.0.5',
        };
        callWrapper = () => Device(invalidOptions);
        expect(callWrapper).to.throw('Missing option: mac');
    });

    it('Should require ip', () => {
        const invalidOptions = {
            name: 'deviceName',
            mac: 'f4:f5:d8:5f:f4:48',
        };
        callWrapper = () => Device(invalidOptions);
        expect(callWrapper).to.throw('Missing option: ip');
    });

    it('Should have property name', () => {
        const options = {
            name: 'deviceName',
            mac: 'f4:f5:d8:5f:f4:48',
            ip: '192.168.0.5',
        }
        expect(Device(options).name).to.be.an('string');
    });

    it('Should have property mac', () => {
        const options = {
            name: 'deviceName',
            mac: 'f4:f5:d8:5f:f4:48',
            ip: '192.168.0.5',
        }
        expect(Device(options).mac).to.be.an('string');
    });

    it('Should have property ip', () => {
        const options = {
            name: 'deviceName',
            mac: 'f4:f5:d8:5f:f4:48',
            ip: '192.168.0.5',
        }
        expect(Device(options).ip).to.be.an('string');
    });
    
    describe('checkType', () => {
        it('Should be a function', () => {
            expect(Device).to.be.an('function');
        });

        it('Should validate object from Device', () => {
            const options = {
                name: 'deviceName',
                mac: 'f4:f5:d8:5f:f4:48',
                ip: '192.168.0.5',
            }
            const device = Device(options);
            expect(Device.checkType(device)).to.be.true;
        });

        it('Should invalidate anything not from Device', () => {
            const fakeDevice = {
                name: 'deviceName',
                mac: 'f4:f5:d8:5f:f4:48',
                ip: '192.168.0.5',
            }
            expect(Device.checkType(fakeDevice)).to.be.false;
        });
    })
});
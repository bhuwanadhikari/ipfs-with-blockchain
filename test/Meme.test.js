const Meme = artifacts.require("Meme");

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Meme', (accounts) => {
    //tests here

    before(async () => {
        meme = await Meme.deployed()
    })
    let meme;
    describe('deploment', async () => {
        it('deploys successfully, ', async () => {
            meme = await Meme.deployed()
            const address = meme.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            console.log("Address is ", address);
            // const address = '0x5c90dE281c92a14E7A1fBdAfB6db987B4fF1a309'

        })
    });

    describe('storage', async () => {
        it('updates meme hash', async () => {
            let memeHash = 'abc124';
            await meme.set(memeHash);
            const result = await meme.get();
            assert.equal(result, memeHash);
        })
    })
})
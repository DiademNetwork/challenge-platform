const ChallengeToken = artifacts.require('ChallengeToken')

contract('TestChallengeToken', function (accounts) {
  let contract

  beforeEach(async function() {
    await ChallengeToken.new().then((instance) => {
      contract = instance
    })
  })

  describe('Personal challenge', () => {
    it('person create challenge with title', async () => {
      const title = "Wakeup at 4am"

      const tx = await contract.create(title, 1)

      assert.equal(tx.logs.length, 2)
      assert.equal(tx.logs[1].event, 'BoughtToken')
      assert.equal(tx.logs[1].args.tokenId.toString(), '1')
      assert.equal(tx.logs[1].args.buyer.toString(), accounts[0])

      assert.equal((await contract.titles(1)), title)
    })
  })
})
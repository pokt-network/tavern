const TestApp = require('zos').TestApp;
const Tavern = artifacts.require('Tavern');
const TavernQuestRewardTest = artifacts.require('test/TavernQuestRewardTest');
const TestUtils = require('./test-utils');

contract('Tavern', function (accounts) {

  var app, tavernProxy, tavernQuestRewardTestInstance;

  async function shouldCreateValidQuest(lat, lon, name, hint, maxWinners, metadata, txObject) {
    const initialQuestAmount = await tavernProxy.getQuestAmount(tavernQuestRewardTestInstance.address),
          merkleTree = TestUtils.generateMerkleTree(lat,lon),
          merkleBody = TestUtils.encodeMerkleBody(merkleTree);

    const txResult = await tavernProxy.createQuest(
                            tavernQuestRewardTestInstance.address,
                            name,
                            hint,
                            maxWinners,
                            '0x' + merkleTree.getRoot().toString('hex'),
                            merkleBody,
                            metadata,
                            txObject
                           );

    const finalQuestAmount = await tavernProxy.getQuestAmount(tavernQuestRewardTestInstance.address);
    assert.equal(finalQuestAmount.toNumber(), initialQuestAmount.toNumber() + 1);
    return txResult;
  }

  before(async function () {
    tavernQuestRewardTestInstance = await TavernQuestRewardTest.new({from: accounts[0]});
    app = await TestApp('zos.json', { from: accounts[0] });
    tavernProxy = await app.createProxy(Tavern, 'Tavern', 'initialize', [accounts[0]]);
  });

  describe('#initialize', function() {
    it('should create a Tavern proxy with the right owner', async function () {
      const proxyOwner = await tavernProxy.owner();
      assert.ok(tavernProxy);
      assert.equal(proxyOwner, accounts[0]);
    });
  });

  describe('#createQuest', function() {
    it('should create a quest succesfully', async function() {
      await shouldCreateValidQuest(
        40.6893,
        -74.0447,
        'This is a quest',
        'This is a hint',
        10,
        'some metadata',
        {from: accounts[0]}
      );
    });
  });

  // This test performs 3 steps: create's a new quest, does the client side work of stitching together the merkle tree,
  // and then submits the found proof to the contract.
  describe('#submitProof', function() {
    it('should accept valid proof', async function() {
      // First create the quest
      const questTxResult = await shouldCreateValidQuest(
                                  40.6893,
                                  -74.0447,
                                  'This is a quest',
                                  'This is a hint',
                                  10,
                                  'some metadata',
                                  {from: accounts[0]}
                                );

      // Have a player guess the answer
      const player = accounts[1],
            questIndex = questTxResult.logs[0].args._questIndex.toNumber(),
            merkleBody = await tavernProxy.getQuestMerkleBody(tavernQuestRewardTestInstance.address, questIndex),
            playerSubmission = TestUtils.generatePlayerSubmission(40.6894,-74.0447, merkleBody);

      const submitProofTx = await tavernProxy.submitProof(
                                    tavernQuestRewardTestInstance.address,
                                    questIndex,
                                    playerSubmission.proof,
                                    playerSubmission.answer,
                                    {
                                      from: player
                                    }
                                  );

      // Assert that player is winner
      const isWinner = await tavernProxy.isWinner(tavernQuestRewardTestInstance.address, questIndex, player);
      assert.ok(isWinner);
    });
  });

  describe('#withdrawOwnerBalance', async function() {
    it('should withdraw the remaining balance contract', async function() {
      // Create the quest
      const ethSent = 1234567891;
      const txResult = await shouldCreateValidQuest(
                              40.6893,
                              -74.0447,
                              'This is a quest',
                              'This is a hint',
                              10,
                              'some metadata',
                              {
                                from: accounts[0],
                                value: ethSent
                              }
                             );

      // Retrieve the balances
      const currentTavernBalance = await web3.eth.getBalance(tavernProxy.address);
      const currentOwnerBalance = await tavernProxy.currentOwnerBalance();
      const questPrize = await tavernProxy.getQuestPrize(tavernQuestRewardTestInstance.address, txResult.logs[0].args._questIndex.toNumber());
      // Assert Total tavern balance
      assert.equal(currentTavernBalance.toNumber(), ethSent);
      // Assert 10% Comission was paid to the Tavern's balance
      const expectedComission = Math.floor(currentTavernBalance.toNumber() / 10);
      assert.equal(currentOwnerBalance.toNumber(), expectedComission);
      // Quest Prize = ethSent - commission
      assert.equal(questPrize.toNumber(), ethSent - expectedComission);
    });
  });

  describe('#getQuest', function() {
    it('should return an existing quest succesfully', async function() {
      let txResult = await shouldCreateValidQuest(
        40.6893,
        -74.0447,
        'This is a quest',
        'This is a hint',
        10,
        'some metadata',
        {from: accounts[0]}
      );

      let quest = await tavernProxy.getQuest(tavernQuestRewardTestInstance.address, txResult.logs[0].args._questIndex.toNumber());
      assert.ok(quest);
      assert.equal(quest.length, 11);
    });
  });
});

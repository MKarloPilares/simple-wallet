const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("SimpleWallet", function () {
    let wallet, owner, addr1;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();
        const Wallet = await ethers.getContractFactory("SimpleWallet");
        wallet = await Wallet.deploy();
    });

    it("Should set the deployer as owner", async () => {
        expect(await wallet.owner()).to.equal(owner.address)
    });

    it("Should accept deposits", async () => {
        await wallet.connect(addr1).deposit({
            value: ethers.parseEther("1.0")
        });

        const balance = await wallet.checkBalance();
        expect(balance).to.equal(ethers.parseEther("1.0"));
    });

    it("Should allow owner to withdraw", async () => {
        await wallet.connect(addr1).deposit({
            value: ethers.parseEther("1.0")
        });

        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
        const tx = await wallet.withdraw(ethers.parseEther("0.5"));
        const receipt = await tx.wait();

        const gasUsed = BigInt(receipt.gasUsed) * BigInt(tx.gasPrice);
        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

        const expectedBalance =
            BigInt(ownerBalanceBefore) + ethers.parseEther("0.5") - BigInt(gasUsed);

        expect(ownerBalanceAfter).to.be.closeTo(expectedBalance, ethers.parseEther("0.001"));
    });

    it("Should not allow non-owner to withdraw", async () => {
        await expect(wallet.connect(addr1).withdraw(1)).to.be.revertedWith("Not owner");
    });
});

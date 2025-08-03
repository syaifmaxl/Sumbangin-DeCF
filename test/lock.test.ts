import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { Campaign, CampaignFactory } from "../typechain-types";

describe("CampaignFactory and Campaign Contracts", function () {
  async function deployFactoryAndCreateCampaignFixture() {
    const [owner, donator, anotherAccount] = await ethers.getSigners();

    const CampaignFactoryFactory = await ethers.getContractFactory(
      "CampaignFactory"
    );
    const campaignFactory =
      (await CampaignFactoryFactory.deploy()) as unknown as CampaignFactory;
    await campaignFactory.waitForDeployment();

    const judul = "Coba Donate Gatherloop";
    const deskripsi = "Gatherloop Cafe and Community";
    await campaignFactory.createCampaign(judul, deskripsi);

    const campaignAddress = (await campaignFactory.getAllCampaigns())[0];
    const campaign = (await ethers.getContractAt(
      "Campaign",
      campaignAddress
    )) as unknown as Campaign;

    return {
      campaignFactory,
      campaign,
      campaignAddress,
      owner,
      donator,
      anotherAccount,
      judul,
      deskripsi,
    };
  }

  describe("CampaignFactory: Deployment and Campaign Creation", function () {
    it("Bisa membuat campaign baru dan memancarkan event CampaignCreated", async function () {
      const { campaignFactory, owner, judul, deskripsi } = await loadFixture(
        deployFactoryAndCreateCampaignFixture
      );

      await expect(
        campaignFactory
          .connect(owner)
          .createCampaign("Campaign Kedua", "Deskripsi kedua")
      ).to.emit(campaignFactory, "CampaignCreated");
    });
  });

  describe("Campaign: Donations and Withdrawals", function () {

    it("Mengizinkan donatur mengirim dana dan saldo kontrak bertambah", async function () {
      const { campaign, donator } = await loadFixture(
        deployFactoryAndCreateCampaignFixture
      );
      const donationAmount = ethers.parseEther("1.0");

      await expect(
        donator.sendTransaction({ to: campaign.target, value: donationAmount })
      ).to.changeEtherBalance(campaign, donationAmount);
    });

    it("Memancarkan event DonasiMasuk saat menerima dana", async function () {
      const { campaign, donator } = await loadFixture(
        deployFactoryAndCreateCampaignFixture
      );
      const donationAmount = ethers.parseEther("0.5");

      await expect(
        donator.sendTransaction({ to: campaign.target, value: donationAmount })
      )
        .to.emit(campaign, "DonasiMasuk")
        .withArgs(donator.address, donationAmount);
    });

    it("Mengizinkan pembuat campaign (creator) untuk menarik semua dana", async function () {
      const { campaign, owner, donator } = await loadFixture(
        deployFactoryAndCreateCampaignFixture
      );
      const donationAmount = ethers.parseEther("2.0");

      await donator.sendTransaction({
        to: campaign.target,
        value: donationAmount,
      });

      await expect(
        campaign.connect(owner).tarikDana(owner.address)
      ).to.changeEtherBalances(
        [campaign, owner],
        [-donationAmount, donationAmount]
      );
    });

    it("GAGAL jika BUKAN creator yang mencoba menarik dana", async function () {
      const { campaign, donator } = await loadFixture(
        deployFactoryAndCreateCampaignFixture
      );
      const donationAmount = ethers.parseEther("1.0");

      await donator.sendTransaction({
        to: campaign.target,
        value: donationAmount,
      });

      await expect(
        campaign.connect(donator).tarikDana(donator.address)
      ).to.be.revertedWith("Bukan pemilik campaign");
    });
  });
});

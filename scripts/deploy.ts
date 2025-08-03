import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CampaignFactory contract...");
  const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
  const factory = await CampaignFactory.deploy();

  await factory.waitForDeployment(); 

  console.log("CampaignFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

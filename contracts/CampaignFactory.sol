// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public allCampaigns;

    event CampaignCreated(address campaignAddress, address creator);

    function createCampaign(string memory _judul, string memory _deskripsi) public {
        Campaign newCampaign = new Campaign(msg.sender, _judul, _deskripsi);
        allCampaigns.push(address(newCampaign));
        emit CampaignCreated(address(newCampaign), msg.sender);
    }

    function getAllCampaigns() public view returns (address[] memory) {
        return allCampaigns;
    }
}

// Sources flattened with hardhat v2.26.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/Campaign.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

contract Campaign {
    address public creator;
    string public judul;
    string public deskripsi;
    uint public totalDonasi;

    event DonasiMasuk(address indexed dari, uint jumlah);
    event DanaDicairkan(address indexed ke, uint jumlah);

    constructor(address _creator, string memory _judul, string memory _deskripsi) {
        creator = _creator;
        judul = _judul;
        deskripsi = _deskripsi;
    }

    receive() external payable {
        totalDonasi += msg.value;
        emit DonasiMasuk(msg.sender, msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function tarikDana(address payable _to) public {
        require(msg.sender == creator, "Bukan pemilik campaign");
        uint amount = address(this).balance;
        _to.transfer(amount);
        emit DanaDicairkan(_to, amount);
    }
}


// File contracts/CampaignFactory.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;
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

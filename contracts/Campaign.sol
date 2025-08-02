// SPDX-License-Identifier: MIT
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

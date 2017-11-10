pragma solidity 0.4.17;

contract SimpleSign {

    address public owner;
    uint contract_creation_value;

    function SimpleSign() payable public {
        owner = msg.sender;
        contract_creation_value = msg.value;
    }

    function destroy () public { // so funds not locked in contract forever
        if (msg.sender == owner) {
          selfdestruct(owner); // send funds to organizer
        }
    }

    function () payable public  {}
}

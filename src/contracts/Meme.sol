pragma solidity >=0.4.21 <0.6.0;

contract Meme {

string memeHash;



    //write func
    function set(string memory _memeHash) public {
        memeHash = _memeHash;
    }


    // read func
    function get() public view returns (string memory) {
        return memeHash;
    }
}
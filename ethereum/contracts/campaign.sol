pragma solidity ^0.6.0;

contract Factory{
    
    Campaign[] public deployedCampaign;
    
    function createCampaign(uint _minimumContribution) public{
        Campaign newCampaign = new Campaign(_minimumContribution,msg.sender);
        deployedCampaign.push(newCampaign);
    }
    
    function getDeployedCampaign() public view returns(Campaign[] memory){
        return deployedCampaign;
    }
}

contract Campaign{
    
    struct Request{
        address payable recipient;
        bool completed;
        string description;
        uint value;
        uint approvalCount;
        mapping(address=>bool) approval;
    }
    
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    uint public count;
    
    modifier restricted(){
        require(msg.sender==manager,"only manager can make this request");
        _;
    }
    
    constructor(uint _minimumContribution,address _manager) public{
        manager = _manager;
        count=0;
        minimumContribution = _minimumContribution;
    }
    
    function contribute() public payable{
        require(msg.value > minimumContribution,"minimum contribution needed");
        approvers[msg.sender]=true;
        count++;
    }
    
    function createRequest(string memory _description,address payable _recipient,uint _value) public restricted{
        Request memory request=Request({
            recipient:_recipient,
            completed:false,
            description:_description,
            value:_value,
            approvalCount:0
        });
        
        requests.push(request);
    }
    
    function approveRequest(uint index) public{
        Request storage request = requests[index];
        require(approvers[msg.sender],"you are not authorized to vote");
        require(!request.approval[msg.sender],"already voted");
        
        request.approval[msg.sender] = true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalCount > count/2,"Insufficient votes");
        request.recipient.transfer(request.value);
        request.completed=true;
    }
    
    function getSummary() public view returns(uint,uint,uint,uint,address){
        return (minimumContribution,address(this).balance,requests.length,count,manager);
    }
    
    function getRequest() public view returns(uint){
        return requests.length;
    }
    
}
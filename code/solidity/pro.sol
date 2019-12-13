contract con8 {

    struct Organization {
        string Name;    //组织名称
        string password;//密码
        bool Type;      //company1 or bank0 
    }
    
    struct Receipt {
        string From;    //欠款人
        string To;      //收款人
        uint Type;      //4种交易类型
        uint receiptAmount;//账单金额数目
        uint  BuildDate;    //账单建立的日期
        uint  dueDate;      //账单过期的日期
        string information; //额外信息
    }
    
    uint O_len = 0;                     //组织（公司以及银行）数目
    mapping(uint => string) orgas;      //方便遍历
    mapping(string => Organization) organizations;//组织
    
    
    uint R_len = 0;                     //账单数目
    mapping(uint => Receipt) receipts;  //所有账单，方便遍历
  

    constructor() public {}
    
    
    //register a company/bank by an admin.
    function register( string name, string password, string tpye )  public returns(uint){
        if(isEqual(name, "") ||isEqual(password, "") ||isEqual(tpye, "")  )
            return 99999999;
        if(isExist(name)){
            return 99999999; //"Register Failed! This name has been used, please change one!";
        } 
        
        organizations[name].Name = name;
        organizations[name].password = password;
        if(isEqual(tpye, "1") )  organizations[name].Type = true;
        else organizations[name].Type = false;
        orgas[O_len++] = name;
        return O_len;
        //success
    }
    //cancel a Organization
    function login(string name, string password) public returns(bool){
        if(isEqual(name, "") || isEqual(password, ""))
            return false;
        if(isEqual(organizations[name].password, password))
            return true;
        else return false;
        
    }
    //1.buyGoods        //company-company
    function buyGoods(string buyer, string seller, uint money, uint daysAfter, string information)  public returns(uint){
        if(organizations[seller].Type && organizations[buyer].Type && !isEqual(buyer, seller)){
            //new receipt
            Receipt memory rNew = Receipt(buyer, seller, 0, money, now, now + daysAfter * 1 days, information);
            receipts[R_len++] = rNew;
            return R_len-1;
        }
        return 99999999;//"buyGoods Failed! Please input company names!";
    }
    
    //2.transferReceipt //company-company
    //2.transferReceipt //company-company
    function transferReceipt(string company1, string company2, uint money)  public returns(uint, uint){
        //check if its enough
        uint count  = 0;
        uint sum = 0;
        if(!organizations[company1].Type || !organizations[company1].Type){
            return (99999999, 0);   //"transferReceipt Failed! Please input two company name!";
        }
        for(uint i = 0; i < R_len; i++){
            if(isEqual(receipts[i].To,company1) && !isEqual(receipts[i].To,company2) && (receipts[i].Type == 0 || receipts[i].Type == 1)){
                if(receipts[i].receiptAmount == money){
                     receipts[i].To = company2;
                     sum += money;
                     count +=1;
                     return (count, sum);
                } //all 
                else if(receipts[i].receiptAmount > money){
                    receipts[i].receiptAmount -= money;
                    sum += money;
                    count += 1;
                    //new receipt
                    Receipt memory rNew = Receipt(receipts[i].From, company2, 1, money , receipts[i].BuildDate, receipts[i].dueDate, receipts[i].information);
                    receipts[R_len++] = rNew;
                    
                    return (count, sum);
                } //partion
                else {
                    receipts[i].To = company2;
                    money -= receipts[i].receiptAmount;
                    sum += receipts[i].receiptAmount;
                    count += 1;
                    continue;
                }
            }
         }

        if(sum == 0 || count == 0) {
            return (99999999, 0);
            //"transferReceipt failed! No enough receipt amount";
        }
        return (count, sum);    
    }
     uint[] ret_index = new uint[](0);
    //3.raiseMoney      //company-bank
    function raiseMoney(string company,string bank)  public returns(uint ,uint ){
        uint count = 0;
        uint sum = 0;
        if(!organizations[company].Type || organizations[bank].Type){
            return( 99999999, 0);//(ret_index.length);//, ret_index); 
        }//return "raiseMoney Failed! Please input right names!";
            
        for(uint i = 0; i < R_len; i++)
        {
            if(isEqual(receipts[i].To, company) && receipts[i].dueDate >= now && (receipts[i].Type == 0 || receipts[i].Type == 1)) {
                receipts[i].To = bank;
                receipts[i].Type = 2;
                sum+= receipts[i].receiptAmount;
                count += 1;
            }
        }
        if(sum == 0 || count == 0) {
            return (99999999, 0);
            //"transferReceipt failed! No enough receipt amount";
        }
        return (count, sum);//, ret_index);//addString("raiseMoney success! Total amount: ", uint2hexstr(sum));
    }
    //4.payReceipt      //duedate
    function payReceipt(string company)  public returns(uint, uint){
        uint count = 0;
        uint sum = 0;
        if(!organizations[company].Type )
        {
            return (99999999,0);
            //return "payReceipt Failed! Please input a right name!";
        }
        //traverse,change transaction[0]->transaction[3]
        for(uint i = 0; i < R_len; i++){
            if((now <= receipts[i].dueDate) && (receipts[i].Type != 3) && isEqual(receipts[i].From, company)){
                receipts[i].Type = 3;
                sum += receipts[i].receiptAmount;
                count += 1;
            }
        }
        if(sum == 0 || count == 0) {  
            return (99999999,0);
            //没有账单可偿还"payReceipt failed!";return "payReceipt success!";
        }
        else return  (count, sum);//,ret_index);
    }
    
    function getCountOs() public view returns (uint){
        return O_len;
    }
    function getCountRs() public view returns (uint){
        return R_len;
    }
    
    function isExist(string name) view public returns (bool){
        if(isEqual(organizations[name].Name, name))return true;
        else return false;
    }
    function getCompany(uint i ) view public returns (string, bool) {
        return (getOrgName(i),organizations[getOrgName(i)].Type);
    }
    function getFrom(uint i) public view returns (string) {
        return receipts[i].From;
    }
    function getTo(uint i)public view returns (string) {
        return receipts[i].To;
    }
    function getAmount(uint i)view public returns (uint) {
        return receipts[i].receiptAmount;
    }
    function getType(uint i)view public returns (uint) {
        return receipts[i].Type;
    }
    function getBuildDate(uint i)view public returns (uint) {
        return receipts[i].BuildDate;
    }
    function getDueDate(uint i)view public returns (uint) {
        return receipts[i].dueDate;
    }
    function getInformation(uint i)view public returns (string) {
        return receipts[i].information;
    }
    function getReceipt(uint i)view public returns (string, string, uint, uint, uint, uint, string) {
        return (getFrom(i), getTo(i), getType(i), getAmount(i), getBuildDate(i), getDueDate(i), getInformation(i));
    }
    function isEqual(string a, string b) internal returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        }
        for (uint i = 0; i < bytes(a).length; i ++) {
            if(bytes(a)[i] != bytes(b)[i]) {
                return false;
            }
        }
        return true;
    }
    // 
    function getOrgName(uint i)view public returns (string){
        return orgas[i];
    }
}

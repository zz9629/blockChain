//使用时需要把下列代码放到pro.sol合约里面

function test_main()public {
        test_register();
        test_buyGoods_0();
        test_buyGoods_1();
        test_buyGoods_2();
        //test_transfer();
      // test_raise();
      //  test_pay();
    }
    function test_register()public {
        if(register("A","aa", "1")>0 && register("B","bb", "1")>0&&
            register("C", "cc",'1')>0 && register("Bank", "bank" ,"bank")>0){
                assert(isExist("A"));
                assert(isExist("B"));
                assert(isExist("C"));
                assert(isExist("Bank"));
            }
    }
    function test_buyGoods_0()public  {
        uint i = buyGoods("A", "B", 8000, 1, "An Apple");
        //assert(i == 0 );
        
        assert(isEqual(getFrom(i), "A"));
        assert(isEqual(getTo(i), "B"));
        assert(getAmount(i) == 8000);
        assert(getType(i) ==  0);
    }
    function test_buyGoods_1()public {
        uint j = buyGoods("B", "A", 8000, 10000, "An Apple");
        assert(j == 1);
        
        assert(isEqual(getFrom(j), "A"));
        assert(isEqual(getTo(j), "B"));
        assert(getAmount(j) == 8000);
        assert(getType(j) ==  0);
        
    }
    function test_buyGoods_2()public{
        uint k = buyGoods("C", "B", 4000, 1, "A banana");
        assert(k == 2);
        
        assert(isEqual(getFrom(k), "B"));
        assert(isEqual(getTo(k), "C"));
        assert(getAmount(k) == 4000);
        assert(getType(k) ==  0);
        
    } 
    function test_transfer() public{
        uint size;
        uint sum;
        uint j;
        (size,sum) = transferReceipt("B", "C", 4000);

        assert(size == 1);
        
        assert(isEqual(getFrom(j), "A"));
        assert(isEqual(getTo(j), "C"));
        assert(getAmount(3) == 4000);
        assert(getType(3) == 1);
        assert(getAmount(0) == 4000);
    }
     function test_raise() public {
        uint [] memory index_arr;
        uint size;
        uint sum;
        //, index_arr
        (size,sum) = raiseMoney("B", "Bank");
        assert(size == 2);

        uint i = 0 ;
        uint j = 1;
        assert(getType(i) == 2 && getType(j) == 2);
        
        //再次测试，没有任何结果
        (size, sum) = raiseMoney("B", "Bank");
        assert(size == 1 && index_arr[0] == 99999999);
    }
     function test_pay()public{
        uint [] memory index_arr;
        uint size;
        uint sum;
        (size, sum) = payReceipt("A");
        assert(size == 3);
        //assert(index_arr[0] == 0 && index_arr[1] == 1 && index_arr[2] == 3);
        //assert(getType(0) == 3 && getType(1) == 3 && getType(2) == 3);
    }
    
    
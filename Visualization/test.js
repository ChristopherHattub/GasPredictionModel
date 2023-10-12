//test to see if gas by year caluclations are correct check
//test to see if gas by month calculations are correct check
//test to see if the years user has gas in correct check
//test to see if predicetions are correctly indetified as such check
//test to see if gas by month per year is correct 


//RUN ALL TESTS AND TEH RELOAD PAGE TO PREVENT ANY CHANGES
function GasByYearTest(){
    tmp=GetGallonsByYear(139)
    if(tmp[0]==382.6){return true;}
    else {return false;}
}

function GasByMonthTest(){
    tmp=GetGallonsByMonth(139)
    if(tmp[0]==1111.8){return true;}
    else {return false;}
}

function showYearsTest(){
    tmp=showYears(139)
    if(tmp[0]==2015){return true;}
    else {return false;}
}
function isPredectionTest(){
    var mydata = JSON.parse(bigdata);
    if(isPredection(mydata[471],1) && !isPredection(mydata[1],1)){return true;}
    else {return false;}
}

function gasByMonthByYearTest(){
    tmp=loadData(2015,139)
    if(tmp[0]==0 && tmp[11]==192.7){return true;}
    else {return false;}
}





function RunTests(){
    if(GasByMonthTest()){console.log("GasByMonthTest Passed")} else{console.log("GasByMonthTest Failed")}
    if(GasByYearTest()){console.log("GasByYearTest Passed")} else{console.log("GasByYearTest Failed")}
    if(showYearsTest()){console.log("showYearsTest Passed")} else{console.log("showYearsTest Failed")}
    if(isPredectionTest()){console.log("isPredectionTest Passed")} else{console.log("isPredectionTest Failed")}
    if(gasByMonthByYearTest()){console.log("gasByMonthByYearTest Passed")} else{console.log("gasByMonthByYearTest Failed")}
}



RunTests()

//below this reset evreything
loadData(2015, 139)
showYears(139)
document.getElementById("userid").value = 139;
GetGallonsByYear(139)
bchart.data.labels=GasYears;
bchart.data.datasets[0].data=GalsbyYear;
bchart.update();
loadData(2015, 139)
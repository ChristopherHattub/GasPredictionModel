//https://www.chartjs.org/docs/latest/samples/other-charts/combo-bar-line.html
//https://www.chartjs.org/docs/latest/charts/mixed.html
//https://www.youtube.com/watch?v=9GqWvUlRXpM
//video to add button that hides or shows weather bar
// multi axis y https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
//https://stackoverflow.com/questions/35633618/chart-js-bar-chart-color-change-based-on-value
// how to swap chart types could be useful for pie to bar https://stackoverflow.com/questions/36949343/chart-js-dynamic-changing-of-chart-type-line-to-bar-as-example
//similar to above https://www.youtube.com/watch?v=mH6MfzUJRms
//dashboard inspo https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dq3zc1ph5fvg&psig=AOvVaw3r6V36JgxQ9pz_ALaKrzFV&ust=1676491267455000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLCO7d_mlf0CFQAAAAAdAAAAABBV
//https://apexcharts.com/javascript-chart-demos/dashboards/
//https://github.com/laravel-admin-extensions/chartjs

monthUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
today = new Date();
GasYears=[2000,2001]
GalsbyYear=[0,0]
selectedYear=0;

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'Novemeber',
  'December',
];

const data = {
  labels: labels,
  datasets: [{
    label: 'Gallons Purchased',
    //barThickness: 60,
    //backgroundColor: 'rgb(255, 50, 140)',
    borderColor: 'rgb(255, 0, 132)',
    //data: [25, 10, 5, 2, 20, 30, 45,2,24,8,10,11,12
    data: monthUsage,
    backgroundColor: ["red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red", "red"],
    yAxisID: 'y',
    order: 4
  }, {
    type: 'line',
    label: 'Average Tempature',
    data: [20, 12, 39, 40, 55, 65, 70, 88, 70, 62, 49, 34],
    fill: false,
    borderColor: 'rgb(54, 162, 235)',
    yAxisID: 'y1',

    hidden: true,
    order: 1
  }, {
    type: 'line',
    label: 'Low Tempature',
    data: [5, 2, 19, 14, 35, 55, 50, 58, 40, 32, 19, 24],
    fill: false,
    borderColor: 'rgb(54, 162, 235)',
    yAxisID: 'y1',

    hidden: true,
    order: 2
  }, {
    type: 'line',
    label: 'High Tempature',
    data: [45, 52, 69, 74, 85, 85, 90, 98, 89, 72, 59, 44],
    fill: false,
    borderColor: 'rgb(54, 162, 235)',
    yAxisID: 'y1',

    hidden: true,
    order: 3
  }]
};

const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,

    scales: {

      y: {
        title: {
          display: true,
          text: 'Gallons Used'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return value + '\u00B0F';
          }
        },

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = tooltipItem.dataset.label

            var value = myChart.data.datasets[tooltipItem.datasetIndex].data[tooltipItem.dataIndex]
            if (tooltipItem.datasetIndex == 1) {
              return label + ': ' + value + '\u00B0F';
            }
            if (tooltipItem.datasetIndex == 2) {
              return label + ': ' + value + '\u00B0F';
            }
            if (tooltipItem.datasetIndex == 3) {
              return label + ': ' + value + '\u00B0F';
            }
          }
        }
      }
    }


  }

};

const myChart = new Chart(
  document.getElementById('myChart'),
  config
);

//function that is given a dataset and toggles that datasets vsiablity used for showing or hiding overlays
function toggelData(value) {
  const showValue = myChart.isDatasetVisible(value);
  if (showValue === true) {
    myChart.hide(value)
  } else {
    myChart.show(value)
  }


}
//clears all weather overlays hard coded for now so if more overlays are added will need to be updated
function clearWeather() {
  myChart.hide(1)
  myChart.hide(2)
  myChart.hide(3)


}

function getData(userid) {
  //this will have a fetch request in it in future for historical data api
  //will also fetch predticive model to get next two months predicted
}

//checks if a datapoint is a prediction or not by checking to see if it is in the future or not
function isPredection(obj, month) {
  let d = new Date(obj.DeliveryDate);
  let val = today < d
  if (val == true) {
    //console.log("this is a predection")
    var bars = data.datasets[0].bars;
    //bars[month-1].fillColor = "green";
    data.datasets[0].backgroundColor[month - 1] = "green";
    return true;
  } else {
    data.datasets[0].backgroundColor[month - 1] = "red";
    return false;
  }
  
}


function isSelectedYear(){
  //loop over total gas purchases by year and if one of years is selectedyear make yellow all others blue
      for (var i = 0; i < bchart.data.labels.length; i++) {
      if(bchart.data.labels[i]==selectedYear){bchart.data.datasets[0].backgroundColor[i] = "Gold";}
      else{bchart.data.datasets[0].backgroundColor[i] = "SkyBlue";}
    
  }

}

//loads one years data and updates the chart
function loadData(year, id) {
  selectedYear=year;
  monthUsage = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  var mydata = JSON.parse(bigdata)
  for (var i = 0; i < mydata.length; i++) {
    if (mydata[i].LocationFuelId == id && parseInt(mydata[i].DeliveryDate.substring(0, 4)) == year) {
      //console.log(mydata[i].DeliveryDate.substring(0, 4));
      let result = mydata[i].DeliveryDate.substring(5, 7);
      monthUsage[parseInt(result) - 1] += mydata[i].Quantity;
      isPredection(mydata[i], parseInt(result))
    }

  }
  //console.log(monthUsage)
  data.datasets[0].data = monthUsage // sets the average tempature to monthusage
  GetGallonsByYear(id)
  myChart.update();
  bchart.data.labels=GasYears;
  bchart.data.datasets[0].data=GalsbyYear;
  isSelectedYear()
  bchart.update();
  dchart.data.datasets[0].data=GetGallonsByMonth(id)
  dchart.update();
  return monthUsage;
}



function loadPredictionData(theData) {
  var mydata = JSON.parse(theData)
  //this not used at momen justy know will need in future
  //idea is to add this data to already loaded historical data data

}

//changes dropdown menu option to only show years that have data for spefic customer
function showYears(userid) {
  var mydata = JSON.parse(bigdata)
  let yrs = []
  for (var i = 0; i < mydata.length; i++) {

    if (mydata[i].LocationFuelId == userid && mydata[i].Quantity > 0) {
      if (yrs.includes(mydata[i].DeliveryDate.substring(0, 4))) {} else {
        yrs.push(mydata[i].DeliveryDate.substring(0, 4))
      }

    }
  }
  yrs.sort(); //puts in order by year
  GasYears=yrs; //this was used as test for bar chart delete when GetGallonsByYear is wokring
  removeOptions(year)

  for (var i = 0; i < yrs.length; i++) {
    var select = document.getElementById('year');
    var opt = document.createElement('option');
    opt.value = yrs[i];
    opt.innerHTML = yrs[i];
    select.appendChild(opt);

  }
  return yrs;
}
function GetGallonsByYear(userid){
  //copys GasYears and turns into 2d array
  var mydata = JSON.parse(bigdata)
  let yrs=[]
  let gals=[]
  for (var i =0; i<GasYears.length; i++){
    yrs[i]=[GasYears[i],0]
  }
  //console.log(yrs)
  //loop over data and add gallons to array
  for (var i = 0; i < mydata.length; i++) {

    if (mydata[i].LocationFuelId == userid && mydata[i].Quantity > 0) {
        for (var j =0; j<yrs.length; j++){
          if(yrs[j][0]==mydata[i].DeliveryDate.substring(0, 4)){
            yrs[j][1]+=mydata[i].Quantity
          }
        }

    }
  }
  //console.log(yrs)
  for (var i =0; i<yrs.length; i++){
    gals[i]=yrs[i][1]
  }
  GalsbyYear=gals;
  //console.log("years is" + gals)
  return gals;
}

function GetGallonsByMonth(userid){
  let mnths=[0,0,0,0,0,0,0,0,0,0,0,0]
  var mydata = JSON.parse(bigdata)
  //loop over all data by user id
  //check month and add that data to array
  //make that array donught charts data
  for (var i = 0; i < mydata.length; i++) {

    if (mydata[i].LocationFuelId == userid && mydata[i].Quantity > 0) {
        let m=parseInt(mydata[i].DeliveryDate.substring(5, 7));
        mnths[m-1]+=mydata[i].Quantity;
    }
  }
    return mnths;
  }

function Includes2d(array,value){
  for (let i = 0; i < array.length; i++) {
    if(array[i].includes(value)){
      return i;//add number of gallons to year and then return
    }
  }
  return -1;//if year not in array yet add it and gallons then return

}
//helper method for showYears that removes html elemnts from year dropdown menu
function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}






//evreything below is pie chart test

dchart = new Chart(document.getElementById("doughnut-chart"), {
  type: 'doughnut',
  data: {
    labels: ['January', 'February','March','April','May','June','July', 'August','September','October','Novemeber', 'December', ],
    datasets: [{
      label: "Gallons Used",
      //backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
      data: [768, 659, 734, 784, 433]
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Gas Purchases By Month'
      }
    }
  }
});

// Bar chart
bchart=new Chart(document.getElementById("bar-chart"), {
  type: 'bar',
  data: {
    labels: GasYears,//["2000", "2001", "2002", "2003"],
    datasets: [{
      label: "Gallons",
      backgroundColor: ["SkyBlue", "SkyBlue", "SkyBlue", "SkyBlue","SkyBlue", "SkyBlue", "SkyBlue", "SkyBlue"],
      data: GalsbyYear
    }]
  },
  options: {
    indexAxis: 'y',
    legend: {
      display: false
    },
    plugins: {
      title: {
        display: true,
        text: 'Total Gas Purchases By Year'
      }
    }
  }
});






loadData(2015, 139)
showYears(139)
document.getElementById("userid").value = 139;
GetGallonsByYear(139)
bchart.data.labels=GasYears;
bchart.data.datasets[0].data=GalsbyYear;
bchart.update();
loadData(2015, 139)
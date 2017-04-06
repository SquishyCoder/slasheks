$(document).ready(function() {
  $(window).scroll(function() {
    if ($(".selected").offset().top > 400) {
      $("nav").removeClass("transparent");
      $("#normal-nav li").css("border", "1px solid #eceff1").addClass("scroll-change");
    } else {
      $("nav").addClass("transparent");
      $("#normal-nav li").css("border", "").removeClass("scroll-change");
    }
  });

  $(".button-collapse").sideNav();

  $(".parallax").parallax();

  checkAPI();
});

var i = 0;
var mainLink1;
var mainLink2;
var links1 = ["https://login.lisk.io/api/delegates/get?username=slasheks", "https://wallet.lisknode.io/api/delegates/get?username=slasheks", "https://lisk-login.vipertkd.com/api/delegates/get?username=slasheks", "https://01.lskwallet.space/api/delegates/get?username=slasheks", "https://02.lskwallet.space/api/delegates/get?username=slasheks"];
var links2 = ["https://login.lisk.io/api/transactions", "https://wallet.lisknode.io/api/transactions", "https://lisk-login.vipertkd.com/api/transactions", "https://01.lskwallet.space/api/transactions", "https://02.lskwallet.space/api/transactions"];

function checkAPI() {
  var promise = $.getJSON(links2[i]);

  promise.done(function() {
    mainLink1 = links1[i];
    mainLink2 = links2[i];

    delegateData();
    retrieveInfo();
  });

  promise.fail(function() {
    if (i === 4) {
      var notice = $("<h2></h2>").text("Data is not available at this time.");
      $("#stats h1").append(notice);
    } else {
      i+=1;
      checkAPI();
    }
  });
}

var productivity;
var approval;
var pBlocks;
var mBlocks;

function delegateData() {
  $.getJSON(mainLink1, function(info) {
    productivity = info.delegate.productivity;
    approval = info.delegate.approval;
    pBlocks = info.delegate.producedblocks;
    mBlocks = info.delegate.missedblocks;
  });

  setTimeout(function() {
    displayCharts();
  }, 1000);
}

/*http://jsfiddle.net/s9tu1c9y/*/

function displayCharts() {
  var ctx1 = document.getElementById("productivity").getContext("2d");
  var ctx2 = document.getElementById("approval");
  var ctx3 = document.getElementById("blocks");

  var data1 = {
    labels: ["Productivity", "Remaining %"],
    datasets: [{
        data: [productivity, (100 - productivity)],
        backgroundColor: [
          "#37474f",
          "#212121"
        ],
        hoverBackgroundColor: [
          "#546e7a",
          "#212121"
        ]
      }
    ]
  }

  var data2 = {
    type: "doughnut",
    labels: ["Approval", "Remaining %"],
    datasets: [{
        data: [approval, (100 - approval)],
        backgroundColor: [
          "#37474f",
          "#212121"
        ],
        hoverBackgroundColor: [
          "#546e7a",
          "#212121"
        ]
      }
    ]
  }

  var data3 = {
    labels: ["Produced Blocks", "Missed Blocks"],
    datasets: [{
        data: [pBlocks, mBlocks],
        backgroundColor: [
          "#37474f",
          "#212121"
        ],
        hoverBackgroundColor: [
          "#546e7a",
          "#212121"
        ]
      }
    ]
  }



  var productivityChart = new Chart(ctx1, {
    type: "doughnut",
    data: data1,
    options: {
      cutoutPercentage: 70,
      animation: {
        animateScale: true
        }
      }
    });

  var approvalChart = new Chart(ctx2, {
    type: "doughnut",
    data: data2,
    options: {
      cutoutPercentage: 70,
      animation: {
        animateScale: true
      }
    }
  });

  var blocksChart = new Chart(ctx3, {
    type: "doughnut",
    data: data3,
    options: {
      cutoutPercentage: 70,
      animation: {
        animateScale: true
      }
    }
  });

  setTimeout(function() {
    var prodMath = String(Math.round(productivity)) + "%";
    var appMath = String(Math.round(approval)) + "%";
    $("#prodInner").append(prodMath);
    $("#approvalInner").append(appMath);
    $("#blocksInner").append(String(pBlocks));

  }, 1000);
}


var data = [];

var addressHash = {
  "17589464102226817833L": "slasheks",
  "2528264217759463926L": "liska",
  "2581296529630509432L": "slasheks_voting",
  "5666375702678662313L": "slasheks_donations",
  "14562294835172406712L": "slasheks_bank1",
  "13378392912255358820L": "slasheks_bank2"
};


function retrieveInfo() {
  var urls = ["?senderId=17589464102226817833L", "?recipientId=17589464102226817833L"];

  for (var x = 0; x < urls.length; x++) {

  $.getJSON(mainLink2 + urls[x], function(info) {
    var transactions = info.transactions;

    for (var i = 0; i < transactions.length; i++) {
      if (transactions[i].type !== 0 || transactions[i].amount < 1) {
        continue;
      } else {
        var d = new Date((transactions[i].timestamp + 1464109200)*1000);
        var options = {month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
        var date = d.toLocaleString('en-US', options);

        data.push([transactions[i].senderId, transactions[i].recipientId, transactions[i].amount, transactions[i].id, date]);
      }
    }
  });
  }
  setTimeout(function() {
      displayData();
  }, 1000);
}

function displayData() {
  for (var t = 0; t < data.length; t++) {
    var linkAddFrom = $("<a></a>").attr({"href":"https://explorer.lisknode.io/address/" + data[t][0], "target": "_blank"}).text(data[t][0]);
    var linkAddTo = $("<a></a>").attr({"href":"https://explorer.lisknode.io/address/" + data[t][1], "target": "_blank"}).text(data[t][1]);
    var linkTrans= $("<a></a>").attr({"href":"https://explorer.lisk.io/tx/" + data[t][3], "target": "_blank"}).text(data[t][3]);

    var row = $("<tr></tr>");
    var from = $("<td></td>").html(linkAddFrom);
    var fname = $("<td></td>").text(addressHash[data[t][0]]);
    var to = $("<td></td>").html(linkAddTo);
    var toName = $("<td></td>").text(addressHash[data[t][1]]);
    var amount = $("<td></td>").text(data[t][2]/100000000);
    var id = $("<td></td>").html(linkTrans);
    var date = $("<td></td>").text(data[t][4]);

    row.append(from, fname, to, toName, amount, id, date);
    $("tbody").append(row);
  }
  setTimeout(function() {
    //Using tablesorter jquery plugin -- materializecss theme: https://github.com/Mottie/tablesorter

    $("table").tablesorter({
    theme : "materialize",

    widthFixed: true,
    widgets : [ "filter", "zebra"],

    widgetOptions : {
      zebra : ["even", "odd"],

      filter_reset : ".reset",

      filter_cssFilter: ["", "", "browser-default"]
    },

    dateFormat: "mmddyyyy",

    headers: {
      6: {sorter: "shortDate"}
    }
  })
  .tablesorterPager({

    container: $(".ts-pager"),

    cssGoto  : ".pagenum",

    removeRows: false,

    output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'

  });

  $("#myTable").tablesorter();
  }, 1000);
}

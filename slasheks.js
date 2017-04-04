$(document).ready(function() {
  $(window).scroll(function() {
    if ($(".selected").offset().top > 400) {
      $(".selected").addClass("scroll-change");
      $("#normal-nav li").css("border", "1px solid #eceff1");
    } else {
      $(".selected").removeClass("scroll-change");
      $("#normal-nav li").css("border", "");
    }
  });

  retrieveInfo();
});


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

  $.get("https://login.lisk.io/api/transactions" + urls[x], function(info) {
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
    var row = $("<tr></tr>");
    var from = $("<td></td>").text(data[t][0]);
    var fname = $("<td></td>").text(addressHash[data[t][0]]);
    var to = $("<td></td>").text(data[t][1]);
    var toName = $("<td></td>").text(addressHash[data[t][1]]);
    var amount = $("<td></td>").text(data[t][2]/100000000);
    var id = $("<td></td>").text(data[t][3]);
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
  }, 1000);
}

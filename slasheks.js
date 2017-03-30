$(document).ready(function() {
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
        var date = d.toDateString();

        console.log(i);

        data.push([transactions[i].senderId, transactions[i].recipientId, transactions[i].amount, transactions[i].id, date]);
      }
    }
  });
  }
  setTimeout(function() {
      //console.log(data.length);
      displayData();
  }, 5000);
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
    $("tr:odd").css("background-color", "#424242");
  }
}

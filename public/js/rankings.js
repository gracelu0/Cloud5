var rankings = [];
rankings[0] = localStorage.getItem("rank1");
rankings[1] = localStorage.getItem("rank2");
rankings[2] = localStorage.getItem("rank3");
rankings[3] = localStorage.getItem("rank4");
for(var i = 0; i < 4; i++){
  $("ol").append("<li>" + rankings[i] + "</li>");
}
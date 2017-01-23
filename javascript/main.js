var statusQuoLeeftijd = 67,
    jaartallen = 0,
    currentJaar = 2017,
    statusQuoAOW = 794.59,
    statusQuoPremie = 17.9,
    leeftijd = statusQuoLeeftijd,
    bedrag = statusQuoAOW,
    premie = statusQuoPremie,
    maxPremie = 6048,
    modelVariabelen = [leeftijd, bedrag, premie],
    modelVariabelenStatusQuo = [statusQuoLeeftijd, statusQuoAOW, statusQuoPremie],
    // leftWidth = 800,
    // leftWidth = document.getElementById("balans").style.width,
    leftWidth = d3.select(".col-md-7")[0][0].clientWidth,
    // rightWidth = 650,
    rightWidth = d3.select(".col-md-5")[0][0].clientWidth,
    topHeight = 400,
    bottomHeight = 200,
    legendBox = {width: leftWidth / 20, height: leftWidth / 20},
    margin = {
      balans: {top: 70, right: leftWidth / 4, bottom: 50, left: leftWidth / 8},
      piramide: {top: 70, right: rightWidth / 4, bottom: 50, left: rightWidth / 10, between: rightWidth / 20},
      contributie: {top: 70, right: leftWidth / 4, bottom: 20, left: leftWidth / 8}
    },
    column = leftWidth / 7,
    yLabelNamen = ['euro\'s', '€ x duizend', '€ x miljoen', '€ x miljard', '€ x biljoen', '€ x biljard']
    balans = d3.select('#balans')
      .attr('width', leftWidth)
      .attr('height', topHeight)
    piramide = d3.select('#piramide')
      .attr('width', rightWidth)
      .attr('height', topHeight)
    contributie = d3.select('#contributie')
      .attr('width', leftWidth)
      .attr('height', bottomHeight)

window.onresize = function(event) {
  // leftWidth = d3.select('.col-md-7')[0][0].clientWidth;
  // rightWidth = d3.select('.col-md-5')[0][0].clientWidth;
  location.reload();
};

console.log(document.getElementsByClassName("col-md-7")[0].style.width)
console.log(column)
// $(document).ready(function () {
//     var holdWidth = $(window).width();
//     $(window).on('resize', function () {
//         newPercentage = (($(window).width() / holdWidth) * 100) + "%";
//         $("html").css("font-size", newPercentage)
//
//     });
// });

document.getElementById('leeftijdKeuze').value=statusQuoLeeftijd
document.getElementById('bedragKeuze').value=statusQuoAOW
document.getElementById('premieKeuze').value=statusQuoPremie

balansTitle()
balansSubTitle()
piramideTitle()
contributieTitle()
legendBalans()
legendPiramide()
legendContributie()

queue()
  .defer(d3.json, "data/leeftijdPrognose.json")
  .defer(d3.json, "data/werkloosheid.json")
  .defer(d3.json, 'data/inkomensKlassen.json')
  .await(mainLoop);

function mainLoop(error, file1, file2, file3) {
  leeftijdsVerdeling = file1
  werkloosheid = file2
  inkomens = file3
  jaartallen = Object.keys(leeftijdsVerdeling)
  leeftijden = []


  console.log(inkomens[5])
  Object.keys(inkomens[5]).forEach(function(each){
    console.log(inkomens[5][each])
  })
  Object.keys(leeftijdsVerdeling[currentJaar]['leeftijden']).forEach(function(x) {
    leeftijden.push(parseInt(x))
  })

  drawBalans()

  drawPiramide()

  drawContributie(currentJaar)

  d3.select('#berekenKeuze').on('click', function() {
    // pagina niet refreshen bij click
    d3.event.preventDefault();
    leeftijdValue = parseInt(d3.select('#leeftijdKeuze').property('value'));
    bedragValue = parseInt(d3.select('#bedragKeuze').property('value'));
    premieValue = parseInt(d3.select('#premieKeuze').property('value'));

    if (leeftijdValue) {leeftijd = leeftijdValue}
    if (bedragValue) {bedrag = bedragValue}
    if (premieValue) {premie = premieValue}

    drawBalans();
    drawPiramide();
    drawContributie(currentJaar);
  })

}

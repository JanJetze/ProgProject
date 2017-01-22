var statusQuoLeeftijd = 67,
    jaartallen = 0,
    currentJaar = 2017,
    statusQuoAOW = 794.59,
    statusQuoPremie = 9343,
    leeftijd = statusQuoLeeftijd,
    bedrag = statusQuoAOW,
    premie = statusQuoPremie,
    modelVariabelen = [leeftijd, bedrag, premie],
    modelVariabelenStatusQuo = [statusQuoLeeftijd, statusQuoAOW, statusQuoPremie],
    leftWidth = 800,
    // leftWidth = document.getElementById("balans").style.width,
    rightWidth = 650,
    topHeight = 400,
    bottomHeight = 200,
    legendBox = {width: 40, height: 40},
    margin = {
      balans: {top: 70, right: 200, bottom: 50, left: 100},
      piramide: {top: 70, right: 200, bottom: 50, left: 30, between: 20},
      contributie: {top: 70, right: 200, bottom: 20, left: 100}
    },
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

console.log('leftwidth', leftWidth)
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
  .await(mainLoop);

function mainLoop(error, file1, file2) {
  leeftijdsVerdeling = file1
  werkloosheid = file2
  jaartallen = Object.keys(leeftijdsVerdeling)
  leeftijden = []

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

var statusQuoLeeftijd = 67,
    statusQuoAOW = 794.59,
    statusQuoPremie = 9343,
    modelVariabelenStatusQuo = [statusQuoLeeftijd, statusQuoAOW, statusQuoPremie],
    leftWidth = 800,
    rightWidth = 650,
    topHeight = 400,
    bottomHeight = 200,
    legendBox = {width: 40, height: 40},
    margin = {
      balans: {top: 100, right: 200, bottom: 50, left: 50},
      piramide: {top: 70, right: 200, bottom: 30, left: 30, between: 20},
      contributie: {top: 40, right: 200, bottom: 20, left: 50}
    },
    yLabelNamen = ['duizend', 'miljoen', 'miljard', 'biljoen']
    balans = d3.select('#balans')
      .attr('width', leftWidth)
      .attr('height', topHeight)
    piramide = d3.select('#piramide')
      .attr('width', rightWidth)
      .attr('height', topHeight)
    contributie = d3.select('#contributie')
      .attr('width', leftWidth)
      .attr('height', bottomHeight)

    balans.append('text')
      .attr('class', 'title')
      .attr('id', 'balansTitle')
      .attr('x', (leftWidth / 4) + margin.balans.left)
      .attr('y', margin.balans.top / 4)
      .text('Balans Titel')

    balans.append('text')
      .attr('class', 'subTitle')
      .attr('id', 'balansSubTitle')
      .attr('x', (leftWidth / 4) + margin.balans.left)
      .attr('y', (margin.balans.top / 2))
      .text('Balans SubTitel')

    piramide.append('text')
      .attr('class', 'title')
      .attr('id', 'piramideTitle')
      .attr('x', (rightWidth / 4) + margin.piramide.left)
      .attr('y', margin.piramide.top / 4)
      .text('Piramide Titel')

    piramide.append('text')
      .attr('class', 'subTitle')
      .attr('id', 'piramideSubTitle')
      .attr('x', (rightWidth / 4) + margin.piramide.left)
      .attr('y', margin.piramide.top / 2)
      .text('Piramide SubTitel')

    contributie.append('text')
      .attr('class', 'title')
      .attr('id', 'contributieTitle')
      .attr('x', (leftWidth / 4) + margin.contributie.left)
      .attr('y', margin.contributie.top / 4)
      .text('Contributie Titel')

    contributie.append('text')
      .attr('class', 'subTitle')
      .attr('id', 'contributieSubTitle')
      .attr('x', (leftWidth / 4) + margin.contributie.left)
      .attr('y', margin.contributie.top / 2)
      .text('Contributie SubTitel')

    var legendBalans = balans.append('g')
      .attr('class', 'legend')

    legendBalans.append('rect')
      .attr('class', 'legendBox expenses')
      .attr('width', legendBox.width)
      .attr('height', legendBox.height)
      .attr('x', leftWidth - 100)
      .attr('y', (topHeight / 2) - 50)

    legendBalans.append('text')
      .attr('class', 'legendText')
      .attr('text-anchor', 'end')
      .attr('x', leftWidth - 110)
      .attr('y', (topHeight / 2) - 25)
      .text('uitgaven')

    legendBalans.append('rect')
      .attr('class', 'legendBox revenues')
      .attr('width', legendBox.width)
      .attr('height', legendBox.height)
      .attr('x', leftWidth - 100)
      .attr('y', (topHeight / 2) + 10)

    legendBalans.append('text')
      .attr('class', 'legendText')
      .attr('text-anchor', 'end')
      .attr('x', leftWidth - 110)
      .attr('y', (topHeight / 2) + 35)
      .text('inkomsten')

    var legendContributie = contributie.append('g')
      .attr('class', 'legend')

    legendContributie.append('rect')
      .attr('class', 'legendBox expenses')
      .attr('width', legendBox.width)
      .attr('height', legendBox.height)
      .attr('x', leftWidth - 100)
      .attr('y', (bottomHeight / 2) - 50)

    legendContributie.append('text')
      .attr('class', 'legendText')
      .attr('text-anchor', 'end')
      .attr('x', leftWidth - 110)
      .attr('y', (bottomHeight / 2) - 25)
      .text('uitgaven')

    legendContributie.append('rect')
      .attr('class', 'legendBox revenues')
      .attr('width', legendBox.width)
      .attr('height', legendBox.height)
      .attr('x', leftWidth - 100)
      .attr('y', (bottomHeight / 2) + 10)

    legendContributie.append('text')
      .attr('class', 'legendText')
      .attr('text-anchor', 'end')
      .attr('x', leftWidth - 110)
      .attr('y', (bottomHeight / 2) + 35)
      .text('inkomsten')

    var legendPiramide = piramide.append('g')
      .attr('class', 'legend')

    legendPiramide.append('rect')
      .attr('class', 'legendBox vrouw')
      .attr('width', legendBox.width)
      .attr('height', legendBox.height)
      .attr('x', rightWidth - 50)
      .attr('y', (topHeight / 2) - 50)

    legendPiramide.append('text')
      .attr('class', 'legendText')
      .attr('text-anchor', 'end')
      .attr('x', rightWidth - 60)
      .attr('y', (topHeight / 2) - 25)
      .text('vrouwen')

    legendPiramide.append('rect')
      .attr('class', 'legendBox man')
      .attr('width', legendBox.width)
      .attr('height', legendBox.height)
      .attr('x', rightWidth - 50)
      .attr('y', (topHeight / 2) + 10)

    legendPiramide.append('text')
      .attr('class', 'legendText')
      .attr('text-anchor', 'end')
      .attr('x', rightWidth - 60)
      .attr('y', (topHeight / 2) + 35)
      .text('mannen')

queue()
  .defer(d3.json, "data/leeftijdPrognose.json")
  .defer(d3.json, "data/werkloosheid.json")
  .await(mainLoop);

function mainLoop(error, file1, file2) {
  leeftijdsVerdeling = file1
  werkloosheid = file2
  jaartallen = Object.keys(leeftijdsVerdeling)
  leeftijd = statusQuoLeeftijd
  bedrag = statusQuoAOW
  premie = statusQuoPremie
  modelVariabelen = [leeftijd, bedrag, premie]
  currentJaar = 2060
  leeftijden = []

  Object.keys(leeftijdsVerdeling[currentJaar]['leeftijden']).forEach(function(x) {
    leeftijden.push(parseInt(x))
  })

  leeftijd = 50
  bedrag = 1200
  premie = 4000


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

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
    // leftWidth = d3.select(".col-md-7")[0][0].clientWidth,
    // rightWidth = 650,
    // rightWidth = d3.select(".col-md-5")[0][0].clientWidth,
    // topHeight = 400,
    // bottomHeight = 200,
    legendBox = {width: 40, height: 40},
    measures = {
      balans: {height: 320, width: 650,
        margin: {top: 70, right: 200, bottom: 50, left: 100},
        graph: {}},
      piramide: {height: 470, width: 490,
        margin: {top: 70, right: 150, bottom: 50, left: 50, between: 25},
        graph: {}},
      contributie: {height: 150, width: 650,
        margin: {top: 70, right: 200, bottom: 20, left: 100},
        graph: {}},
    };
    measures.balans.graph.height = measures.balans.height - measures.balans.margin.top - measures.balans.margin.bottom,
    measures.balans.graph.width = measures.balans.width - measures.balans.margin.right - measures.balans.margin.left,
    measures.piramide.graph.height = measures.piramide.height - measures.piramide.margin.top - measures.piramide.margin.bottom,
    measures.piramide.graph.width =  (measures.piramide.width - measures.piramide.margin.right - measures.piramide.margin.left - measures.piramide.margin.between) / 2,
    measures.contributie.graph.height = measures.contributie.height - measures.contributie.margin.top - measures.contributie.margin.bottom,
    measures.contributie.graph.width = measures.contributie.width - measures.contributie.margin.right - measures.contributie.margin.left,
    // margin = {
    //   balans: {top: 70, right: leftWidth / 4, bottom: 50, left: leftWidth / 8},
    //   piramide: {top: 70, right: rightWidth / 4, bottom: 50, left: rightWidth / 10, between: rightWidth / 20},
    //   contributie: {top: 70, right: leftWidth / 4, bottom: 20, left: leftWidth / 8}
    // },
    // column = leftWidth / 7,
    yLabelNamen = ['euro\'s', '€ x duizend', '€ x miljoen', '€ x miljard', '€ x biljoen', '€ x biljard']
    balans = d3.select('#balans')
      .attr('width', measures.balans.width)
      .attr('height', measures.balans.height)
    // d3.select('#divBalans')
    //   .append('div')
    //   .classed('svg-container', true)
    //   .append('svg')
    //   .attr('id', 'balans')
    //   .attr('preserveAspectRatio', 'xMinYMin meet')
    //   .attr('viewbox', '0 0 ' + measures.balans.width + ' ' + measures.balans.height)
    //   .classed('svg-content-responsive', true)
    piramide = d3.select('#piramide')
      .attr('width', measures.piramide.width)
      .attr('height', measures.piramide.height)
    // d3.select('#divPiramide')
      // .classed('svg-container', true)
      // .append('svg')
      // .attr('width', measures.contributie.width)
      // .attr('height', measures.contributie.height)
      // .attr('id', 'piramide')
      // .attr('class', 'svg-content')
      // .attr('preserveAspectRatio', 'xMinYMin meet')
      // .attr('viewbox', '0 0 600 400')
      // .classed('svg-content-responsive', true)
    contributie = d3.select('#contributie')
      .attr('width', measures.contributie.width)
      .attr('height', measures.contributie.height)
    // d3.select('#divContributie')
      // .classed('svg-container', true)
      // .append('svg')
      // .attr('id', 'contributie')
      // .attr('preserveAspectRatio', 'xMinYMin meet')
      // .attr('viewbox', '0 0 600 400')
      // .classed('svg-content-responsive', true)

    balans = d3.select('#balans')
    piramide = d3.select('#piramide')
    contributie = d3.select('#contributie')

    d3.select('.glyphi.info')
      .on('click', function(){
        document.getElementsByClassName('modal-title')[0].innerHTML = 'algemeen';
        document.getElementsByClassName('modal-body')[0].innerHTML = infoGlyphiAlgemeen
        $('#myModal').modal('toggle')})

    d3.select('.glyphi.question')
      .on('click', function(){
        document.getElementsByClassName('modal-title')[0].innerHTML = 'algemeen';
        document.getElementsByClassName('modal-body')[0].innerHTML = questionGlyphiAlgemeen
        $('#myModal').modal('toggle')})

    d3.select('.glyphi.play')
      .on('click', function() {
        playPiramide();
        })

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
  if (error) {
    d3.selectAll('body > *:not(.alert-danger)')
      .style('display', 'none');
    d3.select('.alert-danger')
      .style('display', 'block')
  }
  d3.select('#load')
    .style('display', 'none')
  d3.select('#main')
    .style('visibility', 'visible')
  leeftijdsVerdeling = file1
  werkloosheid = file2
  inkomens = file3
  jaartallen = Object.keys(leeftijdsVerdeling)
  leeftijden = []

  Object.keys(leeftijdsVerdeling[currentJaar]['leeftijden']).forEach(function(x) {
    leeftijden.push(parseInt(x))
  })

  drawBalans()

  drawPiramide(currentJaar)

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
    drawPiramide(currentJaar);
    drawContributie(currentJaar);
  })

  d3.select("input[type=range]#sliderJaren")
    .on("input", function() {
      currentJaar = this.value;
      drawPiramide(currentJaar);
      drawContributie(currentJaar);})
}

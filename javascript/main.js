/*
 * Jan Jetze Beitler
 * 10416641
 *
 * Minor Programmeren
 * main.js
 */

  var jaartallen = 0,
    currentJaar = 2017,
    maxPremieTeBetalen = 6048,
    yLabelNamen = ['euro\'s', '€ x duizend', '€ x miljoen', '€ x miljard', '€ x biljoen', '€ x biljard'],
    legendBox = {width: 10, height: 10},
    variables = {
      leeftijd: {basis: 67, min: 50, max: 99},
      bedrag: {basis: 794.59, min: 0, max: 10000},
      premie: {basis: 17.9, min: 0, max: 100}
    };
    variables.leeftijd.current = variables.leeftijd.basis,
    variables.bedrag.current = variables.bedrag.basis,
    variables.premie.current = variables.premie.basis,
    measures = {
      balans: {height: 320, width: 650,
        margin: {top: 70, right: 200, bottom: 50, left: 70},
        graph: {}},
      piramide: {height: 370, width: 490,
        margin: {top: 70, right: 50, bottom: 50, left: 50, between: 25},
        graph: {}},
      contributie: {height: 150, width: 650,
        margin: {top: 70, right: 200, bottom: 20, left: 70, between: 50},
        graph: {}},
      slider: {height: 100, width: 490}
    };
    measures.balans.graph.height = measures.balans.height - measures.balans.margin.top - measures.balans.margin.bottom,
    measures.balans.graph.width = measures.balans.width - measures.balans.margin.right - measures.balans.margin.left,
    measures.piramide.graph.height = measures.piramide.height - measures.piramide.margin.top - measures.piramide.margin.bottom,
    measures.piramide.graph.width =  (measures.piramide.width - measures.piramide.margin.right - measures.piramide.margin.left - measures.piramide.margin.between) / 2,
    measures.contributie.graph.height = measures.contributie.height - measures.contributie.margin.top - measures.contributie.margin.bottom,
    measures.contributie.graph.width = measures.contributie.width - measures.contributie.margin.right - measures.contributie.margin.left,

balans = d3.select('#balans')
  .attr('width', measures.balans.width)
  .attr('height', measures.balans.height)

piramide = d3.select('#piramide')
  .attr('width', measures.piramide.width)
  .attr('height', measures.piramide.height)

contributie = d3.select('#contributie')
  .attr('width', measures.contributie.width)
  .attr('height', measures.contributie.height)

d3.select('#slider')
  .style('height', measures.slider.height + 'px')
  .style('width', measures.slider.width + 'px')

d3.select('#jaartal')
  .html(currentJaar)

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
    d3.select('.glyphicon-play')
      .style('display', 'none');
    d3.select('.glyphicon-pause')
      .style('display', 'inline');
    play();
    })

d3.select('.glyphi.pause')
  .on('click', function() {
    d3.select('.glyphicon-pause')
      .style('display', 'none');
    d3.select('.glyphicon-play')
      .style('display', 'inline');
    stop();
  })

d3.select('#leeftijdKeuze').property('value', variables.leeftijd.basis)
d3.select('#leeftijdKeuze').property('min', variables.leeftijd.min)
d3.select('#leeftijdKeuze').property('max', variables.leeftijd.max)

d3.select('#bedragKeuze').property('value', variables.bedrag.basis)
d3.select('#bedragKeuze').property('min', variables.bedrag.min)
d3.select('#bedragKeuze').property('max', variables.bedrag.max)

d3.select('#premieKeuze').property('value', variables.premie.basis)
d3.select('#premieKeuze').property('min', variables.premie.min)
d3.select('#premieKeuze').property('max', variables.premie.max)

balansTitle()
piramideTitle()
contributieTitle()
legendBalans()
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
  else {
  d3.select('#load')
    .style('display', 'none')
  d3.select('#main')
    .style('visibility', 'visible')

  leeftijdsVerdeling = file1
  werkloosheid = file2
  inkomens = file3

  jaartallen = []
  leeftijden = []

  Object.keys(leeftijdsVerdeling[currentJaar]['leeftijden']).forEach(function(x) {
    leeftijden.push(parseInt(x))
  })

  Object.keys(leeftijdsVerdeling).forEach(function(x) {
    jaartallen.push(parseInt(x))
  })

  slider = d3.slider()
    .min(jaartallen[0])
    .max(jaartallen[jaartallen.length - 1])
    .ticks(5)
    .showRange(false)
    .stepValues(jaartallen)
    .tickFormat(d3.format('d'))
    .value(currentJaar)

  d3.select('#slider')
    .call(slider)

  slider.callback(myFn)


  d3.selectAll('.berekenKeuze').on('click', function() {
    variableUpperCase = (this.id).slice(7, (this.id).length)
    variable = variableUpperCase.toLowerCase()
    waarde = parseFloat(d3.select('#' + variable + 'Keuze').property('value'))
    min = variables[variable]['min']
    max = variables[variable]['max']
    correctBedrag = /^([0-9])+[.]?([0-9]){0,2}$/
    correctPremie = /^([0-9])+[.]?([0-9])?$/
    correctLeeftijd = /^([0-9])+$/

    if (min > waarde || max < waarde) {
      alert('Vul een getal in tussen de ' + min + ' en de ' + max + '.')
      d3.select('#' + variable + 'Keuze').property('value', variables[variable]['current'])
    }

    else if (window['correct' + variableUpperCase].test(waarde)) {
      variables[variable]['current'] = waarde
      drawBalans()
      drawContributie(currentJaar)
    }

    else {
      alert('Vul een getal in.\nVoor de leeftijd kunt u alleen gehele getallen invoeren.\nVoor het bedrag en de premie wordt ook een enkele decimaal geaccepteerd.')
      d3.select('#' + variable + 'Keuze').property('value', variables[variable]['current'])
    }
  })

  d3.selectAll('.resetKeuze').on('click', function() {
    variable = ((this.id).slice(5, (this.id).length)).toLowerCase()
    basis = variables[variable]['basis']
    variables[variable]['current'] = basis

    d3.select('#' + variable + 'Keuze').property('value', basis)
    drawBalans();
    drawContributie(currentJaar);
  })
  drawBalans()

  drawPiramide(currentJaar)

  drawContributie(currentJaar)
}
}

function calcRevenue(leeftijd, premie, jaar) {
  werkenden = 0
  for(i = leeftijd - 50; i < leeftijd; i++) {
    werkenden += parseInt(leeftijdsVerdeling[jaar]['leeftijden'][i]['mannen en vrouwen']) * (werkloosheid[i] / 100)
  }
  rev = werkenden * (premie / 12)
  return rev
}

function calcExpense(leeftijd, bedrag, jaar) {
  AOWGerechtigden = 0
  for(i = leeftijd; i <= 99; i++) {
    AOWGerechtigden += parseInt(leeftijdsVerdeling[jaar]['leeftijden'][i]['mannen en vrouwen'])
  }
  exp = AOWGerechtigden * bedrag
  return exp
}

function labelFormatter(number) {
  zeros = String(number).length - 1;
  deleting = zeros / 3;
  return parseInt(deleting)
}

function mouseClickBalans(x, mouse) {
  console.log(x)
  var x0 = x.invert(d3.mouse(mouse)[0]);
  var series = data.map(function(e) {
      i = d3.bisect(jaartallen, x0),
      index0 = jaartallen[i - 1],
      index1 = jaartallen[i],
      index = x0 - index0 > index1 - x0 ? i : (i - 1);})
  console.log(currentJaar)
  currentJaar = parseInt(jaartallen[index])
  drawPiramide()
  drawContributie(currentJaar)

}

function mousemoveBalans(chart, x, y, mouse) {
  // calculate what x-value is closest to mouse position
  var x0 = x.invert(d3.mouse(mouse)[0]);
  var series = data.map(function(e) {
      i = d3.bisect(jaartallen, x0),
      index0 = jaartallen[i - 1],
      index1 = jaartallen[i],
      index = x0 - index0 > index1 - x0 ? i : (i - 1);})

  // draw straight line on x-axis on position of mouse
  balans.select('.crosshair')
    .attr('x1', function() { return x(jaartallen[index]) + margin.balans.left})
    .attr('y1', function() { return y(y.domain()[0]) + margin.balans.top})
    .attr('x2', function() { return x(jaartallen[index]) + margin.balans.left})
    .attr('y2', function() { return y(y.domain()[1]) + margin.balans.top})

  // position dots on each line corresponding to mouse position
  d3.selectAll('.mouse-per-line')
    .attr('transform', function(d, i) {return 'translate('
      + (x(parseInt(jaartallen[index])) + margin.balans.left)+ ', '
      + (y(d[index]) + margin.balans.top) + ')'})

  // show year on top of chart corresponding to mouse position
  balans.select('.year')
    .text(jaartallen[index])
    .attr('transform', 'translate(100, 40)')

  verschil = revenues[index] - expenses[index]
  revenueFormat = labelFormatter(parseInt(revenues[index]))
  expenseFormat = labelFormatter(parseInt(expenses[index]))
  verschilFormat = labelFormatter(parseInt(verschil))
  if (revenueFormat > 0) {
    revenueLabel = yLabelNamen[revenueFormat].slice(3)
  }
  else {revenueLabel = ''}
  if (expenseFormat > 0) {
    expenseLabel = yLabelNamen[expenseFormat].slice(3)
  }
  else {expenseLabel = ''}
  if (verschilFormat > 0) {
    verschilLabel = yLabelNamen[verschilFormat].slice(3)
  }
  else {verschilLabel = ''}
  revenueNumber = revenues[index] / ('1' + '0'.repeat(revenueFormat * 3))
  expenseNumber = expenses[index] / ('1' + '0'.repeat(expenseFormat * 3))
  verschilNumber = verschil / ('1' + '0'.repeat(verschilFormat * 3))

  balans.select('.info>.infoRevenue')
    .text('inkomsten: €' + String(revenueNumber).slice(0,5) + revenueLabel)
  balans.select('.info>.infoExpenses')
    .text('uitgaven: €' + String(expenseNumber).slice(0,5) + expenseLabel)
  if (verschil >= 0) {slice = 5}
  else {slice = 6}
  balans.select('.info>.infoVerschil')
    .text('verschil: €' + String(verschilNumber).slice(0,slice) + verschilLabel)
};

function mouseoverPiramide(bar, leeftijd) {
  leeftijdPos = []
  vrouwMan = ['vrouw', 'man']
  y = d3.select(bar).attr('y');
  bars = document.querySelectorAll('.bar[y="' + y + '"]');
  bars.forEach(function(bar) {
    bar.setAttribute('class', 'bar piramideHover')
    bar.setAttribute('height', (barHeight * 2))
    leeftijdPos.push([bar.getAttribute('x'), bar.getAttribute('width')])
  })

  piramide.append('text')
    .attr('class', 'infoLeeftijd')
    .attr('x', margin.piramide.left)
    .attr('y', parseInt(y) + margin.piramide.top)
    .attr('text-anchor', 'end')
    .text(leeftijd)

  piramide.append('text')
    .attr('class', 'infoLeeftijd')
    .attr('x', innerWidth)
    .attr('y', parseInt(y) + margin.piramide.top)
    .attr('text-anchor', 'end')
    .text(leeftijd)
}

function mouseoutPiramide(bar) {
  d3.selectAll('.infoLeeftijd').remove()
  vrouwMan = ['vrouw', 'man']
  y = d3.select(bar).attr('y')
  bars = document.querySelectorAll('.bar[y="' + y + '"]');
  bars.forEach(function(bar, i) {
    bar.setAttribute('class', 'bar ' + vrouwMan[i] + '')
    bar.setAttribute('height', barHeight)
  })


}

function mouseClickPiramide(bar, leeftijd) {
  piramide.select('.infoLeeftijdBox')
    .text('Leeftijd: ' + leeftijd)

  piramide.select('.infoMannen')
    .text('Mannen: ' + d3.format(',')(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['mannen']).replace(/,/g, '.'))

  piramide.select('.infoVrouwen')
    .text('Vrouwen: ' + d3.format(',')(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['vrouwen']).replace(/,/g, '.'))

  piramide.select('.infoTotaalLeeftijd')
    .text('Totaal: ' + d3.format(',')(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['mannen en vrouwen']).replace(/,/g, '.'))
}

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
  console.log('formatter', number, zeros, deleting)
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

function mousemove(chart, x, y, mouse) {
  marginTop = eval('margin.' + chart + '.top')
  marginRight = eval('margin.' + chart + '.right')
  marginBottom = eval('margin.' + chart + '.bottom')
  marginLeft = eval('margin.' + chart + '.left')
  chart = eval(chart)

  // calculate what x-value is closest to mouse position
  var x0 = x.invert(d3.mouse(mouse)[0]);
  var series = data.map(function(e) {
      i = d3.bisect(jaartallen, x0),
      index0 = jaartallen[i - 1],
      index1 = jaartallen[i],
      index = x0 - index0 > index1 - x0 ? i : (i - 1);})

  // draw straight line on x-axis on position of mouse
  chart.select('.crosshair')
    .attr('x1', function() { return x(jaartallen[index]) + marginLeft})
    .attr('y1', function() { return y(y.domain()[0]) + marginTop})
    .attr('x2', function() { return x(jaartallen[index]) + marginLeft})
    .attr('y2', function() { return y(y.domain()[1]) + marginTop})

  // position dots on each line corresponding to mouse position
  d3.selectAll('.mouse-per-line')
    .attr('transform', function(d, i) {return 'translate('
      + (x(parseInt(jaartallen[index])) + marginLeft)+ ', '
      + (y(d[index]) + marginTop) + ')'})

  // show data for each line corresponding to dot position
  chart.selectAll('.info')
    .text(function(d, i) { return d3.format('d')(data[i][index])})
    .attr('transform', 'translate(-8,-20)')
    .attr('fill', 'red');

  // show year on top of chart corresponding to mouse position
  chart.select('.year')
      .text(jaartallen[index])
      .attr('transform', 'translate(100, 40)')
};

function mouseoverPiramide(bar, leeftijd) {
  leeftijdPos = []
  vrouwMan = ['vrouw', 'man']
  y = d3.select(bar).attr('y');
  bars = document.querySelectorAll('.bar[y="' + y + '"]');
  bars.forEach(function(bar) {
    bar.setAttribute('class', 'bar piramideHover')
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
  })


}

function drawBalans() {
  d3.selectAll('#balans > *:not(.title):not(.subTitle):not(.legend)').remove()
  expenses = []
  revenues = []
  max = 0
  // innerHeight = topHeight - margin.balans.top - margin.balans.bottom
  // innerWidth = leftWidth - margin.balans.left - margin.balans.right
  data = [expenses, revenues]
  names = ['expenses', 'revenues']

  jaartallen.forEach(function(jaar) {
    exp = calcExpense(leeftijd, bedrag, jaar)
    rev = calcRevenue(leeftijd, premie, jaar)
    if (exp > max) {max = exp}
    if (rev > max) {max = rev}
    expenses.push(exp)
    revenues.push(rev)
  })

  formatter = labelFormatter(parseInt(max))
  yLabel = yLabelNamen[formatter]

  var x = d3.scale.linear()
    .domain([jaartallen[0], jaartallen[jaartallen.length - 1]])
    .range([0, measures.balans.graph.width])

  var y = d3.scale.linear()
    .domain([0, max])
    .range([measures.balans.graph.height, 0])
    .nice()

  var	valueline = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(jaartallen[i]); })
    .y(function(d, i) { return y(d); })

  glyphi = balans.append('g')
    .attr('class', 'glyphi')
    .attr('transform', 'translate(10, 10)')
    .on('click', function(){
      document.getElementsByClassName('modal-title')[0].innerHTML = 'balans';
      document.getElementsByClassName('modal-body')[0].innerHTML = infoGlyphiBalans
      $('#myModal').modal('toggle')})

  glyphi.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", 10)
    .attr("x", 10)
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-info-sign");

  balans.append('path')
    .attr('class', 'line expenses')
    .attr('transform', 'translate(' + measures.balans.margin.left + ', ' + measures.balans.margin.top + ')')
    .attr('d', valueline(expenses))

  balans.append('path')
    .attr('class', 'line revenues')
    .attr('transform', 'translate(' + measures.balans.margin.left + ', ' + measures.balans.margin.top + ')')
    .attr('d', valueline(revenues))

  // add element to place mousePerLine in, which shows hover effects
  var focus = balans.append('g')
      .attr('class', 'focus')

  var mousePerLine = focus.selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append('g')
      .attr('class', function(d, i) { return ('mouse-per-line ' + names[i])})

  // append circle, line and text to hover
  mousePerLine.append('circle')
      .attr('r', 9)

  focus.append('line')
      .attr('class', 'crosshair')
      .style('stroke', 'grey');

  balans.append('text')
    .attr('class', 'year')

  info = balans.append('g')
    .attr('class', 'info')
    .attr('transform', 'translate(' + (measures.balans.margin.left + measures.balans.graph.width) + ', 20)')

  info.append('text')
    .attr('class', 'infoRevenue')

  info.append('text')
    .attr('class', 'infoExpenses')
    .attr('dy', 25)

  info.append('text')
    .attr('class', 'infoVerschil')
    .attr('dy', 50)

  balans.append('rect')
    .attr('class', 'overlay')
    .attr('width', measures.balans.graph.width)
    .attr('height', measures.balans.graph.height)
    .attr('pointer-events', 'all')
    .on('mouseover', function() { focus.style('display', null); })
    .attr('transform', 'translate(' + measures.balans.margin.left + ',' + measures.balans.margin.top + ')')
    .on('mouseout', function() { focus.style('display', 'none');
      d3.selectAll('.info > text')
        .text('')
    })
    .on('mousemove', function() {mousemoveBalans('balans', x, y, this)})
    .attr('transform', 'translate(' + measures.balans.margin.left + ',' + measures.balans.margin.top + ')')
    .on('click', function() {mouseClickBalans(x, this)});

  axisBalans(x, y)
}

function drawPiramide(currentJaar) {
  d3.selectAll('#piramide > *:not(.title):not(.legend)').remove()
  piramideSubTitle()

  // innerHeight = topHeight - margin.piramide.bottom - margin.piramide.top
  // innerWidth = (rightWidth - margin.piramide.right - margin.piramide.left - margin.piramide.between) / 2
  barHeight = measures.piramide.graph.height / leeftijden.length
  leeftijdenMannen = []
  leeftijdenVrouwen = []
  max = 0

  leeftijden.forEach(function(leeftijd) {
    man = parseInt(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['mannen'])
    vrouw = parseInt(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['vrouwen'])
    leeftijdenMannen.push(man)
    leeftijdenVrouwen.push(vrouw)
    if (man > max) {max = man}
    if (vrouw > max) {max = vrouw}
  })

  glyphi = piramide.append('g')
    .attr('class', 'glyphi')
    .attr('transform', 'translate(10, 10)')
    .on('click', function(){
      document.getElementsByClassName('modal-title')[0].innerHTML = 'piramide';
      document.getElementsByClassName('modal-body')[0].innerHTML = infoGlyphiPiramide
      $('#myModal').modal('toggle')})

  glyphi.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", 10)
    .attr("x", 10)
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-info-sign");

  info = piramide.append('g')
    .attr('class', 'info')
    .attr('transform', 'translate(' + (measures.piramide.width - measures.piramide.margin.right - 100) + ', 20)')

  info.append('text')
    .attr('class', 'infoLeeftijdBox')

  info.append('text')
    .attr('class', 'infoMannen')
    .attr('dx', 150)

  info.append('text')
    .attr('class', 'infoVrouwen')
    .attr('dx', 150)
    .attr('dy', 25)

  info.append('text')
    .attr('class', 'infoTotaalLeeftijd')
    .attr('dy', 25)

  formatter = labelFormatter(max)
  yLabel = yLabelNamen[formatter]

  xVrouw = d3.scale.linear()
    .domain([max, 0])
    .range([0, measures.piramide.graph.width])

  xMan = d3.scale.linear()
    .domain([0, max])
    .range([0, measures.piramide.graph.width])

  y = d3.scale.linear()
    .domain([0, leeftijden[leeftijden.length - 1]])
    .range([measures.piramide.graph.height, 0])

  barsVrouw = piramide.append('g')
    .attr('class', 'bars barsVrouw')
    .attr('width', measures.piramide.graph.width)
    .attr('height', measures.piramide.graph.height)
    .attr('transform', 'translate(' + measures.piramide.margin.left + ', ' + measures.piramide.margin.top + ')')

  barsVrouw.selectAll('.bar')
    .data(leeftijdenVrouwen)
    .enter().append('rect')
      .attr('class', 'bar vrouw')
      .attr('x', function(d) { return xVrouw(d)})
      .attr('y', function(d, i) { return (measures.piramide.graph.height - (i + 1) * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return (measures.piramide.graph.width - xVrouw(d))})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})
      .on('click', function(d, i) {mouseClickPiramide(this, i)})

  barsMan = piramide.append('g')
    .attr('class', 'bars barsMan')
    .attr('width' , measures.piramide.graph.width)
    .attr('height', measures.piramide.graph.height)
    .attr('transform', 'translate(' + (measures.piramide.margin.left + measures.piramide.graph.width + (measures.piramide.margin.between) * 2) + ', ' + measures.piramide.margin.top + ')')

  barsMan.selectAll('.bar')
    .data(leeftijdenMannen)
    .enter().append('rect')
      .attr('class', 'bar man')
      .attr('x', 0)
      .attr('y', function(d, i) { return (measures.piramide.graph.height - (i + 1) * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return xMan(d)})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})
      .on('click', function(d, i) {mouseClickPiramide(this, i)})

  axisPiramide()
}

function drawContributie(jaar) {
  d3.selectAll('#contributie > *:not(.title):not(.legend)').remove()

  contributieSubTitle()

  inkomsten = calcRevenue(leeftijd, premie, jaar)
  uitgaven = calcExpense(leeftijd, bedrag, jaar)

  leeftijdInkomsten = {kleur: 'green', waarde: inkomsten - calcRevenue(statusQuoLeeftijd, premie, jaar)}
  leeftijdInkomstenFormat = labelFormatter(parseInt(leeftijdInkomsten.waarde))
  if (leeftijdInkomstenFormat > 0) {
    leeftijdInkomstenLabel = yLabelNamen[leeftijdInkomstenFormat].slice(3)
  }
  else {leeftijdInkomstenLabel = ''}
  if (leeftijdInkomsten.waarde >= 0) {leeftijdInkomstenSlice = 5}
  else {leeftijdInkomstenSlice = 6}
  leeftijdInkomstenNumber = leeftijdInkomsten.waarde / ('1' + '0'.repeat(leeftijdInkomstenFormat * 3))

  leeftijdUitgaven = {kleur: 'red', waarde: uitgaven - calcExpense(statusQuoLeeftijd, bedrag, jaar)}
  leeftijdUitgavenFormat = labelFormatter(parseInt(leeftijdUitgaven.waarde))
  if (leeftijdUitgavenFormat > 0) {
    leeftijdUitgavenLabel = yLabelNamen[leeftijdInkomstenFormat].slice(3)
  }
  else {leeftijdUitgavenLabel = ''}
  if (leeftijdUitgaven.waarde >= 0) {leeftijdUitgavenSlice = 5}
  else {leeftijdUitgavenSlice = 6}
  leeftijdUitgavenNumber = leeftijdUitgaven.waarde / ('1' + '0'.repeat(leeftijdUitgavenFormat * 3))

  bedragUitgaven = {kleur: 'red', waarde: uitgaven - calcExpense(leeftijd, statusQuoAOW, jaar)}
  bedragUitgavenFormat = labelFormatter(parseInt(bedragUitgaven.waarde))
  if (bedragUitgavenFormat > 0) {
    bedragUitgavenLabel = yLabelNamen[bedragUitgavenFormat].slice(3)
  }
  else {bedragUitgavenLabel = ''}
  if (bedragUitgaven.waarde >= 0) {bedragUitgavenSlice = 5}
  else {bedragUitgavenSlice = 6}
  bedragUitgavenNumber = bedragUitgaven.waarde / ('1' + '0'.repeat(bedragUitgavenFormat * 3))

  premieInkomsten = {kleur: 'green', waarde: inkomsten - calcRevenue(leeftijd, statusQuoPremie, jaar)}
  premieInkomstenFormat = labelFormatter(parseInt(premieInkomsten.waarde))
  if (premieInkomstenFormat > 0) {
    premieInkomstenLabel = yLabelNamen[premieInkomstenFormat].slice(3)
  }
  else {premieInkomstenLabel = ''}
  if (premieInkomsten.waarde >= 0) {premieInkomstenSlice = 5}
  else {premieInkomstenSlice = 6}
  premieInkomstenNumber = premieInkomsten.waarde / ('1' + '0'.repeat(premieInkomstenFormat * 3))

  leeftijdVerschil = [leeftijdInkomsten, leeftijdUitgaven]
  verschillen = [leeftijdInkomsten, leeftijdUitgaven, bedragUitgaven, premieInkomsten]

  min = 0
  max = 0

  verschillen.forEach(function(verschil) {
    if (verschil.waarde > max) {max = verschil.waarde}
    if (verschil.waarde < min) {min = verschil.waarde}
  })

  // innerHeight = bottomHeight - margin.contributie.top - margin.contributie.bottom
  // innerWidth = leftWidth - margin.contributie.left - margin.contributie.right
  spaceBetween = 50
  barWidth = measures.contributie.graph.width / 4 - spaceBetween

  if (Math.abs(max) > Math.abs(min)) {
    formatter = labelFormatter(parseInt(max))
  }
  else {
    formatter = labelFormatter(parseInt(Math.abs(min)))
  }
  yLabel = yLabelNamen[formatter]

  x = d3.scale.ordinal()
    .domain(4)
    .rangeBands([0, measures.contributie.graph.width])

  y = d3.scale.linear()
    .domain([min, max])
    .range([measures.contributie.graph.height, 0])
    .nice()

  glyphi = contributie.append('g')
    .attr('class', 'glyphi')
    .attr('transform', 'translate(10, 10)')
    .on('click', function(){
      document.getElementsByClassName('modal-title')[0].innerHTML = 'contributie';
      document.getElementsByClassName('modal-body')[0].innerHTML = infoGlyphiContributie
      $('#myModal').modal('toggle')})

  glyphi.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", 10)
    .attr("x", 10)
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-info-sign");

  info = contributie.append('g')
    .attr('class', 'info infoContributie')
    .attr('transform', 'translate(' + measures.contributie.margin.left + ', ' + measures.contributie.margin.top + ')')

  info.append('text')
    .attr('class', 'info infoLeeftijdRevenue')
    .attr('dx', (barWidth + spaceBetween) * 0.5)
    .attr('text-anchor', 'middle')
    .text('')

  info.append('text')
    .attr('class', 'info infoLeeftijdExpense')
    .attr('dx', (barWidth + spaceBetween) * 1.5)
    .attr('text-anchor', 'middle')
    .text('')

  info.append('text')
    .attr('class', 'info infoBedrag')
    .attr('dx', (barWidth + spaceBetween) * 2.5)
    .attr('text-anchor', 'middle')
    .text('')

  info.append('text')
    .attr('class', 'info infoPremie')
    .attr('dx', (barWidth + spaceBetween) * 3.5)
    .attr('text-anchor', 'middle')
    .text('')

  contributie.selectAll('.bar')
    .data(verschillen)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d, i) { return (barWidth * i) + measures.contributie.margin.left + ((i + 0.5) * spaceBetween)})
      .attr('y', function(d) {
        if (d.waarde >= 0) { pos = y(d.waarde)}
        else { pos = y(0)}
        return (pos + measures.contributie.margin.top)
      })
      .attr('height', function(d) {
        if (d.waarde >= 0) { return (y(0) - y(d.waarde))}
        else { return (y(d.waarde) - y(0))}
      })
      .attr('width', barWidth)
      .attr('fill', function(d) { return d.kleur})

  for (var i = 2; i <= 3; i++) {
    contributie.append('line')
      .attr('class', 'dashedLine')
      .attr('x1', measures.contributie.margin.left + (spaceBetween * i) + (barWidth * i))
      .attr('x2', measures.contributie.margin.left + (spaceBetween * i) + (barWidth * i))
      .attr('y1', (measures.contributie.margin.top))
      .attr('y2', (measures.contributie.margin.top + measures.contributie.graph.height))
  }
  axisContributie()
  var focus = contributie.append('g')
    .attr('class', 'focus focusContributie')

  focus.append('rect')
    .attr('class', 'focus focusLeeftijden')
    .attr('x', measures.contributie.margin.left)
    .attr('y', measures.contributie.margin.top)
    .attr('height', measures.contributie.graph.height)
    .attr('width', (barWidth + spaceBetween) * 2)
    .on('click', function() { console.log(d3.select('.info > .infoLeeftijdRevenue').text())
      if (d3.select('.info>.infoLeeftijdRevenue').text() == '') {
        contributie.select('.info>.infoLeeftijdRevenue')
          .text('€' + String(leeftijdInkomstenNumber).slice(0, leeftijdInkomstenSlice) + leeftijdInkomstenLabel)
        contributie.select('.info>.infoLeeftijdExpense')
          .text('€' + String(leeftijdUitgavenNumber).slice(0, leeftijdUitgavenSlice) + leeftijdUitgavenLabel)
      }
      else {
        contributie.select('.info>.infoLeeftijdRevenue')
          .text('')
        contributie.select('.info>.infoLeeftijdExpense')
          .text('')
      }
    })

  focus.append('rect')
    .attr('class', 'focus focusBedrag')
    .attr('x', measures.contributie.margin.left + (barWidth + spaceBetween) * 2)
    .attr('y', measures.contributie.margin.top)
    .attr('height', measures.contributie.graph.height)
    .attr('width', barWidth + spaceBetween)
    .on('click', function() {
      if (d3.select('.info>.infoBedrag').text() == '') {
        contributie.select('.info>.infoBedrag')
          .text('€' + String(bedragUitgavenNumber).slice(0, bedragUitgavenSlice) + bedragUitgavenLabel)
      }
      else {
        contributie.select('.info>.infoBedrag')
          .text('')
      }
    })

  focus.append('rect')
    .attr('class', 'focus focusPremie')
    .attr('x', measures.contributie.margin.left + (barWidth + spaceBetween) * 3)
    .attr('y', measures.contributie.margin.top)
    .attr('height', measures.contributie.graph.height)
    .attr('width', barWidth + spaceBetween)
    .on('click', function() {
      if (d3.select('.info>.infoPremie').text() == '') {
        contributie.select('.info>.infoPremie')
          .text('€' + String(premieInkomstenNumber).slice(0, premieInkomstenSlice) + premieInkomstenLabel)
      }
      else {
        contributie.select('.info>.infoPremie')
          .text('')
      }
    })
}

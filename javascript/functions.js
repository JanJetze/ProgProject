function drawBalans() {
  d3.selectAll('#balans > *:not(.title):not(.subTitle):not(.legend)').remove()
  expenses = []
  revenues = []
  max = 0
  innerHeight = topHeight - margin.balans.top - margin.balans.bottom
  innerWidth = leftWidth - margin.balans.left - margin.balans.right
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
    .range([0, innerWidth])
    .nice()

  var y = d3.scale.linear()
    .domain([0, max])
    .range([innerHeight, 0])
    .nice()

  var	valueline = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(jaartallen[i]); })
    .y(function(d, i) { return y(d); })

  balans.append('path')
    .attr('class', 'line expenses')
    .attr('transform', 'translate(' + margin.balans.left + ', ' + margin.balans.top + ')')
    .attr('d', valueline(expenses))

  balans.append('path')
    .attr('class', 'line revenues')
    .attr('transform', 'translate(' + margin.balans.left + ', ' + margin.balans.top + ')')
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
    .attr('transform', 'translate(' + (margin.balans.left + innerWidth) + ', 20)')

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
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('pointer-events', 'all')
    .on('mouseover', function() { focus.style('display', null); })
    .attr('transform', 'translate(' + margin.balans.left + ',' + margin.balans.top + ')')
    .on('mouseout', function() { focus.style('display', 'none'); })
    .on('mousemove', function() {mousemoveBalans('balans', x, y, this)})
    .attr('transform', 'translate(' + margin.balans.left + ',' + margin.balans.top + ')')
    .on('click', function() {mouseClickBalans(x, this)});

  axisBalans(x, y)
}

function drawPiramide() {
  d3.selectAll('#piramide > *:not(.title):not(.legend)').remove()

  piramideSubTitle()

  innerHeight = topHeight - margin.piramide.bottom - margin.piramide.top
  innerWidth = (rightWidth - margin.piramide.right - margin.piramide.left - margin.piramide.between) / 2
  barHeight = innerHeight / leeftijden.length
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

  info = piramide.append('g')
    .attr('class', 'info')
    .attr('transform', 'translate(' + (rightWidth - margin.piramide.right - 100) + ', 20)')

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
    .range([0, innerWidth])

  xMan = d3.scale.linear()
    .domain([0, max])
    .range([0, innerWidth])

  y = d3.scale.linear()
    .domain([0, leeftijden[leeftijden.length - 1]])
    .range([innerHeight, 0])

  barsVrouw = piramide.append('g')
    .attr('class', 'bars barsVrouw')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margin.piramide.left + ', ' + margin.piramide.top + ')')

  barsVrouw.selectAll('.bar')
    .data(leeftijdenVrouwen)
    .enter().append('rect')
      .attr('class', 'bar vrouw')
      .attr('x', function(d) { return xVrouw(d)})
      .attr('y', function(d, i) { return (innerHeight - (i + 1) * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return (innerWidth - xVrouw(d))})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})
      .on('click', function(d, i) {mouseClickPiramide(this, i)})

  barsMan = piramide.append('g')
    .attr('class', 'bars barsMan')
    .attr('width' , innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + (margin.piramide.left + innerWidth + (margin.piramide.between) * 2) + ', ' + margin.piramide.top + ')')

  barsMan.selectAll('.bar')
    .data(leeftijdenMannen)
    .enter().append('rect')
      .attr('class', 'bar man')
      .attr('x', 0)
      .attr('y', function(d, i) { return (innerHeight - (i + 1) * barHeight)})
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

  innerHeight = bottomHeight - margin.contributie.top - margin.contributie.bottom
  innerWidth = leftWidth - margin.contributie.left - margin.contributie.right
  spaceBetween = 50
  barWidth = innerWidth / 4 - spaceBetween

  if (Math.abs(max) > Math.abs(min)) {
    formatter = labelFormatter(parseInt(max))
  }
  else {
    formatter = labelFormatter(parseInt(Math.abs(min)))
  }
  yLabel = yLabelNamen[formatter]

  x = d3.scale.ordinal()
    .domain(4)
    .rangeBands([0, innerWidth])

  y = d3.scale.linear()
    .domain([min, max])
    .range([innerHeight, 0])
    .nice()

  info = contributie.append('g')
    .attr('class', 'info infoContributie')
    .attr('transform', 'translate(' + margin.contributie.left + ', ' + margin.contributie.top + ')')

  info.append('text')
    .attr('class', 'info infoLeeftijdRevenue')
    .attr('dx', (barWidth + spaceBetween) * 0.5)
    .attr('text-anchor', 'middle')
    .text('€' + String(leeftijdInkomstenNumber).slice(0, leeftijdInkomstenSlice) + leeftijdInkomstenLabel)
    .style('visibility', 'hidden')

  info.append('text')
    .attr('class', 'info infoLeeftijdExpense')
    .attr('dx', (barWidth + spaceBetween) * 1.5)
    .attr('text-anchor', 'middle')
    .text('€' + String(leeftijdUitgavenNumber).slice(0, leeftijdUitgavenSlice) + leeftijdUitgavenLabel)
    .style('visibility', 'hidden')

  info.append('text')
    .attr('class', 'info infoBedrag')
    .attr('dx', (barWidth + spaceBetween) * 2.5)
    .attr('text-anchor', 'middle')
    .text('€' + String(bedragUitgavenNumber).slice(0, bedragUitgavenSlice) + bedragUitgavenLabel)
    .style('visibility', 'hidden')

  info.append('text')
    .attr('class', 'info infoPremie')
    .attr('dx', (barWidth + spaceBetween) * 3.5)
    .attr('text-anchor', 'middle')
    .text('€' + String(premieInkomstenNumber).slice(0, premieInkomstenSlice) + premieInkomstenLabel)
    .style('visibility', 'hidden')

  contributie.selectAll('.bar')
    .data(verschillen)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d, i) { return (barWidth * i) + margin.contributie.left + ((i + 0.5) * spaceBetween)})
      .attr('y', function(d) {
        if (d.waarde >= 0) { pos = y(d.waarde)}
        else { pos = y(0)}
        return (pos + margin.contributie.top)
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
      .attr('x1', margin.contributie.left + (spaceBetween * i) + (barWidth * i))
      .attr('x2', margin.contributie.left + (spaceBetween * i) + (barWidth * i))
      .attr('y1', (margin.contributie.top))
      .attr('y2', (margin.contributie.top + innerHeight))
  }
  axisContributie()
  var focus = contributie.append('g')
    .attr('class', 'focus focusContributie')

  focus.append('rect')
    .attr('class', 'focus focusLeeftijden')
    .attr('x', margin.contributie.left)
    .attr('y', margin.contributie.top)
    .attr('height', innerHeight)
    .attr('width', (barWidth + spaceBetween) * 2)
    .on('click', function() {
      if (document.querySelectorAll('.info>.infoLeeftijdRevenue')[0].style.visibility == 'hidden') {
        contributie.select('.info>.infoLeeftijdRevenue')
          .style('visibility', 'visible')
        contributie.select('.info>.infoLeeftijdExpense')
          .style('visibility', 'visible')
      }
      else {
        contributie.select('.info>.infoLeeftijdRevenue')
          .style('visibility', 'hidden')
        contributie.select('.info>.infoLeeftijdExpense')
          .style('visibility', 'hidden')
      }
    })

  focus.append('rect')
    .attr('class', 'focus focusBedrag')
    .attr('x', margin.contributie.left + (barWidth + spaceBetween) * 2)
    .attr('y', margin.contributie.top)
    .attr('height', innerHeight)
    .attr('width', barWidth + spaceBetween)
    .on('click', function() {
      if (document.querySelectorAll('.info>.infoBedrag')[0].style.visibility == 'hidden') {
        contributie.select('.info>.infoBedrag')
          .style('visibility', 'visible')
        contributie.select('.info>.infoBedrag')
          .style('visibility', 'visible')
      }
      else {
        contributie.select('.info>.infoBedrag')
          .style('visibility', 'hidden')
        contributie.select('.info>.infoBedrag')
          .style('visibility', 'hidden')
      }
    })

  focus.append('rect')
    .attr('class', 'focus focusPremie')
    .attr('x', margin.contributie.left + (barWidth + spaceBetween) * 3)
    .attr('y', margin.contributie.top)
    .attr('height', innerHeight)
    .attr('width', barWidth + spaceBetween)
    .on('click', function() {
      if (document.querySelectorAll('.info>.infoPremie')[0].style.visibility == 'hidden') {
        contributie.select('.info>.infoPremie')
          .style('visibility', 'visible')
        contributie.select('.info>.infoPremie')
          .style('visibility', 'visible')
      }
      else {
        contributie.select('.info>.infoPremie')
          .style('visibility', 'hidden')
        contributie.select('.info>.infoPremie')
          .style('visibility', 'hidden')
      }
    })
}

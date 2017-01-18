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

  mousePerLine.append('text')
      .attr('class', 'info')
      .attr('x', 9)
      .attr('dy', '.35em');

  // show select year
  balans.append('text')
    .attr('class', 'year')

  balans.append('rect')
    .attr('class', 'overlay')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('pointer-events', 'all')
    .on('mouseover', function() { focus.style('display', null); })
    .attr('transform', 'translate(' + margin.balans.left + ',' + margin.balans.top + ')')
    .on('mouseout', function() { focus.style('display', 'none'); })
    .on('mousemove', function() {mousemove('balans', x, y, this)})
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

  formatter = labelFormatter(max)
  yLabel = yLabelNamen[formatter - 1]

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
      .attr('y', function(d, i) { return (innerHeight - i * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return (innerWidth - xVrouw(d))})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})

  barsMan = piramide.append('g')
    .attr('class', 'bars barsMan')
    .attr('width' , innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margin.piramide.between + ', ' + margin.piramide.top + ')')

  barsMan.selectAll('.bar')
    .data(leeftijdenMannen)
    .enter().append('rect')
      .attr('class', 'bar man')
      .attr('x', (margin.piramide.left + innerWidth + margin.piramide.left))
      .attr('y', function(d, i) { return (innerHeight - i * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return xMan(d)})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})

  axisPiramide()
}

function drawContributie(jaar) {
  d3.selectAll('#contributie > *:not(.title):not(.legend)').remove()

  contributieSubTitle()

  inkomsten = calcRevenue(leeftijd, premie, jaar)
  uitgaven = calcExpense(leeftijd, bedrag, jaar)
  leeftijdInkomsten = {kleur: 'green', waarde: inkomsten - calcRevenue(statusQuoLeeftijd, premie, jaar)}
  leeftijdUitgaven = {kleur: 'red', waarde: uitgaven - calcExpense(statusQuoLeeftijd, bedrag, jaar)}
  bedragUitgaven = {kleur: 'red', waarde: uitgaven - calcExpense(leeftijd, statusQuoAOW, jaar)}
  premieInkomsten = {kleur: 'green', waarde: inkomsten - calcRevenue(leeftijd, statusQuoPremie, jaar)}
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
  console.log(max, formatter, yLabel)
  x = d3.scale.ordinal()
    .domain(4)
    .rangeBands([0, innerWidth])

  y = d3.scale.linear()
    .domain([min, max])
    .range([innerHeight, 0])
    .nice()

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
}

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

function drawBalans() {
  d3.selectAll('#balans > *:not(.title):not(.subTitle):not(.legend)').remove()
  var expenses = [],
      revenues = [],
      max = 0,
      innerHeight = topHeight - margin.balans.top - margin.balans.bottom,
      innerWidth = leftWidth - margin.balans.left - margin.balans.right

  jaartallen.forEach(function(jaar) {
    exp = calcExpense(leeftijd, bedrag, jaar)
    rev = calcRevenue(leeftijd, premie, jaar)
    if (exp > max) {max = exp}
    if (rev > max) {max = rev}
    expenses.push(exp)
    revenues.push(rev)
  })

  formatter = labelFormatter(max)
  yLabel = yLabelNamen[formatter - 1]


  var x = d3.scale.linear()
    .domain([jaartallen[0], jaartallen[jaartallen.length - 1]])
    .range([0, innerWidth])
    .nice()

  var y = d3.scale.linear()
    .domain([0, max])
    .range([innerHeight, 0])
    .nice()

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5)
    .tickFormat(d3.format('d'))

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5)
    .tickFormat(function(d) {
      deler = '1' + '0'.repeat((formatter * 3));
      return (d / deler)
    })

  balans.append('g')
    .attr('class', 'axis xaxis')
    .attr('transform', 'translate(' + margin.balans.left + ', ' + (topHeight - margin.balans.bottom) + ')')
    .call(xAxis)

  balans.append('g')
    .attr('class', 'axis yaxis')
    .attr('transform', 'translate(' + margin.balans.left + ', ' + margin.balans.top + ')')
    .call(yAxis)

  balans.append("text")
    .attr("class", "xLabel label")
    .attr("text-anchor", "end")
    .attr("x", (innerWidth + margin.balans.left) / 2)
    .attr("y", innerHeight + margin.balans.top + margin.balans.bottom - 10)
    .text("jaartallen");

  balans.append('text')
    .attr('class', 'yLabel label')
    .attr('text-anchor', 'end')
    .attr('y', (margin.balans.left / 2))
    .attr('x', -((innerHeight + margin.balans.top) / 2))
    .attr('transform', 'rotate(-90)')
    .text('€ x ' + yLabel)

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
}

function drawPiramide() {
  d3.selectAll('#piramide > *:not(.title):not(.subTitle):not(.legend)').remove()
  var innerHeight = topHeight - margin.piramide.bottom - margin.piramide.top,
      innerWidth = (rightWidth - margin.piramide.right - margin.piramide.left - margin.piramide.between) / 2,
      barHeight = innerHeight / leeftijden.length,
      leeftijdenMannen = [],
      leeftijdenVrouwen = [],
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

  console.log(formatter, yLabel)

  var xVrouw = d3.scale.linear()
    .domain([max, 0])
    .range([0, innerWidth])

  var xMan = d3.scale.linear()
    .domain([0, max])
    .range([0, innerWidth])

  var y = d3.scale.linear()
    .domain([0, leeftijden[leeftijden.length - 1]])
    .range([innerHeight, 0])

  xAxisVrouw = d3.svg.axis()
    .scale(xVrouw)
    .orient('bottom')
    .ticks(3)
    .tickFormat(function(d) {
      deler = '1' + '0'.repeat((formatter * 3));
      return (d / deler)
    })

  xAxisMan = d3.svg.axis()
    .scale(xMan)
    .orient('bottom')
    .ticks(3)
    .tickFormat(function(d) {
      deler = '1' + '0'.repeat((formatter * 3));
      return (d / deler)
    })

  yAxis = d3.svg.axis()
    .scale(y)
    .orient('right')
    .ticks(10)

  var barsVrouw = piramide.append('g')
    .attr('class', 'bars vrouw')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margin.piramide.left + ', ' + margin.piramide.top + ')')

  barsVrouw.selectAll('.bar')
    .data(leeftijdenVrouwen)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return xVrouw(d)})
      .attr('y', function(d, i) { return (innerHeight - i * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return (innerWidth - xVrouw(d))})

  var barsMan = piramide.append('g')
    .attr('class', 'bars man')
    .attr('width' , innerWidth)
    .attr('height', innerHeight)
    .attr('transform', 'translate(' + margin.piramide.between + ', ' + margin.piramide.top + ')')

  barsMan.selectAll('.bar')
    .data(leeftijdenMannen)
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (margin.piramide.left + innerWidth + margin.piramide.left))
      .attr('y', function(d, i) { return (innerHeight - i * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return xMan(d)})

  piramide.append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .attr('transform', 'translate(' + (margin.piramide.left + innerWidth) + ', ' + margin.piramide.top + ')')
    .call(yAxis)

  piramide.append('g')
    .attr('class', 'axis xAxis')
    .attr('id', 'xAxisVrouw')
    .attr('transform', 'translate(' + margin.piramide.left + ', ' + (margin.piramide.top + innerHeight) + ')')
    .call(xAxisVrouw)

  piramide.append('g')
    .attr('class', 'axis xAxis')
    .attr('id' , 'xAxisMan')
    .attr('transform', 'translate(' + (margin.piramide.left + innerWidth + (2 * margin.piramide.between)) + ', ' + (margin.piramide.top + innerHeight) + ')')
    .call(xAxisMan)
}

function drawContributie(jaar) {
  d3.selectAll('#contributie > *:not(.title):not(.subTitle):not(.legend)').remove()
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

  formatter = labelFormatter(max)
  yLabel = yLabelNamen[formatter - 1]

  var x = d3.scale.ordinal()
    .domain(4)
    .rangeBands([0, innerWidth])

  var y = d3.scale.linear()
    .domain([min, max])
    .range([innerHeight, 0])
    .nice()

  xAxis = d3.svg.axis()
    .scale(x)

  yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5)
    .tickFormat(function(d) {
      deler = '1' + '0'.repeat((formatter * 3));
      return (d / deler)
    })


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

  contributie.append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .attr('transform', 'translate(' + margin.contributie.left + ', ' + margin.contributie.top + ')')
    .call(yAxis)

  contributie.append('text')
    .attr('class', 'yLabel label')
    .attr('text-anchor', 'end')
    .attr('y', (margin.balans.left / 2))
    .attr('x', -(innerHeight / 2))
    .attr('transform', 'rotate(-90)')
    .text('€ x ' + yLabel)

  contributie.append('g')
    .attr('class', 'axis')
    .attr('id', 'xAxis')
    .attr('transform', 'translate(' + margin.contributie.left + ', ' + (y(0) + margin.contributie.top) + ')')
    .call(xAxis)

  contributie.append('text')
    .attr('class', 'xLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', bottomHeight - (margin.contributie.bottom / 4))
    .attr('x', barWidth + spaceBetween + margin.contributie.left)
    .text('leeftijd')

  contributie.append('text')
    .attr('clas', 'xLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', bottomHeight - (margin.contributie.bottom / 4))
    .attr('x', (barWidth + spaceBetween) * 2.5 + margin.contributie.left)
    .text('bedrag')

  contributie.append('text')
    .attr('clas', 'xLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', bottomHeight - (margin.contributie.bottom / 4))
    .attr('x', (barWidth + spaceBetween) * 3.5 + margin.contributie.left)
    .text('premie')

  for (var i = 2; i <= 3; i++) {
    contributie.append('line')
      .attr('class', 'dashedLine')
      .attr('x1', (spaceBetween * (i + 1)) + (barWidth * i))
      .attr('x2', (spaceBetween * (i + 1)) + (barWidth * i))
      .attr('y1', (margin.contributie.top))
      .attr('y2', (margin.contributie.top + innerHeight))
  }
}

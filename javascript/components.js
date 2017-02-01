function balansTitle() {
  balans.append('foreignObject')
    .attr('class', 'title')
    .attr('id', 'balansTitle')
    .attr('width', 100)
    .attr('height', 100)
    .attr('x', measures.balans.margin.left)
    .append('xhtml:body')
    .html('<h3>Balans</h3>')
}

function balansSubTitle() {
  balans.append('text')
    .attr('class', 'subTitle')
    .attr('id', 'balansSubTitle')
    .attr('x', (measures.balans.width / 4) + measures.balans.margin.left)
    .attr('y', (measures.balans.margin.top / 2))
    .text('Balans SubTitel')
}

function piramideTitle() {
  piramide.append('foreignObject')
    .attr('class', 'title')
    .attr('id', 'piramideTitle')
    .attr('width', 200)
    .attr('height', 100)
    .attr('x', measures.piramide.margin.left)
    .append('xhtml:body')
    .html('<h3>Bevolkings piramide</h3>')
}

function piramideSubTitle() {
  piramide.append('text')
    .attr('class', 'subTitle')
    .attr('id', 'piramideSubTitle')
    .attr('x', (measures.piramide.width / 4) + measures.piramide.margin.left)
    .attr('y', measures.piramide.margin.top / 2)
    .text('Jaar: ' + currentJaar)
}

function contributieTitle() {
  contributie.append('foreignObject')
    .attr('class', 'title')
    .attr('id', 'contributieTitle')
    .attr('width', 150)
    .attr('height', 100)
    .attr('x', measures.contributie.margin.left)
    .append('xhtml:body')
    .html('<h3>Contributie</h3>')
}

function contributieSubTitle() {
  contributie.append('text')
    .attr('class', 'subTitle')
    .attr('id', 'contributieSubTitle')
    .attr('x', (measures.contributie.width / 4) + measures.contributie.margin.left)
    .attr('y', measures.contributie.margin.top / 2)
    .text('Jaar: ' + currentJaar)
}

function legendBalans() {
  var legendBalans = balans.append('g')
    .attr('class', 'legend')

  legendBalans.append('rect')
    .attr('class', 'legendBox expenses col-md-1')
    .attr('width', legendBox.width)
    .attr('height', legendBox.height)
    .attr('x', measures.balans.width - 100)
    .attr('y', measures.balans.height - measures.balans.margin.bottom - 35)

  legendBalans.append('text')
    .attr('class', 'legendText')
    .attr('text-anchor', 'end')
    .attr('x', measures.balans.width - 110)
    .attr('y', measures.balans.height - measures.balans.margin.bottom - 25)
    .text('uitgaven')

  legendBalans.append('rect')
    .attr('class', 'legendBox revenues')
    .attr('width', legendBox.width)
    .attr('height', legendBox.height)
    .attr('x', measures.balans.width - 100)
    .attr('y', measures.balans.height - measures.balans.margin.bottom - 10)

  legendBalans.append('text')
    .attr('class', 'legendText')
    .attr('text-anchor', 'end')
    .attr('x', measures.balans.width - 110)
    .attr('y', measures.balans.height - measures.balans.margin.bottom)
    .text('inkomsten')
}

function legendContributie() {
  var legendContributie = contributie.append('g')
    .attr('class', 'legend')

  legendContributie.append('rect')
    .attr('class', 'legendBox expenses')
    .attr('width', legendBox.width)
    .attr('height', legendBox.height)
    .attr('x', measures.contributie.width - 100)
    .attr('y', measures.contributie.height - measures.contributie.margin.bottom - 35)

  legendContributie.append('text')
    .attr('class', 'legendText')
    .attr('text-anchor', 'end')
    .attr('x', measures.contributie.width - 110)
    .attr('y', measures.contributie.height - measures.contributie.margin.bottom - 25)
    .text('uitgaven')

  legendContributie.append('rect')
    .attr('class', 'legendBox revenues')
    .attr('width', legendBox.width)
    .attr('height', legendBox.height)
    .attr('x', measures.contributie.width - 100)
    .attr('y', measures.contributie.height - measures.contributie.margin.bottom - 10)

  legendContributie.append('text')
    .attr('class', 'legendText')
    .attr('text-anchor', 'end')
    .attr('x', measures.contributie.width - 110)
    .attr('y', measures.contributie.height - measures.contributie.margin.bottom)
    .text('inkomsten')
}

function axisContributie() {
  xAxis = d3.svg.axis()
    .scale(x)

  yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(3)
    .tickFormat(function(d) {
      deler = '1' + '0'.repeat((formatter * 3));
      return (d / deler)
    })

  contributie.append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .attr('transform', 'translate(' + measures.contributie.margin.left + ', ' + measures.contributie.margin.top + ')')
    .call(yAxis)

  contributie.append('text')
    .attr('class', 'yLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', (measures.contributie.margin.left / 2))
    .attr('x', -(measures.contributie.margin.top + (measures.contributie.graph.height / 2)))
    .attr('transform', 'rotate(-90)')
    .text(yLabel)

  contributie.append('g')
    .attr('class', 'axis')
    .attr('id', 'xAxis')
    .attr('transform', 'translate(' + measures.contributie.margin.left + ', ' + (y(0) + measures.contributie.margin.top) + ')')
    .call(xAxis)

  contributie.append('text')
    .attr('class', 'xLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', measures.contributie.height - (measures.contributie.margin.bottom / 4))
    .attr('x', barWidth + measures.contributie.margin.between + measures.contributie.margin.left)
    .text('leeftijd')

  contributie.append('text')
    .attr('class', 'xLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', measures.contributie.height - (measures.contributie.margin.bottom / 4))
    .attr('x', (barWidth + measures.contributie.margin.between) * 2.5 + measures.contributie.margin.left)
    .text('bedrag')

  contributie.append('text')
    .attr('class', 'xLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', measures.contributie.height - (measures.contributie.margin.bottom / 4))
    .attr('x', (barWidth + measures.contributie.margin.between) * 3.5 + measures.contributie.margin.left)
    .text('premie')

  d3.selectAll('#yAxis > .tick')[0][0].remove()
}

function axisPiramide() {
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
    .ticks(9)
    .outerTickSize(0)

  piramide.append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .attr('transform', 'translate(' + (measures.piramide.margin.left + measures.piramide.graph.width) + ', ' + measures.piramide.margin.top + ')')
    .call(yAxis)

  piramide.append('g')
    .attr('class', 'axis xAxis')
    .attr('id', 'xAxisVrouw')
    .attr('transform', 'translate(' + measures.piramide.margin.left + ', ' + (measures.piramide.margin.top + measures.piramide.graph.height) + ')')
    .call(xAxisVrouw)

  piramide.append('g')
    .attr('class', 'axis xAxis')
    .attr('id' , 'xAxisMan')
    .attr('transform', 'translate(' + (measures.piramide.margin.left + measures.piramide.graph.width + (2 * measures.piramide.margin.between)) + ', ' + (measures.piramide.margin.top + measures.piramide.graph.height) + ')')
    .call(xAxisMan)

  piramide.append("text")
    .attr("class", "xLabel label")
    .attr("text-anchor", "start")
    .attr("x", (measures.piramide.margin.left))
    .attr("y", measures.piramide.graph.height + measures.piramide.margin.top + measures.piramide.margin.bottom - 10)
    .text('vrouwen ' + yLabel.slice(1));

  piramide.append("text")
    .attr("class", "xLabel label")
    .attr("text-anchor", "end")
    .attr("x", (measures.piramide.width - measures.piramide.margin.right))
    .attr("y", measures.piramide.graph.height + measures.piramide.margin.top + measures.piramide.margin.bottom - 10)
    .text('mannen ' + yLabel.slice(1));
}

function axisBalans(x, y) {
  xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5)
    .tickFormat(d3.format('d'))

  yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5)
    .tickFormat(function(d) {
      deler = '1' + '0'.repeat((formatter * 3));
      return (d / deler)
    })

  balans.append('g')
    .attr('class', 'axis xaxis')
    .attr('transform', 'translate(' + measures.balans.margin.left + ', ' + (measures.balans.height - measures.balans.margin.bottom) + ')')
    .call(xAxis)

  balans.append('g')
    .attr('class', 'axis yaxis')
    .attr('transform', 'translate(' + measures.balans.margin.left + ', ' + measures.balans.margin.top + ')')
    .call(yAxis)

  balans.append("text")
    .attr("class", "xLabel label")
    .attr("text-anchor", "end")
    .attr("x", (measures.balans.graph.width + measures.balans.margin.left) / 2)
    .attr("y", measures.balans.graph.height + measures.balans.margin.top + measures.balans.margin.bottom - 10)
    .text("jaartallen");

  balans.append('text')
    .attr('class', 'yLabel label')
    .attr('text-anchor', 'end')
    .attr('y', (measures.balans.margin.left / 2))
    .attr('x', -((measures.balans.graph.height + measures.balans.margin.top) / 2))
    .attr('transform', 'rotate(-90)')
    .text(yLabel)
}

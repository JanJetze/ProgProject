function balansTitle() {
  balans.append('text')
    .attr('class', 'title')
    .attr('id', 'balansTitle')
    .attr('x', (leftWidth / 4) + margin.balans.left)
    .attr('y', margin.balans.top / 4)
    .text('Balans Titel')
}

function balansSubTitle() {
  balans.append('text')
    .attr('class', 'subTitle')
    .attr('id', 'balansSubTitle')
    .attr('x', (leftWidth / 4) + margin.balans.left)
    .attr('y', (margin.balans.top / 2))
    .text('Balans SubTitel')
}

function piramideTitle() {
  piramide.append('text')
    .attr('class', 'title')
    .attr('id', 'piramideTitle')
    .attr('x', (rightWidth / 4) + margin.piramide.left)
    .attr('y', margin.piramide.top / 4)
    .text('Piramide Titel')
}

function piramideSubTitle() {
  piramide.append('text')
    .attr('class', 'subTitle')
    .attr('id', 'piramideSubTitle')
    .attr('x', (rightWidth / 4) + margin.piramide.left)
    .attr('y', margin.piramide.top / 2)
    .text('Jaar: ' + currentJaar)
}

function contributieTitle() {
  contributie.append('text')
    .attr('class', 'title')
    .attr('id', 'contributieTitle')
    .attr('x', (leftWidth / 4) + margin.contributie.left)
    .attr('y', margin.contributie.top / 4)
    .text('Contributie Titel')
}

function contributieSubTitle() {
  contributie.append('text')
    .attr('class', 'subTitle')
    .attr('id', 'contributieSubTitle')
    .attr('x', (leftWidth / 4) + margin.contributie.left)
    .attr('y', margin.contributie.top / 2)
    .text('Jaar: ' + currentJaar)
}

function legendBalans() {
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
}

function legendPiramide() {
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
}

function legendContributie() {
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
}

function axisContributie() {
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

  contributie.append('g')
    .attr('class', 'axis')
    .attr('id', 'yAxis')
    .attr('transform', 'translate(' + margin.contributie.left + ', ' + margin.contributie.top + ')')
    .call(yAxis)

  contributie.append('text')
    .attr('class', 'yLabel label')
    .attr('text-anchor', 'middle')
    .attr('y', (margin.contributie.left / 2))
    .attr('x', -(margin.contributie.top + (innerHeight / 2)))
    .attr('transform', 'rotate(-90)')
    .text(yLabel)

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
    .ticks(10)

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

  piramide.append("text")
    .attr("class", "xLabel label")
    .attr("text-anchor", "end")
    .attr("x", (rightWidth - margin.piramide.right))
    .attr("y", innerHeight + margin.piramide.top + margin.piramide.bottom - 10)
    .text(yLabel.slice(1));
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
    .text(yLabel)

}

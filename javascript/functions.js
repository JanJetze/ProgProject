function drawBalans() {
  /* function to draw balans including information boxes and interaction */

  // clear graph except for title and legend
  d3.selectAll('#balans > *:not(.title):not(.legend)').remove()

  expenses = []
  revenues = []
  max = 0
  data = [expenses, revenues]
  names = ['expenses', 'revenues']

  // retrieve each year from data and push to it's array
  // also calculate the max value of expenses and revenues
  jaartallen.forEach(function(jaar) {
    exp = calcExpense(variables.leeftijd.current,
                      variables.bedrag.current, jaar)
    rev = calcRevenue(variables.leeftijd.current,
                      variables.premie.current, jaar)

    if (exp > max) {max = exp}

    if (rev > max) {max = rev}

    expenses.push(exp)
    revenues.push(rev)
  })

  // variables for y- and info- labels
  formatter = labelFormatter(parseInt(max))
  yLabel = yLabelNamen[formatter]

  // instantiate x- and yscale
  var x = d3.scale.linear()
    .domain([jaartallen[0], jaartallen[jaartallen.length - 1]])
    .range([0, measures.balans.graph.width])

  var y = d3.scale.linear()
    .domain([0, max])
    .range([measures.balans.graph.height, 0])
    .nice()

  // instantiate function to draw lines
  var	valueline = d3.svg.line()
    .defined(function(d) { return d; })
    .x(function(d, i) { return x(jaartallen[i]); })
    .y(function(d, i) { return y(d); })

  // instantiate infobutton
  glyphi = balans.append('g')
    .attr('class', 'glyphi')
    .attr('transform', 'translate(10, 10)')
    .on('click', function(){
      document.getElementsByClassName('modal-title')[0]
        .innerHTML = 'balans';
      document.getElementsByClassName('modal-body')[0]
        .innerHTML = infoGlyphiBalans
      $('#myModal').modal('toggle')})

  // place icon on infobutton
  glyphi.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", 10)
    .attr("x", 10)
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-info-sign");

  // append div element to svg as infobox
  balans.append('foreignObject')
    .attr('x', measures.balans.margin.left + measures.balans.graph.width + 20)
    .attr('width', 200)
    .attr('height', 200)
    .append('xhtml:div')
    .attr('class', 'infoBox')

  // draw lines for expenses and revenues respectively
  balans.append('path')
    .attr('class', 'line expenses')
    .attr('transform', 'translate(' + measures.balans.margin.left + ', '
                                    + measures.balans.margin.top + ')')
    .attr('d', valueline(expenses))

  balans.append('path')
    .attr('class', 'line revenues')
    .attr('transform', 'translate(' + measures.balans.margin.left + ', '
                                    + measures.balans.margin.top + ')')
    .attr('d', valueline(revenues))

  // add focus element to svg
  focus = balans.append('g')
    .attr('class', 'focus')
    .style('display', 'none')

  // add mousetracker
  mousePerLine = focus.selectAll('.mouse-per-line')
    .data(data)
    .enter()
    .append('g')
    .attr('class', function(d, i) { return ('mouse-per-line ' + names[i])})

  // append circle and crosshair to mousetracker
  mousePerLine.append('circle')
    .attr('r', 9)

  focus.append('line')
    .attr('class', 'crosshair')
    .style('stroke', 'grey');

  // show year on top of crosshair
  focus.append('text')
    .attr('class', 'year')
    .attr('text-anchor', 'middle')
    .attr('y', measures.balans.margin.top - 10)

  // put layer on top of graph to actualy track the mouse
  // sent mouseposition to focus and infobox
  balans.append('rect')
    .attr('class', 'overlay')
    .attr('width', measures.balans.graph.width)
    .attr('height', measures.balans.graph.height)
    .attr('pointer-events', 'all')
    .on('mouseover', function() {
      focus.style('display', null);
      balans.selectAll('.infoBox').style('display', null)})
    .attr('transform', 'translate(' + measures.balans.margin.left + ','
                                    + measures.balans.margin.top + ')')
    .on('mouseout', function() {
      focus.style('display', 'none');
      balans.selectAll('.infoBox')
        .style('display', 'none')
    })
    .on('mousemove', function() {mousemoveBalans('balans', x, y, this)})
    .attr('transform', 'translate(' + measures.balans.margin.left + ','
                                    + measures.balans.margin.top + ')')
    .on('click', function() {mouseClickBalans(x, this)});

  axisBalans(x, y)
}

function drawPiramide(currentJaar) {
  /* function to draw piramide including information boxes and interaction */

  // clear graph except for title and legend
  d3.selectAll('#piramide > *:not(.title):not(.legend)').remove()

  barHeight = measures.piramide.graph.height / leeftijden.length
  leeftijdenMannen = []
  leeftijdenVrouwen = []
  max = 0

  // retrieve number of people in each age and put it in designated array
  // also retrieve max number of people in an age
  leeftijden.forEach(function(leeftijd) {
    man = parseInt(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['mannen'])
    vrouw = parseInt(leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['vrouwen'])
    leeftijdenMannen.push(man)
    leeftijdenVrouwen.push(vrouw)
    if (man > max) {max = man}
    if (vrouw > max) {max = vrouw}
  })

  // instantiate infobutton
  glyphi = piramide.append('g')
    .attr('class', 'glyphi')
    .attr('transform', 'translate(10, 10)')
    .on('click', function(){
      document.getElementsByClassName('modal-title')[0]
        .innerHTML = 'piramide';
      document.getElementsByClassName('modal-body')[0]
        .innerHTML = infoGlyphiPiramide
      $('#myModal').modal('toggle')})

  // place icon on infobutton
  glyphi.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", 10)
    .attr("x", 10)
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-info-sign");

  // append div element to svg as infobox
  piramide.append('foreignObject')
    .attr('x', measures.piramide.margin.left
              + measures.piramide.graph.width
              + measures.piramide.margin.between * 2)
    .attr('width', 200)
    .attr('height', 200)
    .append('xhtml:div')
    .attr('class', 'infoBox')

  // variables for y- and info- labels
  formatter = labelFormatter(max)
  yLabel = yLabelNamen[formatter]

  // instantiate x- and yscale
  xVrouw = d3.scale.linear()
    .domain([max, 0])
    .range([0, measures.piramide.graph.width])

  xMan = d3.scale.linear()
    .domain([0, max])
    .range([0, measures.piramide.graph.width])

  y = d3.scale.linear()
    .domain([0, leeftijden[leeftijden.length - 1]])
    .range([measures.piramide.graph.height, 0])

  // add element to draw women bars in
  barsVrouw = piramide.append('g')
    .attr('class', 'bars barsVrouw')
    .attr('width', measures.piramide.graph.width)
    .attr('height', measures.piramide.graph.height)
    .attr('transform', 'translate(' + measures.piramide.margin.left + ', '
                                    + measures.piramide.margin.top + ')')

  // draw women bars in designated area
  // draw bars from xvalue to zeropoint
  barsVrouw.selectAll('.bar')
    .data(leeftijdenVrouwen)
    .enter().append('rect')
      .attr('class', 'bar vrouw')
      .attr('x', function(d) { return xVrouw(d)})
      .attr('y', function(d, i) {
        return (measures.piramide.graph.height - (i + 1) * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) {
        return (measures.piramide.graph.width - xVrouw(d))})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})

  // add element to draw men bars in
  barsMan = piramide.append('g')
    .attr('class', 'bars barsMan')
    .attr('width' , measures.piramide.graph.width)
    .attr('height', measures.piramide.graph.height)
    .attr('transform', 'translate(' + (measures.piramide.margin.left
                                    + measures.piramide.graph.width
                                    + (measures.piramide.margin.between) * 2)
                                    + ', ' + measures.piramide.margin.top + ')')

  // draw men bars in designated area
  // draw bars from zeropoint to xvalue
  barsMan.selectAll('.bar')
    .data(leeftijdenMannen)
    .enter().append('rect')
      .attr('class', 'bar man')
      .attr('x', 0)
      .attr('y', function(d, i) {
        return (measures.piramide.graph.height - (i + 1) * barHeight)})
      .attr('height', barHeight)
      .attr('width', function(d) { return xMan(d)})
      .on('mouseover', function(d, i) {mouseoverPiramide(this, i)})
      .on('mouseout', function() {mouseoutPiramide(this)})

  axisPiramide()
}

function drawContributie(jaar) {
  /* function to draw contributie including information boxes and interaction */

  // clear graph except for title and legend
  d3.selectAll('#contributie > *:not(.title):not(.legend)').remove()

  inkomsten = calcRevenue(variables.leeftijd.current,
                          variables.premie.current, jaar)
  uitgaven = calcExpense(variables.leeftijd.current,
                         variables.bedrag.current, jaar)

  leeftijdInkomsten = {waarde: inkomsten -
                      calcRevenue(variables.leeftijd.basis,
                                  variables.premie.current, jaar),
                       className: 'revenues'}
  leeftijdUitgaven = {waarde: uitgaven -
                     calcExpense(variables.leeftijd.basis,
                                 variables.bedrag.current, jaar),
                      className: 'expenses'}
  bedragUitgaven = {waarde: uitgaven -
                   calcExpense(variables.leeftijd.current,
                               variables.bedrag.basis, jaar),
                    className: 'expenses'}
  premieInkomsten = {waarde: inkomsten -
                    calcRevenue(variables.leeftijd.current,
                                variables.premie.basis, jaar),
                     className: 'revenues'}

  // declare variables to be drawn bars for
  verschillen = [leeftijdInkomsten,
                 leeftijdUitgaven,
                 bedragUitgaven,
                 premieInkomsten]

  min = 0
  max = 0

  // calculate min and max values to scale yaxis
  verschillen.forEach(function(verschil) {
    if (verschil.waarde > max) {max = verschil.waarde}
    if (verschil.waarde < min) {min = verschil.waarde}
  })

  // calculate labelformatter for min or max with highest absolute value
  if (Math.abs(max) > Math.abs(min)) {
    formatter = labelFormatter(parseInt(max))
  }
  else {
    formatter = labelFormatter(parseInt(Math.abs(min)))
  }

  yLabel = yLabelNamen[formatter]

  // calculations to format value shown (.number) in infoboxes
  // slice is to make sure a value of 4 numbers and a dot is shown,
  // and minussign if negative
  if (leeftijdInkomsten.waarde >= 0) {leeftijdInkomsten.slice = 5}
  else {leeftijdInkomsten.slice = 6}
  leeftijdInkomsten.number = leeftijdInkomsten.waarde
                             / ('1' + '0'.repeat(formatter * 3))

  if (leeftijdUitgaven.waarde >= 0) {leeftijdUitgaven.slice = 5}
  else {leeftijdUitgaven.slice = 6}
  leeftijdUitgaven.number = leeftijdUitgaven.waarde
                            / ('1' + '0'.repeat(formatter * 3))

  if (bedragUitgaven.waarde >= 0) {bedragUitgaven.slice = 5}
  else {bedragUitgaven.slice = 6}
  bedragUitgaven.number = bedragUitgaven.waarde
                          / ('1' + '0'.repeat(formatter * 3))

  if (premieInkomsten.waarde >= 0) {premieInkomsten.slice = 5}
  else {premieInkomsten.slice = 6}
  premieInkomsten.number = premieInkomsten.waarde
                           / ('1' + '0'.repeat(formatter * 3))

  barWidth = measures.contributie.graph.width / 4
             - measures.contributie.margin.between

  // instantiate x- and yscale
  x = d3.scale.ordinal()
    .domain(4)
    .rangeBands([0, measures.contributie.graph.width])

  y = d3.scale.linear()
    .domain([min, max])
    .range([measures.contributie.graph.height, 0])
    .nice()

  // instantiate infobutton
  glyphi = contributie.append('g')
    .attr('class', 'glyphi')
    .attr('transform', 'translate(10, 10)')
    .on('click', function(){
      document.getElementsByClassName('modal-title')[0]
        .innerHTML = 'contributie';
      document.getElementsByClassName('modal-body')[0]
        .innerHTML = infoGlyphiContributie
      $('#myModal').modal('toggle')})

  // place icon on infobutton
  glyphi.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", 10)
    .attr("x", 10)
    .append("xhtml:span")
    .attr("class", "control glyphicon glyphicon-info-sign");

  // add element to svg to append value info on
  info = contributie.append('g')
    .attr('class', 'info infoContributie')
    .attr('transform', 'translate(' + measures.contributie.margin.left + ', '
                                    + (measures.contributie.margin.top - 10) + ')')

  // add value on top of bar on designated element
  info.append('text')
    .attr('class', 'info infoLeeftijdRevenue')
    .attr('dx', (barWidth + measures.contributie.margin.between) * 0.5)
    .attr('text-anchor', 'middle')
    .text('')

  info.append('text')
    .attr('class', 'info infoLeeftijdExpense')
    .attr('dx', (barWidth + measures.contributie.margin.between) * 1.5)
    .attr('text-anchor', 'middle')
    .text('')

  info.append('text')
    .attr('class', 'info infoBedragExpense')
    .attr('dx', (barWidth + measures.contributie.margin.between) * 2.5)
    .attr('text-anchor', 'middle')
    .text('')

  info.append('text')
    .attr('class', 'info infoPremieRevenue')
    .attr('dx', (barWidth + measures.contributie.margin.between) * 3.5)
    .attr('text-anchor', 'middle')
    .text('')

  // draw bar for each variable, give it it's designated classname to color it,
  // if value is positive, start drawing from ypoint to zeropoint
  // if values is negative, start drawing from zeropoint to ypoint
  contributie.selectAll('.bar')
    .data(verschillen)
    .enter().append('rect')
      .attr('class', function(d) {return 'bar ' + d.className})
      .attr('x', function(d, i) {
        return (barWidth * i) + measures.contributie.margin.left
               + ((i + 0.5) * measures.contributie.margin.between)})
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

  // place dashedline between variable 2 and 3 and variable 3 and 4
  for (var i = 2; i <= 3; i++) {
    contributie.append('line')
      .attr('class', 'dashedLine')
      .attr('x1', measures.contributie.margin.left
                  + (measures.contributie.margin.between * i) + (barWidth * i))
      .attr('x2', measures.contributie.margin.left
                  + (measures.contributie.margin.between * i) + (barWidth * i))
      .attr('y1', (measures.contributie.margin.top))
      .attr('y2', (measures.contributie.margin.top
                  + measures.contributie.graph.height))
  }

  axisContributie()

  // add focuslayer to track mouseclick on entire area instead of only on the bar
  var focus = contributie.append('g')
    .attr('class', 'focus focusContributie')

  // add clickable rectangle on each of trhee area's
  // on click show/hide info
  focus.append('rect')
    .attr('class', 'focus focusLeeftijden')
    .attr('x', measures.contributie.margin.left)
    .attr('y', measures.contributie.margin.top)
    .attr('height', measures.contributie.graph.height)
    .attr('width', (barWidth + measures.contributie.margin.between) * 2)
    .on('click', function() {
      if (d3.select('.infoLeeftijdRevenue').text() == '') {
        contributie.select('.infoLeeftijdRevenue')
          .text(String(leeftijdInkomsten.number).slice(0, leeftijdInkomsten.slice))
        contributie.select('.infoLeeftijdExpense')
          .text(String(leeftijdUitgaven.number).slice(0, leeftijdUitgaven.slice))
      }
      else {
        contributie.select('.infoLeeftijdRevenue')
          .text('')
        contributie.select('.infoLeeftijdExpense')
          .text('')
      }
    })

  // second clickable rectangle
  focus.append('rect')
    .attr('class', 'focus focusBedrag')
    .attr('x', measures.contributie.margin.left + (barWidth + measures.contributie.margin.between) * 2)
    .attr('y', measures.contributie.margin.top)
    .attr('height', measures.contributie.graph.height)
    .attr('width', barWidth + measures.contributie.margin.between)
    .on('click', function() {
      if (d3.select('.infoBedragExpense').text() == '') {
        contributie.select('.infoBedragExpense')
          .text(String(bedragUitgaven.number).slice(0, bedragUitgaven.slice))
      }
      else {
        contributie.select('.infoBedragExpense')
          .text('')
      }
    })

  // third clickable rectangle
  focus.append('rect')
    .attr('class', 'focus focusPremie')
    .attr('x', measures.contributie.margin.left + (barWidth + measures.contributie.margin.between) * 3)
    .attr('y', measures.contributie.margin.top)
    .attr('height', measures.contributie.graph.height)
    .attr('width', barWidth + measures.contributie.margin.between)
    .on('click', function() {console.log(premieInkomsten.number, premieInkomsten.slice);
      if (d3.select('.infoPremieRevenue').text() == '') {
        contributie.select('.infoPremieRevenue')
          .text(String(premieInkomsten.number).slice(0, premieInkomsten.slice))
      }
      else {
        contributie.select('.info>.infoPremieRevenue')
          .text('')
      }
    })
}

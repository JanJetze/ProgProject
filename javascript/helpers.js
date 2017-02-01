function calcRevenue(leeftijd, premie, jaar) {
  /* calculate revenue with given variables for one year
   * calculate for each age group number of workers
   * multiply with mean income for group
   * calculate premie, if bigger then max premie, replace premie with this max
   */

  werkenden = 0
  rev = 0

  for (i = 0; i < leeftijd; i++) {
    werkenden = parseInt(leeftijdsVerdeling[jaar]['leeftijden'][i]['mannen en vrouwen'])
                * (werkloosheid[i] / 100)

    Object.keys(inkomens[i]).forEach(function(each) {
      klasse = inkomens[i][each]['percentage'] * werkenden
      minimum = inkomens[i][each]['minimum']
      maximum = inkomens[i][each]['maximum']
      klasseInkomen = (minimum + maximum) / 2
      klassePremie = klasseInkomen * (premie / 100)

      if (klassePremie > maxPremieTeBetalen) {
        rev += maxPremieTeBetalen * klasse
      }

      else {
        rev += klassePremie * klasse
      }
    })
  }
  return rev
}

function calcExpense(leeftijd, bedrag, jaar) {
  /* calculate expense with given variables for one year
   * calculate number of receivers
   * multiply with bedrag and 12, cause bedrag is per month
   */
  AOWGerechtigden = 0
  for(i = leeftijd; i <= 99; i++) {
    AOWGerechtigden += parseInt(leeftijdsVerdeling[jaar]['leeftijden'][i]['mannen en vrouwen'])
  }
  exp = AOWGerechtigden * bedrag * 12
  return exp
}

function labelFormatter(number) {
  /* calculate how much 'thousands' there are in a integer
   */
  zeros = String(number).length - 1;
  thousands = zeros / 3;
  return parseInt(thousands)
}

function mouseClickBalans(x, mouse) {
  /* change year when clicked in balans
   */

  // calculate what x-value is closest to mouse position
  var x0 = x.invert(d3.mouse(mouse)[0]);
  var series = data.map(function(e) {
      i = d3.bisect(jaartallen, x0),
      index0 = jaartallen[i - 1],
      index1 = jaartallen[i],
      index = x0 - index0 > index1 - x0 ? i : (i - 1);})


  currentJaar = parseInt(jaartallen[index])
  drawPiramide(currentJaar)
  drawContributie(currentJaar)

  slider.value(currentJaar)
  slider.destroy()
  d3.select('#slider')
    .call(slider)

  d3.select('#jaartal')
    .html(currentJaar)
}

function mousemoveBalans(chart, x, y, mouse) {
  /* show values in topcorner when mouse moves over balans
   */

  // calculate what x-value is closest to mouse position
  var x0 = x.invert(d3.mouse(mouse)[0]);
  var series = data.map(function(e) {
      i = d3.bisect(jaartallen, x0),
      index0 = jaartallen[i - 1],
      index1 = jaartallen[i],
      index = x0 - index0 > index1 - x0 ? i : (i - 1);})

  // draw straight line on x-axis on position of mouse
  balans.select('.crosshair')
    .attr('x1', function() {
      return x(jaartallen[index]) + measures.balans.margin.left})
    .attr('y1', function() {
      return y(y.domain()[0]) + measures.balans.margin.top})
    .attr('x2', function() {
      return x(jaartallen[index]) + measures.balans.margin.left})
    .attr('y2', function() {
      return y(y.domain()[1]) + measures.balans.margin.top})

  // position dots on each line corresponding to mouse position
  d3.selectAll('.mouse-per-line')
    .attr('transform', function(d, i) {return 'translate('
      + (x(parseInt(jaartallen[index])) + measures.balans.margin.left)+ ', '
      + (y(d[index]) + measures.balans.margin.top) + ')'})

  // show year on top of chart corresponding to mouse position
  focus.select('.year')
    .text(jaartallen[index])
    .attr('x', x(jaartallen[index]) + measures.balans.margin.left)

  // calculate values corresponding to mouse position
  // and render to correct format and label
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

  if (verschil >= 0) {slice = 5}
  else {slice = 6}

  // set up table to show values
  balans.select('.infoBox')
    .html(
      '<table>' +
        '<tr>' +
          '<th>inkomsten</th>' +
          '<td>€' + String(revenueNumber).slice(0,5) + revenueLabel + '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>uitgaven</th>' +
          '<td>€' + String(expenseNumber).slice(0,5) + expenseLabel + '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>verschil</th>' +
          '<td>€' + String(verschilNumber).slice(0,slice) + verschilLabel + '</td>' +
        '</tr>' +
      '</table>'
    )
};

function mouseoverPiramide(bar, leeftijd) {
  /* show age in middle and values in top corner when mouse moves over piramide
   */

  // find hovered bars and add new class to change color
  y = d3.select(bar).attr('y');
  bars = document.querySelectorAll('.bar[y="' + y + '"]');
  bars.forEach(function(bar) {
    bar.classList.add('piramideHover')
  })

  // show selected age in middle of piramide
  piramide.append('text')
    .attr('class', 'infoLeeftijd')
    .attr('x', measures.piramide.graph.width + measures.piramide.margin.left
               + measures.piramide.margin.between + 20)
    .attr('y', parseInt(y) + measures.piramide.margin.top + 6)
    .attr('text-anchor', 'end')
    .text(leeftijd)

  // set up table to show values
  piramide.select('.infoBox')
    .style('display', null)
    .html(
      '<table>' +
        '<tr>' +
          '<th>mannen</th>' +
          '<td>' + d3.format(',')
                   (leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['mannen'])
                   .replace(/,/g, '.') + '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>vrouwen</th>' +
          '<td>' + d3.format(',')
                   (leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['vrouwen'])
                   .replace(/,/g, '.') + '</td>' +
        '</tr>' +
        '<tr>' +
          '<th>totaal</th>' +
          '<td>' + d3.format(',')
                   (leeftijdsVerdeling[currentJaar]['leeftijden'][leeftijd]['mannen en vrouwen'])
                   .replace(/,/g, '.') + '</td>' +
        '</tr>' +
      '</table>'
    )

}

function mouseoutPiramide(bar) {
  /* delete piramidehover class and hide infobox when mouse out
   */

  d3.selectAll('.infoLeeftijd').remove()

  // find hoevered bars and delete class
  y = d3.select(bar).attr('y')
  bars = document.querySelectorAll('.bar[y="' + y + '"]');
  bars.forEach(function(bar) {
    bar.classList.remove('piramideHover')
  })

  // hide infobox
  piramide.selectAll('.infoBox')
    .style('display', 'none')
}

function play() {
  /* iterate with graphs over years when clicked on play button
   */

  // store each drawinterval in array to stop play with stop()
  timer = []

  for (var i = currentJaar; i <= 2060; i++) {
    (function(i) {
      timer.push(setTimeout(function() {
        currentJaar = i;

        drawPiramide(currentJaar);
        drawContributie(currentJaar);

        slider.value(currentJaar);
        slider.destroy();

        d3.select('#slider')
          .call(slider);
        d3.select('#jaartal')
          .html(currentJaar)}, (i - currentJaar) * 1000))
    })(i);
  }
}

function stop() {
  /* stop play()
   */
  timer.forEach(function(time) {
    clearTimeout(time)
  })
}

var myFn = function(slider) {
  /* draw graphs when slider used
   */
  currentJaar = parseInt(slider.value());
  d3.select('#jaartal')
    .html(currentJaar)
  drawPiramide(currentJaar)
  drawContributie(currentJaar);
}

# design
## functies
3 hoofdfuncties
- drawGraph(leeftijd, AOW, premie)
- drawPyramid(jaar)
- drawChart(leeftijd, AOW, premie, jaar)

### drawGraph
drawGraph(leeftijd, AOW, premie)
  foreach jaar
    calcRevenue(leeftijd, AOW, premie, jaar)
    calcExpense(leeftijd, AOW, premie, jaar)
    draw line

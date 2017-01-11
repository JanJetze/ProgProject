# design
## data
werkloosheid = een dict met daarin iedere afzonderlijke leeftijd van 0 tot 100 als key en het percentage werkloosheid als value <br>
-> werkloosheid[enkeleLeeftijd] = werkloosheidPercentage <br>
leeftijdsVerdeling = een nested dict met daarin voor ieder jaartal weer een dict <br>
leeftijdsVerdeling[jaartal] = dict met daarin per leeftijd <br>
leeftijdsVerdeling[jaartal][totaal] = totale bevolking van dat jaartal <br>
leeftijdsVerdeling[jaartal][leeftijd] = aantal personen in die leeftijd <br>

## variabelen
### globaal
statusQuoLeeftijd = de huidige AOW leeftijd <br>
statusQuoAOW = het huidige AOW bedrag <br>
statusQuoPremie = de huidige premie <br>

### lokaal
modelVariabelen = [*leeftijd*, *AOW*, *premie*] <br>
modelVariabelenStatusQuo = [*statusQuoLeeftijd*, *statusQuoAOW*, *statusQuoPremie*] <br>
leeftijd = verandert bij invoer van gebruiker <br>
AOW = verandert bij invoer van gebruiker <br>
premie = verandert bij invoer van gebruiker <br>
currentJaar = verandert bij klik in scherm 1 <br>

## functies
### hoofdfuncties
- drawGraph() -> wordt aangeroepen bij wijziging van *leeftijd*, *AOW* of *premie*
- drawPyramid() = wordt aangeroepen bij wijziging van *currentJaar*
- drawChart() = wordt aangeroepen bij wijziging van *currentJaar*

### helperfuncties
- calcRevenue(leeftijd, AOW, premie, jaar)
- calcExpense(leeftijd, AOW, premie, jaar)

### drawGraph
drawGraph()
- foreach jaar
  - calcRevenue(leeftijd, AOW, premie, jaar)
  - calcExpense(leeftijd, AOW, premie, jaar)
  - draw line

### drawChart
drawChart(jaar)  
- calcRevenue(leeftijd, statusQuoAOW, statusQuoPremie, jaar)
- draw bar
- calcExpense(leeftijd, statusQuoAOW, statusQuoPremie, jaar)
- draw bar
- calcRevenue(statusQuoLeeftijd, AOW, statusQuoPremie, jaar)
- draw bar
- calcExpense(statusQuoLeeftijd, AOW, statusQuoPremie, jaar)
- draw bar
- calcRevenue(statusQuoLeeftijd, statusQuoAOW, premie, jaar)
- draw bar
- calcExpense(statusQuoLeeftijd, statusQuoAOW, premie, jaar)

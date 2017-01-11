# design
## data
> werkloosheid = een dict met daarin iedere afzonderlijke leeftijd van 0 tot 100 als key en het percentage werkloosheid als value
> -> werkloosheid[enkeleLeeftijd] = werkloosheidPercentage
> leeftijdsVerdeling = een nested dict met daarin voor ieder jaartal weer een dict
> leeftijdsVerdeling[jaartal] = dict met daarin per leeftijd
> leeftijdsVerdeling[jaartal][totaal] = totale bevolking van dat jaartal
> leeftijdsVerdeling[jaartal][leeftijd] = aantal personen in die leeftijd

## variabelen
### globaal
statusQuoLeeftijd = de huidige AOW leeftijd
statusQuoAOW = het huidige AOW bedrag
statusQuoPremie = de huidige premie

### lokaal
modelVariabelen = [*leeftijd*, *AOW*, *premie*]
modelVariabelenStatusQuo = [*statusQuoLeeftijd*, *statusQuoAOW*, *statusQuoPremie*]
leeftijd = verandert bij invoer van gebruiker
AOW = verandert bij invoer van gebruiker
premie = verandert bij invoer van gebruiker
currentJaar = verandert bij klik in scherm 1

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

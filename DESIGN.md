# design
## data
- werkloosheid = een dict met daarin iedere afzonderlijke leeftijd van 0 tot 100 als key en het percentage werkloosheid als value
  - werkloosheid[enkeleLeeftijd] = werkloosheidPercentage
- leeftijdsVerdeling = een nested dict met daarin voor ieder jaartal weer een dict
  - leeftijdsVerdeling[jaartal] = dict met daarin per leeftijd
    - leeftijdsVerdeling[jaartal][totaal] = totale bevolking van dat jaartal
    - leeftijdsVerdeling[jaartal][leeftijd] = aantal personen in die leeftijd

## variabelen
### globaal
- statusQuoLeeftijd = de huidige AOW leeftijd
- statusQuoAOW = het huidige AOW bedrag
- statusQuoPremie = de huidige premie

### lokaal
- modelVariabelen = [*leeftijd*, *AOW*, *premie*]
- modelVariabelenStatusQuo = [*statusQuoLeeftijd*, *statusQuoAOW*, *statusQuoPremie*]
- leeftijd = verandert bij invoer van gebruiker
- AOW = verandert bij invoer van gebruiker
- premie = verandert bij invoer van gebruiker
- currentJaar = verandert bij klik in scherm 1

## functies
### hoofdfuncties
- drawGraph() -> wordt aangeroepen bij wijziging van *leeftijd*, *AOW* of *premie*
- drawPyramid() = wordt aangeroepen bij wijziging van *currentJaar*
- drawChart() = wordt aangeroepen bij wijziging van *currentJaar*

### helperfuncties
- calcRevenue(leeftijd, AOW, premie, jaar)
- calcExpense(leeftijd, AOW, premie, jaar)

### drawGraph
drawGraph() <br>
&ensp;foreach jaar <br>
&ensp;&ensp;calcRevenue(leeftijd, AOW, premie, jaar) <br>
&ensp;&ensp;calcExpense(leeftijd, AOW, premie, jaar) <br>
&ensp;&ensp;draw line <br>

### drawChart
drawChart(jaar) <br>
&ensp;calcRevenue(leeftijd, statusQuoAOW, statusQuoPremie, jaar) <br>
&ensp;draw bar <br>
&ensp;calcExpense(leeftijd, statusQuoAOW, statusQuoPremie, jaar) <br>
&ensp;draw bar <br>
&ensp;calcRevenue(statusQuoLeeftijd, AOW, statusQuoPremie, jaar) <br>
&ensp;draw bar <br>
&ensp;calcExpense(statusQuoLeeftijd, AOW, statusQuoPremie, jaar) <br>
&ensp;draw bar <br>
&ensp;calcRevenue(statusQuoLeeftijd, statusQuoAOW, premie, jaar) <br>
&ensp;draw bar <br>
&ensp;calcExpense(statusQuoLeeftijd, statusQuoAOW, premie, jaar) <br>

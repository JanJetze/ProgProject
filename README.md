# ProgProject

Deze visualisatie maakt het mogelijk voor de gebruiker een ideale verdeling te vinden voor 3 verschillende parameters met betrekking tot het Nederlandse AOW-stelsel. De 3 parameters zijn de AOW-leeftijd, de premie en het bedrag dat wordt uitgekeerd bij het bereiken van de AOW-leeftijd.

Door een makkelijk en speelse visualisatie te maken van mogelijke combinaties van deze parameters, wordt het probleem rondom de AOW (het tekort aan middelen om iedereen te kunnen blijven betalen) zichtbaar en wordt de kans geboden met andere mogelijke oplossingen te komen voor dit probleem.

## de visualisatie
![](doc/schets.jpeg)
Deze visualisatie bestaat uit 4 onderdelen die onderling gelinkt zijn. Deze 4 onderdelen worden in 1 scherm opgedeeld in 4 rechthoeken. Verder zijn er 3 sliders die het getal van de eerder genoemde parameters kan veranderen.

Linksboven worden de inkomsten en uitgaven aan AOW in een lijndiagram tegen elkaar weggezet, met op de x-as jaartallen. Wanneer een parameter wordt veranderd, wijzigt ook deze grafiek. Ook kan hier een jaartal worden geselecteerd wat effect zal hebben op de getoonde informatie in de overige 3 onderdelen.

Het onderdeel rechtsboven is een bevolkingspiramide. Deze toont standaard de bevolkingspiramide voor het huidige jaar (2017) maar veranderd wanneer in onderdeel 1 een bepaald jaartal wordt geselecteerd.

Linksonder wordt een staafdiagram getoond met daarin 3 groepen van elk 2 datapunten. Elk van deze groep laat voor zowel de inkomsten als de uitgaven aan AOW, zien wat het verschil is met de parameters die op dit moment gelden. Hier kan nog gekozen worden of dit voor het geselecteerde jaar moet worden laten zien, hetzelfde als bij de bevolkingspiramide, of voor een langere tijdsspanne.

Rechtsonder staan als laatste nog wat gegevens over het geselecteerde jaar. Op het startscherm zal hier niets staan.

## data
Voor deze visualisatie zijn verschillende datasets en ook databronnen nodig. Allereerst is er een dataset nodig waarin een prognose wordt gegeven van de leeftijdsverdeling van de Nederlandse bevolking voor de komende jaren. Deze dataset is te vinden via het CBS.

Verder is er data nodig over de huidige AOW-leeftijd, het bedrag en de premie. Deze gegevens zijn te vinden via de site van de rijksoverheid. Het enige probleem hieraan is dat de regels wat betreft AOW, erg complex kunnen worden. Voor nu zal ik dus een versimpelde versie nemen waarin iedereen hetzelfde bedrag krijgt, ongeacht status etc.

Met de datasets met leeftijden kan ik in ieder geval al de bevolkingspiramide maken. Deze dataset gecombineerd met het (vereenvoudigde) AOW-bedrag kan de uitgaven weergeven in de visualisatie linksboven. De visualisatie linksonder kan, zodra zowel de inkomsten als uitgaven berekend zijn, gemakkelijk worden gemaakt door het huidige jaartal en het geselecteerde jaartal te vergelijken. Verder komt de informatie rechtsonder direct uit de gebruikte datasets.

Het enige probleem zit dus nog in de inkomsten uit de premies. Aangezien de AOW-premie een percentage is van het brutoloon tot een bepaald maximum, is hiervoor eigenlijk een verdeling nodig van het inkomen per leeftijd. Aan de hand van deze verdeling kan dan worden berekend hoeveel premie erbij komt of verdijnt bij een verandering van de AOW-leeftijd en/of de premie. Het vinden van deze verdeling blijkt echter erg lastig. Wellicht kan hiervoor ook gebruik worden gemaakt van een versimpelde schatting zoals ook voor het AOW-bedrag, die deze premie voor iedereen gelijk maakt.

De verkregen data zal worden omgezet naar een JSON file zodat deze gemakkelijk kan worden ingelezen in javascript. Binnen deze JSON file wordt de data gestald in de vorm van nested dictionaries beginnende bij een aparte dictionary voor elk jaartal.

## vergelijkbare visualisaties
Ik heb nog geen vergelijkbare visualisaties kunnen vinden. Wel zijn er al een hoop websites waar kan worden opgevraagd vanaf welke leeftijd iemand met een bepaalde geboortedatum AOW ontvangt. Deze site werken allemaal met een simpele optie om je geboortedatum in te voeren en vervolgens wordt dan de leeftijd getoond waarop AOW wordt ontvangen.

Ook zijn er al wel visualisaties die het probleem rondom AOW schetsen. Zo zijn er ook al een hoop filmpjes die tonen wat er gebeurt wanneer er niets verandert.

Maar een visualisatie als hierboven omschreven, waar de gebruiker alle gevolgen direct kan zien van een verandering een van de parameters, heb ik nog niet kunnen vinden.

## bronnen
data/leeftijdPrognose.csv, 11-01-2017
http://statline.cbs.nl/Statweb/publication/?VW=D&DM=SLNL&PA=83597NED&D1=0&D2=a&D3=0-100&D4=a&HD=170111-2115&HDR=T,G3&STB=G1,G2

data/werkloosheid2003tot2015.csv, 11-01-2017
http://statline.cbs.nl/Statweb/publication/?VW=D&DM=SLNL&PA=80590ned&D1=9&D2=1-3&D3=0&D4=12,25,38,51,64,77,90,103,116,129,142,155,168&HD=170111-2135&HDR=T,G1&STB=G2,G3

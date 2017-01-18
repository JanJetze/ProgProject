
# 11 januari
In plaats van een schuifbalk voor de drie te veranderen variabelen (leeftijd, AOW, premie), zal ik nu gebruik gaan maken van een textbox voor AOW en premie en een dropdownmenu voor de leeftijd.

Leeftijd, AOW en premie zijn niet langer te veranderen in de hoofdvisualisatie, maar deze knoppen zullen zich vanaf nu bevinden in de Header van de pagina, onder de titel.

Om goede schattingen te maken van de inkomsten en uitgaven van het AOW-stelsel bij een verandering van een van de eerder genoemde variabelen is een economisch model nodig dat deze variabelen test. Hiervoor moeten dan verschillende regressie analyses worden verricht etc. Voor nu zal ik deze stap overslaan en mij meer richten op de visualisatie. In mijn schattingen zal ieder werken persoon evenveel aan premie betalen en iedere AOW-gerechtigde ontvangt ook hetzelfde bedrag.

Dit bedacht, geniaal: In de schets zijn er nog 6 staven te zien, dit zullen er 4 worden; 2 onder leeftijd, 1 bij AOW en 1 bij premie. Bij een verandering van de premie zal er natuurlijk niets veranderen in de uitgaven, dit omdat de premie enkel betrekking heeft op de inkomsten. Ditzelfde, maar dan precies andersom, geldt voor het AOW-bedrag. Hier zal alleen een staaf komen die de verandering weergeeft in de uitgaven. Leeftijd is de enige variabele die zowel invloed heeft op de inkomsten als ook op de uitgaven, daarom zal deze wel twee staven krijgen in de visualisatie.

# 13 januari
Alle visualisatie staan nu op de pagina.

Bij de visualisatie contributie zit nog geen knop om te laten zien voor een tijdsperiode. Dit is een extra optie als ik tijd over heb.

# 15 januari
CSS styling gedaan.

Buttons toegevoegd om leeftijd, bedrag en premie aan te passen. Leeftijd is op dit moment ook een textvlak ipv een dropdownmenu.

# 16 januari
alles wat op de pagina moet komen geplaatst. Titels, legenda's etc.

Het is nu nog een zooitje, met name in main.js, met alle regels voor de legenda's etc. Deze kunnen uiteindelijk in aparte functies worden geplaatst. Voor elke visualisatie een eigen functies voor assen en aparte voor legenda's. Deze kunnen dan in een aparte file. Een main.js waar de mainloop in zit, graphs.js waarin alle graphs worden getekend, helpers.js waarin alle helperfuncties zitten zoals bijvoorbeeld de calcRevenue() en een file extra.js (of een dergelijke naam), waarin alle opmaak rondom de grafieken zit.

Er is nu een prototype site. Alleen de onderlinge links zijn nog niet gemaakt. Wel kunnen de drie variabelen (leeftijd, bedrag en premie) worden veranderd. Morgen zal ik mij richten op de onderlinge links tussen grafieken.

# 17 januari
Aparte javascript file gemaakt voor alle teksten etc op de pagina. components.js bevat nu voor elke visualisatie een aantal aparte functies die voor die visualisatie de titels, legenda en de assen maken. Deze functies worden aangeroepen in main.js en vervolgens in functions.js.

de visualisatie 'balans' is nu interactief met 'piramide' en 'contributie'. Als je in balans beweegt, beweegt er een lijntje mee, zodra je klikt, veranderen voor de piramide en de contributie de jaartallen.

# 18 januari
Kleine bugfixes, voornamelijk in de benaming van de assen van balans en contributie.

In de piramide worden nu beide balken gehighlight wanneer de muis erover heengaat. Daarnaast wordt zowel links als rechts naast de piramide getoonde welke leeftijd het is die gehighlight is.

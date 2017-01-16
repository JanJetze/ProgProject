import csv
import json

csv_file = open('leeftijdPrognose.csv', 'r')
json_file = open('leeftijdPrognose.json', 'w')

data_reader = csv.reader(csv_file, delimiter=',')

rows = list(data_reader)

leeftijden = {}

for col in range(2, len(rows[0])):
    jaar = rows[2][col]
    leeftijden[jaar] = {}
    leeftijden[jaar]['totaal leeftijd'] = {}
    leeftijden[jaar]['leeftijden'] = {}
    for row_a in range(4, 105):
        leeftijd = rows[row_a][1]
        if leeftijd == 'Totaal leeftijd':
            leeftijden[jaar]['totaal leeftijd']['mannen en vrouw'] = rows[row_a][col]
            leeftijden[jaar]['totaal leeftijd']['mannen'] = rows[row_a + 101][col]
            leeftijden[jaar]['totaal leeftijd']['vrouwen'] = rows[row_a + 202][col]
        elif len(leeftijd) == 6:
            leeftijd = int(leeftijd[0:1])
            leeftijden[jaar]['leeftijden'][leeftijd] = {}
            leeftijden[jaar]['leeftijden'][leeftijd]['mannen en vrouwen'] = rows[row_a][col]
            leeftijden[jaar]['leeftijden'][leeftijd]['mannen'] = rows[row_a + 101][col]
            leeftijden[jaar]['leeftijden'][leeftijd]['vrouwen'] = rows[row_a + 202][col]
        else:
            leeftijd = int(leeftijd[0:2])
            leeftijden[jaar]['leeftijden'][leeftijd] = {}
            leeftijden[jaar]['leeftijden'][leeftijd]['mannen en vrouwen'] = rows[row_a][col]
            leeftijden[jaar]['leeftijden'][leeftijd]['mannen'] = rows[row_a + 101][col]
            leeftijden[jaar]['leeftijden'][leeftijd]['vrouwen'] = rows[row_a + 202][col]


json.dump(leeftijden, json_file, indent=4, sort_keys=True)

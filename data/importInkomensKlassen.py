'''
  Jan Jetze Beitler
  10416641

  Minor Programmeren
  importInkomensKlassen.py

  data-source:
  http://statline.cbs.nl/Statweb/publication/?VW=T&DM=SLNL&PA=71510ned&D1=0&D2=0&D3=0,8-31&D4=0&D5=0&D6=0,17-34&D7=l&HD=170122-1928&HDR=T,G6,G1,G5,G3,G4&STB=G2

'''

import csv
import json

csv_file = open('inkomensKlassen.csv', 'r')
json_file = open('inkomensKlassen.json', 'w')

data_reader = csv.reader(csv_file, delimiter=';')

rows = list(data_reader)

inkomen = {}

for col in range(2, len(rows[4])):
    for add in range(5):
        leeftijd = (col - 2) * 5 + add
        inkomen[leeftijd] = {}
        for row in range(9, 32):
            bedrag = rows[row][0]
            percent = int(rows[row][col]) / int(rows[8][col])
            if row < 11:
                minimum = 0
                maximum = 0
            elif row < 26:
                minimum = (row - 11) * 2000
                maximum = minimum + 2000
            elif row < 30:
                minimum = (row - 26) * 5000 + 30000
                maximum = minimum + 5000
            elif row == 30:
                minimum = 50000
                maximum = 75000
            elif row == 31:
                minimum = 75000
                maximum = 100000
            else:
                minimum = 100000
                maximum = 100000
            inkomen[leeftijd][bedrag] = {}
            inkomen[leeftijd][bedrag]['percentage'] = percent
            inkomen[leeftijd][bedrag]['minimum'] = minimum
            inkomen[leeftijd][bedrag]['maximum'] = maximum

json.dump(inkomen, json_file, indent=4, sort_keys=True)

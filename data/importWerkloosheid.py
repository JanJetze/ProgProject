'''
  Jan Jetze Beitler
  10416641

  Minor Programmeren
  importWerkloosheid.py

  data-source:
  http://statline.cbs.nl/Statweb/publication/?VW=D&DM=SLNL&PA=80590ned&D1=9&D2=1-3&D3=0&D4=12,25,38,51,64,77,90,103,116,129,142,155,168&HD=170202-1818&HDR=T,G1&STB=G2,G3
'''
import csv
import json

csv_file = open('werkloosheid2003tot2015.csv', 'r')
json_file = open('werkloosheid.json', 'w')

data_reader = csv.reader(csv_file, delimiter=',')

rows = list(data_reader)

werkloosheid = {}

eerste = 0
tweede = 0
derde = 0

for row in range(5, len(rows) - 1):
    eerste += float(rows[row][2])
    tweede += float(rows[row][3])
    derde += float(rows[row][4])

eerste = eerste / 13
tweede = tweede / 13
derde = derde / 13

for leeftijd in range(0, 100):
    if leeftijd < 15:
        werkloosheid[leeftijd] = 0
    elif leeftijd < 25:
        werkloosheid[leeftijd] = eerste
    elif leeftijd < 45:
        werkloosheid[leeftijd] = tweede
    elif leeftijd < 75:
        werkloosheid[leeftijd] = derde
    else:
        werkloosheid[leeftijd] = 0

json.dump(werkloosheid, json_file, indent=4, sort_keys=True)

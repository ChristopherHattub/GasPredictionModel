import csv


#author: Chris Hattub

#Script that adds headers to a .csv datafile

#Change input file to target
with open('palmerData.csv', 'r') as file:


    reader = csv.reader(file)


    rows = list(reader)

# Define headers to add
headers = ['id', 'area code', 'gas type', 'amount', 'date']



# Insert headers
rows.insert(0, headers)

# Open the existing CSV file in write mode
with open('palmerData.csv', 'w', newline='') as file:

    # Create a CSV writer object
    writer = csv.writer(file)

    # Write the updated data to the file
    writer.writerows(rows)

print("Headers added successfully")

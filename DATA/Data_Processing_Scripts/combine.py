import glob
import pandas as pd

# REPLACE THIS STRING WITH TARGET DIRECTORY
directory_name = "Data_Processing_Scripts"

# OUTPUT FILE NAME. REPLACE WITH DESIRED OUTPUT FILE NAME
output_name = "COMBINED_OUTPUT"

# FINDS ALL .CSV files in target directory
csv_files = glob.glob(directory_name + "/*.csv")

#Alternate Use: Target current Directory

#csv_files = glob.glob("./*.csv")

print(str(len(csv_files)) + " csv files found")

if not csv_files:
    print("No CSV files found in the specified directory.")
    exit()

dfs = []

# Loop through each CSV file
for file in csv_files:
    df = pd.read_csv(file, low_memory=False)
    # Drop rows where all values are the same as the headers
    df = df[~df.eq(df.columns).all(1)]
    dfs.append(df)

# Write combined data frame to a CSV
with open(output_name + ".csv", "w", newline='', encoding='utf-8') as outfile:
    for i, df in enumerate(dfs):
        # Write headers and data for the first DataFrame
        if i == 0:
            df.to_csv(outfile, index=False)
        # For subsequent DataFrames, write a newline, then headers and data, only if the header is different
        else:
            if not df.columns.equals(dfs[i - 1].columns):
                outfile.write('\n')
            df.to_csv(outfile, index=False, header=True)


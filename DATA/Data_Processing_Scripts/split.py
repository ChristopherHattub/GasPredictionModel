import pandas as pd
from sklearn.model_selection import train_test_split


#Author: Chris Hattub

#Script that splits one csv into training, testing and validation datasets

#CHANGE TO WHATEVER INPUT FILE YOU ARE SPLITTING
df = pd.read_csv('vermont_master.csv', low_memory=False)

# Split into 80% training and 20% testing datasets
train_df, temp_df = train_test_split(df, test_size=0.2, random_state=42)

# Split 20% into 10% testing and 10% validation datasets
test_df, val_df = train_test_split(temp_df, test_size=0.5, random_state=42)


#CHANGE TO WHATEVER YOU WANT OUTPUT FILES TO BE NAMED
train_df.to_csv('VT_Temp_train.csv', index=False)
test_df.to_csv('VT_Temp_test.csv', index=False)
val_df.to_csv('VT_Temp_val.csv', index=False)

#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
import numpy as np
from datetime import datetime

def data_split (df)

df['Date'] = pd.to_datetime(df['Date']).dt.to_period('m')
df = df.sort_values(by=['Date'])

train_set, valid_set= np.split(df, [int(.8 *len(df))])
valid_set, test_set = np.split(valid_set, [int(.5 *len(valid_set))])


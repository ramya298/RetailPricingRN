Context Diagram

                           Retail Store Manager
                                    │
                                    │
                          Upload Pricing CSV
                                    │
                                    ▼
                    +-------------------------------+
                    |   Retail Pricing Mobile App   |
                    |      (Expo React Native)      |
                    +---------------+---------------+
                                    │
              Parse & Validate CSV  │
                                    │
                                    ▼
                           Local Data Store
                           (AsyncStorage)
                                    │
               Search / Update / Delete Pricing
                                    │
                                    ▼
                               User Interface
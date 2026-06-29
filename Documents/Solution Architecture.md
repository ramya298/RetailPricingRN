                        +----------------------+
                        |      UI Layer        |
                        |----------------------|
                        | Upload Screen        |
                        | Search Screen        |
                        | Edit Modal           |
                        | Toast Messages       |
                        +----------+-----------+
                                   │
                                   ▼
                     +---------------------------+
                     |    Business Logic Layer   |
                     |---------------------------|
                     | CSV Service               |
                     | Data Service             |
                     | Validation              |
                     | Search Logic            |
                     +------------+------------+
                                  │
                    +-------------+-------------+
                    │                           │
                    ▼                           ▼
          Redux Toolkit              React Query
       (Global UI State)         (Caching / Server State)

                                  │
                                  ▼
                      AsyncStorage Persistence

                                  ▲
                                  │
                    Expo File System + PapaParse
                                  ▲
                                  │
                             CSV File
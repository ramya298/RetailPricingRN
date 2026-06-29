Design Decisions

Expo 54
Chosen because

Faster development
Cross-platform
Native modules already supported
Easy testing with Expo Go
Expo Router

Used because

File-based routing
Cleaner navigation structure
Less boilerplate
Redux Toolkit

Used only for application-wide UI state.

Examples

Toast notifications
Global flags
Shared application state

Reason

Keeps UI state centralized while avoiding prop drilling.

React Query

Used for

Data caching
Data synchronization
Cleaner asynchronous logic

Even though this application primarily uses local storage, React Query makes it easy to replace AsyncStorage with REST APIs in the future.

AsyncStorage

Instead of a database,

the application stores records locally.

Advantages

Offline support
Fast reads
Simple persistence
PapaParse

Chosen because

Fast CSV parsing
Handles headers automatically
Good error reporting
Widely used
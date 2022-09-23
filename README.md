# Fire Emblem TumblrBot

Creates all possible complete pairings of Fire Emblem characters to help with your playthrough.

It will not work for large numbers of characters, so you will need to lock in some pairs.

# App usage

## Installing dependencies

**UI**

Requires Node.js and NPM installed.

```sh
npm install
```

**Python scripts**

Requires Python 3.10+.

No dependencies.

## Running the app

**UI**

```sh
npm start
```

**Python scripts**

To generate test data:

```sh
python test_data_gen.py
```

To generate generate JSON for Quicktype:

```sh
python fecodegen.py
```

To play with matchmaking logic:

```sh
python public/matchmaker.py
```

## Testing the app

**UI**

```sh
npm run test
```

**Python scripts**

No tests at the moment.

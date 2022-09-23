from csv import reader
from json import dump
from pathlib import Path
from re import sub
from typing import Dict, List, TypedDict

NON_ALPHANUMERIC_REGEX = r"[^a-zA-Z0-9]"

AWAKENING_KEY = "awakening"
AWAKENING_NAME = "Fire Emblem Awakening"

TEST_KEY = "test"
TEST_NAME = "Test Data"

class Character(TypedDict):
    game_key: str
    key: str
    name: str
    possible_partner_keys: List[str]

class Game(TypedDict):
    is_implemented: bool
    key: str
    name: str

GAMES: List[Game] = [
    {   
        "is_implemented": False,
        "key": AWAKENING_KEY,
        "name": AWAKENING_NAME,
    },
    {
        "is_implemented": True,
        "key": TEST_KEY,
        "name": TEST_NAME,
    },
]


class FireEmblem(TypedDict):
    characters: List[Character]
    games: List[Game]

def main():
    fire_emblem: FireEmblem = {
        "characters": [],
        "games": GAMES,
    }

    for game in fire_emblem["games"]:
        row_index_key_map: Dict[int, str] = {}

        with open(Path("data", f"{game['key']}.csv")) as game_csv:
            game_reader = reader(game_csv)
            
            for row_index, row in enumerate(game_reader):
                if row_index == 0:
                    for item_index, item in enumerate(row):
                        if item_index == 0:
                            continue
                        
                        name = " ".join(map(lambda s : s.capitalize(), item.split(" ")))
                        key = sub(NON_ALPHANUMERIC_REGEX, "", name).lower()

                        row_index_key_map[item_index] = key

                        fire_emblem["characters"].append({
                            "game_key": game["key"],
                            "key": key,
                            "name": name,
                            "possible_partner_keys": []
                        })
                else:
                    character = [c for c in fire_emblem["characters"] if c["key"] == row_index_key_map[row_index] and c["game_key"] == game["key"]][0]

                    for item_index, item in enumerate(row):
                        if item_index == 0:
                            continue

                        if item != "1":
                            continue
                        
                        character["possible_partner_keys"].append(row_index_key_map[item_index])
    
    with open(Path("src", "output.json"), "w") as game_json:
        dump(fire_emblem, game_json, indent=4, sort_keys=True)

if __name__ == "__main__":
    main()
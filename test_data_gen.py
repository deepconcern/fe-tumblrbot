from csv import writer
from pathlib import Path
from random import randint
from typing import List, TypedDict

ITEMS: List[str] = [
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    # "Bilberry",
    "Blackberry",
    # "Blackcurrant",
    "Blueberry",
    "Boysenberry",
    "Currant",
    "Cherry",
    # "Cherimoya",
    # "Chico fruit",
    # "Cloudberry",
    # "Coconut",
    "Cranberry",
    # "Cucumber",
    # "Custard apple",
    # "Damson",
    "Date",
    # "Dragonfruit",
    # "Durian",
    # "Elderberry",
    # "Feijoa",
    "Fig",
    # "Goji berry",
    # "Gooseberry",
    "Grape",
    "Raisin",
    "Grapefruit",
    "Guava",
    # "Honeyberry",
    # "Huckleberry",
    # "Jabuticaba",
    # "Jackfruit",
    # "Jambul",
    # "Jujube",
    # "Juniper berry",
    # "Kiwano",
    # "Kiwifruit",
    # "Kumquat",
    "Lemon",
    "Lime",
    # "Loquat",
    # "Longan",
    # "Lychee",
    "Mango",
    # "Mangosteen",
    # "Marionberry",
    # "Melon",
    # "Cantaloupe",
    # "Honeydew",
    # "Watermelon",
    # "Miracle fruit",
    # "Mulberry",
    # "Nectarine",
    # "Nance",
    # "Olive",
    # "Orange",
    # "Blood orange",
    # "Clementine",
    # "Mandarine",
    # "Tangerine",
    # "Papaya",
    # "Passionfruit",
    # "Peach",
    # "Pear",
    # "Persimmon",
    # "Physalis",
    # "Plantain",
    # "Plum",
    # "Prune",
    # "Pineapple",
    # "Plumcot",
    # "Pomegranate",
    # "Pomelo",
    # "Purple mangosteen",
    # "Quince",
    # "Raspberry",
    # "Salmonberry",
    # "Rambutan",
    # "Redcurrant",
    # "Salal berry",
    # "Salak",
    # "Satsuma",
    # "Soursop",
    # "Star fruit",
    # "Solanum quitoense",
    # "Strawberry",
    # "Tamarillo",
    # "Tamarind",
    "Ugli fruit",
    # "Yuzu",
]

ITEMS.sort()

class Fruit(TypedDict):
    excluded_pairing_ids: List[str]
    id: int
    name: str

def main():
    fruits: List[Fruit] = list(map(lambda entry: { "excluded_pairing_ids": [], "id": entry[0], "name": entry[1] }, enumerate(ITEMS)))

    for fruit in fruits:
        pairing_id = fruit["id"]
        while pairing_id == fruit["id"] or fruit["excluded_pairing_ids"].count(pairing_id) != 0:
            pairing_id = randint(0, len(fruits) - 1)

        fruit["excluded_pairing_ids"].append(pairing_id)
        fruits[pairing_id]["excluded_pairing_ids"].append(fruit["id"])

    with open(Path("data", "test.csv"), "w") as test_file:
        test_writer = writer(test_file)

        test_writer.writerow(["", *map(lambda fruit: fruit["name"].upper(), fruits)])

        for fruit in fruits:
            row: List[str] = [fruit["name"].upper()]

            for other_fruit in fruits:
                if fruit["excluded_pairing_ids"].count(other_fruit["id"]) > 0:
                    row.append("")
                else:
                    row.append("1")
            
            test_writer.writerow(row)

if __name__ == "__main__":
    main()
from math import factorial
from typing import Any, List, Set, Tuple, TypeVar

def calculate_sets_of_pairs(list: List[int]) -> int:
    n = len(list)

    return factorial(n) // (pow(2, n // 2) * factorial(n // 2))

def create_sets_of_pairs(list: List[int]) -> Set[Set[Set[int]]]:
    number_of_pairs = len(list) // 2

    pairs_sets: Set[Set[Set[int]]] = set()

    first, *rest = list

    for index, person in enumerate(rest):
        pairs_set: Set[Set[int]] = set()

        first_pair = frozenset({ first, person })

        pairs_set.add(first_pair)

        for offset in range(1, number_of_pairs):
            pair = frozenset({ rest[(index - offset) % len(rest)], rest[(index + offset) % len(rest)] })
            pairs_set.add(pair)
        
        pairs_sets.add(frozenset(pairs_set))

    return pairs_sets

I = TypeVar("I")

def create_possible_pairs_lists(items: List[I]) -> List[List[Tuple[I, I]]]:
    possible_pairs_lists: List[List[Tuple[I, I]]] = []

    index_pairs_sets = create_sets_of_pairs(range(len(items)))

    for index_pairs_set in index_pairs_sets:
        possible_pairs_list: List[Tuple[I, I]] = []

        for index_pair_set in index_pairs_set:
            index_pair_list = list(index_pair_set)

            possible_pairs_list.append([
                items[index_pair_list[0]],
                items[index_pair_list[1]],
            ])
        
        possible_pairs_lists.append(possible_pairs_list)
    
    return possible_pairs_lists

def sizeof_fmt(n: float, suffix: str = "B") -> str:
    for unit in ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"]:
        if abs(n) < 1024.0:
            return f"{n:3.1f}{unit}{suffix}"
        n /= 1024.0
    
    return f"{n:3.1f}Yi{suffix}"

def main(items: List[str], calculate_only: bool):
    print(f"Items: {items}")

    if calculate_only:
        n = calculate_sets_of_pairs(items)

        print(f"Number of sets: {n}")
        print(f"Rough memory usage: {sizeof_fmt(n)}")
        
        return

    pairings = create_sets_of_pairs(range(len(items)))
    for pairing in pairings:
        printable_pairing: List[str] = []

        for pair in pairing:
            printable_pair: List[str] = []

            for index in pair:
                printable_pair.append(items[index])
            
            printable_pairing.append(f"{{{', '.join(printable_pair)}}}")
        
        print(f"[{', '.join(printable_pairing)}]")

if __name__ == "__main__":
    from argparse import ArgumentParser, BooleanOptionalAction, FileType

    parser = ArgumentParser(description="Generates all possible pairings of the given input")

    group = parser.add_mutually_exclusive_group(required=True)

    group.add_argument("-i", "--items", type=str, nargs="+", help="an item to pair with", required=False)

    group.add_argument("-f", "--file", type=FileType("r"), required=False)

    parser.add_argument("-c", "--calculate-only", action=BooleanOptionalAction, dest="calculate_only", required=False, type=bool)

    args = parser.parse_args()

    if args.items is not None:
        items = args.items
    else:
        items = args.file.read().split("\n")

    main(items, args.calculate_only)

# Example (1) - 1, 2
# (1, 2)
# 1

# Example (2) - 1, 2, 3, 4
# (1, 2), (3, 4)
# (1, 3), (2, 4)
# (1, 4), (2, 3)
# 3

# Example (3) - 1, 2, 3, 4, 5, 6
# (1, 2), (3, 4), (5, 6)
# (1, 2), (3, 5), (4, 6)
# (1, 2), (3, 6), (4, 5)
# (1, 3), (2, 4), (5, 6)
# (1, 3), (2, 5), (4, 6)
# (1, 3), (2, 6), (4, 5)
# (1, 4), (2, 3), (5, 6)
# (1, 4), (2, 5), (3, 6)
# (1, 4), (2, 6), (3, 5)
# (1, 5), (2, 3), (4, 6)
# (1, 5), (2, 3), (4, 6)
# (1, 5), (2, 3), (4, 6)
# (1, 6), (2, 3), (4, 6)
# (1, 6), (2, 3), (4, 6)
# (1, 6), (2, 3), (4, 6)
# 15

# Example (4) - 1, 2, 3, 4, 5, 6, 7, 8
# (1, 2), (3, 4), (5, 6), (7, 8)
# (1, 2), (3, 5), (4, 6), (7, 8)
# (1, 2), (3, 6), (4, 5), (7, 8)
# (1, 2), (3, 6), (4, 5), (7, 8)
# (1, 2), (3, 6), (4, 5), (7, 8)
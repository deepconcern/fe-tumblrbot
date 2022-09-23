import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import { FC, MouseEvent, useCallback, useMemo, useState } from "react";

import { useCharacters } from "../contexts/fire-emblem";
import { Character } from "../lib/fire-emblem";
import { MAX_UNMATCHED_CHARACTERS } from "../lib/MAX_UNMATCHED_CHARACTERS";
import { PairDisplay } from "./PairDisplay";

export type LockedPairSelectProps = {
    gameKey: string,
    onPairsChanged: (pairs: [Character, Character][]) => void,
};

function getCharacterOptionLabel(character: Character): string {
    return character.name;
}

export const LockedPairSelect: FC<LockedPairSelectProps> = ({ gameKey, onPairsChanged }) => {
    const characters = useCharacters(gameKey);
    const [lockedPairs, setLockedPairs] = useState<[Character, Character][]>([]);
    const [inputCharacters, setInputCharacters] = useState<Character[]>([]);

    const handleInputChange = useCallback((_: any, characters: Character[]) => {
        if (characters.length > 3) {
            return;
        }

        setInputCharacters(characters);
    }, [setInputCharacters]);

    const handleInsert = useCallback((ev: MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();

        const newLockedPairs: [Character, Character][] = [...lockedPairs, [inputCharacters[0], inputCharacters[1]]];

        setLockedPairs(newLockedPairs);
        setInputCharacters([]);
        onPairsChanged(newLockedPairs);
    }, [inputCharacters, lockedPairs, onPairsChanged, setInputCharacters, setLockedPairs]);

    const matchedCharacterKeys = useMemo(() => {
        const matchedCharacterKeys = new Set<string>();

        lockedPairs.forEach(([c1, c2]) => {
            matchedCharacterKeys.add(c1.key);
            matchedCharacterKeys.add(c2.key);
        });

        return matchedCharacterKeys;
    }, [lockedPairs]);

    const unmatchedCharacters = useMemo(() => {
        return characters.filter(c => !matchedCharacterKeys.has(c.key));
    }, [characters, matchedCharacterKeys]);

    const handleOptionDisabled = useCallback((character: Character) => {
        if (inputCharacters.find(c => c.key === character.key)) {
            return false;
        }

        if (matchedCharacterKeys.has(character.key)) {
            return true;
        }

        return inputCharacters.length > 1;
    }, [inputCharacters, matchedCharacterKeys]);

    const handleListDelete = useCallback((index: number) => (_: MouseEvent<HTMLButtonElement>) => {
        const newLockedPairs = [...lockedPairs];

        newLockedPairs.splice(index, 1);

        setLockedPairs(newLockedPairs);
        onPairsChanged(newLockedPairs);
    }, [lockedPairs, onPairsChanged, setLockedPairs]);

    return (
        <Paper sx={{ mb: 2, p: 2 }}>
            <InputLabel htmlFor="pair-input">
                Input locked pairs:
            </InputLabel>
            {lockedPairs.length === 0 ? null : (
                <List>
                    {lockedPairs.map(([character1, character2], i) => (
                        <ListItem key={i} secondaryAction={
                            <IconButton data-list-index={i}  onClick={handleListDelete(i)}>
                                <DeleteIcon/>
                            </IconButton>
                        }>
                            <PairDisplay
                                firstCharacterKey={character1.key}
                                secondCharacterKey={character2.key}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
            <Autocomplete
                getOptionDisabled={handleOptionDisabled}
                getOptionLabel={getCharacterOptionLabel}
                id="pair-input"
                multiple
                onChange={handleInputChange}
                options={characters}
                renderInput={params => <TextField {...params} />}
                value={inputCharacters}
            />
            <Button disabled={inputCharacters.length < 2} onClick={handleInsert}>Insert</Button>
            <Box>Unmatched characters (must be {MAX_UNMATCHED_CHARACTERS} or below): {unmatchedCharacters.length}</Box>
        </Paper>
    );
};
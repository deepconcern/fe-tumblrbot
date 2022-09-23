import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { FC, useCallback, useMemo, useState } from "react";
import { useCharacters } from "../contexts/fire-emblem";
import { useMatchmake, usePyodide } from "../contexts/pyodide";

import { Character } from "../lib/fire-emblem";

import { PairDisplay } from "./PairDisplay";

export type SetOfPairsDisplayProps = {
    gameKey: string,
    lockedPairs: [Character, Character][],
};

export const SetOfPairsDisplay: FC<SetOfPairsDisplayProps> = ({ gameKey, lockedPairs }) => {
    const matchmake = useMatchmake();
    const pyodide = usePyodide();
    const characters = useCharacters(gameKey);
    const unmatchedCharacters = useMemo(() => {
        const matchedCharacterKeys = new Set<string>();

        for (const pair of lockedPairs) {
            for (const character of pair) {
                matchedCharacterKeys.add(character.key);
            }
        }

        return characters.filter(c => !matchedCharacterKeys.has(c.key));
    }, [characters, lockedPairs]);

    const [pairsSet, setPairsSet] = useState<[Character, Character][][]>([]);

    const handleGenerate = useCallback(() => {
        if (!pyodide) {
            return;
        }

        const listOfPairs: [Character, Character][][] = matchmake(unmatchedCharacters);

        setPairsSet(listOfPairs);
    }, [pyodide, unmatchedCharacters]);

    return (
        <Paper sx={{ mb: 2, p: 2 }}>
            <Button onClick={handleGenerate}>Generate</Button>
            <TableContainer>
                <Table size="small">
                    <TableBody>
                        {pairsSet.map((pairs, i) => (
                            <TableRow key={i}>
                                {pairs.map(([firstCharacter, secondCharacter], i) => (
                                    <TableCell align="center" key={i}>
                                        <PairDisplay firstCharacterKey={firstCharacter.key} secondCharacterKey={secondCharacter.key} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
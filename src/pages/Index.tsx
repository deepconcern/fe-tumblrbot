import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { FC, Fragment, useCallback, useMemo, useState } from "react";

import { GameSelect } from "../components/GameSelect";
import { LockedPairSelect } from "../components/LockedPairSelect";
import { SetOfPairsDisplay } from "../components/SetOfPairsDisplay";
import { useCharacters, useGames } from "../contexts/fire-emblem";
import { Character, Game } from "../lib/fire-emblem";
import { MAX_UNMATCHED_CHARACTERS } from "../lib/MAX_UNMATCHED_CHARACTERS";

export const Index: FC = () => {
    const games = useGames();

    const [isGameImplemented, setGameImplemented] = useState(games[0].isImplemented);
    const [gameKey, setGameKey] = useState(games[0].key);

    const characters = useCharacters(gameKey);

    const [lockedPairs, setLockedPairs] = useState<[Character, Character][]>([]);

    const matchedCharacters = lockedPairs.flat();

    const hasTooManyCharacters = useMemo(() => {
        const numberOfUnmatchedCharacters = (characters?.length || 0) - matchedCharacters.length;

        return numberOfUnmatchedCharacters > MAX_UNMATCHED_CHARACTERS;
    }, [characters, matchedCharacters]);
    
    const handleGameSelect = useCallback((game: Game) => {
        setGameImplemented(game.isImplemented);
        setGameKey(game.key);
    }, [setGameImplemented, setGameKey]);

    const handlePairsChanged = useCallback((pairs: [Character, Character][]) => {
        setLockedPairs(pairs);
    }, []);

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="absolute" sx={{ padding: 1 }}>
                <Typography component="h1" variant="h6">
                    TumblrBot
                </Typography>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
                <Toolbar/>
                <Container maxWidth="lg" sx={{ mb: 4, mt: 4 }}>
                    <GameSelect onGameSelect={handleGameSelect}/>
                    {!isGameImplemented ? null : (
                        <Fragment>
                            <LockedPairSelect gameKey={gameKey} onPairsChanged={handlePairsChanged}/>
                            {hasTooManyCharacters ? null : (
                                <SetOfPairsDisplay gameKey={gameKey} lockedPairs={lockedPairs}/>
                            )}
                        </Fragment>
                    )}
                </Container>
            </Box>
        </Box>
    );
};
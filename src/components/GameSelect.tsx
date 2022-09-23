import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import Paper from "@mui/material/Paper";
import { ChangeEvent, FC, useCallback, useState } from "react";

import { useGames } from "../contexts/fire-emblem";
import { Game } from "../lib/fire-emblem";

export type GameSelectProps = {
    onGameSelect: (game: Game) => void,
};

export const GameSelect: FC<GameSelectProps> = ({ onGameSelect }) => {
    const games = useGames();

    const [gameKey, setGameKey] = useState(games[0].key);
    
    const handleSelectGame = useCallback((ev: ChangeEvent<HTMLSelectElement>) => {
        ev.preventDefault();

        const selectedGame = games.find(g => g.key === ev.target.value);

        if (!selectedGame) {
            return;
        }

        setGameKey(selectedGame.key);
        onGameSelect(selectedGame);
    }, [games, onGameSelect, setGameKey]);

    return (
        <Paper sx={{ mb: 2, p: 2 }}>
            <InputLabel htmlFor="game-select">
                Select a game:
            </InputLabel>
            <NativeSelect id="game-select" onChange={handleSelectGame} value={gameKey}>
                {games.map(({ isImplemented, key, name }) => {
                    name = isImplemented ? name : `${name} (Not Implemented)`;
                    return (
                        <option key={key} value={key}>{name}</option>
                    );
                })}
            </NativeSelect>
        </Paper>
    );
};
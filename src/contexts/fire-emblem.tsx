import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

import { Character, Convert, Game } from "../lib/fire-emblem";
import dataJson from "../output.json";

const fireEmblemData = Convert.toFireEmblem(JSON.stringify(dataJson));

const FireEmblemContext = createContext(fireEmblemData);

export const FireEmblemProvider: FC<PropsWithChildren> = ({ children }) => (
    <FireEmblemContext.Provider value={fireEmblemData}>
        {children}
    </FireEmblemContext.Provider>
);

export function useCharacter(key: string): Character | null {
    const { characters } = useContext(FireEmblemContext);

    return characters.find(c => c.key === key) || null;
}

export function useCharacters(gameKey?: string): Character[] {
    const { characters } = useContext(FireEmblemContext);

    const filteredCharacters = useMemo(() => {
        if (!gameKey) {
            return characters;
        }

        return characters.filter(c => c.gameKey === gameKey);
    }, [characters, gameKey]);

    return filteredCharacters;
}

export function useGame(key: string): Game | null {
    const { games } = useContext(FireEmblemContext);

    return games.find(g => g.key === key) || null;
}

export function useGames(): Game[] {
    const { games } = useContext(FireEmblemContext);

    return games;
}
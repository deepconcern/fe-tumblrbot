import { PyodideInterface } from "pyodide";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";

declare function loadPyodide(): Promise<PyodideInterface>;

export type Matchmake = <I>(items: I[]) => [I, I][][];

type PyodideData = {
    matchmake: Matchmake,
    pyodide: PyodideInterface | null,
}

const PyodideContext = createContext<PyodideData>({
    matchmake: () => [],
    pyodide: null,
});

export const PyodideProvider: FC<PropsWithChildren> = ({ children }) => {
    const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);

    useEffect(() => {
        const process = async () => {
            const pyodide = await loadPyodide();

            await pyodide.runPythonAsync(`
                from pyodide.http import pyfetch

                response = await pyfetch("/matchmaker.py");

                with open("matchmaker.py", "wb") as f:
                    f.write(await response.bytes())
            `);
            setPyodide(pyodide);
        };

        process();
    }, [setPyodide]);

    const matchmake = useCallback(<I extends any>(items: I[]): any => {
        if (!pyodide) {
            return;
        }

        const pkg = pyodide.pyimport("matchmaker");

        return pkg.create_possible_pairs_lists(items).toJs();
    }, [pyodide]);

    const value = useMemo(() => ({
        matchmake,
        pyodide,
    }), [matchmake, pyodide]);

    return (
        <PyodideContext.Provider value={value}>
            {children}
        </PyodideContext.Provider>
    )
};

export function useMatchmake(): Matchmake {
    const { matchmake } = useContext(PyodideContext);

    return matchmake;
}

export function usePyodide(): PyodideInterface | null {
    const { pyodide } = useContext(PyodideContext);

    return pyodide;
}
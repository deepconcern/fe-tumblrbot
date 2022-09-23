import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { SxProps, Theme, useTheme } from "@mui/material/styles";
import { FC } from "react";

import { CharacterDisplay } from "./CharacterDisplay";

export type PairDisplayProps = {
    firstCharacterKey: string,
    secondCharacterKey: string,
    sx?: SxProps<Theme>,
};

export const PairDisplay: FC<PairDisplayProps> = ({ firstCharacterKey, secondCharacterKey, sx }) => {
    const theme = useTheme();

    return (
        <Box sx={{
            alignItems: "center",
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 4,
            color: "text.secondary",
            display: "flex",
            padding: 1,
            width: "fit-content",
            ...(sx || {})
        }}>
            <CharacterDisplay characterKey={firstCharacterKey} sx={{ m: 1 }}/>
            <Divider orientation="vertical" variant="middle" flexItem sx={{
                mx: 1,
            }} />
            <CharacterDisplay characterKey={secondCharacterKey} sx={{ ml: 1, mr: 1 }} />
        </Box>
    );
};
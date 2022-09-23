import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material/styles";
import { FC, MouseEventHandler, TouchEventHandler } from "react";

import { useCharacter } from "../contexts/fire-emblem";

export type CharacterDisplayProps = {
    characterKey: string,
    onClick?: MouseEventHandler<any>,
    onMouseOver?: MouseEventHandler<any>,
    onTouchStart?: TouchEventHandler<any>,
    sx?: SxProps<Theme>,
}; 

export const CharacterDisplay: FC<CharacterDisplayProps> = ({
    characterKey,
    onClick,
    onMouseOver,
    onTouchStart,
    sx,
}) => {
    const { name } = useCharacter(characterKey) || {
        name: "N/A",
    };

    const initial = name.charAt(0).toLocaleUpperCase();

    return (
        <Chip
            avatar={<Avatar>{initial}</Avatar>}
            clickable={!!onClick}
            label={name}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onTouchStart={onTouchStart}
            sx={sx}
        />
    );
};
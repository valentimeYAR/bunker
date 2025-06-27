import { Box, Input } from "@chakra-ui/react";
import { memo } from "react";

interface Props {
  id: number;
  name: string;
  onNameChange: (id: number, name: string) => void;
}

const CreatePlayer = ({ id, name, onNameChange }: Partial<Props>) => {
  return <Box>
    <Input
      value={name}
      placeholder={`Игрок ${id}. Введите имя`}
      onChange={(e) => onNameChange?.(id!, e.target.value)}
    />
  </Box>;
};

export default memo(CreatePlayer);
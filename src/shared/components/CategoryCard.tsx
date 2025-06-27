import { Box, Image, Text } from "@chakra-ui/react";
import { memo } from "react";
import type { GameCategory, PlayerCard } from "../gameData/categories";

interface CategoryCardProps {
  category: GameCategory;
  card?: PlayerCard | null;
  isRevealed?: boolean;
  isExpanded?: boolean;
  isCurrentReveal?: boolean;
  onClick?: () => void;
}

const CategoryCard = ({ category, card, isRevealed = false, isExpanded = false, isCurrentReveal = false, onClick }: CategoryCardProps) => {
  return (
    <Box
      borderWidth={2}
      borderRadius="lg"
      p={3}
      cursor="pointer"
      onClick={onClick}
      bg={isCurrentReveal ? "yellow.50" : (isExpanded ? "blue.50" : (isRevealed ? "green.50" : "gray.50"))}
      borderColor={isCurrentReveal ? "yellow.400" : (isExpanded ? "blue.300" : (isRevealed ? "green.200" : "gray.200"))}
      _hover={{ borderColor: "blue.400", bg: "blue.100" }}
      transition="all 0.2s"
      w="100%"
    >
      {/* Заголовок - всегда видимый */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        minH="40px"
      >
        <Text fontSize="md" fontWeight={600}>
          {category.nameRu} {isCurrentReveal && "🎯"}
        </Text>
        <Text fontSize="sm" color="gray.500">
          {isExpanded ? "▼" : "▶"}
        </Text>
      </Box>

      {/* Содержимое карточки - показывается только при развороте */}
      {isExpanded && (
        <Box mt={3} textAlign="center">
          {card ? (
            <Image
              src={card.imagePath}
              alt={category.nameRu}
              w="100%"
              h="100%"
              objectFit="cover"
              borderRadius="md"
              fallback={
                <Box
                  h="120px"
                  w="100%"
                  bg="green.200"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="lg"
                  textAlign="center"
                  color="green.800"
                  fontWeight="600"
                >
                  №{card.imageNumber}
                </Box>
              }
            />
          ) : (
            <Box
              h="120px"
              w="100%"
              bg="gray.200"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
            >
              ❓
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default memo(CategoryCard); 
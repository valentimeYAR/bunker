import { Box, VStack, Text, Spinner, Button, HStack, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useGame } from "../../shared/hooks/useGame";
import { getPlayerCards, getCategoryNameById } from "../../shared/gameData/categories";
import CategoryCard from "../../shared/components/CategoryCard";
import { useNavigate } from "react-router-dom";

const Game = () => {
  const navigate = useNavigate();
  const { loading, game, playerName, isRegistered, playerCharacteristics, commonCards, currentRevealCard, revealedCards, changeRevealCard } = useGame();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (loading) return <Spinner />;

  if (!isRegistered) {
    return (
      <Box p={4}>
        <Text>Вы не зарегистрированы в этой игре</Text>
      </Box>
    );
  }

  if (game?.status !== 'started' && game?.status !== 'finished') {
    return (
      <Box p={4}>
        <Text>Игра еще не началась</Text>
      </Box>
    );
  }

  // Временная заглушка для тестирования
  const testCharacteristics = {
    luggage: { categoryId: 'luggage', imageNumber: 1, imagePath: '/assests/luggage/1.jpg' },
    biology: { categoryId: 'biology', imageNumber: 1, imagePath: '/assests/biology/1.jpg' },
    bunker: { categoryId: 'bunker', imageNumber: 1, imagePath: '/assests/bunker/1.jpg' },
    health: { categoryId: 'health', imageNumber: 1, imagePath: '/assests/health/1.jpg' },
    special: { categoryId: 'special', imageNumber: 1, imagePath: '/assests/special/1.jpg' },
    profession: { categoryId: 'profession', imageNumber: 1, imagePath: '/assests/profession/1.jpg' },
    menace: { categoryId: 'menace', imageNumber: 1, imagePath: '/assests/menace/1.jpg' },
    facts: { categoryId: 'facts', imageNumber: 1, imagePath: '/assests/facts/1.jpg' },
    hobby: { categoryId: 'hobby', imageNumber: 1, imagePath: '/assests/hobby/1.jpg' }
  };

  const testCommonCards = {
    disaster: { categoryId: 'disaster', imageNumber: 1, imagePath: '/assests/disaster/1.jpg' }
  };

  const playerCards = getPlayerCards(
    playerCharacteristics || testCharacteristics,
    commonCards || testCommonCards,
    currentRevealCard
  );

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleLeaveGame = () => {
    localStorage.clear();
    navigate('/');
    onClose();
  };

  // Отладочная информация
  console.log('Player characteristics:', playerCharacteristics);
  console.log('Player cards:', playerCards);

  return (
    <Box p={4} maxW="600px" mx="auto">
      <Text fontSize="2xl" fontWeight={700} mb={4} textAlign="center">
        Игра началась! Привет, {playerName}
      </Text>

      {/* Панель управления открытием карточек */}
      <Box bg={currentRevealCard ? "blue.50" : "red.50"} p={4} borderRadius="lg" mb={6}>
        {currentRevealCard ? (
          <>
            <Text fontSize="lg" fontWeight={600} mb={3} textAlign="center">
              Сейчас открываем: {getCategoryNameById(currentRevealCard)}
            </Text>

            <HStack justify="center" spacing={4} mb={3}>
              <Button colorScheme="blue" onClick={changeRevealCard} size="sm">
                Следующая карточка
              </Button>
            </HStack>
          </>
        ) : (
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight={700} mb={2} color="red.600">
              🎉 Все карточки открыты!
            </Text>
            <Text fontSize="md" mb={4} color="red.500">
              Игра завершена. Вы можете обсудить результаты или покинуть игру.
            </Text>
            {game?.status === 'finished' && (
              <Badge colorScheme="red" variant="solid" fontSize="sm" p={2}>
                ИГРА ЗАВЕРШЕНА
              </Badge>
            )}
          </Box>
        )}

        {revealedCards.length > 0 && (
          <Box>
            <Text fontSize="sm" color="gray.600" mb={2} textAlign="center">
              Уже открыты ({revealedCards.length} из 7):
            </Text>
            <HStack justify="center" flexWrap="wrap" spacing={2}>
              {revealedCards.map(cardId => (
                <Badge key={cardId} colorScheme="green" variant="solid">
                  {getCategoryNameById(cardId)}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}
      </Box>

      <Text mb={4} textAlign="center">Ваши карточки:</Text>

      <VStack spacing={3} align="stretch">
        {playerCards.map((cardData) => (
          <CategoryCard
            key={cardData.id}
            category={cardData}
            card={cardData.card}
            isRevealed={cardData.isRevealed}
            isExpanded={expandedCards.has(cardData.id)}
            isCurrentReveal={cardData.isCurrentReveal}
            onClick={() => toggleCard(cardData.id)}
          />
        ))}
      </VStack>
      <Button mt={4} colorScheme="red" onClick={onOpen}>
        Покинуть игру
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4} maxW="400px">
          <ModalHeader>Покинуть игру</ModalHeader>
          <ModalBody>
            <Text>Вы уверены, что хотите покинуть игру?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Отмена
            </Button>
            <Button colorScheme="red" onClick={handleLeaveGame}>
              Да, покинуть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Game;
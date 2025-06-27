export interface GameCategory {
  id: string;
  nameRu: string;
  nameEn: string;
  folderName: string; // название папки в assets
  cardCount: number; // количество карточек в категории
}

export const GAME_CATEGORIES: GameCategory[] = [
  {
    id: 'disaster',
    nameRu: 'Катастрофа',
    nameEn: 'Disaster',
    folderName: 'disaster',
    cardCount: 20
  },
  {
    id: 'luggage',
    nameRu: 'Багаж',
    nameEn: 'Luggage',
    folderName: 'luggage',
    cardCount: 30
  },
  {
    id: 'biology',
    nameRu: 'Биология',
    nameEn: 'Biology',
    folderName: 'biology',
    cardCount: 30
  },
  {
    id: 'health',
    nameRu: 'Здоровье',
    nameEn: 'Health',
    folderName: 'health',
    cardCount: 30
  },
  {
    id: 'special',
    nameRu: 'Особые условия',
    nameEn: 'Special',
    folderName: 'special',
    cardCount: 30
  },
  {
    id: 'profession',
    nameRu: 'Профессия',
    nameEn: 'Profession',
    folderName: 'profession',
    cardCount: 30
  },
  {
    id: 'facts',
    nameRu: 'Факты',
    nameEn: 'Facts',
    folderName: 'facts',
    cardCount: 30
  },
  {
    id: 'hobby',
    nameRu: 'Хобби',
    nameEn: 'Hobby',
    folderName: 'hobby',
    cardCount: 30
  }
];

export interface PlayerCard {
  categoryId: string;
  imageNumber: number; // номер картинки в папке (1, 2, 3...)
  imagePath: string; // полный путь к картинке
}

export interface PlayerCharacteristics {
  luggage?: PlayerCard;
  biology?: PlayerCard;
  bunker?: PlayerCard;
  health?: PlayerCard;
  special?: PlayerCard;
  profession?: PlayerCard;
  menace?: PlayerCard;
  facts?: PlayerCard;
  hobby?: PlayerCard;
}

export interface GameCommonCards {
  disaster?: PlayerCard;
}

// Функция для получения случайной карточки из категории
export const getRandomCardFromCategory = (categoryId: string, usedCards: number[] = []): PlayerCard => {
  const category = GAME_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) throw new Error(`Category ${categoryId} not found`);
  
  // Получаем доступные номера карточек (исключая уже использованные)
  const availableNumbers = Array.from({ length: category.cardCount }, (_, i) => i + 1)
    .filter(num => !usedCards.includes(num));
  
  if (availableNumbers.length === 0) {
    // Если все карточки использованы, берем любую случайную
    const randomNumber = Math.floor(Math.random() * category.cardCount) + 1;
    return {
      categoryId,
      imageNumber: randomNumber,
      imagePath: `/assests/${category.folderName}/${randomNumber}.jpg`
    };
  }
  
  const randomNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
  return {
    categoryId,
    imageNumber: randomNumber,
    imagePath: `/assests/${category.folderName}/${randomNumber}.jpg`
  };
};

// Генерация общих карточек игры (катастрофа одна для всех)
export const generateGameCommonCards = (): GameCommonCards => {
  return {
    disaster: getRandomCardFromCategory('disaster')
  };
};

// Генерация индивидуальных характеристик игрока (без катастрофы)
export const generatePlayerCharacteristics = (gameUsedCards: Record<string, number[]> = {}): PlayerCharacteristics => {
  const characteristics: PlayerCharacteristics = {};
  
  GAME_CATEGORIES.forEach(category => {
    // Катастрофа - общая для всех, не генерируем индивидуально
    if (category.id === 'disaster') return;
    
    const usedInCategory = gameUsedCards[category.id] || [];
    const card = getRandomCardFromCategory(category.id, usedInCategory);
    characteristics[category.id as keyof PlayerCharacteristics] = card;
  });
  
  return characteristics;
};

// Для отображения карточек игрока (с общими карточками игры)
export const getPlayerCards = (characteristics: PlayerCharacteristics, commonCards?: GameCommonCards, currentRevealCard?: string) => {
  return GAME_CATEGORIES.map(category => ({
    ...category,
    card: category.id === 'disaster' 
      ? (commonCards?.disaster || null)
      : (characteristics[category.id as keyof PlayerCharacteristics] || null),
    isRevealed: true, // Пока что показываем все карточки открытыми
    isCurrentReveal: category.id === currentRevealCard // Отмечаем текущую открываемую карточку
  }));
};

// Получить случайную категорию для открытия (кроме катастрофы и уже открытых)
export const getRandomRevealCategory = (revealedCards: string[] = []): string | null => {
  const availableCategories = GAME_CATEGORIES
    .filter(cat => cat.id !== 'disaster' && !revealedCards.includes(cat.id))
    .map(cat => cat.id);
  
  if (availableCategories.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableCategories.length);
  return availableCategories[randomIndex];
};

// Получить название категории по ID
export const getCategoryNameById = (categoryId: string): string => {
  const category = GAME_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.nameRu || 'Неизвестная категория';
}; 
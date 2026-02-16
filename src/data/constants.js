// App color palette
export const COLORS = {
  acid: '#BDFF00',
  brandGreen: '#208C80',
  black: '#000000',
  white: '#FFFFFF',
  grayBg: '#F5F5F5',
  border: '#EEEEEE',
  error: '#FF5459',
};

// Store locations - Магнит stores within MKAD (Moscow)
export const STORES = [
  // Центральный округ - точные координаты по адресам
  { id: 's1', name: 'Магнит', address: 'Комсомольский пр-т, 36', lat: 55.7261, lng: 37.5721 },
  { id: 's2', name: 'Магнит', address: 'ул. Усачёва, 15', lat: 55.7268, lng: 37.5683 },
  { id: 's3', name: 'Магнит', address: 'ул. Ефремова, 12', lat: 55.7202, lng: 37.5779 },
  { id: 's4', name: 'Магнит', address: 'ул. Арбат, 54', lat: 55.7469, lng: 37.5819 },
  { id: 's5', name: 'Магнит', address: 'ул. Тверская, 22', lat: 55.7667, lng: 37.6019 },
  { id: 's6', name: 'Магнит', address: 'Цветной бульвар, 15', lat: 55.7695, lng: 37.6209 },
  { id: 's7', name: 'Магнит', address: 'ул. Мясницкая, 30', lat: 55.7629, lng: 37.6331 },
  { id: 's8', name: 'Магнит', address: 'ул. Покровка, 18', lat: 55.7594, lng: 37.6407 },
  
  // Северный округ  
  { id: 's9', name: 'Магнит', address: 'Дмитровское ш., 13', lat: 55.8012, lng: 37.5787 },
  { id: 's10', name: 'Магнит', address: 'ул. Дубнинская, 16', lat: 55.8632, lng: 37.5379 },
  { id: 's11', name: 'Магнит', address: 'Алтуфьевское ш., 48', lat: 55.8489, lng: 37.5882 },
  { id: 's12', name: 'Магнит', address: 'ул. Лескова, 14', lat: 55.8891, lng: 37.5718 },
  { id: 's13', name: 'Магнит', address: 'Бескудниковский бульвар, 32', lat: 55.8663, lng: 37.5512 },
  { id: 's14', name: 'Магнит', address: 'ул. Ангарская, 22', lat: 55.8671, lng: 37.5169 },
  { id: 's15', name: 'Магнит', address: 'Коровинское ш., 35', lat: 55.8724, lng: 37.5289 },
  
  // Северо-Восточный округ
  { id: 's16', name: 'Магнит', address: 'пр-т Мира, 118', lat: 55.8119, lng: 37.6371 },
  { id: 's17', name: 'Магнит', address: 'ул. Бажова, 17', lat: 55.8265, lng: 37.6482 },
  { id: 's18', name: 'Магнит', address: 'ул. Космонавтов, 8', lat: 55.8208, lng: 37.6419 },
  { id: 's19', name: 'Магнит', address: 'Ярославское ш., 124', lat: 55.8587, lng: 37.6798 },
  { id: 's20', name: 'Магнит', address: 'ул. Декабристов, 22', lat: 55.8317, lng: 37.6615 },
  { id: 's21', name: 'Магнит', address: 'Северянинский пр-д, 16', lat: 55.8432, lng: 37.6509 },
  { id: 's22', name: 'Магнит', address: 'Енисейская ул., 36', lat: 55.8512, lng: 37.6745 },
  
  // Восточный округ
  { id: 's23', name: 'Магнит', address: 'Щёлковское ш., 75', lat: 55.8024, lng: 37.7685 },
  { id: 's24', name: 'Магнит', address: 'ул. Первомайская, 42', lat: 55.7912, lng: 37.7919 },
  { id: 's25', name: 'Магнит', address: '9-я Парковая ул., 61', lat: 55.8021, lng: 37.8067 },
  { id: 's26', name: 'Магнит', address: 'ул. Сталеваров, 14', lat: 55.7461, lng: 37.7912 },
  { id: 's27', name: 'Магнит', address: 'Зелёный пр-т, 83', lat: 55.7546, lng: 37.8165 },
  { id: 's28', name: 'Магнит', address: 'ш. Энтузиастов, 98', lat: 55.7521, lng: 37.7897 },
  { id: 's29', name: 'Магнит', address: 'ул. Металлургов, 56', lat: 55.7412, lng: 37.7589 },
  { id: 's30', name: 'Магнит', address: 'Измайловский пр-т, 37', lat: 55.7821, lng: 37.7612 },
  
  // Юго-Восточный округ
  { id: 's31', name: 'Магнит', address: 'Волгоградский пр-т, 32', lat: 55.7215, lng: 37.6912 },
  { id: 's32', name: 'Магнит', address: 'ул. Люблинская, 169', lat: 55.6679, lng: 37.7612 },
  { id: 's33', name: 'Магнит', address: 'ул. Авиаторов, 8', lat: 55.6521, lng: 37.7387 },
  { id: 's34', name: 'Магнит', address: 'Рязанский пр-т, 86', lat: 55.7165, lng: 37.7756 },
  { id: 's35', name: 'Магнит', address: 'ул. Ташкентская, 24', lat: 55.6898, lng: 37.7412 },
  { id: 's36', name: 'Магнит', address: 'Марьинский бульвар, 15', lat: 55.6514, lng: 37.7487 },
  { id: 's37', name: 'Магнит', address: 'Братиславская ул., 27', lat: 55.6587, lng: 37.7601 },
  { id: 's38', name: 'Магнит', address: 'ул. Маршала Голованова, 12', lat: 55.6412, lng: 37.7289 },
  
  // Южный округ
  { id: 's39', name: 'Магнит', address: 'Каширское ш., 61', lat: 55.6582, lng: 37.6289 },
  { id: 's40', name: 'Магнит', address: 'Варшавское ш., 152', lat: 55.6198, lng: 37.6178 },
  { id: 's41', name: 'Магнит', address: 'ул. Чертановская, 48', lat: 55.6276, lng: 37.6065 },
  { id: 's42', name: 'Магнит', address: 'Балаклавский пр-т, 5', lat: 55.6365, lng: 37.5912 },
  { id: 's43', name: 'Магнит', address: 'ул. Кировоградская, 22', lat: 55.6087, lng: 37.6189 },
  { id: 's44', name: 'Магнит', address: 'Симферопольский пр-д, 18', lat: 55.6245, lng: 37.6098 },
  { id: 's45', name: 'Магнит', address: 'Нахимовский пр-т, 73', lat: 55.6598, lng: 37.5812 },
  { id: 's46', name: 'Магнит', address: 'ул. Генерала Антонова, 9', lat: 55.6067, lng: 37.5598 },
  
  // Юго-Западный округ
  { id: 's47', name: 'Магнит', address: 'Ленинский пр-т, 123', lat: 55.6712, lng: 37.5178 },
  { id: 's48', name: 'Магнит', address: 'пр-т Вернадского, 86', lat: 55.6598, lng: 37.5067 },
  { id: 's49', name: 'Магнит', address: 'ул. Профсоюзная, 144', lat: 55.6287, lng: 37.5412 },
  { id: 's50', name: 'Магнит', address: 'ул. Островитянова, 30', lat: 55.6198, lng: 37.5234 },
  { id: 's51', name: 'Магнит', address: 'ул. Миклухо-Маклая, 55', lat: 55.6512, lng: 37.4898 },
  { id: 's52', name: 'Магнит', address: 'ул. Обручева, 35', lat: 55.6598, lng: 37.5389 },
  { id: 's53', name: 'Магнит', address: 'Новоясеневский пр-т, 12', lat: 55.6087, lng: 37.5312 },
  { id: 's54', name: 'Магнит', address: 'ул. Академика Варги, 8', lat: 55.6156, lng: 37.4998 },
  
  // Западный округ
  { id: 's55', name: 'Магнит', address: 'Кутузовский пр-т, 71', lat: 55.7289, lng: 37.4698 },
  { id: 's56', name: 'Магнит', address: 'ул. Мосфильмовская, 42', lat: 55.7098, lng: 37.5098 },
  { id: 's57', name: 'Магнит', address: 'пр-т Вернадского, 29', lat: 55.6945, lng: 37.5189 },
  { id: 's58', name: 'Магнит', address: 'Аминьевское ш., 36', lat: 55.7012, lng: 37.4567 },
  { id: 's59', name: 'Магнит', address: 'ул. Лобачевского, 100', lat: 55.6845, lng: 37.4789 },
  { id: 's60', name: 'Магнит', address: 'Можайское ш., 29', lat: 55.7178, lng: 37.4398 },
  { id: 's61', name: 'Магнит', address: 'ул. Рябиновая, 18', lat: 55.7087, lng: 37.4312 },
  { id: 's62', name: 'Магнит', address: 'Рублёвское ш., 48', lat: 55.7312, lng: 37.4087 },
  
  // Северо-Западный округ
  { id: 's63', name: 'Магнит', address: 'Ленинградский пр-т, 76', lat: 55.7945, lng: 37.5189 },
  { id: 's64', name: 'Магнит', address: 'ул. Народного Ополчения, 44', lat: 55.7812, lng: 37.4798 },
  { id: 's65', name: 'Магнит', address: 'ул. Тухачевского, 32', lat: 55.7923, lng: 37.4598 },
  { id: 's66', name: 'Магнит', address: 'Волоколамское ш., 116', lat: 55.8198, lng: 37.4389 },
  { id: 's67', name: 'Магнит', address: 'Пятницкое ш., 21', lat: 55.8287, lng: 37.4187 },
  { id: 's68', name: 'Магнит', address: 'бульвар Яна Райниса, 12', lat: 55.8498, lng: 37.4389 },
  { id: 's69', name: 'Магнит', address: 'Сходненская ул., 56', lat: 55.8534, lng: 37.4512 },
  { id: 's70', name: 'Магнит', address: 'ул. Свободы, 75', lat: 55.8389, lng: 37.4489 },
  
  // Дополнительные точки по Москве (центр)
  { id: 's71', name: 'Магнит', address: 'ул. Таганская, 15', lat: 55.7412, lng: 37.6567 },
  { id: 's72', name: 'Магнит', address: 'Нижегородская ул., 70', lat: 55.7298, lng: 37.6812 },
  { id: 's73', name: 'Магнит', address: 'Бауманская ул., 33', lat: 55.7712, lng: 37.6712 },
  { id: 's74', name: 'Магнит', address: 'ул. Новослободская, 62', lat: 55.7798, lng: 37.5912 },
  { id: 's75', name: 'Магнит', address: 'ул. Сущёвский Вал, 14', lat: 55.7845, lng: 37.6098 },
  { id: 's76', name: 'Магнит', address: 'ул. Большая Якиманка, 24', lat: 55.7312, lng: 37.6089 },
  { id: 's77', name: 'Магнит', address: 'ул. Пятницкая, 54', lat: 55.7298, lng: 37.6267 },
  { id: 's78', name: 'Магнит', address: 'Садовническая ул., 82', lat: 55.7378, lng: 37.6378 },
  { id: 's79', name: 'Магнит', address: 'ул. Малая Бронная, 22', lat: 55.7612, lng: 37.5989 },
  { id: 's80', name: 'Магнит', address: 'ул. Большая Полянка, 30', lat: 55.7345, lng: 37.6178 },
];

// Product categories
export const CATEGORIES = ['Все', 'Мясо', 'Молоко', 'Выпечка', 'Рыба', 'Фрукты', 'Напитки'];

// Onboarding slides
export const ONBOARDING_DATA = [
  {
    title: 'Свежесть с выгодой до 50%',
    description: 'Robin Food находит лучшие цены на продукты с оптимальным сроком годности в магазинах рядом с вами.',
    image: '/onboarding/slide1.png',
  },
  {
    title: 'Твой личный фуд-радар',
    description: 'Настрой радиус поиска и выбирай любые категории. Мы сообщим, когда в ближайшем «Магните» появятся лучшие предложения. Фоновой поиск до 10 км.',
    image: '/onboarding/slide2.png',
  },
  {
    title: 'Закажи и забери',
    description: 'Оплати в приложении, а наш сборщик бережно подготовит твой заказ к выдаче. Никаких очередей.',
    image: '/onboarding/slide3.png',
  },
  {
    title: 'Спасай еду красиво',
    description: 'Вместе мы снижаем объём пищевых отходов и делаем потребление осознанным. Начнём?',
    image: '/onboarding/slide4.png',
    isLast: true,
  },
];

// Map center coordinates (Moscow)
export const MAP_CENTER = {
  lat: 55.7208,
  lng: 37.5804,
};

// Default user data
export const DEFAULT_USER = {
  firstName: 'Иван',
  lastName: 'Петров',
  phone: '+7 985 123-45-67',
  email: 'ivan@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300',
  bonuses: 250,
  spent: 5847,
  ordersCount: 15,
  savedFoodKg: 12.4,
  ecoRank: 'Лесной Страж',
  addressesCount: 3,
  paymentMethodsCount: 2,
  preferences: {
    theme: 'light',
    language: 'ru',
    notificationsEnabled: true,
  },
};

// Navigation tabs
export const NAV_TABS = [
  { id: 'catalog', label: 'Лоты' },
  { id: 'map', label: 'Радар' },
  { id: 'cart', label: 'Корзина' },
  { id: 'profile', label: 'Профиль' },
];

// View states
export const VIEWS = {
  SPLASH: 'splash',
  ONBOARD: 'onboard',
  LOGIN: 'login',
  SMS: 'sms',
  CARD_BIND: 'card_bind',
  HUB: 'hub',
  SUCCESS: 'success',
};

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

// Store locations — Магнит, Пятёрочка, ВкусВилл within MKAD (Moscow)
export const STORES = [
  // ── Магнит ──
  { id: 's1', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Комсомольский пр-т, 36', lat: 55.7261, lng: 37.5721 },
  { id: 's2', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Усачёва, 15', lat: 55.7268, lng: 37.5683 },
  { id: 's3', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Ефремова, 12', lat: 55.7202, lng: 37.5779 },
  { id: 's4', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Арбат, 54', lat: 55.7469, lng: 37.5819 },
  { id: 's5', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Тверская, 22', lat: 55.7667, lng: 37.6019 },
  { id: 's6', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Цветной бульвар, 15', lat: 55.7695, lng: 37.6209 },
  { id: 's7', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Мясницкая, 30', lat: 55.7629, lng: 37.6331 },
  { id: 's8', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Покровка, 18', lat: 55.7594, lng: 37.6407 },
  { id: 's9', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Дмитровское ш., 13', lat: 55.8012, lng: 37.5787 },
  { id: 's10', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Дубнинская, 16', lat: 55.8632, lng: 37.5379 },
  { id: 's11', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Алтуфьевское ш., 48', lat: 55.8489, lng: 37.5882 },
  { id: 's12', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Лескова, 14', lat: 55.8891, lng: 37.5718 },
  { id: 's13', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Бескудниковский бульвар, 32', lat: 55.8663, lng: 37.5512 },
  { id: 's14', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Ангарская, 22', lat: 55.8671, lng: 37.5169 },
  { id: 's15', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Коровинское ш., 35', lat: 55.8724, lng: 37.5289 },
  { id: 's16', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'пр-т Мира, 118', lat: 55.8119, lng: 37.6371 },
  { id: 's17', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Бажова, 17', lat: 55.8265, lng: 37.6482 },
  { id: 's18', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Космонавтов, 8', lat: 55.8208, lng: 37.6419 },
  { id: 's19', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Ярославское ш., 124', lat: 55.8587, lng: 37.6798 },
  { id: 's20', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Декабристов, 22', lat: 55.8317, lng: 37.6615 },
  { id: 's21', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Волгоградский пр-т, 32', lat: 55.7215, lng: 37.6912 },
  { id: 's22', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Рязанский пр-т, 86', lat: 55.7165, lng: 37.7756 },
  { id: 's23', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Каширское ш., 61', lat: 55.6582, lng: 37.6289 },
  { id: 's24', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Варшавское ш., 152', lat: 55.6198, lng: 37.6178 },
  { id: 's25', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Чертановская, 48', lat: 55.6276, lng: 37.6065 },
  { id: 's26', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Ленинский пр-т, 123', lat: 55.6712, lng: 37.5178 },
  { id: 's27', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'пр-т Вернадского, 86', lat: 55.6598, lng: 37.5067 },
  { id: 's28', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Кутузовский пр-т, 71', lat: 55.7289, lng: 37.4698 },
  { id: 's29', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Мосфильмовская, 42', lat: 55.7098, lng: 37.5098 },
  { id: 's30', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Ленинградский пр-т, 76', lat: 55.7945, lng: 37.5189 },
  { id: 's31', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Таганская, 15', lat: 55.7412, lng: 37.6567 },
  { id: 's32', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'Бауманская ул., 33', lat: 55.7712, lng: 37.6712 },
  { id: 's33', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Новослободская, 62', lat: 55.7798, lng: 37.5912 },
  { id: 's34', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Большая Якиманка, 24', lat: 55.7312, lng: 37.6089 },
  { id: 's35', name: 'Магнит', chain: 'magnit', icon: '/chains/magnit.png', address: 'ул. Большая Полянка, 30', lat: 55.7345, lng: 37.6178 },

  // ── Пятёрочка ──
  { id: 'p1', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Льва Толстого, 16', lat: 55.7335, lng: 37.5876 },
  { id: 'p2', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Фрунзенская, 3', lat: 55.7254, lng: 37.5762 },
  { id: 'p3', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Плющиха, 22', lat: 55.7391, lng: 37.5756 },
  { id: 'p4', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Остоженка, 36', lat: 55.7378, lng: 37.5981 },
  { id: 'p5', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Смоленская пл., 6', lat: 55.7487, lng: 37.5812 },
  { id: 'p6', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Новый Арбат, 11', lat: 55.7521, lng: 37.5876 },
  { id: 'p7', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Красная Пресня, 24', lat: 55.7612, lng: 37.5712 },
  { id: 'p8', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. 1905 года, 7', lat: 55.7654, lng: 37.5612 },
  { id: 'p9', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Ленинградский пр-т, 33', lat: 55.7834, lng: 37.5523 },
  { id: 'p10', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Бутырская, 86', lat: 55.8067, lng: 37.5812 },
  { id: 'p11', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'пр-т Мира, 68', lat: 55.7934, lng: 37.6298 },
  { id: 'p12', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Сретенка, 27', lat: 55.7712, lng: 37.6312 },
  { id: 'p13', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Маросейка, 9', lat: 55.7576, lng: 37.6367 },
  { id: 'p14', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Земляной Вал, 41', lat: 55.7512, lng: 37.6512 },
  { id: 'p15', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Нижегородская ул., 34', lat: 55.7387, lng: 37.6678 },
  { id: 'p16', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Щёлковское ш., 19', lat: 55.7945, lng: 37.7245 },
  { id: 'p17', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Первомайская, 110', lat: 55.7987, lng: 37.8012 },
  { id: 'p18', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Люблинская ул., 72', lat: 55.6845, lng: 37.7434 },
  { id: 'p19', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Варшавское ш., 68', lat: 55.6534, lng: 37.6198 },
  { id: 'p20', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Профсоюзная, 56', lat: 55.6612, lng: 37.5534 },
  { id: 'p21', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Ломоносовский пр-т, 18', lat: 55.6912, lng: 37.5312 },
  { id: 'p22', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'пр-т Вернадского, 41', lat: 55.6876, lng: 37.5098 },
  { id: 'p23', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Народного Ополчения, 22', lat: 55.7756, lng: 37.4845 },
  { id: 'p24', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Хорошёвское ш., 62', lat: 55.7834, lng: 37.4978 },
  { id: 'p25', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Алтуфьевское ш., 20', lat: 55.8345, lng: 37.5812 },
  { id: 'p26', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Дмитровская, 9', lat: 55.7912, lng: 37.5856 },
  { id: 'p27', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Балаклавский пр-т, 18', lat: 55.6312, lng: 37.5978 },
  { id: 'p28', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Измайловское ш., 71', lat: 55.7876, lng: 37.7534 },
  { id: 'p29', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'ул. Миклухо-Маклая, 36', lat: 55.6534, lng: 37.4956 },
  { id: 'p30', name: 'Пятёрочка', chain: 'pyaterochka', icon: '/chains/pyaterochka.png', address: 'Рублёвское ш., 18', lat: 55.7256, lng: 37.4312 },

  // ── ВкусВилл ──
  { id: 'v1', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Комсомольский пр-т, 28', lat: 55.7278, lng: 37.5756 },
  { id: 'v2', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Большая Пироговская, 11', lat: 55.7312, lng: 37.5667 },
  { id: 'v3', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Арбат, 20', lat: 55.7498, lng: 37.5912 },
  { id: 'v4', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Тверская ул., 9', lat: 55.7612, lng: 37.6098 },
  { id: 'v5', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Покровка, 33', lat: 55.7567, lng: 37.6445 },
  { id: 'v6', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Мясницкая ул., 15', lat: 55.7612, lng: 37.6312 },
  { id: 'v7', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'пр-т Мира, 45', lat: 55.7812, lng: 37.6267 },
  { id: 'v8', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Новослободская, 18', lat: 55.7756, lng: 37.5945 },
  { id: 'v9', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Ленинский пр-т, 38', lat: 55.7098, lng: 37.5823 },
  { id: 'v10', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Профсоюзная, 7', lat: 55.6934, lng: 37.5689 },
  { id: 'v11', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'пр-т Вернадского, 15', lat: 55.6978, lng: 37.5212 },
  { id: 'v12', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Кутузовский пр-т, 22', lat: 55.7412, lng: 37.5489 },
  { id: 'v13', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Красная Пресня, 11', lat: 55.7589, lng: 37.5645 },
  { id: 'v14', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Щёлковское ш., 9', lat: 55.7889, lng: 37.7134 },
  { id: 'v15', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Бутырская, 46', lat: 55.7978, lng: 37.5878 },
  { id: 'v16', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Варшавское ш., 42', lat: 55.6678, lng: 37.6212 },
  { id: 'v17', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Алтуфьевское ш., 12', lat: 55.8234, lng: 37.5878 },
  { id: 'v18', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Балаклавский пр-т, 8', lat: 55.6345, lng: 37.5945 },
  { id: 'v19', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'ул. Таганская, 31', lat: 55.7434, lng: 37.6534 },
  { id: 'v20', name: 'ВкусВилл', chain: 'vkusvill', icon: '/chains/vkusvill.png', address: 'Нахимовский пр-т, 24', lat: 55.6612, lng: 37.5712 },
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

// Navigation tabs (5 tabs)
export const NAV_TABS = [
  { id: 'home', label: 'Каталог' },
  { id: 'categories', label: 'Разделы' },
  { id: 'cart', label: 'Корзина' },
  { id: 'favorites', label: 'Избранное' },
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

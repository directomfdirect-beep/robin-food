/**
 * Hierarchical category data for the Pyaterochka-style category browser.
 * Each section has subcategories that map to product categories from MASTER_CATALOG.
 * Uses emoji for transparent-background product visuals.
 */

export const CATEGORY_SECTIONS = [
  {
    id: 'ready-food',
    name: 'Готовая еда',
    subcategories: [
      { id: 'combo', name: 'Комбо', bgColor: '#FFE8D6', emoji: '🍱', productCategory: 'Выпечка' },
      { id: 'breakfasts', name: 'Завтраки', bgColor: '#FFF3E0', emoji: '🍳', productCategory: 'Выпечка' },
      { id: 'snacks-drinks', name: 'Перекусы и напитки', bgColor: '#FFE0B2', emoji: '🥤', productCategory: 'Напитки' },
      { id: 'salads', name: 'Салаты и закуски', bgColor: '#E8F5E9', emoji: '🥗', productCategory: 'Выпечка' },
      { id: 'main-dishes', name: 'Основные блюда', bgColor: '#FFE8D6', emoji: '🍲', productCategory: 'Мясо' },
      { id: 'sushi', name: 'Суши и роллы', bgColor: '#FFF3E0', emoji: '🍣', productCategory: 'Рыба' },
    ],
  },
  {
    id: 'vegetables-fruits',
    name: 'Овощи, фрукты, орехи',
    subcategories: [
      { id: 'season', name: 'Самый сезон', bgColor: '#E8F5E9', emoji: '🥝', productCategory: 'Фрукты' },
      { id: 'vegetables', name: 'Овощи, зелень, грибы', bgColor: '#F1F8E9', emoji: '🥦', productCategory: 'Фрукты' },
      { id: 'fruits-berries', name: 'Фрукты, ягоды', bgColor: '#FFF9C4', emoji: '🍊', productCategory: 'Фрукты' },
      { id: 'nuts-dried', name: 'Орехи, сухофрукты', bgColor: '#EFEBE9', emoji: '🥜', productCategory: 'Фрукты' },
    ],
  },
  {
    id: 'dairy',
    name: 'Молочная продукция и яйцо',
    subcategories: [
      { id: 'milk-cream', name: 'Молоко, сметана', bgColor: '#E3F2FD', emoji: '🥛', productCategory: 'Молоко' },
      { id: 'kefir-tvorog', name: 'Кефир, творог', bgColor: '#E8EAF6', emoji: '🫙', productCategory: 'Молоко' },
      { id: 'cheese', name: 'Сыр', bgColor: '#FFF9C4', emoji: '🧀', productCategory: 'Молоко' },
      { id: 'eggs-butter', name: 'Яйцо, масло', bgColor: '#FFF3E0', emoji: '🥚', productCategory: 'Молоко' },
      { id: 'mayo', name: 'Майонез', bgColor: '#FFFDE7', emoji: '🫗', productCategory: 'Молоко' },
      { id: 'yogurt-desserts', name: 'Йогурты, десерты', bgColor: '#FCE4EC', emoji: '🍨', productCategory: 'Молоко' },
    ],
  },
  {
    id: 'meat',
    name: 'Мясо, птица, колбасы',
    subcategories: [
      { id: 'meat-raw', name: 'Мясо', bgColor: '#FFEBEE', emoji: '🥩', productCategory: 'Мясо' },
      { id: 'poultry', name: 'Птица', bgColor: '#FFF3E0', emoji: '🍗', productCategory: 'Мясо' },
      { id: 'cutlets-mince', name: 'Котлеты, фарш', bgColor: '#FFE0B2', emoji: '🫓', productCategory: 'Мясо' },
      { id: 'sausages', name: 'Колбаса, сосиски', bgColor: '#FFCCBC', emoji: '🌭', productCategory: 'Мясо' },
      { id: 'pates', name: 'Паштеты, закуски', bgColor: '#FFE0E0', emoji: '🥓', productCategory: 'Мясо' },
    ],
  },
  {
    id: 'fish',
    name: 'Рыба и морепродукты',
    subcategories: [
      { id: 'fish-raw', name: 'Рыба', bgColor: '#E0F0FF', emoji: '🐟', productCategory: 'Рыба' },
      { id: 'seafood', name: 'Морепродукты', bgColor: '#E8F5E9', emoji: '🦐', productCategory: 'Рыба' },
      { id: 'fish-cutlets', name: 'Котлеты, фарш', bgColor: '#E3F2FD', emoji: '🐠', productCategory: 'Рыба' },
      { id: 'caviar', name: 'Икра, закуски', bgColor: '#FCE4EC', emoji: '🫙', productCategory: 'Рыба' },
    ],
  },
  {
    id: 'bakery',
    name: 'Хлеб и выпечка',
    subcategories: [
      { id: 'fresh-baked', name: 'Испекли для вас', bgColor: '#FFF3E0', emoji: '🥐', productCategory: 'Выпечка' },
      { id: 'bread', name: 'Хлеб, лаваш', bgColor: '#EFEBE9', emoji: '🍞', productCategory: 'Выпечка' },
      { id: 'sweet-pastry', name: 'Сдоба, выпечка', bgColor: '#FFE0B2', emoji: '🧁', productCategory: 'Выпечка' },
      { id: 'crackers', name: 'Хлебцы, сухари', bgColor: '#FFF8E1', emoji: '🥖', productCategory: 'Выпечка' },
    ],
  },
  {
    id: 'sweets',
    name: 'Сладости',
    subcategories: [
      { id: 'chocolate', name: 'Шоколад, конфеты', bgColor: '#EFEBE9', emoji: '🍫', productCategory: 'Выпечка' },
      { id: 'cookies', name: 'Печенье, вафли', bgColor: '#FFF3E0', emoji: '🍪', productCategory: 'Выпечка' },
      { id: 'marshmallow', name: 'Зефир, мармелад', bgColor: '#FCE4EC', emoji: '🍬', productCategory: 'Выпечка' },
      { id: 'cakes', name: 'Торты, пирожные', bgColor: '#F3E5F5', emoji: '🎂', productCategory: 'Выпечка' },
      { id: 'ice-cream', name: 'Мороженое', bgColor: '#E8EAF6', emoji: '🍦', productCategory: 'Молоко' },
      { id: 'candy', name: 'Жвачка, леденцы', bgColor: '#FFF9C4', emoji: '🍭', productCategory: 'Выпечка' },
    ],
  },
  {
    id: 'snacks',
    name: 'Снеки и чипсы',
    subcategories: [
      { id: 'chips', name: 'Чипсы, сухарики', bgColor: '#FFF8E1', emoji: '🥔', productCategory: 'Выпечка' },
      { id: 'sticks', name: 'Соломка, крекеры', bgColor: '#FFF3E0', emoji: '🥨', productCategory: 'Выпечка' },
      { id: 'meat-snacks', name: 'Мясные снеки', bgColor: '#FFEBEE', emoji: '🥓', productCategory: 'Мясо' },
      { id: 'fish-snacks', name: 'Рыбные снеки', bgColor: '#E0F0FF', emoji: '🐡', productCategory: 'Рыба' },
      { id: 'corn-snacks', name: 'Кукурузные снеки', bgColor: '#FFFDE7', emoji: '🌽', productCategory: 'Выпечка' },
      { id: 'nuts-seeds', name: 'Орехи, семечки', bgColor: '#EFEBE9', emoji: '🌰', productCategory: 'Фрукты' },
    ],
  },
  {
    id: 'grocery',
    name: 'Бакалея',
    subcategories: [
      { id: 'pasta', name: 'Макароны, крупы', bgColor: '#FFF3E0', emoji: '🍝', productCategory: 'Выпечка' },
      { id: 'cereals', name: 'Завтраки, каши', bgColor: '#FFF8E1', emoji: '🥣', productCategory: 'Выпечка' },
      { id: 'tea-coffee', name: 'Чай, кофе, какао', bgColor: '#EFEBE9', emoji: '☕', productCategory: 'Напитки' },
      { id: 'sugar-spices', name: 'Сахар, соль, специи', bgColor: '#FFF9C4', emoji: '🧂', productCategory: 'Выпечка' },
      { id: 'oil-vinegar', name: 'Масло, уксус', bgColor: '#F1F8E9', emoji: '🫒', productCategory: 'Молоко' },
      { id: 'mayo-sauces', name: 'Майонез, соусы', bgColor: '#FFCCBC', emoji: '🥫', productCategory: 'Молоко' },
    ],
  },
  {
    id: 'drinks',
    name: 'Напитки',
    subcategories: [
      { id: 'water', name: 'Вода', bgColor: '#E0F7FA', emoji: '💧', productCategory: 'Напитки' },
      { id: 'juice', name: 'Соки, нектары', bgColor: '#FFF9C4', emoji: '🧃', productCategory: 'Напитки' },
      { id: 'soda', name: 'Газировка, лимонады', bgColor: '#E8F5E9', emoji: '🥤', productCategory: 'Напитки' },
      { id: 'energy', name: 'Энергетики', bgColor: '#E3F2FD', emoji: '⚡', productCategory: 'Напитки' },
      { id: 'kvass-kompot', name: 'Квас, морс', bgColor: '#FFE0B2', emoji: '🍺', productCategory: 'Напитки' },
    ],
  },
];

# 🦊 Robin Food

Мобильное приложение для покупки продуктов с истекающим сроком годности со скидками до 70%.

![Robin Food](https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=800)

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build
```

## 📁 Структура проекта

```
robin-food/
├── src/
│   ├── components/
│   │   ├── ui/              # UI примитивы
│   │   │   ├── Button.jsx   # Кнопки
│   │   │   ├── Input.jsx    # Поля ввода
│   │   │   └── Badge.jsx    # Бейджи
│   │   ├── layout/          # Layout
│   │   │   ├── Header.jsx   # Хедер
│   │   │   └── BottomNav.jsx # Нижняя навигация
│   │   ├── screens/         # Экраны
│   │   │   ├── SplashScreen.jsx
│   │   │   ├── OnboardingScreen.jsx
│   │   │   ├── LoginScreen.jsx
│   │   │   ├── SmsScreen.jsx
│   │   │   ├── SuccessScreen.jsx
│   │   │   ├── CatalogTab.jsx
│   │   │   ├── MapTab.jsx
│   │   │   ├── CartTab.jsx
│   │   │   └── ProfileTab.jsx
│   │   ├── modals/          # Модалки
│   │   │   └── ProductModal.jsx
│   │   └── overlays/        # Оверлеи
│   │       └── OverlayScreens.jsx
│   ├── hooks/               # React Hooks
│   │   ├── useCart.js       # Управление корзиной
│   │   ├── useFavorites.js  # Избранное
│   │   └── useMap.js        # Leaflet карта
│   ├── utils/               # Утилиты
│   │   ├── price.js         # Расчет цен
│   │   └── phone.js         # Форматирование телефона
│   ├── data/                # Данные
│   │   ├── constants.js     # Константы
│   │   └── catalog.js       # Каталог товаров
│   ├── styles/
│   │   └── index.css        # Глобальные стили
│   ├── App.jsx              # Главный компонент
│   └── main.jsx             # Entry point
├── .cursorrules             # Правила для Cursor AI
├── jsconfig.json            # Path aliases
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🎨 Дизайн-система

### Цвета

| Название | HEX | Использование |
|----------|-----|---------------|
| Acid | `#BDFF00` | Акцент, кнопки |
| Brand Green | `#208C80` | Бренд, цены со скидкой |
| Error | `#FF5459` | Ошибки, избранное |
| Gray BG | `#F5F5F5` | Фоны |

### Типографика

- **Заголовки**: `font-black uppercase italic`
- **Подписи**: `text-[10px] font-bold uppercase tracking-widest`
- **Цены**: `font-black italic`

### Радиусы

- Карточки продуктов: `rounded-[36px]`
- Кнопки: `rounded-2xl` / `rounded-3xl`
- Модалки: `rounded-t-[50px]`

## 🪝 Хуки

### useCart

```jsx
const {
  items,           // Товары в корзине
  stats,           // { count, totalQuantity, totalPrice }
  addItem,         // (product, qty) => void
  removeItem,      // (productId) => void
  incrementItem,   // (productId) => void
  decrementItem,   // (productId) => void
  clearCart,       // () => void
} = useCart();
```

### useFavorites

```jsx
const {
  favorites,        // [productId, ...]
  toggleFavorite,   // (productId) => void
  isFavorite,       // (productId) => boolean
  count,            // number
} = useFavorites([initialIds]);
```

### useMap

```jsx
const { mapRef } = useMap({
  enabled: true,    // Активировать карту
  radius: 1.5,      // Радиус в км
});
```

## 📱 Экраны приложения

1. **Splash** → Логотип при загрузке
2. **Onboarding** → 3 слайда знакомства
3. **Login** → Ввод телефона
4. **SMS** → Код подтверждения
5. **Hub** → Главный экран с табами:
   - Catalog — каталог товаров
   - Map — карта с магазинами
   - Cart — корзина
   - Profile — профиль
6. **Success** → Успешный заказ

## 🛠 Утилиты

### calculatePrices

```js
import { calculatePrices } from '@/utils/price';

const { unitPrice, totalPrice, discountPercent, bulkBonusPercent } = 
  calculatePrices(product, quantity);
```

### formatPhone

```js
import { formatPhone, isValidPhone } from '@/utils/phone';

formatPhone('+79851234567'); // '+7 (985) 123-45-67'
isValidPhone('+7 (985) 123-45-67'); // true
```

## 🔧 Path Aliases

```js
import { Button } from '@/components/ui';
import { useCart } from '@/hooks';
import { COLORS } from '@/data';
import { calculatePrices } from '@/utils';
```

## 📦 Зависимости

- **React** 18.2
- **Vite** 5.0
- **Tailwind CSS** 3.4
- **Lucide React** — иконки
- **Leaflet** — карты (загружается динамически)

## 📄 Лицензия

MIT

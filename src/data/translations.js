/**
 * Translations for Robin Food app
 * Languages: Russian (ru), English (en), Uzbek (uz)
 */

export const translations = {
  // App header
  appName: {
    ru: 'РОБИН ФУД',
    en: 'ROBIN FOOD',
    uz: 'ROBIN FOOD',
  },
  appSlogan: {
    ru: 'Бережное потребление',
    en: 'Conscious consumption',
    uz: 'Oqilona iste\'mol',
  },

  // Navigation
  nav: {
    radar: { ru: 'Радар', en: 'Radar', uz: 'Radar' },
    catalog: { ru: 'Каталог', en: 'Catalog', uz: 'Katalog' },
    cart: { ru: 'Корзина', en: 'Cart', uz: 'Savat' },
    profile: { ru: 'Профиль', en: 'Profile', uz: 'Profil' },
  },

  // Onboarding
  onboarding: {
    slide1Title: { ru: 'Выбирай продукты рядом', en: 'Choose products nearby', uz: 'Yaqin mahsulotlarni tanlang' },
    slide1Desc: { ru: 'Находи товары со скидкой до 70% в магазинах рядом с тобой', en: 'Find products with up to 70% discount in stores near you', uz: 'Yaqin do\'konlarda 70% gacha chegirma bilan mahsulotlarni toping' },
    slide2Title: { ru: 'Спасай еду от выбрасывания', en: 'Save food from waste', uz: 'Oziq-ovqatni isrofdan saqlang' },
    slide2Desc: { ru: 'Покупай продукты с коротким сроком годности и помогай планете', en: 'Buy products with short expiry dates and help the planet', uz: 'Yaroqlilik muddati qisqa mahsulotlarni sotib oling va sayyoramizga yordam bering' },
    slide3Title: { ru: 'Забирай заказ в магазине', en: 'Pick up at the store', uz: 'Do\'kondan oling' },
    slide3Desc: { ru: 'Оплачивай онлайн и забирай готовый заказ без очереди', en: 'Pay online and pick up your order without waiting in line', uz: 'Onlayn to\'lang va navbatsiz buyurtmangizni oling' },
    slide4Title: { ru: 'Получай награды за экологию', en: 'Earn eco rewards', uz: 'Ekologik mukofotlar oling' },
    slide4Desc: { ru: 'Копи эко-баллы и трать их на новые покупки', en: 'Collect eco-points and spend them on new purchases', uz: 'Eko-ballar yig\'ing va yangi xaridlarga sarflang' },
    skip: { ru: 'Пропустить', en: 'Skip', uz: 'O\'tkazib yuborish' },
    next: { ru: 'Далее', en: 'Next', uz: 'Keyingi' },
    startShopping: { ru: 'Начать покупки', en: 'Start shopping', uz: 'Xarid qilishni boshlash' },
  },

  // Auth
  auth: {
    enterPhone: { ru: 'Введите номер телефона', en: 'Enter phone number', uz: 'Telefon raqamini kiriting' },
    phoneHint: { ru: 'Мы отправим код подтверждения', en: 'We will send a verification code', uz: 'Tasdiqlash kodini yuboramiz' },
    getCode: { ru: 'Получить код', en: 'Get code', uz: 'Kodni olish' },
    enterCode: { ru: 'Введите код из SMS', en: 'Enter SMS code', uz: 'SMS kodini kiriting' },
    codeSentTo: { ru: 'Код отправлен на', en: 'Code sent to', uz: 'Kod yuborildi' },
    resendCode: { ru: 'Отправить повторно', en: 'Resend code', uz: 'Qayta yuborish' },
    resendIn: { ru: 'Повторно через', en: 'Resend in', uz: 'Qayta yuborish' },
    seconds: { ru: 'сек', en: 'sec', uz: 'sek' },
    verify: { ru: 'Подтвердить', en: 'Verify', uz: 'Tasdiqlash' },
  },

  // Card binding
  cardBinding: {
    title: { ru: 'Привязка карты', en: 'Add card', uz: 'Karta qo\'shish' },
    cardNumber: { ru: 'Номер карты', en: 'Card number', uz: 'Karta raqami' },
    expiry: { ru: 'Срок', en: 'Expiry', uz: 'Muddat' },
    cvc: { ru: 'CVC', en: 'CVC', uz: 'CVC' },
    saveCard: { ru: 'Сохранить карту для быстрой оплаты', en: 'Save card for quick payment', uz: 'Tez to\'lov uchun kartani saqlash' },
    bindCard: { ru: 'Привязать карту', en: 'Add card', uz: 'Kartani qo\'shish' },
    skip: { ru: 'Пропустить', en: 'Skip', uz: 'O\'tkazib yuborish' },
    skipConfirm: { ru: 'Вы уверены? Без карты оплата будет недоступна.', en: 'Are you sure? Payment will be unavailable without a card.', uz: 'Ishonchingiz komilmi? Kartasiz to\'lov imkonsiz bo\'ladi.' },
  },

  // Map/Radar
  radar: {
    interceptRadius: { ru: 'Радиус перехвата', en: 'Intercept radius', uz: 'Qidirish radiusi' },
    km: { ru: 'км', en: 'km', uz: 'km' },
    searchLots: { ru: 'Искать лоты', en: 'Search deals', uz: 'Takliflarni qidirish' },
    resetLocation: { ru: 'Сбросить локацию', en: 'Reset location', uz: 'Joylashuvni tiklash' },
    searchAddress: { ru: 'Поиск адреса...', en: 'Search address...', uz: 'Manzilni qidirish...' },
  },

  // Catalog
  catalog: {
    title: { ru: 'Каталог', en: 'Catalog', uz: 'Katalog' },
    all: { ru: 'Все', en: 'All', uz: 'Hammasi' },
    search: { ru: 'Поиск товаров...', en: 'Search products...', uz: 'Mahsulotlarni qidirish...' },
    noProducts: { ru: 'Товары не найдены', en: 'No products found', uz: 'Mahsulotlar topilmadi' },
    reviews: { ru: 'отзывов', en: 'reviews', uz: 'sharhlar' },
  },

  // Product
  product: {
    addToCart: { ru: 'В корзину', en: 'Add to cart', uz: 'Savatga' },
    added: { ru: 'Добавлено', en: 'Added', uz: 'Qo\'shildi' },
    expiresIn: { ru: 'Годен до', en: 'Expires', uz: 'Yaroqli' },
    urgent: { ru: 'Срочно!', en: 'Urgent!', uz: 'Shoshilinch!' },
    description: { ru: 'Описание', en: 'Description', uz: 'Tavsif' },
    characteristics: { ru: 'Характеристики', en: 'Specifications', uz: 'Xususiyatlar' },
    total: { ru: 'Итого', en: 'Total', uz: 'Jami' },
    showMore: { ru: 'Показать ещё', en: 'Show more', uz: 'Ko\'proq ko\'rsatish' },
    maxQuantity: { ru: 'Максимум', en: 'Maximum', uz: 'Maksimum' },
    pieces: { ru: 'шт', en: 'pcs', uz: 'dona' },
  },

  // Cart
  cart: {
    title: { ru: 'Корзина', en: 'Cart', uz: 'Savat' },
    empty: { ru: 'Корзина пуста', en: 'Cart is empty', uz: 'Savat bo\'sh' },
    emptyHint: { ru: 'Добавьте товары, чтобы начать оформление заказа', en: 'Add products to start checkout', uz: 'Buyurtmani rasmiylashtirish uchun mahsulotlarni qo\'shing' },
    promoCode: { ru: 'Промокод', en: 'Promo code', uz: 'Promo kod' },
    enterCode: { ru: 'Введите код', en: 'Enter code', uz: 'Kodni kiriting' },
    apply: { ru: 'Применить', en: 'Apply', uz: 'Qo\'llash' },
    subtotal: { ru: 'Сумма товаров', en: 'Subtotal', uz: 'Jami summa' },
    promoDiscount: { ru: 'Скидка по коду', en: 'Promo discount', uz: 'Promo chegirma' },
    total: { ru: 'ВСЕГО', en: 'TOTAL', uz: 'JAMI' },
    checkout: { ru: 'Оформить заказ', en: 'Checkout', uz: 'Buyurtma berish' },
    continueShopping: { ru: 'Продолжить покупки', en: 'Continue shopping', uz: 'Xaridni davom ettirish' },
    startShopping: { ru: 'Начать покупки', en: 'Start shopping', uz: 'Xarid qilishni boshlash' },
    remove: { ru: 'Удалить', en: 'Remove', uz: 'O\'chirish' },
    invalidPromo: { ru: 'Неверный промокод', en: 'Invalid promo code', uz: 'Noto\'g\'ri promo kod' },
  },

  // Checkout
  checkout: {
    title: { ru: 'Оформление заказа', en: 'Checkout', uz: 'Buyurtmani rasmiylashtirish' },
    pickupAddress: { ru: 'Адрес самовывоза', en: 'Pickup address', uz: 'Olib ketish manzili' },
    paymentMethod: { ru: 'Способ оплаты', en: 'Payment method', uz: 'To\'lov usuli' },
    addCard: { ru: 'Добавить карту', en: 'Add card', uz: 'Karta qo\'shish' },
    pay: { ru: 'Оплатить', en: 'Pay', uz: 'To\'lash' },
    orderSummary: { ru: 'Состав заказа', en: 'Order summary', uz: 'Buyurtma tarkibi' },
    items: { ru: 'товаров', en: 'items', uz: 'mahsulot' },
  },

  // Profile
  profile: {
    title: { ru: 'Профиль', en: 'Profile', uz: 'Profil' },
    editProfile: { ru: 'Редактировать профиль', en: 'Edit profile', uz: 'Profilni tahrirlash' },
    ecoSaved: { ru: 'Эко-экономия', en: 'Eco savings', uz: 'Eko tejash' },
    orders: { ru: 'Заказов', en: 'Orders', uz: 'Buyurtmalar' },
    saved: { ru: 'Сохранено', en: 'Saved', uz: 'Saqlangan' },
    management: { ru: 'Управление', en: 'Management', uz: 'Boshqaruv' },
    myAddresses: { ru: 'Мои адреса', en: 'My addresses', uz: 'Mening manzillarim' },
    paymentMethods: { ru: 'Методы оплаты', en: 'Payment methods', uz: 'To\'lov usullari' },
    myOrders: { ru: 'Мои заказы', en: 'My orders', uz: 'Mening buyurtmalarim' },
    favorites: { ru: 'Избранное', en: 'Favorites', uz: 'Sevimlilar' },
    promoCodes: { ru: 'Промокоды', en: 'Promo codes', uz: 'Promo kodlar' },
    settings: { ru: 'Настройки', en: 'Settings', uz: 'Sozlamalar' },
    notifications: { ru: 'Уведомления', en: 'Notifications', uz: 'Bildirishnomalar' },
    darkTheme: { ru: 'Темная тема', en: 'Dark theme', uz: 'Qorong\'i mavzu' },
    language: { ru: 'Язык', en: 'Language', uz: 'Til' },
    privacy: { ru: 'Приватность', en: 'Privacy', uz: 'Maxfiylik' },
    helpSupport: { ru: 'Помощь и поддержка', en: 'Help & Support', uz: 'Yordam va qo\'llab-quvvatlash' },
    faq: { ru: 'Частые вопросы', en: 'FAQ', uz: 'Ko\'p so\'raladigan savollar' },
    contactSupport: { ru: 'Связаться с поддержкой', en: 'Contact support', uz: 'Qo\'llab-quvvatlash bilan bog\'lanish' },
    terms: { ru: 'Условия обслуживания', en: 'Terms of Service', uz: 'Xizmat shartlari' },
    privacyPolicy: { ru: 'Политика конфиденциальности', en: 'Privacy Policy', uz: 'Maxfiylik siyosati' },
    logout: { ru: 'Выйти из аккаунта', en: 'Log out', uz: 'Chiqish' },
    version: { ru: 'Версия', en: 'Version', uz: 'Versiya' },
  },

  // Edit Profile
  editProfile: {
    title: { ru: 'Редактировать профиль', en: 'Edit profile', uz: 'Profilni tahrirlash' },
    changePhoto: { ru: 'Изменить фото', en: 'Change photo', uz: 'Rasmni o\'zgartirish' },
    personalData: { ru: 'Личные данные', en: 'Personal data', uz: 'Shaxsiy ma\'lumotlar' },
    firstName: { ru: 'Имя', en: 'First name', uz: 'Ism' },
    lastName: { ru: 'Фамилия', en: 'Last name', uz: 'Familiya' },
    contacts: { ru: 'Контакты', en: 'Contacts', uz: 'Aloqa' },
    email: { ru: 'Email', en: 'Email', uz: 'Email' },
    phone: { ru: 'Телефон', en: 'Phone', uz: 'Telefon' },
    phoneHint: { ru: 'Для изменения номера потребуется подтверждение по SMS', en: 'SMS verification required to change number', uz: 'Raqamni o\'zgartirish uchun SMS tasdiqlash kerak' },
    saveChanges: { ru: 'Сохранить изменения', en: 'Save changes', uz: 'O\'zgarishlarni saqlash' },
    saving: { ru: 'Сохранение...', en: 'Saving...', uz: 'Saqlanmoqda...' },
    takePhoto: { ru: 'Сделать фото', en: 'Take photo', uz: 'Suratga olish' },
    chooseFromGallery: { ru: 'Выбрать из галереи', en: 'Choose from gallery', uz: 'Galereyadan tanlash' },
    removePhoto: { ru: 'Удалить фото', en: 'Remove photo', uz: 'Rasmni o\'chirish' },
  },

  // Addresses
  addresses: {
    title: { ru: 'Мои адреса', en: 'My addresses', uz: 'Mening manzillarim' },
    noAddresses: { ru: 'Нет сохранённых адресов', en: 'No saved addresses', uz: 'Saqlangan manzillar yo\'q' },
    addAddress: { ru: 'Добавить адрес', en: 'Add address', uz: 'Manzil qo\'shish' },
    newAddress: { ru: 'Новый адрес', en: 'New address', uz: 'Yangi manzil' },
    editAddress: { ru: 'Редактировать адрес', en: 'Edit address', uz: 'Manzilni tahrirlash' },
    title_field: { ru: 'Название', en: 'Title', uz: 'Nomi' },
    titlePlaceholder: { ru: 'напр. Дом, Работа', en: 'e.g. Home, Work', uz: 'masalan, Uy, Ish' },
    fullAddress: { ru: 'Полный адрес', en: 'Full address', uz: 'To\'liq manzil' },
    setDefault: { ru: 'Сделать основным', en: 'Set as default', uz: 'Asosiy qilish' },
    default: { ru: 'По умолчанию', en: 'Default', uz: 'Asosiy' },
    edit: { ru: 'Изменить', en: 'Edit', uz: 'Tahrirlash' },
    delete: { ru: 'Удалить', en: 'Delete', uz: 'O\'chirish' },
    cancel: { ru: 'Отмена', en: 'Cancel', uz: 'Bekor qilish' },
    add: { ru: 'Добавить', en: 'Add', uz: 'Qo\'shish' },
    save: { ru: 'Сохранить', en: 'Save', uz: 'Saqlash' },
  },

  // Payment
  payment: {
    title: { ru: 'Методы оплаты', en: 'Payment methods', uz: 'To\'lov usullari' },
    noCards: { ru: 'Нет сохранённых карт', en: 'No saved cards', uz: 'Saqlangan kartalar yo\'q' },
    noCardsHint: { ru: 'Добавьте карту для быстрой оплаты', en: 'Add a card for quick payment', uz: 'Tez to\'lov uchun karta qo\'shing' },
    addCard: { ru: 'Добавить карту', en: 'Add card', uz: 'Karta qo\'shish' },
    setDefault: { ru: 'Сделать основной', en: 'Set as default', uz: 'Asosiy qilish' },
    default: { ru: 'Основная', en: 'Default', uz: 'Asosiy' },
    delete: { ru: 'Удалить', en: 'Delete', uz: 'O\'chirish' },
    deleteCard: { ru: 'Удалить карту?', en: 'Delete card?', uz: 'Kartani o\'chirishmi?' },
    deleteCardHint: { ru: 'Карта будет удалена из ваших методов оплаты', en: 'Card will be removed from your payment methods', uz: 'Karta to\'lov usullaringizdan o\'chiriladi' },
    validUntil: { ru: 'Действует до', en: 'Valid until', uz: 'Amal qiladi' },
    security: { ru: 'Безопасность', en: 'Security', uz: 'Xavfsizlik' },
    securityHint: { ru: 'Данные карт надёжно защищены и хранятся в зашифрованном виде. Мы не сохраняем CVV-коды.', en: 'Card data is securely encrypted. We do not store CVV codes.', uz: 'Karta ma\'lumotlari xavfsiz shifrlanadi. Biz CVV kodlarini saqlamaymiz.' },
    cancel: { ru: 'Отмена', en: 'Cancel', uz: 'Bekor qilish' },
  },

  // Orders
  orders: {
    title: { ru: 'Мои заказы', en: 'My orders', uz: 'Mening buyurtmalarim' },
    all: { ru: 'Все', en: 'All', uz: 'Hammasi' },
    active: { ru: 'Активные', en: 'Active', uz: 'Faol' },
    history: { ru: 'История', en: 'History', uz: 'Tarix' },
    noOrders: { ru: 'Нет заказов', en: 'No orders', uz: 'Buyurtmalar yo\'q' },
    noOrdersHint: { ru: 'Ваши заказы появятся здесь', en: 'Your orders will appear here', uz: 'Buyurtmalaringiz bu yerda ko\'rinadi' },
    noActiveOrders: { ru: 'Нет активных заказов', en: 'No active orders', uz: 'Faol buyurtmalar yo\'q' },
    noHistoryOrders: { ru: 'История заказов пуста', en: 'Order history is empty', uz: 'Buyurtmalar tarixi bo\'sh' },
    order: { ru: 'Заказ', en: 'Order', uz: 'Buyurtma' },
    view: { ru: 'Просмотреть', en: 'View', uz: 'Ko\'rish' },
    repeat: { ru: 'Повторить', en: 'Repeat', uz: 'Takrorlash' },
    track: { ru: 'Отследить', en: 'Track', uz: 'Kuzatish' },
    pending: { ru: 'Ожидает', en: 'Pending', uz: 'Kutilmoqda' },
    confirmed: { ru: 'Подтверждён', en: 'Confirmed', uz: 'Tasdiqlangan' },
    preparing: { ru: 'Готовится', en: 'Preparing', uz: 'Tayyorlanmoqda' },
    inTransit: { ru: 'В пути', en: 'In transit', uz: 'Yo\'lda' },
    delivered: { ru: 'Доставлен', en: 'Delivered', uz: 'Yetkazildi' },
    cancelled: { ru: 'Отменён', en: 'Cancelled', uz: 'Bekor qilindi' },
    courier: { ru: 'Курьер', en: 'Courier', uz: 'Kuryer' },
  },

  // Tracking
  tracking: {
    title: { ru: 'Отслеживание заказа', en: 'Order tracking', uz: 'Buyurtmani kuzatish' },
    live: { ru: 'LIVE', en: 'LIVE', uz: 'LIVE' },
    arrivalIn: { ru: 'Прибытие через', en: 'Arrival in', uz: 'Kelish vaqti' },
    min: { ru: 'мин', en: 'min', uz: 'daq' },
    distance: { ru: 'Расстояние', en: 'Distance', uz: 'Masofa' },
    courier: { ru: 'Курьер', en: 'Courier', uz: 'Kuryer' },
    message: { ru: 'Написать', en: 'Message', uz: 'Xabar' },
    call: { ru: 'Позвонить', en: 'Call', uz: 'Qo\'ng\'iroq' },
    orderInfo: { ru: 'Информация о заказе', en: 'Order info', uz: 'Buyurtma ma\'lumoti' },
    settings: { ru: 'Настройки', en: 'Settings', uz: 'Sozlamalar' },
    cancelOrder: { ru: 'Отменить заказ', en: 'Cancel order', uz: 'Buyurtmani bekor qilish' },
    cancelConfirm: { ru: 'Вы уверены, что хотите отменить заказ?', en: 'Are you sure you want to cancel the order?', uz: 'Buyurtmani bekor qilmoqchimisiz?' },
    cancelHint: { ru: 'Это действие нельзя отменить.', en: 'This action cannot be undone.', uz: 'Bu amalni bekor qilib bo\'lmaydi.' },
    keepOrder: { ru: 'Нет, оставить', en: 'No, keep it', uz: 'Yo\'q, qoldiring' },
    yesCancel: { ru: 'Да, отменить', en: 'Yes, cancel', uz: 'Ha, bekor qiling' },
  },

  // Notifications
  notifications: {
    title: { ru: 'Уведомления', en: 'Notifications', uz: 'Bildirishnomalar' },
    noNotifications: { ru: 'Нет уведомлений', en: 'No notifications', uz: 'Bildirishnomalar yo\'q' },
    noNotificationsHint: { ru: 'Здесь появятся уведомления о заказах и акциях', en: 'Notifications about orders and promotions will appear here', uz: 'Buyurtmalar va aksiyalar haqida bildirishnomalar bu yerda ko\'rinadi' },
    new: { ru: 'НОВЫХ', en: 'NEW', uz: 'YANGI' },
    clearAll: { ru: 'Очистить все', en: 'Clear all', uz: 'Hammasini tozalash' },
    orderPlaced: { ru: 'Заказ оформлен!', en: 'Order placed!', uz: 'Buyurtma berildi!' },
    orderPreparing: { ru: 'Заказ готовится', en: 'Order preparing', uz: 'Buyurtma tayyorlanmoqda' },
    justNow: { ru: 'Только что', en: 'Just now', uz: 'Hozirgina' },
  },

  // Reviews
  reviews: {
    title: { ru: 'Отзывы', en: 'Reviews', uz: 'Sharhlar' },
    noReviews: { ru: 'Отзывов пока нет', en: 'No reviews yet', uz: 'Hali sharhlar yo\'q' },
    noReviewsHint: { ru: 'Будьте первым, кто оставит отзыв!', en: 'Be the first to leave a review!', uz: 'Birinchi bo\'lib sharh qoldiring!' },
    writeReview: { ru: 'Написать отзыв', en: 'Write review', uz: 'Sharh yozish' },
    yourReview: { ru: 'Ваш отзыв', en: 'Your review', uz: 'Sizning sharhingiz' },
    submit: { ru: 'Отправить отзыв', en: 'Submit review', uz: 'Sharhni yuborish' },
    addPhoto: { ru: 'Добавить фото', en: 'Add photo', uz: 'Rasm qo\'shish' },
    outOf: { ru: 'из', en: 'out of', uz: 'dan' },
    stars: { ru: 'звёзд', en: 'stars', uz: 'yulduz' },
    all: { ru: 'Все', en: 'All', uz: 'Hammasi' },
    newest: { ru: 'Новые', en: 'Newest', uz: 'Eng yangi' },
    mostHelpful: { ru: 'Полезные', en: 'Most helpful', uz: 'Eng foydali' },
    highestRated: { ru: 'Высокий рейтинг', en: 'Highest rated', uz: 'Eng yuqori reyting' },
    daysAgo: { ru: 'дн назад', en: 'days ago', uz: 'kun oldin' },
  },

  // Favorites
  favorites: {
    title: { ru: 'Избранное', en: 'Favorites', uz: 'Sevimlilar' },
    empty: { ru: 'В избранном пусто', en: 'No favorites yet', uz: 'Sevimlilar bo\'sh' },
    emptyHint: { ru: 'Добавляйте товары в избранное, нажав на сердечко', en: 'Add products to favorites by tapping the heart icon', uz: 'Yurak belgisini bosib mahsulotlarni sevimlilarga qo\'shing' },
  },

  // Promotions
  promotions: {
    title: { ru: 'Акции и скидки', en: 'Promotions & Deals', uz: 'Aksiyalar va chegirmalar' },
    all: { ru: 'Все', en: 'All', uz: 'Hammasi' },
    active: { ru: 'Активные', en: 'Active', uz: 'Faol' },
    flash: { ru: 'Flash', en: 'Flash', uz: 'Flash' },
    season: { ru: 'Сезон', en: 'Season', uz: 'Mavsum' },
    vip: { ru: 'VIP', en: 'VIP', uz: 'VIP' },
    search: { ru: 'Поиск акций...', en: 'Search promotions...', uz: 'Aksiyalarni qidirish...' },
    copied: { ru: 'Скопировано', en: 'Copied', uz: 'Nusxalandi' },
    copy: { ru: 'Копировать', en: 'Copy', uz: 'Nusxalash' },
    apply: { ru: 'Применить', en: 'Apply', uz: 'Qo\'llash' },
    save: { ru: 'Сохранить', en: 'Save', uz: 'Saqlash' },
    saved: { ru: 'Сохранено', en: 'Saved', uz: 'Saqlangan' },
    mySaved: { ru: 'Мои сохранённые', en: 'My saved', uz: 'Saqlangan' },
    validUntil: { ru: 'Действует до', en: 'Valid until', uz: 'Amal qiladi' },
    minPurchase: { ru: 'Мин. покупка', en: 'Min. purchase', uz: 'Min. xarid' },
    available: { ru: 'Доступно', en: 'Available', uz: 'Mavjud' },
    limited: { ru: 'Ограничено', en: 'Limited', uz: 'Cheklangan' },
  },

  // Support
  support: {
    title: { ru: 'Поддержка', en: 'Support', uz: 'Qo\'llab-quvvatlash' },
    faq: { ru: 'FAQ', en: 'FAQ', uz: 'FAQ' },
    write: { ru: 'Написать', en: 'Write', uz: 'Yozish' },
    chat: { ru: 'Чат', en: 'Chat', uz: 'Chat' },
    contacts: { ru: 'Контакты', en: 'Contacts', uz: 'Aloqa' },
    searchFaq: { ru: 'Поиск вопросов...', en: 'Search questions...', uz: 'Savollarni qidirish...' },
    topic: { ru: 'Тема обращения', en: 'Topic', uz: 'Mavzu' },
    selectTopic: { ru: 'Выберите тему', en: 'Select topic', uz: 'Mavzuni tanlang' },
    orderIssue: { ru: 'Проблема с заказом', en: 'Order issue', uz: 'Buyurtma bilan muammo' },
    paymentIssue: { ru: 'Вопрос по оплате', en: 'Payment issue', uz: 'To\'lov masalasi' },
    appIssue: { ru: 'Ошибка в приложении', en: 'App issue', uz: 'Ilova xatosi' },
    suggestion: { ru: 'Предложение', en: 'Suggestion', uz: 'Taklif' },
    other: { ru: 'Другое', en: 'Other', uz: 'Boshqa' },
    message: { ru: 'Сообщение', en: 'Message', uz: 'Xabar' },
    describeIssue: { ru: 'Опишите вашу проблему или вопрос', en: 'Describe your issue or question', uz: 'Muammo yoki savolingizni tavsiflang' },
    attachFile: { ru: 'Прикрепить файл', en: 'Attach file', uz: 'Fayl biriktirish' },
    send: { ru: 'Отправить', en: 'Send', uz: 'Yuborish' },
    operatorOnline: { ru: 'Оператор онлайн', en: 'Operator online', uz: 'Operator onlayn' },
    operatorOffline: { ru: 'Оператор офлайн', en: 'Operator offline', uz: 'Operator oflayn' },
    responseTime: { ru: 'Время ответа', en: 'Response time', uz: 'Javob vaqti' },
    typeMessage: { ru: 'Введите сообщение...', en: 'Type message...', uz: 'Xabar yozing...' },
    workingHours: { ru: 'Время работы', en: 'Working hours', uz: 'Ish vaqti' },
    socialMedia: { ru: 'Социальные сети', en: 'Social media', uz: 'Ijtimoiy tarmoqlar' },
  },

  // Language
  language: {
    title: { ru: 'Язык / Language', en: 'Language', uz: 'Til' },
    hint: { ru: 'Язык приложения будет изменён. Некоторые элементы могут остаться на русском языке.', en: 'App language will be changed.', uz: 'Ilova tili o\'zgartiriladi.' },
  },

  // Common
  common: {
    cancel: { ru: 'Отмена', en: 'Cancel', uz: 'Bekor qilish' },
    confirm: { ru: 'Подтвердить', en: 'Confirm', uz: 'Tasdiqlash' },
    save: { ru: 'Сохранить', en: 'Save', uz: 'Saqlash' },
    delete: { ru: 'Удалить', en: 'Delete', uz: 'O\'chirish' },
    edit: { ru: 'Изменить', en: 'Edit', uz: 'Tahrirlash' },
    back: { ru: 'Назад', en: 'Back', uz: 'Orqaga' },
    close: { ru: 'Закрыть', en: 'Close', uz: 'Yopish' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uz: 'Yuklanmoqda...' },
    error: { ru: 'Ошибка', en: 'Error', uz: 'Xato' },
    success: { ru: 'Успешно', en: 'Success', uz: 'Muvaffaqiyatli' },
    yes: { ru: 'Да', en: 'Yes', uz: 'Ha' },
    no: { ru: 'Нет', en: 'No', uz: 'Yo\'q' },
    kg: { ru: 'кг', en: 'kg', uz: 'kg' },
  },

  // Success screen
  success: {
    title: { ru: 'Заказ оформлен!', en: 'Order placed!', uz: 'Buyurtma berildi!' },
    message: { ru: 'Ваш заказ успешно оформлен. Ожидайте готовности в магазине.', en: 'Your order has been placed. Wait for it to be ready at the store.', uz: 'Buyurtmangiz qabul qilindi. Do\'konda tayyor bo\'lishini kuting.' },
    continue: { ru: 'Продолжить покупки', en: 'Continue shopping', uz: 'Xaridni davom ettirish' },
  },

  // Settings
  settings: {
    title: { ru: 'Настройки', en: 'Settings', uz: 'Sozlamalar' },
  },
};

/**
 * Get translation by key path
 * @param {string} path - Dot-separated path like 'nav.radar'
 * @param {string} lang - Language code (ru, en, uz)
 * @returns {string} Translated text
 */
export const getTranslation = (path, lang = 'ru') => {
  const keys = path.split('.');
  let result = translations;
  
  for (const key of keys) {
    if (result[key] === undefined) {
      console.warn(`Translation not found: ${path}`);
      return path;
    }
    result = result[key];
  }
  
  if (typeof result === 'object' && result[lang]) {
    return result[lang];
  }
  
  // Fallback to Russian
  if (typeof result === 'object' && result.ru) {
    return result.ru;
  }
  
  return path;
};

/**
 * Create translator function for specific language
 * @param {string} lang - Language code
 * @returns {Function} Translator function
 */
export const createTranslator = (lang) => (path) => getTranslation(path, lang);

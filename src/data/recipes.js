/**
 * Local fallback recipe library (~20 recipes).
 * Used when Supabase Edge Function is unavailable.
 *
 * Ingredient matching uses a 3-layer combinatorial system:
 *   - keywords[]:  at least one MUST be present in product title (lowercase)
 *   - excludes[]:  NONE of these may be present in product title (negative filter)
 *   - categoryHint: only products in this catalog category are even considered
 *
 * This prevents "творожный сыр" matching "сыр твёрдый" in Карбонара,
 * "молоко" matching "сгущённое молоко" in Омлет, etc.
 */

/**
 * Checks whether a cart item title matches an ingredient spec.
 * Returns true only if:
 *   1. Product is in the right catalog category (if categoryHint is set)
 *   2. At least one required keyword appears in the title
 *   3. NONE of the exclusion keywords appear in the title
 */
export function titleMatches(title, category, ing) {
  const t = title.toLowerCase();
  const cat = (category || '').toLowerCase();

  // Category gate — fast reject
  if (ing.categoryHint && cat !== ing.categoryHint.toLowerCase()) return false;

  // At least one required keyword must be present
  const hasKeyword = ing.keywords.some((kw) => t.includes(kw.toLowerCase()));
  if (!hasKeyword) return false;

  // None of the exclusion keywords may appear
  if (ing.excludes && ing.excludes.some((ex) => t.includes(ex.toLowerCase()))) return false;

  return true;
}

export const FALLBACK_RECIPES = [
  {
    id: 'mac-n-cheese',
    name: 'Мак-н-Чиз',
    emoji: '🧀',
    steps: [
      { step: 1, text: 'Отварить макароны до состояния аль денте' },
      { step: 2, text: 'Растопить масло, добавить муку' },
      { step: 3, text: 'Влить молоко, добавить тёртый сыр' },
      { step: 4, text: 'Соединить соус с пастой' },
    ],
    ingredients: [
      {
        group: 'паста',
        categoryHint: 'Выпечка',
        keywords: ['макарон','спагетт','паста','лапш','феттучин','пенне','фузилли'],
        excludes: ['томатн','паста томатн'],
      },
      {
        group: 'сыр твёрдый',
        categoryHint: 'Молоко',
        keywords: ['пармезан','гауда','российск','чеддер','эдам','маасдам','тильзит'],
        excludes: ['творог','творожн','плавлен','рикотт','маскарпон','моцарелл','фета','брынз','сырок','сырн'],
      },
      {
        group: 'молоко',
        categoryHint: 'Молоко',
        keywords: ['молок'],
        excludes: ['сгущ','кокос','шоколад','соев','мороженое'],
      },
      {
        group: 'сливочное масло',
        categoryHint: 'Молоко',
        keywords: ['масло сливочн','масло кресть','сливочное масло'],
        excludes: ['раститель','оливков','подсолнечн'],
      },
    ],
  },
  {
    id: 'carbonara',
    name: 'Паста Карбонара',
    emoji: '🍝',
    steps: [
      { step: 1, text: 'Отварить пасту аль денте' },
      { step: 2, text: 'Обжарить бекон до хруста' },
      { step: 3, text: 'Смешать желтки с тёртым пармезаном' },
      { step: 4, text: 'Соединить пасту с беконом и заправить соусом' },
    ],
    ingredients: [
      {
        group: 'паста',
        categoryHint: 'Выпечка',
        keywords: ['макарон','спагетт','паста','лапш','пенне','феттучин'],
        excludes: ['томатн','паста томатн'],
      },
      {
        group: 'бекон',
        categoryHint: 'Мясо',
        keywords: ['бекон','грудинка копч','панчетт'],
        excludes: ['сыр','колбас'],
      },
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин'],
      },
      {
        group: 'сыр твёрдый (пармезан)',
        categoryHint: 'Молоко',
        keywords: ['пармезан','гауда','российск','чеддер','пармезан','грана падан'],
        excludes: ['творог','творожн','плавлен','рикотт','маскарпон','моцарелл','фета','брынз','сырок','сырн','сгущ'],
      },
    ],
  },
  {
    id: 'fish-oven',
    name: 'Рыба в духовке',
    emoji: '🐟',
    steps: [
      { step: 1, text: 'Натереть рыбу специями и солью' },
      { step: 2, text: 'Положить дольки лимона внутрь' },
      { step: 3, text: 'Завернуть в фольгу' },
      { step: 4, text: 'Запекать 25 минут при 180°C' },
    ],
    ingredients: [
      {
        group: 'рыба',
        categoryHint: 'Рыба',
        keywords: ['рыб','лосос','сёмга','семга','форел','треска','минтай','горбуш','кета','пикш','хек','судак'],
        excludes: ['консерв','паштет','крабов','икра'],
      },
      {
        group: 'лимон',
        categoryHint: 'Фрукты',
        keywords: ['лимон','лайм'],
        excludes: ['сок','джем','варень'],
      },
      {
        group: 'зелень свежая',
        categoryHint: 'Фрукты',
        keywords: ['укроп','петрушк','базилик','кинза','розмарин','тимьян'],
        excludes: ['сушен','замороженн','смесь приправ'],
      },
    ],
  },
  {
    id: 'greek-salad',
    name: 'Греческий салат',
    emoji: '🥗',
    steps: [
      { step: 1, text: 'Нарезать томаты и огурцы крупными кусками' },
      { step: 2, text: 'Добавить моцареллу или брынзу' },
      { step: 3, text: 'Заправить оливковым маслом' },
      { step: 4, text: 'Добавить оливки и базилик' },
    ],
    ingredients: [
      {
        group: 'свежие томаты',
        categoryHint: 'Фрукты',
        keywords: ['томат','помидор','черри'],
        excludes: ['паста','соус','сушен','консерв','сок'],
      },
      {
        group: 'свежие огурцы',
        categoryHint: 'Фрукты',
        keywords: ['огурц'],
        excludes: ['консерв','маринов','солён'],
      },
      {
        group: 'брынза или фета',
        categoryHint: 'Молоко',
        keywords: ['моцарелл','брынза','фета'],
        excludes: ['творог','творожн','плавлен','сырок','маскарпон','рикотт'],
      },
    ],
  },
  {
    id: 'pancakes',
    name: 'Блины',
    emoji: '🥞',
    steps: [
      { step: 1, text: 'Смешать яйца, молоко и муку' },
      { step: 2, text: 'Добавить масло и сахар' },
      { step: 3, text: 'Жарить тонкие блины' },
    ],
    ingredients: [
      {
        group: 'мука пшеничная',
        categoryHint: 'Выпечка',
        keywords: ['мука'],
        excludes: ['блинн','готов','смесь','кукурузн','ржан','гречнев'],
      },
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин'],
      },
      {
        group: 'молоко',
        categoryHint: 'Молоко',
        keywords: ['молок'],
        excludes: ['сгущ','кокос','шоколад','соев','сухое молоко'],
      },
      {
        group: 'сливочное масло',
        categoryHint: 'Молоко',
        keywords: ['масло сливочн','масло кресть','сливочное масло'],
        excludes: ['раститель','оливков','подсолнечн'],
      },
    ],
  },
  {
    id: 'omlette',
    name: 'Омлет',
    emoji: '🍳',
    steps: [
      { step: 1, text: 'Взбить яйца с молоком' },
      { step: 2, text: 'Вылить на разогретую сковороду' },
      { step: 3, text: 'Готовить под крышкой 3 минуты' },
    ],
    ingredients: [
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин','майонез'],
      },
      {
        group: 'молоко',
        categoryHint: 'Молоко',
        keywords: ['молок'],
        excludes: ['сгущ','кокос','шоколад','соев'],
      },
    ],
  },
  {
    id: 'chicken-sour-cream',
    name: 'Курица в сметане',
    emoji: '🍗',
    steps: [
      { step: 1, text: 'Нарезать куриное филе' },
      { step: 2, text: 'Обжарить с луком' },
      { step: 3, text: 'Добавить сметану' },
      { step: 4, text: 'Тушить 20 минут' },
    ],
    ingredients: [
      {
        group: 'куриное филе',
        categoryHint: 'Мясо',
        keywords: ['курин','грудк','филе курин'],
        excludes: ['бульон','паштет','консерв','нагетс','котлет'],
      },
      {
        group: 'сметана',
        categoryHint: 'Молоко',
        keywords: ['сметан'],
        excludes: ['соус','сметанн'],
      },
      {
        group: 'лук репчатый',
        categoryHint: null,
        keywords: ['лук реп','лук белый','лук'],
        excludes: ['зелёный лук','лук-порей','луков','чипс'],
      },
    ],
  },
  {
    id: 'syrniki',
    name: 'Сырники',
    emoji: '🧀',
    steps: [
      { step: 1, text: 'Смешать творог, яйца и муку' },
      { step: 2, text: 'Добавить сахар и ваниль' },
      { step: 3, text: 'Сформировать сырники' },
      { step: 4, text: 'Обжарить с двух сторон' },
    ],
    ingredients: [
      {
        group: 'творог',
        categoryHint: 'Молоко',
        keywords: ['творог'],
        excludes: ['глазур','сырок глазур','масса творожн','десерт'],
      },
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин'],
      },
      {
        group: 'мука пшеничная',
        categoryHint: 'Выпечка',
        keywords: ['мука'],
        excludes: ['блинн','готов','смесь','кукурузн','ржан'],
      },
    ],
  },
  {
    id: 'bolognese',
    name: 'Болоньезе',
    emoji: '🍝',
    steps: [
      { step: 1, text: 'Обжарить фарш с луком' },
      { step: 2, text: 'Добавить томатную пасту, тушить 20 минут' },
      { step: 3, text: 'Отварить спагетти' },
      { step: 4, text: 'Соединить и посыпать пармезаном' },
    ],
    ingredients: [
      {
        group: 'паста/спагетти',
        categoryHint: 'Выпечка',
        keywords: ['макарон','спагетт','паста','пенне','фузилли'],
        excludes: ['томатн','паста томатн'],
      },
      {
        group: 'говяжий/смешанный фарш',
        categoryHint: 'Мясо',
        keywords: ['фарш'],
        excludes: ['рыбн','куриный','котлет'],
      },
      {
        group: 'томатная паста',
        categoryHint: null,
        keywords: ['паста томатн','томатн пюре','томатн соус'],
        excludes: ['макарон','спагетт'],
      },
      {
        group: 'лук репчатый',
        categoryHint: null,
        keywords: ['лук реп','лук белый','лук'],
        excludes: ['зелёный лук','лук-порей','чипс'],
      },
    ],
  },
  {
    id: 'borscht',
    name: 'Борщ',
    emoji: '🍲',
    steps: [
      { step: 1, text: 'Сварить мясной бульон' },
      { step: 2, text: 'Обжарить свёклу с томатной пастой' },
      { step: 3, text: 'Добавить капусту и картофель' },
      { step: 4, text: 'Варить 10 минут, подавать со сметаной' },
    ],
    ingredients: [
      {
        group: 'говядина (на бульон)',
        categoryHint: 'Мясо',
        keywords: ['говядин','мясо говяж'],
        excludes: ['фарш','котлет','бульон готов'],
      },
      {
        group: 'белокочанная капуста',
        categoryHint: null,
        keywords: ['капуст белокочан','капуст свеж'],
        excludes: ['пекинск','краснокочан','квашен','брокол','цветн'],
      },
      {
        group: 'картофель',
        categoryHint: null,
        keywords: ['картоф','картошк'],
        excludes: ['чипс','пюре','крахмал','фри'],
      },
      {
        group: 'морковь',
        categoryHint: null,
        keywords: ['моркови','морковь','морков'],
        excludes: ['сок','консерв','корейск'],
      },
      {
        group: 'томатная паста',
        categoryHint: null,
        keywords: ['паста томатн','томатн пюре'],
        excludes: ['макарон','спагетт'],
      },
    ],
  },
  {
    id: 'charlotte',
    name: 'Шарлотка',
    emoji: '🎂',
    steps: [
      { step: 1, text: 'Взбить яйца с сахаром' },
      { step: 2, text: 'Добавить муку' },
      { step: 3, text: 'Нарезать яблоки и вмешать в тесто' },
      { step: 4, text: 'Выпекать 30 минут при 180°C' },
    ],
    ingredients: [
      {
        group: 'свежие яблоки',
        categoryHint: 'Фрукты',
        keywords: ['яблок'],
        excludes: ['сок','джем','варень','сушен','пюре','чипс'],
      },
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин'],
      },
      {
        group: 'мука пшеничная',
        categoryHint: 'Выпечка',
        keywords: ['мука'],
        excludes: ['блинн','готов','смесь','кукурузн','ржан'],
      },
    ],
  },
  {
    id: 'salmon-cream',
    name: 'Паста с сёмгой',
    emoji: '🐟',
    steps: [
      { step: 1, text: 'Обжарить кусочки сёмги' },
      { step: 2, text: 'Влить сливки, тушить 5 минут' },
      { step: 3, text: 'Отварить пасту' },
      { step: 4, text: 'Соединить и посыпать зеленью' },
    ],
    ingredients: [
      {
        group: 'красная рыба',
        categoryHint: 'Рыба',
        keywords: ['лосос','сёмга','семга','форел','горбуш','кета'],
        excludes: ['консерв','паштет','икра','слабосол'],
      },
      {
        group: 'паста',
        categoryHint: 'Выпечка',
        keywords: ['макарон','спагетт','паста','пенне','феттучин'],
        excludes: ['томатн','паста томатн'],
      },
      {
        group: 'сливки 20–33%',
        categoryHint: 'Молоко',
        keywords: ['сливк'],
        excludes: ['мороженое','взбит','кондитерск','сухие'],
      },
    ],
  },
  {
    id: 'fried-eggs-bacon',
    name: 'Яичница с беконом',
    emoji: '🍳',
    steps: [
      { step: 1, text: 'Обжарить бекон' },
      { step: 2, text: 'Разбить яйца рядом' },
      { step: 3, text: 'Готовить до желаемой степени' },
    ],
    ingredients: [
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин','майонез'],
      },
      {
        group: 'бекон',
        categoryHint: 'Мясо',
        keywords: ['бекон','грудинка копч'],
        excludes: ['сыр','рыбн'],
      },
    ],
  },
  {
    id: 'caesar-chicken',
    name: 'Цезарь с курицей',
    emoji: '🥗',
    steps: [
      { step: 1, text: 'Обжарить куриное филе' },
      { step: 2, text: 'Нарезать листья ромэн' },
      { step: 3, text: 'Заправить соусом цезарь' },
      { step: 4, text: 'Посыпать пармезаном и сухариками' },
    ],
    ingredients: [
      {
        group: 'куриное филе',
        categoryHint: 'Мясо',
        keywords: ['курин','грудк','филе курин'],
        excludes: ['бульон','паштет','нагетс','котлет'],
      },
      {
        group: 'пармезан / твёрдый сыр',
        categoryHint: 'Молоко',
        keywords: ['пармезан','гауда','чеддер','российск'],
        excludes: ['творог','творожн','плавлен','сырок','маскарпон','рикотт','брынз','фета'],
      },
      {
        group: 'хлеб (для сухариков)',
        categoryHint: 'Выпечка',
        keywords: ['хлеб','батон','багет'],
        excludes: ['сухар','гренк','хлебц','бородинск','ржан'],
      },
    ],
  },
  {
    id: 'banana-bread',
    name: 'Банановый хлеб',
    emoji: '🍌',
    steps: [
      { step: 1, text: 'Размять спелые бананы' },
      { step: 2, text: 'Добавить яйца и растопленное масло' },
      { step: 3, text: 'Вмешать муку и сахар' },
      { step: 4, text: 'Выпекать 50 минут при 175°C' },
    ],
    ingredients: [
      {
        group: 'бананы',
        categoryHint: 'Фрукты',
        keywords: ['банан'],
        excludes: ['сок','чипс','сушен'],
      },
      {
        group: 'мука пшеничная',
        categoryHint: 'Выпечка',
        keywords: ['мука'],
        excludes: ['блинн','готов','смесь','кукурузн','ржан'],
      },
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин'],
      },
      {
        group: 'сливочное масло',
        categoryHint: 'Молоко',
        keywords: ['масло сливочн','масло кресть','сливочное масло'],
        excludes: ['раститель','оливков','подсолнечн'],
      },
    ],
  },
  {
    id: 'fish-cutlets',
    name: 'Рыбные котлеты',
    emoji: '🐟',
    steps: [
      { step: 1, text: 'Прокрутить рыбу в фарш' },
      { step: 2, text: 'Добавить лук и яйцо' },
      { step: 3, text: 'Сформировать котлеты' },
      { step: 4, text: 'Обжарить с двух сторон' },
    ],
    ingredients: [
      {
        group: 'белая рыба',
        categoryHint: 'Рыба',
        keywords: ['треска','минтай','хек','тилапия','пикш','судак','щук','карп'],
        excludes: ['консерв','паштет','икра','семга','лосос'],
      },
      {
        group: 'лук репчатый',
        categoryHint: null,
        keywords: ['лук реп','лук белый','лук'],
        excludes: ['зелёный лук','лук-порей','чипс'],
      },
      {
        group: 'яйца куриные',
        categoryHint: 'Молоко',
        keywords: ['яйц'],
        excludes: ['перепел','утин'],
      },
    ],
  },
  {
    id: 'tefteli',
    name: 'Тефтели в томатном соусе',
    emoji: '🍅',
    steps: [
      { step: 1, text: 'Смешать фарш с рисом и луком' },
      { step: 2, text: 'Сформировать тефтели' },
      { step: 3, text: 'Приготовить томатный соус' },
      { step: 4, text: 'Тушить в соусе 25 минут' },
    ],
    ingredients: [
      {
        group: 'мясной фарш',
        categoryHint: 'Мясо',
        keywords: ['фарш'],
        excludes: ['рыбн','куриный фарш','котлет'],
      },
      {
        group: 'рис круглый',
        categoryHint: null,
        keywords: ['рис'],
        excludes: ['плов','пакет','суши','рисов'],
      },
      {
        group: 'лук репчатый',
        categoryHint: null,
        keywords: ['лук реп','лук белый','лук'],
        excludes: ['зелёный лук','лук-порей','чипс'],
      },
      {
        group: 'томатная паста',
        categoryHint: null,
        keywords: ['паста томатн','томатн пюре','томатн соус'],
        excludes: ['макарон','спагетт'],
      },
    ],
  },
  {
    id: 'mac-n-cheese',
    name: 'Мак-н-Чиз',
    emoji: '🧀',
    steps: [
      { step: 1, text: 'Отварить макароны до состояния аль денте' },
      { step: 2, text: 'Растопить масло, добавить муку' },
      { step: 3, text: 'Влить молоко, добавить тёртый сыр' },
      { step: 4, text: 'Соединить соус с пастой' },
    ],
    ingredients: [
      { group: 'паста',           categoryHint: 'Выпечка', keywords: ['макарон','спагетт','паста','лапш','феттучин','пенне'] },
      { group: 'сыр твёрдый',     categoryHint: 'Молоко',  keywords: ['сыр','пармезан','гауда','российск','чеддер'] },
      { group: 'молоко',          categoryHint: 'Молоко',  keywords: ['молок'] },
      { group: 'сливочное масло', categoryHint: 'Молоко',  keywords: ['масло сливочн','масло кресть'] },
    ],
  },
  {
    id: 'carbonara',
    name: 'Паста Карбонара',
    emoji: '🍝',
    steps: [
      { step: 1, text: 'Отварить пасту аль денте' },
      { step: 2, text: 'Обжарить бекон до хруста' },
      { step: 3, text: 'Смешать желтки с тёртым пармезаном' },
      { step: 4, text: 'Соединить пасту с беконом и заправить соусом' },
    ],
    ingredients: [
      { group: 'паста',       categoryHint: 'Выпечка', keywords: ['макарон','спагетт','паста','лапш'] },
      { group: 'бекон',       categoryHint: 'Мясо',    keywords: ['бекон','грудинка','панчетт'] },
      { group: 'яйца',        categoryHint: 'Молоко',  keywords: ['яйц','яйко'] },
      { group: 'сыр твёрдый', categoryHint: 'Молоко',  keywords: ['сыр','пармезан'] },
    ],
  },
  {
    id: 'fish-oven',
    name: 'Рыба в духовке',
    emoji: '🐟',
    steps: [
      { step: 1, text: 'Натереть рыбу специями и солью' },
      { step: 2, text: 'Положить дольки лимона внутрь' },
      { step: 3, text: 'Завернуть в фольгу' },
      { step: 4, text: 'Запекать 25 минут при 180°C' },
    ],
    ingredients: [
      { group: 'рыба',        categoryHint: 'Рыба',   keywords: ['рыб','лосос','сёмга','семга','форел','треска','минтай'] },
      { group: 'лимон/лайм',  categoryHint: 'Фрукты', keywords: ['лимон','лайм'] },
      { group: 'зелень',      categoryHint: 'Фрукты', keywords: ['укроп','петрушк','базилик','зелень'] },
    ],
  },
  {
    id: 'greek-salad',
    name: 'Греческий салат',
    emoji: '🥗',
    steps: [
      { step: 1, text: 'Нарезать томаты и огурцы крупными кусками' },
      { step: 2, text: 'Добавить моцареллу или брынзу' },
      { step: 3, text: 'Заправить оливковым маслом' },
      { step: 4, text: 'Добавить оливки и базилик' },
    ],
    ingredients: [
      { group: 'помидоры', categoryHint: 'Фрукты', keywords: ['томат','помидор','черри'] },
      { group: 'огурцы',   categoryHint: 'Фрукты', keywords: ['огурц'] },
      { group: 'сыр мягкий', categoryHint: 'Молоко', keywords: ['моцарелл','брынза','фета','сыр мягк'] },
    ],
  },
  {
    id: 'pancakes',
    name: 'Блины',
    emoji: '🥞',
    steps: [
      { step: 1, text: 'Смешать яйца, молоко и муку' },
      { step: 2, text: 'Добавить масло и сахар' },
      { step: 3, text: 'Жарить тонкие блины' },
    ],
    ingredients: [
      { group: 'мука',            categoryHint: 'Выпечка', keywords: ['мука','мук'] },
      { group: 'яйца',            categoryHint: 'Молоко',  keywords: ['яйц'] },
      { group: 'молоко',          categoryHint: 'Молоко',  keywords: ['молок'] },
      { group: 'сливочное масло', categoryHint: 'Молоко',  keywords: ['масло сливочн','масло кресть'] },
    ],
  },
  {
    id: 'omlette',
    name: 'Омлет',
    emoji: '🍳',
    steps: [
      { step: 1, text: 'Взбить яйца с молоком' },
      { step: 2, text: 'Вылить на разогретую сковороду' },
      { step: 3, text: 'Готовить под крышкой 3 минуты' },
    ],
    ingredients: [
      { group: 'яйца',  categoryHint: 'Молоко', keywords: ['яйц'] },
      { group: 'молоко', categoryHint: 'Молоко', keywords: ['молок'] },
    ],
  },
  {
    id: 'chicken-sour-cream',
    name: 'Курица в сметане',
    emoji: '🍗',
    steps: [
      { step: 1, text: 'Нарезать куриное филе' },
      { step: 2, text: 'Обжарить с луком' },
      { step: 3, text: 'Добавить сметану' },
      { step: 4, text: 'Тушить 20 минут' },
    ],
    ingredients: [
      { group: 'куриное филе', categoryHint: 'Мясо',   keywords: ['курин','грудк','филе'] },
      { group: 'сметана',      categoryHint: 'Молоко', keywords: ['сметан'] },
      { group: 'лук',          categoryHint: null,     keywords: ['лук'] },
    ],
  },
  {
    id: 'syrniki',
    name: 'Сырники',
    emoji: '🧀',
    steps: [
      { step: 1, text: 'Смешать творог, яйца и муку' },
      { step: 2, text: 'Добавить сахар и ваниль' },
      { step: 3, text: 'Сформировать сырники' },
      { step: 4, text: 'Обжарить с двух сторон' },
    ],
    ingredients: [
      { group: 'сыр мягкий', categoryHint: 'Молоко',  keywords: ['творог','сыр мягк'] },
      { group: 'яйца',       categoryHint: 'Молоко',  keywords: ['яйц'] },
      { group: 'мука',       categoryHint: 'Выпечка', keywords: ['мука'] },
    ],
  },
  {
    id: 'bolognese',
    name: 'Болоньезе',
    emoji: '🍝',
    steps: [
      { step: 1, text: 'Обжарить фарш с луком' },
      { step: 2, text: 'Добавить томатную пасту, тушить 20 минут' },
      { step: 3, text: 'Отварить спагетти' },
      { step: 4, text: 'Соединить и посыпать пармезаном' },
    ],
    ingredients: [
      { group: 'паста',        categoryHint: 'Выпечка', keywords: ['макарон','спагетт','паста'] },
      { group: 'фарш мясной',  categoryHint: 'Мясо',    keywords: ['фарш'] },
      { group: 'томатная паста', categoryHint: null,    keywords: ['томатн','паста томатн','кетчуп'] },
      { group: 'лук',          categoryHint: null,      keywords: ['лук'] },
    ],
  },
  {
    id: 'borscht',
    name: 'Борщ',
    emoji: '🍲',
    steps: [
      { step: 1, text: 'Сварить мясной бульон' },
      { step: 2, text: 'Обжарить свёклу с томатной пастой' },
      { step: 3, text: 'Добавить капусту и картофель' },
      { step: 4, text: 'Варить 10 минут, подавать со сметаной' },
    ],
    ingredients: [
      { group: 'говядина/мясо', categoryHint: 'Мясо', keywords: ['говядин','мясо'] },
      { group: 'капуста',       categoryHint: null,   keywords: ['капуст'] },
      { group: 'картошка',      categoryHint: null,   keywords: ['картоф','картошк'] },
      { group: 'морковь',       categoryHint: null,   keywords: ['моркови','морковь'] },
      { group: 'томатная паста', categoryHint: null,  keywords: ['томатн'] },
    ],
  },
  {
    id: 'charlotte',
    name: 'Шарлотка',
    emoji: '🎂',
    steps: [
      { step: 1, text: 'Взбить яйца с сахаром' },
      { step: 2, text: 'Добавить муку' },
      { step: 3, text: 'Нарезать яблоки и вмешать в тесто' },
      { step: 4, text: 'Выпекать 30 минут при 180°C' },
    ],
    ingredients: [
      { group: 'яблоко', categoryHint: 'Фрукты', keywords: ['яблок'] },
      { group: 'яйца',   categoryHint: 'Молоко', keywords: ['яйц'] },
      { group: 'мука',   categoryHint: 'Выпечка', keywords: ['мука'] },
    ],
  },
  {
    id: 'salmon-cream',
    name: 'Паста с сёмгой',
    emoji: '🐟',
    steps: [
      { step: 1, text: 'Обжарить кусочки сёмги' },
      { step: 2, text: 'Влить сливки, тушить 5 минут' },
      { step: 3, text: 'Отварить пасту' },
      { step: 4, text: 'Соединить и посыпать зеленью' },
    ],
    ingredients: [
      { group: 'красная рыба', categoryHint: 'Рыба',    keywords: ['лосос','сёмга','семга','форел','горбуш','кета'] },
      { group: 'паста',        categoryHint: 'Выпечка', keywords: ['макарон','спагетт','паста'] },
      { group: 'сливки',       categoryHint: 'Молоко',  keywords: ['сливк'] },
    ],
  },
  {
    id: 'fried-eggs-bacon',
    name: 'Яичница с беконом',
    emoji: '🍳',
    steps: [
      { step: 1, text: 'Обжарить бекон' },
      { step: 2, text: 'Разбить яйца рядом' },
      { step: 3, text: 'Готовить до желаемой степени' },
    ],
    ingredients: [
      { group: 'яйца',  categoryHint: 'Молоко', keywords: ['яйц'] },
      { group: 'бекон', categoryHint: 'Мясо',   keywords: ['бекон','грудинк'] },
    ],
  },
  {
    id: 'caesar-chicken',
    name: 'Цезарь с курицей',
    emoji: '🥗',
    steps: [
      { step: 1, text: 'Обжарить куриное филе' },
      { step: 2, text: 'Нарезать листья ромэн' },
      { step: 3, text: 'Заправить соусом цезарь' },
      { step: 4, text: 'Посыпать пармезаном и сухариками' },
    ],
    ingredients: [
      { group: 'куриное филе', categoryHint: 'Мясо',   keywords: ['курин','грудк','филе'] },
      { group: 'сыр твёрдый',  categoryHint: 'Молоко', keywords: ['сыр','пармезан'] },
      { group: 'хлеб/тост',    categoryHint: 'Выпечка', keywords: ['хлеб','батон','тост'] },
    ],
  },
  {
    id: 'banana-bread',
    name: 'Банановый хлеб',
    emoji: '🍌',
    steps: [
      { step: 1, text: 'Размять спелые бананы' },
      { step: 2, text: 'Добавить яйца и растопленное масло' },
      { step: 3, text: 'Вмешать муку и сахар' },
      { step: 4, text: 'Выпекать 50 минут при 175°C' },
    ],
    ingredients: [
      { group: 'банан', categoryHint: 'Фрукты', keywords: ['банан'] },
      { group: 'мука',  categoryHint: 'Выпечка', keywords: ['мука'] },
      { group: 'яйца',  categoryHint: 'Молоко',  keywords: ['яйц'] },
      { group: 'сливочное масло', categoryHint: 'Молоко', keywords: ['масло сливочн','масло кресть'] },
    ],
  },
  {
    id: 'fish-cutlets',
    name: 'Рыбные котлеты',
    emoji: '🐟',
    steps: [
      { step: 1, text: 'Прокрутить рыбу в фарш' },
      { step: 2, text: 'Добавить лук и яйцо' },
      { step: 3, text: 'Сформировать котлеты' },
      { step: 4, text: 'Обжарить с двух сторон' },
    ],
    ingredients: [
      { group: 'белая рыба', categoryHint: 'Рыба',   keywords: ['треска','минтай','хек','тилапия','пикш','рыб'] },
      { group: 'лук',        categoryHint: null,     keywords: ['лук'] },
      { group: 'яйца',       categoryHint: 'Молоко', keywords: ['яйц'] },
    ],
  },
  {
    id: 'tefteli',
    name: 'Тефтели в томатном соусе',
    emoji: '🍅',
    steps: [
      { step: 1, text: 'Смешать фарш с рисом и луком' },
      { step: 2, text: 'Сформировать тефтели' },
      { step: 3, text: 'Приготовить томатный соус' },
      { step: 4, text: 'Тушить в соусе 25 минут' },
    ],
    ingredients: [
      { group: 'фарш мясной',   categoryHint: 'Мясо', keywords: ['фарш'] },
      { group: 'рис',           categoryHint: null,   keywords: ['рис'] },
      { group: 'лук',           categoryHint: null,   keywords: ['лук'] },
      { group: 'томатная паста', categoryHint: null,  keywords: ['томатн','кетчуп'] },
    ],
  },
];

/**
 * Returns recipes that have ≥ 2/3 of ingredients matched in availableProducts.
 * Used to inject recipe promo cards into the catalog grid.
 */
export function getRecipesForCatalog(availableProducts, limit = 6) {
  const seen = new Set();
  return FALLBACK_RECIPES
    .map((recipe) => {
      const ingredientProducts = recipe.ingredients
        .map((ing) =>
          (availableProducts || []).find((p) =>
            titleMatches(p.title || p.name || '', p.category || '', ing)
          ) || null
        )
        .filter(Boolean);
      return { ...recipe, ingredientProducts };
    })
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      const total = r.ingredients.length;
      return r.ingredientProducts.length >= Math.ceil(total * 2 / 3);
    })
    .slice(0, limit);
}

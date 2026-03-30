// Robin Food Screens — Grocerya style
// Frame: 430×932, light theme, #bdff32 accent

// ─── Fonts ────────────────────────────────────────────────────────────────────
const fonts = [
  {family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},
  {family:'Manrope',style:'SemiBold'},{family:'Manrope',style:'Bold'},
  {family:'Manrope',style:'ExtraBold'},
  {family:'Inter',style:'Regular'},{family:'Inter',style:'Medium'},
  {family:'Inter',style:'Semi Bold'},{family:'Inter',style:'Bold'},
];
for (const f of fonts) await figma.loadFontAsync(f);

// ─── Design Tokens (Grocerya palette) ─────────────────────────────────────────
const T = {
  acid:     '#bdff32',   // Grocerya Lime Green = Robin Food acid
  green:    '#2db217',   // Support Green
  red:      '#ee4747',   // Support Red
  yellow:   '#eab600',   // Support Yellow
  black:    '#0d0d0d',   // Black/Main
  white:    '#ffffff',   // White/Main
  greyBg:   '#f8f8f8',   // Grey/Basic
  greyCard: '#f2f2f3',   // Grey/Accent
  greyMid:  '#cccccc',   // Grey/Accent-2
  greyText: '#777777',   // Grey/Text
  orange:   '#ff6d00',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgb(h) {
  const s = h.replace('#','');
  return {
    r: parseInt(s.substring(0,2),16) / 255,
    g: parseInt(s.substring(2,4),16) / 255,
    b: parseInt(s.substring(4,6),16) / 255,
  };
}
function sp(hex, opacity) {
  const rgb = hexToRgb(hex);
  const p = { type:'SOLID', color:{ r:rgb.r, g:rgb.g, b:rgb.b } };
  if (opacity !== undefined && opacity !== 1) p.opacity = opacity;
  return [p];
}
function gr(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return [{
    type:'GRADIENT_LINEAR',
    gradientTransform:[[1,0,0],[0,1,0]],
    gradientStops:[
      {position:0, color:{r:c1.r,g:c1.g,b:c1.b,a:1}},
      {position:1, color:{r:c2.r,g:c2.g,b:c2.b,a:1}},
    ]
  }];
}
function elev(y=4,blur=12,a=0.08) {
  return [{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a},offset:{x:0,y},radius:blur,spread:0,visible:true,blendMode:'NORMAL'}];
}

// Create text node
function T_(str, {fam='Inter',sty='Regular',sz=14,col=T.black,ax=0,ay=0,aw,ah,align='LEFT'}={}) {
  const t = figma.createText();
  t.fontName = {family:fam, style:sty};
  t.characters = str;
  t.fontSize = sz;
  t.fills = sp(col);
  if (aw) { t.resize(aw, ah||sz+4); t.textAutoResize='HEIGHT'; }
  else t.textAutoResize='WIDTH_AND_HEIGHT';
  if (align!=='LEFT') t.textAlignHorizontal=align;
  t.x=ax; t.y=ay;
  return t;
}

// Create frame
function F(name,w,h,{fill=T.white,radius=0,ax=0,ay=0,clip=false,mode='NONE'}={}) {
  const f=figma.createFrame();
  f.name=name; f.resize(w,h); f.x=ax; f.y=ay;
  f.fills=sp(fill);
  if(radius) f.cornerRadius=radius;
  if(clip) f.clipsContent=true;
  if(mode!=='NONE'){f.layoutMode=mode;}
  return f;
}

// Pill badge
function Badge(label,bg,tc,{ax=0,ay=0}={}) {
  const b=F(label,80,22,{fill:bg,radius:100,ax,ay,mode:'HORIZONTAL'});
  b.primaryAxisAlignItems='CENTER'; b.counterAxisAlignItems='CENTER';
  b.paddingLeft=8; b.paddingRight=8;
  b.primaryAxisSizingMode='AUTO'; b.counterAxisSizingMode='AUTO';
  const t=T_(label,{sz:10,col:tc,sty:'Medium'});
  b.appendChild(t);
  return b;
}

// Primary button
function Btn(label,{ax=0,ay=0,w=390,h=52,bg=T.acid,tc=T.black,radius=14,sz=15,sty='Semi Bold'}={}) {
  const b=F(label,w,h,{fill:bg,radius,ax,ay});
  b.layoutMode='HORIZONTAL'; b.primaryAxisAlignItems='CENTER'; b.counterAxisAlignItems='CENTER';
  b.primaryAxisSizingMode='FIXED'; b.counterAxisSizingMode='FIXED';
  b.effects=elev(4,16,0.15);
  const t=T_(label,{fam:'Inter',sty,sz,col:tc});
  b.appendChild(t);
  return b;
}

// Divider
function Div(w,{ax=0,ay=0}={}) {
  const r=figma.createRectangle();
  r.name='divider'; r.resize(w,1);
  r.fills=sp(T.greyMid, 0.5);
  r.x=ax; r.y=ay;
  return r;
}

// Input field (Grocerya pill style)
function Input(placeholder,{ax=0,ay=0,w=390,h=52}={}) {
  const f=F(placeholder,w,h,{fill:T.greyCard,radius:100,ax,ay});
  f.appendChild(T_(placeholder,{sz:15,col:T.greyText,ax:20,ay:16}));
  return f;
}

// Status bar
function StatusBar(parent) {
  const sb=F('Status Bar',430,44,{fill:T.white});
  sb.appendChild(T_('9:41',{fam:'Manrope',sty:'SemiBold',sz:15,col:T.black,ax:20,ay:14}));
  sb.appendChild(T_('●●●',{sz:12,col:T.black,ax:360,ay:16}));
  parent.appendChild(sb);
}

// Bottom nav
function BottomNav(parent, active=0) {
  const nav=F('Bottom Nav',430,80,{fill:T.white,ay:852});
  nav.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.05},offset:{x:0,y:-2},radius:8,spread:0,visible:true,blendMode:'NORMAL'}];
  const tabs=[{i:'🏠',l:'Home'},{i:'🔍',l:'Search'},{i:'🛒',l:'Cart'},{i:'★',l:'Favorites'},{i:'👤',l:'Profile'}];
  tabs.forEach((tab,idx) => {
    const isA=idx===active;
    const tf=F(tab.l,86,64,{fill:T.white,ay:8});
    tf.x=idx*86;
    const ic=T_(tab.i,{sz:22,col:isA?T.black:T.greyText,ax:32,ay:4});
    tf.appendChild(ic);
    const lb=T_(tab.l,{fam:'Inter',sty:isA?'Semi Bold':'Regular',sz:10,col:isA?T.black:T.greyText,ax:isA?28:30,ay:30});
    tf.appendChild(lb);
    if(isA){
      const dot=figma.createEllipse(); dot.resize(6,6);
      dot.x=40; dot.y=54; dot.fills=sp(T.acid);
      tf.appendChild(dot);
    }
    nav.appendChild(tf);
  });
  parent.appendChild(nav);
}

// ─── Create / reset page ──────────────────────────────────────────────────────
const old=figma.root.children.find(p=>p.name==='🥦 Robin Food');
if(old) old.remove();
const page=figma.createPage();
page.name='🥦 Robin Food';
figma.currentPage=page;

const FW=430, FH=932;
let SX=0;
const GAP=40;

// ═══════════════════════════════════════════════════════════════════════════════
// 1. AUTH PHONE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('AuthPhoneScreen',FW,FH,{fill:T.white,ax:SX});
  StatusBar(s);

  // Hero
  const hero=F('Hero',FW,280,{fill:T.acid,ay:44});
  hero.appendChild(T_('🌿',{sz:56,ax:175,ay:48}));
  hero.appendChild(T_('Robin Food',{fam:'Manrope',sty:'ExtraBold',sz:36,col:T.black,ax:FW/2-90,ay:120}));
  hero.appendChild(T_('Спасите еду — спасите бюджет',{sz:14,col:T.black,sty:'Regular',ax:FW/2-120,ay:166,aw:240,align:'CENTER'}));
  s.appendChild(hero);

  // Form
  s.appendChild(T_('Войти в аккаунт',{fam:'Manrope',sty:'Bold',sz:22,col:T.black,ax:20,ay:356}));
  s.appendChild(T_('Введите номер телефона для входа',{sz:14,col:T.greyText,ax:20,ay:386}));
  s.appendChild(Input('+7 (___) ___-__-__',{ax:20,ay:420,w:FW-40}));

  // Consent
  const cbRow=F('Consent',FW-40,40,{fill:T.white,ax:20,ay:484});
  const cb=F('cb',20,20,{fill:T.acid,radius:6,ay:10});
  cb.appendChild(T_('✓',{fam:'Manrope',sty:'Bold',sz:12,col:T.black,ax:3,ay:3}));
  cbRow.appendChild(cb);
  cbRow.appendChild(T_('Согласен на обработку персональных данных (152-ФЗ)',{sz:11,col:T.greyText,ax:28,ay:10,aw:FW-40-36}));
  s.appendChild(cbRow);

  s.appendChild(Btn('Получить код',{ax:20,ay:540,w:FW-40}));

  s.appendChild(T_('Продолжая, вы принимаете условия использования',{sz:12,col:T.greyText,ax:FW/2-150,ay:612,aw:300,align:'CENTER'}));

  page.appendChild(s);
  SX+=FW+GAP;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. AUTH OTP SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('AuthOTPScreen',FW,FH,{fill:T.white,ax:SX});
  StatusBar(s);

  s.appendChild(T_('←',{fam:'Manrope',sty:'Bold',sz:24,col:T.black,ax:20,ay:64}));
  s.appendChild(T_('Введите код',{fam:'Manrope',sty:'ExtraBold',sz:30,col:T.black,ax:20,ay:120}));
  s.appendChild(T_('Мы отправили SMS на номер\n+7 (999) 123-45-67',{sz:15,col:T.greyText,ax:20,ay:166,aw:FW-40}));

  // OTP boxes
  const digits=['3','7','—','—','—','—'];
  digits.forEach((d,i) => {
    const isFilled=d!=='—';
    const box=F(`otp_${i}`,56,64,{fill:isFilled?T.acid:T.greyCard,radius:16,ax:20+i*68,ay:256});
    box.appendChild(T_(d,{fam:'Manrope',sty:'Bold',sz:28,col:T.black,ax:isFilled?18:22,ay:18}));
    s.appendChild(box);
  });

  s.appendChild(T_('Повторить через 01:45',{sz:14,col:T.greyText,ax:FW/2-90,ay:356}));

  // Progress hint
  const hint=F('Hint',FW-40,48,{fill:T.greyCard,radius:12,ax:20,ay:400});
  hint.appendChild(T_('Введите 6-значный код из SMS',{sz:13,col:T.greyText,ax:16,ay:16}));
  s.appendChild(hint);

  s.appendChild(T_('Не пришёл код? Проверьте номер',{sz:12,col:T.greyText,ax:FW/2-120,ay:780,aw:240,align:'CENTER'}));

  page.appendChild(s);
  SX+=FW+GAP;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('HomeScreen',FW,FH,{fill:T.greyBg,ax:SX});
  StatusBar(s);

  // Header
  const hdr=F('Header',FW,60,{fill:T.white,ay:44});
  hdr.appendChild(T_('📍 ул. Ленина, 15 ▾',{fam:'Manrope',sty:'SemiBold',sz:15,col:T.black,ax:16,ay:20}));
  hdr.appendChild(T_('🔔',{sz:22,ax:FW-50,ay:18}));
  s.appendChild(hdr);

  // Search
  s.appendChild(Input('🔍  Найти продукты...',{ax:20,ay:120,w:FW-40,h:48}));

  // Banner
  const ban=F('Banner',FW-40,160,{fill:T.acid,radius:20,ax:20,ay:184});
  ban.appendChild(T_('Спасите еду\nсегодня 🌱',{fam:'Manrope',sty:'ExtraBold',sz:26,col:T.black,ax:16,ay:20,aw:220}));
  ban.appendChild(T_('42 товара со скидкой рядом',{sz:13,col:T.black,ax:16,ay:112}));
  const banBtn=Btn('Смотреть →',{ax:FW-40-148,ay:110,w:132,h:36,bg:T.black,tc:T.white,radius:18,sz:12});
  ban.appendChild(banBtn);
  s.appendChild(ban);

  // Categories
  s.appendChild(T_('Категории',{fam:'Manrope',sty:'Bold',sz:18,col:T.black,ax:20,ay:364}));
  const cats=[['🥐 Выпечка',T.acid,T.black],['🥛 Молоко',T.greyCard,T.black],['🥗 Готовое',T.greyCard,T.black],['🥩 Мясо',T.greyCard,T.black]];
  cats.forEach(([l,bg,tc],i)=>{
    const c=Badge(l,bg,tc,{ax:20+i*100,ay:394});
    s.appendChild(c);
  });

  // Stores
  s.appendChild(T_('Магазины рядом',{fam:'Manrope',sty:'Bold',sz:18,col:T.black,ax:20,ay:442}));
  const stores=[
    {name:'Пятёрочка',addr:'ул. Ленина, 15 · 1.2 км',items:'12 товаров со скидкой',time:'до 23:00'},
    {name:'Магнит',addr:'пр. Мира, 44 · 0.8 км',items:'8 товаров со скидкой',time:'до 22:00'},
    {name:'ВкусВилл',addr:'ул. Садовая, 12 · 2.1 км',items:'5 товаров со скидкой',time:'до 21:00'},
  ];
  stores.forEach((st,i)=>{
    const sc=F('StoreCard',FW-40,88,{fill:T.white,radius:16,ax:20,ay:476+i*100});
    sc.effects=elev(2,8,0.06);
    const logo=F('logo',52,52,{fill:T.acid,radius:12,ay:18});
    logo.x=12;
    logo.appendChild(T_('🏪',{sz:26,ax:12,ay:12}));
    sc.appendChild(logo);
    sc.appendChild(T_(st.name,{fam:'Manrope',sty:'SemiBold',sz:16,col:T.black,ax:76,ay:12}));
    sc.appendChild(T_(st.addr,{sz:12,col:T.greyText,ax:76,ay:34}));
    sc.appendChild(T_('🟢 '+st.time+' · '+st.items,{sz:11,col:T.green,ax:76,ay:56}));
    s.appendChild(sc);
  });

  BottomNav(s,0);
  page.appendChild(s);
  SX+=FW+GAP;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. PRODUCT DETAIL SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('ProductDetailScreen',FW,FH,{fill:T.white,ax:SX});
  StatusBar(s);

  // Photo
  const photo=F('Photo',FW,320,{fill:T.greyCard,ay:44,clip:true});
  photo.appendChild(T_('🥐',{sz:140,ax:140,ay:70}));
  photo.appendChild(T_('←',{fam:'Manrope',sty:'Bold',sz:22,col:T.black,ax:20,ay:16}));
  photo.appendChild(T_('♡',{sz:22,col:T.black,ax:FW-46,ay:16}));
  const freshB=Badge('🟢 Свежий',T.acid,T.black,{ax:16,ay:272});
  photo.appendChild(freshB);
  const discB=Badge('-40%',T.black,T.acid,{ax:FW-76,ay:272});
  photo.appendChild(discB);
  s.appendChild(photo);

  // Prices
  s.appendChild(T_('150 ₽',{fam:'Manrope',sty:'ExtraBold',sz:32,col:T.black,ax:20,ay:380}));
  s.appendChild(T_('250 ₽',{sz:16,col:T.greyText,ax:100,ay:392}));
  const saveBadge=Badge('Экономия 100 ₽',T.acid,T.black,{ax:20,ay:428});
  s.appendChild(saveBadge);

  // Title
  s.appendChild(T_('Круассан с миндалём',{fam:'Manrope',sty:'Bold',sz:22,col:T.black,ax:20,ay:468}));
  s.appendChild(T_('Пятёрочка · ул. Ленина, 15',{sz:13,col:T.greyText,ax:20,ay:498}));
  s.appendChild(T_('Годен до: 12.02.2026',{sz:12,col:T.greyText,ax:20,ay:518}));
  s.appendChild(Div(FW-40,{ax:20,ay:540}));

  // КБЖУ
  s.appendChild(T_('Пищевая ценность на 100 г',{fam:'Manrope',sty:'SemiBold',sz:14,col:T.black,ax:20,ay:552}));
  const kbju=[['370','ккал'],['8г','белки'],['18г','жиры'],['45г','углев']];
  kbju.forEach(([v,l],i)=>{
    const kf=F(`k${i}`,88,52,{fill:T.greyCard,radius:12,ax:20+i*96,ay:576});
    kf.appendChild(T_(v,{fam:'Manrope',sty:'Bold',sz:18,col:T.black,ax:0,ay:8,aw:88,align:'CENTER'}));
    kf.appendChild(T_(l,{sz:11,col:T.greyText,ax:0,ay:30,aw:88,align:'CENTER'}));
    s.appendChild(kf);
  });

  s.appendChild(Div(FW-40,{ax:20,ay:640}));
  s.appendChild(T_('Свежий круассан с миндальной начинкой. Выпечен сегодня утром в пекарне Пятёрочки.',{sz:13,col:T.greyText,ax:20,ay:652,aw:FW-40}));

  // CTA bar
  const ctaBar=F('CTA',FW,88,{fill:T.white,ay:FH-88});
  ctaBar.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.06},offset:{x:0,y:-2},radius:8,spread:0,visible:true,blendMode:'NORMAL'}];
  ctaBar.appendChild(Btn('Добавить в корзину · 150 ₽',{ax:20,ay:18,w:FW-40,h:52}));
  s.appendChild(ctaBar);

  page.appendChild(s);
  SX+=FW+GAP;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CART SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('CartScreen',FW,FH,{fill:T.greyBg,ax:SX});
  StatusBar(s);

  // Header
  const hdr=F('CartHeader',FW,56,{fill:T.white,ay:44});
  hdr.appendChild(T_('Корзина',{fam:'Manrope',sty:'ExtraBold',sz:24,col:T.black,ax:20,ay:16}));
  hdr.appendChild(T_('Очистить',{sz:13,col:T.red,ax:FW-90,ay:20}));
  s.appendChild(hdr);

  // Store group
  const sg=F('StoreGroup',FW-40,220,{fill:T.white,radius:20,ax:20,ay:116});
  sg.effects=elev(2,8,0.06);
  sg.appendChild(T_('🏪 Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'SemiBold',sz:14,col:T.black,ax:16,ay:16}));
  sg.appendChild(Div(FW-40-32,{ax:16,ay:40}));

  const cartItems=[
    {e:'🥐',n:'Круассан с миндалём',p:'150 ₽',o:'250 ₽',q:'2'},
    {e:'🥛',n:'Молоко 3.2% 1л',p:'89 ₽',o:'120 ₽',q:'1'},
  ];
  cartItems.forEach((item,i)=>{
    const row=F(`row${i}`,FW-40-32,72,{fill:T.white,ax:16,ay:52+i*80});
    const photo=F('p',48,48,{fill:T.greyCard,radius:12,ay:12});
    photo.appendChild(T_(item.e,{sz:26,ax:10,ay:10}));
    row.appendChild(photo);
    row.appendChild(T_(item.n,{fam:'Manrope',sty:'SemiBold',sz:14,col:T.black,ax:60,ay:8,aw:180}));
    row.appendChild(T_(item.o,{sz:11,col:T.greyText,ax:60,ay:30}));
    row.appendChild(T_(item.p,{fam:'Manrope',sty:'Bold',sz:16,col:T.black,ax:106,ay:28}));
    // Stepper
    const st=F('step',88,32,{fill:T.greyCard,radius:100,ax:FW-40-32-96,ay:20});
    st.appendChild(T_('−',{fam:'Manrope',sty:'Bold',sz:18,col:T.greyText,ax:12,ay:6}));
    st.appendChild(T_(item.q,{fam:'Manrope',sty:'Bold',sz:16,col:T.black,ax:40,ay:7}));
    st.appendChild(T_('+',{fam:'Manrope',sty:'Bold',sz:18,col:T.black,ax:64,ay:6}));
    row.appendChild(st);
    sg.appendChild(row);
    if(i<cartItems.length-1) sg.appendChild(Div(FW-40-32,{ax:16,ay:122+i*80}));
  });
  s.appendChild(sg);

  // Summary card
  const sum=F('Summary',FW-40,120,{fill:T.white,radius:20,ax:20,ay:352});
  sum.effects=elev(2,8,0.06);
  sum.appendChild(T_('3 товара',{sz:13,col:T.greyText,ax:16,ay:16}));
  sum.appendChild(T_('389 ₽',{fam:'Manrope',sty:'ExtraBold',sz:28,col:T.black,ax:16,ay:36}));
  sum.appendChild(T_('Вы экономите 201 ₽',{sz:12,col:T.green,ax:16,ay:72}));
  const saveBadge2=Badge('-34%',T.acid,T.black);
  saveBadge2.x=FW-40-90; saveBadge2.y=48;
  sum.appendChild(saveBadge2);
  s.appendChild(sum);

  // Replacement
  const repl=F('Replacement',FW-40,100,{fill:T.white,radius:20,ax:20,ay:488});
  repl.effects=elev(2,8,0.06);
  repl.appendChild(T_('Если товара нет в наличии',{fam:'Manrope',sty:'SemiBold',sz:14,col:T.black,ax:16,ay:12}));
  repl.appendChild(T_('✓  Убрать из заказа',{sz:13,col:T.black,ax:16,ay:40}));
  repl.appendChild(T_('○  Заменить аналогом',{sz:13,col:T.greyText,ax:16,ay:64}));
  s.appendChild(repl);

  s.appendChild(Btn('Оформить заказ',{ax:20,ay:616,w:FW-40}));

  BottomNav(s,2);
  page.appendChild(s);
  SX+=FW+GAP;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. ORDER TRACKING SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('OrderTrackingScreen',FW,FH,{fill:T.greyBg,ax:SX});
  StatusBar(s);

  // Header
  const hdr=F('TrackHeader',FW,56,{fill:T.white,ay:44});
  hdr.appendChild(T_('← Заказ #1234',{fam:'Manrope',sty:'Bold',sz:20,col:T.black,ax:16,ay:16}));
  s.appendChild(hdr);

  // Tabs
  const tabs=F('Tabs',FW,44,{fill:T.white,ay:100});
  const tLabels=['Статус','Состав','Чат'];
  tLabels.forEach((l,i)=>{
    const isA=i===0;
    tabs.appendChild(T_(l,{fam:'Inter',sty:isA?'Semi Bold':'Regular',sz:15,col:isA?T.black:T.greyText,ax:20+i*130,ay:12}));
    if(isA){
      const ul=figma.createRectangle(); ul.resize(48,3); ul.fills=sp(T.acid);
      ul.cornerRadius=2; ul.x=16+i*130; ul.y=41;
      tabs.appendChild(ul);
    }
  });
  s.appendChild(tabs);

  // Status banner
  const banner=F('StatusBanner',FW-40,80,{fill:T.acid,radius:20,ax:20,ay:160});
  banner.appendChild(T_('🎉 Заказ собран!',{fam:'Manrope',sty:'ExtraBold',sz:20,col:T.black,ax:16,ay:16}));
  banner.appendChild(T_('Ваш заказ ждёт вас в магазине. Нажмите «Я на месте»',{sz:12,col:T.black,ax:16,ay:44,aw:FW-40-32}));
  s.appendChild(banner);

  // Progress stepper
  s.appendChild(T_('Прогресс',{fam:'Manrope',sty:'SemiBold',sz:15,col:T.black,ax:20,ay:260}));
  const stepLabels=['Создан','Подтв.','Сборка','Готов','На месте','Завершён'];
  const stepsDone=4;
  const SY=290;
  const stepW=(FW-40)/6;
  stepLabels.forEach((sl,i)=>{
    const cx=20+i*stepW+stepW/2;
    const isDone=i<stepsDone;
    const isCurr=i===stepsDone;
    const col=isDone||isCurr?T.acid:T.greyCard;
    const borderCol=isDone||isCurr?T.black:T.greyMid;
    const dot=figma.createEllipse();
    dot.resize(22,22); dot.x=cx-11; dot.y=SY;
    dot.fills=sp(col);
    dot.strokes=[{type:'SOLID',color:hexToRgb(borderCol)}];
    dot.strokeWeight=2;
    s.appendChild(dot);
    if(isDone){
      const ck=T_('✓',{fam:'Manrope',sty:'Bold',sz:11,col:T.black});
      ck.x=cx-5; ck.y=SY+5; s.appendChild(ck);
    }
    if(i<stepLabels.length-1){
      const line=figma.createRectangle();
      line.resize(Math.round(stepW-22),2); line.x=cx+11; line.y=SY+10;
      line.fills=sp(isDone?T.acid:T.greyMid);
      s.appendChild(line);
    }
    const lt=T_(sl,{sz:9,col:isDone||isCurr?T.black:T.greyText,aw:Math.round(stepW),align:'CENTER'});
    lt.x=cx-stepW/2; lt.y=SY+28; s.appendChild(lt);
  });

  // Store info
  const storeInfo=F('StoreInfo',FW-40,72,{fill:T.white,radius:16,ax:20,ay:360});
  storeInfo.effects=elev(2,8,0.06);
  storeInfo.appendChild(T_('🏪 Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'SemiBold',sz:15,col:T.black,ax:16,ay:10}));
  storeInfo.appendChild(T_('Маршрут → Открыть в картах',{sz:12,col:T.green,ax:16,ay:38}));
  s.appendChild(storeInfo);

  // Arrival button
  s.appendChild(Btn('📍  Я на месте',{ax:20,ay:452,w:FW-40,h:56,bg:T.acid,tc:T.black,radius:16}));

  // Cancel link
  s.appendChild(T_('Отменить заказ',{sz:14,col:T.red,ax:FW/2-60,ay:524}));

  // Items preview
  const items2=F('ItemsPreview',FW-40,148,{fill:T.white,radius:20,ax:20,ay:556});
  items2.effects=elev(2,8,0.06);
  items2.appendChild(T_('Состав заказа',{fam:'Manrope',sty:'Bold',sz:14,col:T.black,ax:16,ay:12}));
  items2.appendChild(Div(FW-40-32,{ax:16,ay:36}));
  items2.appendChild(T_('🥐 Круассан с миндалём × 2',{sz:13,col:T.black,ax:16,ay:48}));
  items2.appendChild(T_('300 ₽',{fam:'Manrope',sty:'Bold',sz:13,col:T.black,ax:FW-40-68,ay:48}));
  items2.appendChild(T_('🥛 Молоко 3.2% × 1',{sz:13,col:T.black,ax:16,ay:76}));
  items2.appendChild(T_('89 ₽',{fam:'Manrope',sty:'Bold',sz:13,col:T.black,ax:FW-40-56,ay:76}));
  items2.appendChild(Div(FW-40-32,{ax:16,ay:106}));
  items2.appendChild(T_('Итого: 389 ₽  (экономия 201 ₽)',{fam:'Manrope',sty:'Bold',sz:14,col:T.black,ax:16,ay:118}));
  s.appendChild(items2);

  BottomNav(s,0);
  page.appendChild(s);
  SX+=FW+GAP;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s=F('ProfileScreen',FW,FH,{fill:T.greyBg,ax:SX});
  StatusBar(s);

  // Header
  const phdr=F('ProfileHeader',FW,180,{fill:T.acid,ay:44});
  const ava=F('Avatar',76,76,{fill:T.black,radius:38,ax:FW/2-38,ay:20});
  ava.appendChild(T_('АИ',{fam:'Manrope',sty:'Bold',sz:28,col:T.acid,ax:18,ay:22}));
  phdr.appendChild(ava);
  phdr.appendChild(T_('Александр И.',{fam:'Manrope',sty:'ExtraBold',sz:20,col:T.black,ax:FW/2-68,ay:108}));
  phdr.appendChild(T_('+7 (999) 123-45-67',{sz:14,col:T.black,ax:FW/2-80,ay:136}));
  s.appendChild(phdr);

  // Eco card
  const eco=F('EcoCard',FW-40,76,{fill:T.white,radius:20,ax:20,ay:240});
  eco.effects=elev(2,8,0.06);
  eco.appendChild(T_('🌍 Спасено продуктов: 24 шт',{fam:'Manrope',sty:'Bold',sz:14,col:T.black,ax:16,ay:12}));
  eco.appendChild(T_('−16.8 кг CO₂ · Экономия: 2 340 ₽',{sz:12,col:T.greyText,ax:16,ay:36}));
  const pbar=F('pbar',FW-40-32,6,{fill:T.greyCard,radius:3,ax:16,ay:60});
  const pfill=F('pfill',Math.round((FW-40-32)*0.65),6,{fill:T.acid,radius:3});
  pbar.appendChild(pfill);
  eco.appendChild(pbar);
  s.appendChild(eco);

  // Menu
  const menuItems=[
    {i:'💳',l:'Способы оплаты',s:'3 карты'},
    {i:'📍',l:'Адреса',s:'2 адреса'},
    {i:'🔔',l:'Smart Alerts',s:'5 алертов'},
    {i:'📋',l:'История заказов',s:'12 заказов'},
    {i:'❤️',l:'Избранное',s:'8 товаров'},
    {i:'⚙️',l:'Настройки',s:''},
  ];
  menuItems.forEach((item,i)=>{
    const row=F(`menu${i}`,FW-40,56,{fill:T.white,radius:16,ax:20,ay:332+i*64});
    row.effects=elev(1,4,0.05);
    row.appendChild(T_(item.i,{sz:22,ax:12,ay:16}));
    row.appendChild(T_(item.l,{fam:'Manrope',sty:'SemiBold',sz:15,col:T.black,ax:46,ay:18}));
    if(item.s) row.appendChild(T_(item.s,{sz:12,col:T.greyText,ax:FW-40-90,ay:20}));
    row.appendChild(T_('›',{fam:'Manrope',sty:'Bold',sz:20,col:T.greyMid,ax:FW-40-28,ay:16}));
    s.appendChild(row);
  });

  BottomNav(s,4);
  page.appendChild(s);
  SX+=FW+GAP;
}

// ─── Finish ───────────────────────────────────────────────────────────────────
figma.currentPage=page;
figma.viewport.scrollAndZoomIntoView(page.children);
return {
  ok: true,
  page: page.name,
  screens: page.children.length,
  names: page.children.map(n=>n.name)
};

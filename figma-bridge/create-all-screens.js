// Robin Food — Full App Screens
// Colors from src/data/constants.js + Grocerya DS
// Frame: 393×852 (iPhone 15 Pro)

const FONTS = [
  {family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},
  {family:'Manrope',style:'SemiBold'},{family:'Manrope',style:'Bold'},
  {family:'Manrope',style:'ExtraBold'},
  {family:'Inter',style:'Regular'},{family:'Inter',style:'Medium'},
  {family:'Inter',style:'Semi Bold'},{family:'Inter',style:'Bold'},
];
for (const f of FONTS) { try { await figma.loadFontAsync(f); } catch(e) {} }

// ─── Design Tokens (Robin Food) ───────────────────────────────────────────────
const acid     = '#BDFF00';
const green    = '#208C80';
const error    = '#FF5459';
const grayBg   = '#F5F5F5';
const black    = '#0D0D0D';
const white    = '#FFFFFF';
const grayCard = '#EFEFEF';
const grayText = '#757575';
const grayMid  = '#BDBDBD';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rgb(h) {
  if (h.startsWith('rgba')) {
    const m = h.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (m) return { r: parseInt(m[1])/255, g: parseInt(m[2])/255, b: parseInt(m[3])/255 };
  }
  const s = h.replace('#','').substring(0,6);
  return { r:parseInt(s.substring(0,2),16)/255, g:parseInt(s.substring(2,4),16)/255, b:parseInt(s.substring(4,6),16)/255 };
}
function sp(h, a) {
  const p = {type:'SOLID', color:rgb(h)};
  if (a !== undefined && a < 1) p.opacity = a;
  return [p];
}
function grd(h1,h2,angle=1) {
  const c1=rgb(h1), c2=rgb(h2);
  return [{type:'GRADIENT_LINEAR',
    gradientTransform: angle===1 ? [[0,0,0],[1,0,0]] : [[1,0,0],[0,1,0]],
    gradientStops:[{position:0,color:{...c1,a:1}},{position:1,color:{...c2,a:1}}]
  }];
}
function sh(y=4,blur=12,a=0.08) {
  return [{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a},offset:{x:0,y},radius:blur,spread:0,visible:true,blendMode:'NORMAL'}];
}

function F(n,w,h,{bg=white,r=0,x=0,y=0,clip=false}={}) {
  const f=figma.createFrame();
  f.name=n; f.resize(w,h); f.x=x; f.y=y;
  f.fills=bg==='none'?[]:sp(bg);
  if(r) f.cornerRadius=r;
  if(clip) f.clipsContent=true;
  return f;
}
function R(w,h,{bg=grayCard,r=0,x=0,y=0}={}) {
  const rect=figma.createRectangle();
  rect.resize(w,h); rect.x=x; rect.y=y;
  rect.fills=sp(bg);
  if(r) rect.cornerRadius=r;
  return rect;
}
function T(str,{fam='Inter',sty='Regular',sz=14,c=black,x=0,y=0,w,h,align='LEFT',wrap=false}={}) {
  const t=figma.createText();
  try { t.fontName={family:fam,style:sty}; } catch(e) { t.fontName={family:'Inter',style:'Regular'}; }
  t.characters=String(str);
  t.fontSize=sz;
  t.fills=sp(c);
  if(w){ t.resize(w,h||Math.ceil(sz*1.4)); t.textAutoResize='HEIGHT'; }
  else t.textAutoResize='WIDTH_AND_HEIGHT';
  if(align!=='LEFT') t.textAlignHorizontal=align;
  t.x=x; t.y=y;
  return t;
}
function Div(w,{x=0,y=0,c=grayMid}={}) {
  const r=figma.createRectangle(); r.name='div';
  r.resize(w,1); r.x=x; r.y=y; r.fills=sp(c,0.4);
  return r;
}
function Pill(label,bg,tc,{x=0,y=0,h=24,px=10}={}) {
  const b=F(label,10,h,{bg,r:100,x,y});
  b.layoutMode='HORIZONTAL'; b.primaryAxisAlignItems='CENTER'; b.counterAxisAlignItems='CENTER';
  b.paddingLeft=px; b.paddingRight=px; b.paddingTop=4; b.paddingBottom=4;
  b.primaryAxisSizingMode='AUTO'; b.counterAxisSizingMode='AUTO';
  b.appendChild(T(label,{sz:11,c:tc,sty:'Bold'}));
  return b;
}
function Btn(label,{x=0,y=0,w=361,h=50,bg=black,tc=acid,r=16,sz=15,sty='Bold',shadow=true}={}) {
  const b=F(label,w,h,{bg,r,x,y});
  b.layoutMode='HORIZONTAL'; b.primaryAxisAlignItems='CENTER'; b.counterAxisAlignItems='CENTER';
  b.primaryAxisSizingMode='FIXED'; b.counterAxisSizingMode='FIXED';
  if(shadow) b.effects=sh(4,16,0.2);
  b.appendChild(T(label,{fam:'Manrope',sty,sz,c:tc}));
  return b;
}
function Input(placeholder,{x=0,y=0,w=361,h=52,bg=grayBg,r=16,icon=''}={}) {
  const f=F(placeholder,w,h,{bg,r,x,y});
  if(icon) f.appendChild(T(icon,{sz:18,x:14,y:(h-22)/2}));
  f.appendChild(T(placeholder,{sz:15,c:grayText,x:icon?44:16,y:(h-20)/2}));
  return f;
}
function StatusBar(parent,{dark=false}={}) {
  const sb=F('StatusBar',393,47,{bg:dark?black:white});
  sb.appendChild(T('9:41',{fam:'Manrope',sty:'SemiBold',sz:15,c:dark?white:black,x:20,y:15}));
  sb.appendChild(T(dark?'●●●  WiFi  🔋':'●●●  WiFi  🔋',{sz:11,c:dark?white:grayText,x:310,y:17}));
  parent.appendChild(sb);
}
function BottomNav(parent,active=0) {
  const nav=F('BottomNav',393,56,{bg:white,y:796});
  nav.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.06},offset:{x:0,y:-2},radius:8,spread:0,visible:true,blendMode:'NORMAL'}];
  const tabs=[
    {icon:'📡',label:'Главная'},
    {icon:'🔍',label:'Каталог'},
    {icon:'🛒',label:'Корзина'},
    {icon:'👤',label:'Профиль'},
  ];
  tabs.forEach((tab,i)=>{
    const isA=i===active;
    const tf=F(tab.label,98,56,{bg:white});
    tf.x=i*98; tf.y=0;
    tf.appendChild(T(tab.icon,{sz:22,c:isA?black:grayMid,x:38,y:4}));
    tf.appendChild(T(tab.label,{fam:'Inter',sty:isA?'Semi Bold':'Regular',sz:9,c:isA?black:grayMid,x:isA?38:40,y:30}));
    if(isA){
      const dot=figma.createEllipse(); dot.resize(5,5);
      dot.x=46; dot.y=48; dot.fills=sp(acid);
      tf.appendChild(dot);
    }
    if(i===2){
      const badge=F('badge',18,18,{bg:error,r:9,x:62,y:2});
      badge.appendChild(T('3',{sz:9,c:white,x:5,y:4,sty:'Bold'}));
      tf.appendChild(badge);
    }
    nav.appendChild(tf);
  });
  parent.appendChild(nav);
}

// ─── Page setup ───────────────────────────────────────────────────────────────
let PAGE=figma.root.children.find(p=>p.name==='🍏 Robin Food — Все экраны');
if(PAGE) {
  // Clear existing children instead of removing page
  for(const child of [...PAGE.children]) child.remove();
} else {
  PAGE=figma.createPage();
  PAGE.name='🍏 Robin Food — Все экраны';
}
figma.currentPage=PAGE;

const W=393, H=852;
let SX=0, SY=0;
const GAP=48;
const COL=8;
let screenIndex=0;

function addScreen(frame) {
  const col=screenIndex%COL;
  const row=Math.floor(screenIndex/COL);
  frame.x=col*(W+GAP);
  frame.y=row*(H+GAP+32);
  PAGE.appendChild(frame);
  screenIndex++;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROW 1 — ONBOARDING FLOW
// ═══════════════════════════════════════════════════════════════════════════════

// ── 1. SPLASH SCREEN ──────────────────────────────────────────────────────────
{
  const s=F('SplashScreen',W,H,{bg:black});
  // Video placeholder
  const vp=F('VideoPlaceholder',W,H,{bg:black,clip:true});
  const vpGrad=R(W,H,{x:0,y:0});
  vpGrad.fills=grd('#00C853','#BDFF00');
  vpGrad.opacity=0.15;
  vp.appendChild(vpGrad);
  s.appendChild(vp);
  // Robin logo
  s.appendChild(T('🌿',{sz:80,x:W/2-48,y:280}));
  s.appendChild(T('ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:38,c:acid,x:W/2-108,y:374,align:'CENTER'}));
  s.appendChild(T('Бережное потребление',{sz:14,c:white,x:W/2-90,y:420,align:'CENTER',w:180}));
  // Loading bar
  const lb=F('loadBar',200,4,{bg:white,r:2,x:W/2-100,y:760});
  lb.fills=sp(white,0.2);
  const lbFill=F('fill',140,4,{bg:acid,r:2});
  lb.appendChild(lbFill);
  s.appendChild(lb);
  // Fade vignette
  const vig=R(W,160,{x:0,y:H-160});
  vig.fills=grd('#000000','#00000000',0);
  s.appendChild(vig);
  addScreen(s);
}

// ── 2. ONBOARDING SLIDE 1 ─────────────────────────────────────────────────────
{
  const s=F('Onboarding-1',W,H,{bg:grayBg});
  // 55% image area
  const imgArea=F('SlideImage',W,Math.round(H*0.55),{bg:black,clip:true});
  const imgGrad=R(W,Math.round(H*0.55));
  imgGrad.fills=grd('#0a3320',green);
  imgArea.appendChild(imgGrad);
  imgArea.appendChild(T('🥦',{sz:140,x:110,y:80}));
  // Gradient overlay bottom
  const grad=R(W,120,{x:0,y:Math.round(H*0.55)-120});
  grad.fills=grd('#00000000',grayBg,0);
  imgArea.appendChild(grad);
  s.appendChild(imgArea);
  // White bottom sheet
  const sheet=F('BottomSheet',W,Math.round(H*0.5),{bg:white,r:50,x:0,y:Math.round(H*0.5)+8});
  // Dots
  const dots=['', acid, grayMid, grayMid, grayMid];
  const dotLabels=['','','',''];
  [0,1,2,3].forEach((d,i)=>{
    const dot=figma.createEllipse();
    dot.resize(i===0?28:8, 8);
    dot.x=W/2-30+i*14; dot.y=24;
    dot.fills=sp(i===0?acid:grayMid);
    sheet.appendChild(dot);
  });
  sheet.appendChild(T('Свежесть с выгодой\nдо 50%',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:24,y:56,w:W-48}));
  sheet.appendChild(T('Покупайте продукты со скидкой до истечения срока годности. Помогайте планете — экономьте бюджет.',{sz:14,c:grayText,x:24,y:130,w:W-48}));
  sheet.appendChild(Btn('Далее →',{x:16,y:280,w:W-32,h:50}));
  sheet.appendChild(T('Пропустить',{sz:14,c:grayMid,x:W/2-44,y:348}));
  s.appendChild(sheet);
  addScreen(s);
}

// ── 3. ONBOARDING SLIDE 2 ─────────────────────────────────────────────────────
{
  const s=F('Onboarding-2',W,H,{bg:grayBg});
  const imgArea=F('SlideImage',W,Math.round(H*0.55),{bg:black,clip:true});
  const imgBg=R(W,Math.round(H*0.55)); imgBg.fills=grd('#1a0a3a','#4a1580'); imgArea.appendChild(imgBg);
  imgArea.appendChild(T('📡',{sz:130,x:120,y:90}));
  s.appendChild(imgArea);
  const sheet=F('BottomSheet',W,Math.round(H*0.5),{bg:white,r:50,x:0,y:Math.round(H*0.5)+8});
  [0,1,2,3].forEach((d,i)=>{
    const dot=figma.createEllipse(); dot.resize(i===1?28:8,8);
    dot.x=W/2-30+i*14; dot.y=24; dot.fills=sp(i===1?acid:grayMid);
    sheet.appendChild(dot);
  });
  sheet.appendChild(T('Твой личный\nфуд-радар',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:24,y:56,w:W-48}));
  sheet.appendChild(T('Задай радиус и увидишь все магазины с истекающими скидками рядом с тобой в реальном времени.',{sz:14,c:grayText,x:24,y:130,w:W-48}));
  sheet.appendChild(Btn('Далее →',{x:16,y:280,w:W-32,h:50}));
  sheet.appendChild(T('Пропустить',{sz:14,c:grayMid,x:W/2-44,y:348}));
  s.appendChild(sheet);
  addScreen(s);
}

// ── 4. BASKET BUILDER ─────────────────────────────────────────────────────────
{
  const s=F('BasketBuilderScreen',W,H,{bg:white});
  StatusBar(s);
  s.appendChild(T('Что обычно\nпокупаешь?',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:20,y:64,w:W-40}));
  s.appendChild(T('Выбери категории — будем показывать релевантные предложения',{sz:13,c:grayText,x:20,y:128,w:W-40}));
  const cats=[
    ['🥩','Мясо'],['🐟','Рыба'],['🥛','Молоко'],
    ['🍞','Выпечка'],['🍎','Фрукты'],['🧃','Напитки'],
    ['🥦','Овощи'],['❄️','Заморозка'],['🍱','Готовое'],
  ];
  const cellW=Math.floor((W-40-16)/3);
  cats.forEach(([emoji,label],i)=>{
    const row=Math.floor(i/3), col=i%3;
    const isActive=i<4;
    const cell=F(label,cellW,cellW,{bg:isActive?black:grayCard,r:20,x:20+col*(cellW+8),y:172+row*(cellW+8)});
    cell.appendChild(T(emoji,{sz:36,x:cellW/2-22,y:24}));
    cell.appendChild(T(label,{fam:'Manrope',sty:'Bold',sz:13,c:isActive?acid:black,x:8,y:cellW-34,w:cellW-16,align:'CENTER'}));
    if(isActive){
      const ck=F('check',22,22,{bg:acid,r:11,x:cellW-28,y:6});
      ck.appendChild(T('✓',{fam:'Manrope',sty:'ExtraBold',sz:12,c:black,x:4,y:4}));
      cell.appendChild(ck);
    }
    s.appendChild(cell);
  });
  // Family size
  s.appendChild(T('Размер семьи',{fam:'Manrope',sty:'Bold',sz:16,c:black,x:20,y:610}));
  ['1','2','3','4+'].forEach((n,i)=>{
    const isA=i===1;
    const btn=F(n,80,44,{bg:isA?black:grayBg,r:12,x:20+i*84,y:636});
    btn.appendChild(T(n,{fam:'Manrope',sty:'ExtraBold',sz:18,c:isA?acid:grayText,x:isA?26:28,y:12}));
    s.appendChild(btn);
  });
  s.appendChild(Btn('Начать покупки',{x:16,y:706,w:W-32,h:50}));
  addScreen(s);
}

// ── 5. LOGIN SCREEN ───────────────────────────────────────────────────────────
{
  const s=F('LoginScreen',W,H,{bg:white});
  StatusBar(s);
  // Logo area
  const logoArea=F('LogoArea',W,200,{bg:grayBg,y:47,r:0});
  logoArea.appendChild(T('🌿',{sz:64,x:W/2-36,y:40}));
  logoArea.appendChild(T('ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:W/2-82,y:116}));
  logoArea.appendChild(T('Бережное потребление',{sz:12,c:green,x:W/2-70,y:152}));
  s.appendChild(logoArea);
  s.appendChild(T('Вход',{fam:'Manrope',sty:'ExtraBold',sz:32,c:black,x:20,y:272}));
  s.appendChild(T('Введите номер телефона',{sz:14,c:grayText,x:20,y:316}));
  s.appendChild(Input('+7 (999) 123-45-67',{x:16,y:348,w:W-32,bg:grayBg,r:20}));
  // Checkbox
  const cbRow=F('Consent',W-32,44,{bg:white,x:16,y:416});
  const cb=F('cb',20,20,{bg:acid,r:6,y:12});
  cb.appendChild(T('✓',{fam:'Manrope',sty:'ExtraBold',sz:11,c:black,x:3,y:3}));
  cbRow.appendChild(cb);
  cbRow.appendChild(T('Я согласен с правилами Robin Food',{sz:13,c:black,x:28,y:13,w:W-32-36}));
  s.appendChild(cbRow);
  s.appendChild(Btn('Отправить код',{x:16,y:480,w:W-32,h:52}));
  s.appendChild(T('Вход через СМС — быстро и безопасно',{sz:12,c:grayMid,x:W/2-110,y:548,align:'CENTER',w:220}));
  addScreen(s);
}

// ── 6. SMS OTP SCREEN ─────────────────────────────────────────────────────────
{
  const s=F('SmsScreen',W,H,{bg:white});
  StatusBar(s);
  s.appendChild(T('←',{fam:'Manrope',sty:'ExtraBold',sz:24,c:black,x:16,y:64}));
  s.appendChild(T('Введите код\nиз SMS',{fam:'Manrope',sty:'ExtraBold',sz:32,c:black,x:20,y:112,w:W-40}));
  s.appendChild(T('Код отправлен на +7 (999) 123-45-67',{sz:14,c:grayText,x:20,y:192,w:W-40}));
  // 6 OTP boxes
  const digits=['3','7','','','',''];
  const bw=52, bg2=W-32, bstart=16;
  digits.forEach((d,i)=>{
    const isFilled=d!=='';
    const box=F(`otp_${i}`,bw,64,{bg:isFilled?black:grayBg,r:16,x:bstart+i*(bw+8),y:240});
    box.appendChild(T(isFilled?d:'_',{fam:'Manrope',sty:'ExtraBold',sz:28,c:isFilled?acid:grayMid,x:isFilled?16:18,y:17}));
    s.appendChild(box);
  });
  s.appendChild(T('Повторить через 00:54',{sz:14,c:grayMid,x:W/2-80,y:328}));
  s.appendChild(Btn('Подтвердить',{x:16,y:400,w:W-32,h:52}));
  addScreen(s);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROW 2 — MAIN HUB
// ═══════════════════════════════════════════════════════════════════════════════

// ── 7. HOME SCREEN (Map + Radar) ──────────────────────────────────────────────
{
  const s=F('HomeScreen (Radar)',W,H,{bg:'#1a2e1e'});
  StatusBar(s,{dark:true});
  // Map background
  const mapBg=F('Map',W,480,{bg:'#2d4a2d',y:47,clip:true});
  const mapGrid=R(W,480,{bg:'#1a3020'}); mapBg.appendChild(mapGrid);
  // Grid lines
  for(let i=0;i<6;i++){
    const gl=R(W,1,{bg:'#2d5030',x:0,y:i*80}); mapBg.appendChild(gl);
    const gl2=R(1,480,{bg:'#2d5030',x:i*65,y:0}); mapBg.appendChild(gl2);
  }
  // Radar circle
  const radar=figma.createEllipse(); radar.resize(280,280);
  radar.x=W/2-140; radar.y=80;
  radar.fills=sp(acid,0.08); radar.strokes=[{type:'SOLID',color:rgb(acid)}];
  radar.strokeWeight=1.5; radar.dashPattern=[6,4];
  mapBg.appendChild(radar);
  // Store markers
  const markers=[{e:'🏪',x:120,y:130},{e:'🏪',x:240,y:180},{e:'🏪',x:160,y:280}];
  markers.forEach(m=>{
    const mk=F('marker',36,36,{bg:acid,r:18,x:m.x,y:m.y});
    mk.appendChild(T(m.e,{sz:18,x:9,y:8}));
    mapBg.appendChild(mk);
  });
  // User pin
  const pin=figma.createEllipse(); pin.resize(20,20);
  pin.x=W/2-10; pin.y=240;
  pin.fills=sp(acid); pin.strokes=[{type:'SOLID',color:{r:1,g:1,b:1}}];
  pin.strokeWeight=3; mapBg.appendChild(pin);
  s.appendChild(mapBg);
  // Address search bar
  const searchBar=F('AddressSearch',W-32,48,{bg:white,r:24,x:16,y:60});
  searchBar.effects=sh(2,8,0.15);
  searchBar.appendChild(T('📍',{sz:16,x:14,y:15}));
  searchBar.appendChild(T('ул. Ленина, 15',{fam:'Manrope',sty:'SemiBold',sz:14,c:black,x:40,y:15}));
  s.appendChild(searchBar);
  // Bottom sheet
  const bsheet=F('BottomSheet',W,H-480-47+20,{bg:white,r:32,x:0,y:480+47-20});
  bsheet.appendChild(T('Радиус перехвата',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:20,y:20}));
  bsheet.appendChild(T('3 магазина в радиусе 3 км',{sz:13,c:grayText,x:20,y:50}));
  // Slider
  const sliderBg=R(W-40,4,{bg:grayBg,r:2,x:20,y:84});
  bsheet.appendChild(sliderBg);
  const sliderFill=R(140,4,{bg:acid,r:2,x:20,y:84}); bsheet.appendChild(sliderFill);
  const sliderKnob=figma.createEllipse(); sliderKnob.resize(20,20);
  sliderKnob.x=152; sliderKnob.y=77; sliderKnob.fills=sp(acid);
  sliderKnob.strokes=[{type:'SOLID',color:{r:1,g:1,b:1}}]; sliderKnob.strokeWeight=2;
  bsheet.appendChild(sliderKnob);
  bsheet.appendChild(T('0.5 км',{sz:11,c:grayMid,x:20,y:96}));
  bsheet.appendChild(T('10 км',{sz:11,c:grayMid,x:W-60,y:96}));
  bsheet.appendChild(Btn('Искать лоты',{x:16,y:124,w:W-32,h:50}));
  s.appendChild(bsheet);
  addScreen(s);
}

// ── 8. HOME SCREEN (Store List) ───────────────────────────────────────────────
{
  const s=F('HomeScreen (Каталог)',W,H,{bg:grayBg});
  StatusBar(s);
  // Compact header
  const hdr=F('Header',W,56,{bg:white,y:47});
  hdr.effects=sh(2,6,0.06);
  // Logo
  hdr.appendChild(T('🌿 ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:16,c:black,x:16,y:18}));
  hdr.appendChild(T('📍',{sz:18,x:W-84,y:17}));
  hdr.appendChild(T('🔔',{sz:20,x:W-48,y:16}));
  const notifBadge=F('nb',8,8,{bg:error,r:4,x:W-38,y:14});
  hdr.appendChild(notifBadge);
  s.appendChild(hdr);
  // Search bar
  const sb=Input('🔍  Поиск товаров...',{x:16,y:116,w:W-32,bg:white,r:20});
  sb.effects=sh(1,4,0.06);
  s.appendChild(sb);
  // Category filter
  const cfY=180;
  s.appendChild(T('Категории',{fam:'Manrope',sty:'Bold',sz:16,c:black,x:16,y:cfY}));
  const catItems=[['Все',acid,black],['Мясо',grayCard,black],['Молоко',grayCard,black],['Выпечка',grayCard,black],['Фрукты',grayCard,black]];
  let cx2=16;
  catItems.forEach(([l,bg2,tc])=>{
    const chip=Pill(l,bg2,tc,{x:cx2,y:cfY+28,h:30,px:14});
    s.appendChild(chip); cx2+=70;
  });
  // Store cards
  s.appendChild(T('3 магазина рядом',{fam:'Manrope',sty:'Bold',sz:18,c:black,x:16,y:236}));
  const stores2=[
    {n:'Пятёрочка',a:'ул. Ленина, 15',d:'1.2 км',cnt:'12',logo:'🍎'},
    {n:'Магнит',a:'пр. Мира, 44',d:'0.8 км',cnt:'8',logo:'🧲'},
    {n:'ВкусВилл',a:'ул. Садовая, 12',d:'2.1 км',cnt:'5',logo:'🌿'},
  ];
  stores2.forEach((st,i)=>{
    const sc=F('StoreCard',W-32,80,{bg:white,r:20,x:16,y:268+i*92});
    sc.effects=sh(2,8,0.07);
    const logo=F('logo',52,52,{bg:grayBg,r:14,x:12,y:14});
    logo.appendChild(T(st.logo,{sz:26,x:12,y:12}));
    sc.appendChild(logo);
    sc.appendChild(T(st.n,{fam:'Manrope',sty:'Bold',sz:16,c:black,x:76,y:12}));
    sc.appendChild(T(st.a+' · '+st.d,{sz:12,c:grayText,x:76,y:36}));
    const badge=Pill(st.cnt+' скидок',acid,black,{x:76,y:56,h:20,px:8});
    sc.appendChild(badge);
    s.appendChild(sc);
  });
  BottomNav(s,0);
  addScreen(s);
}

// ── 9. CATALOG TAB ────────────────────────────────────────────────────────────
{
  const s=F('CatalogTab',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('Header',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('🌿 ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:16,c:black,x:16,y:18}));
  hdr.appendChild(T('⊞  ≡',{sz:16,c:grayText,x:W-60,y:20}));
  s.appendChild(hdr);
  const sb2=Input('🔍  Поиск...',{x:16,y:116,w:W-96,bg:white,r:20}); sb2.effects=sh(1,4,0.06);
  s.appendChild(sb2);
  const sortBtn=F('sort',72,52,{bg:white,r:20,x:W-88,y:108}); sortBtn.effects=sh(1,4,0.06);
  sortBtn.appendChild(T('↕ Сорт.',{sz:11,c:grayText,x:6,y:18}));
  s.appendChild(sortBtn);
  // Cat filter strip
  let catX=16;
  [['Все',acid,black],['Мясо',grayCard,black],['Выпечка',grayCard,black],['Молоко',grayCard,black]].forEach(([l,bg2,tc])=>{
    const ch=Pill(l,bg2,tc,{x:catX,y:178,h:30,px:14});
    s.appendChild(ch); catX+=74;
  });
  // Product grid (6 cards)
  const prods=[
    {e:'🥐',n:'Круассан',p:'150',o:'250',d:'40'},
    {e:'🥩',n:'Стейк рибай',p:'890',o:'1400',d:'36'},
    {e:'🥛',n:'Молоко 3.2%',p:'89',o:'120',d:'26'},
    {e:'🍎',n:'Яблоки 1кг',p:'120',o:'180',d:'33'},
    {e:'🐟','n':'Форель с/с',p:'450',o:'680',d:'34'},
    {e:'🥗',n:'Салат Цезарь',p:'280',o:'380',d:'26'},
  ];
  const cardW=(W-40-8)/2;
  prods.forEach((pr,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const card=F(pr.n,Math.round(cardW),200,{bg:white,r:20,x:16+col*(Math.round(cardW)+8),y:220+row*212});
    card.effects=sh(2,8,0.06);
    // Image
    const img=F('img',Math.round(cardW),120,{bg:grayBg,r:16,clip:true});
    img.appendChild(T(pr.e,{sz:60,x:Math.round(cardW)/2-36,y:28}));
    // Discount badge
    const db=F('disc',48,22,{bg:black,r:8,x:8,y:92});
    db.appendChild(T('-'+pr.d+'%',{fam:'Manrope',sty:'ExtraBold',sz:10,c:acid,x:6,y:6}));
    img.appendChild(db);
    card.appendChild(img);
    card.appendChild(T(pr.n,{fam:'Manrope',sty:'SemiBold',sz:13,c:black,x:10,y:128,w:Math.round(cardW)-20}));
    card.appendChild(T(pr.o+' ₽',{sz:11,c:grayMid,x:10,y:150}));
    card.appendChild(T(pr.p+' ₽',{fam:'Manrope',sty:'ExtraBold',sz:17,c:black,x:10,y:166}));
    s.appendChild(card);
  });
  BottomNav(s,1);
  addScreen(s);
}

// ── 10. PRODUCT DETAIL ────────────────────────────────────────────────────────
{
  const s=F('ProductDetailScreen',W,H,{bg:white});
  StatusBar(s);
  // Photo area (45vh)
  const ph=F('Photo',W,380,{bg:grayBg,y:47,clip:true});
  const phBg=R(W,380); phBg.fills=grd('#f0ece4','#e8e0d0'); ph.appendChild(phBg);
  ph.appendChild(T('🥐',{sz:180,x:90,y:70}));
  // Back
  const back=F('back',40,40,{bg:white,r:20,x:12,y:16}); back.effects=sh(2,8,0.12);
  back.appendChild(T('←',{sz:20,c:black,x:12,y:9})); ph.appendChild(back);
  // Heart
  const heart=F('heart',40,40,{bg:white,r:20,x:W-52,y:16}); heart.effects=sh(2,8,0.12);
  heart.appendChild(T('♡',{sz:20,c:error,x:10,y:9})); ph.appendChild(heart);
  // Badges
  ph.appendChild(Pill('🟢 Свежий',acid,black,{x:12,y:330,h:26,px:10}));
  ph.appendChild(Pill('-40%',black,acid,{x:W-78,y:330,h:26,px:10}));
  s.appendChild(ph);
  // Content
  const priceRow=F('priceRow',W,56,{bg:white,y:427});
  priceRow.appendChild(T('150 ₽',{fam:'Manrope',sty:'ExtraBold',sz:34,c:green,x:16,y:10}));
  priceRow.appendChild(T('250 ₽',{sz:16,c:grayMid,x:108,y:22}));
  priceRow.appendChild(Pill('−100 ₽',acid,black,{x:165,y:16,h:26}));
  s.appendChild(priceRow);
  s.appendChild(T('Круассан с миндалём',{fam:'Manrope',sty:'ExtraBold',sz:22,c:black,x:16,y:492,w:W-32}));
  s.appendChild(T('★★★★☆  4.2  (47 отзывов)',{sz:13,c:'#F4A22C',x:16,y:522}));
  s.appendChild(T('📍 Пятёрочка · ул. Ленина, 15',{sz:13,c:green,x:16,y:546}));
  s.appendChild(T('Годен до: 12.02.2026',{sz:12,c:grayMid,x:16,y:568}));
  s.appendChild(Div(W-32,{x:16,y:590}));
  // КБЖУ
  s.appendChild(T('Пищевая ценность',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:16,y:602}));
  const kbju=[['370','ккал'],['8г','белки'],['18г','жиры'],['45г','углев.']];
  kbju.forEach(([v,l],i)=>{
    const kf=F(`k${i}`,84,44,{bg:grayBg,r:12,x:16+i*86,y:626});
    kf.appendChild(T(v,{fam:'Manrope',sty:'ExtraBold',sz:16,c:black,x:4,y:6,w:76,align:'CENTER'}));
    kf.appendChild(T(l,{sz:10,c:grayText,x:4,y:28,w:76,align:'CENTER'}));
    s.appendChild(kf);
  });
  s.appendChild(T('Свежий круассан с начинкой из миндальной пасты. Выпечен сегодня.',{sz:13,c:grayText,x:16,y:682,w:W-32}));
  // Fixed CTA
  const cta=F('CTA',W,80,{bg:white,y:H-80});
  cta.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.08},offset:{x:0,y:-4},radius:12,spread:0,visible:true,blendMode:'NORMAL'}];
  // Stepper
  const step=F('stepper',100,44,{bg:grayBg,r:22,x:16,y:18});
  step.appendChild(T('−',{fam:'Manrope',sty:'ExtraBold',sz:22,c:grayText,x:14,y:10}));
  step.appendChild(T('1',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:44,y:11}));
  step.appendChild(T('+',{fam:'Manrope',sty:'ExtraBold',sz:22,c:black,x:70,y:10}));
  cta.appendChild(step);
  cta.appendChild(Btn('В корзину · 150 ₽',{x:128,y:16,w:W-144,h:48,bg:green,tc:white,r:16,sz:15,shadow:false}));
  s.appendChild(cta);
  addScreen(s);
}

// ── 11. STORE SCREEN ──────────────────────────────────────────────────────────
{
  const s=F('StoreScreen',W,H,{bg:grayBg});
  // Green header
  const hdr=F('StoreHeader',W,180,{bg:green});
  hdr.appendChild(T('←',{sz:22,c:white,x:16,y:56}));
  hdr.appendChild(T('♡',{sz:22,c:white,x:W-42,y:56}));
  hdr.appendChild(T('Пятёрочка',{fam:'Manrope',sty:'ExtraBold',sz:26,c:white,x:20,y:90}));
  hdr.appendChild(T('📍 ул. Ленина, 15  🕐 08:00–22:00',{sz:13,c:'rgba(255,255,255,0.85)',x:20,y:128}));
  const countBadge=Pill('12 товаров',acid,black,{x:20,y:152,h:26});
  hdr.appendChild(countBadge);
  s.appendChild(hdr);
  let catX3=16; s.appendChild(T('Фильтр:',{sz:12,c:grayText,x:16,y:196}));
  [['Все',acid,black],['Мясо',grayCard,black],['Выпечка',grayCard,black]].forEach(([l,bg2,tc])=>{
    const ch=Pill(l,bg2,tc,{x:catX3,y:216,h:28,px:12}); s.appendChild(ch); catX3+=74;
  });
  // Grid
  const prs=[{e:'🥐',n:'Круассан',p:'150',d:'40'},{e:'🥩',n:'Стейк',p:'890',d:'36'},{e:'🥛',n:'Молоко',p:'89',d:'26'},{e:'🍎',n:'Яблоки',p:'120',d:'33'}];
  const cw2=Math.round((W-40-8)/2);
  prs.forEach((pr,i)=>{
    const col=i%2, row=Math.floor(i/2);
    const card=F(pr.n,cw2,180,{bg:white,r:20,x:16+col*(cw2+8),y:260+row*192});
    card.effects=sh(2,8,0.06);
    const img2=F('img',cw2,104,{bg:grayBg,r:16,clip:true});
    img2.appendChild(T(pr.e,{sz:52,x:cw2/2-32,y:22}));
    const db2=F('d',46,20,{bg:black,r:6,x:6,y:80});
    db2.appendChild(T('-'+pr.d+'%',{fam:'Manrope',sty:'ExtraBold',sz:9,c:acid,x:5,y:5}));
    img2.appendChild(db2); card.appendChild(img2);
    card.appendChild(T(pr.n,{fam:'Manrope',sty:'SemiBold',sz:13,c:black,x:8,y:112,w:cw2-16}));
    card.appendChild(T(pr.p+' ₽',{fam:'Manrope',sty:'ExtraBold',sz:16,c:green,x:8,y:134}));
    const addBtn=F('+',32,32,{bg:acid,r:16,x:cw2-40,y:138});
    addBtn.appendChild(T('+',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:7,y:4}));
    card.appendChild(addBtn);
    s.appendChild(card);
  });
  BottomNav(s,0);
  addScreen(s);
}

// ── 12. CART SCREEN ───────────────────────────────────────────────────────────
{
  const s=F('CartTab',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('CartHeader',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('Корзина',{fam:'Manrope',sty:'ExtraBold',sz:24,c:black,x:16,y:16}));
  hdr.appendChild(T('Очистить',{sz:13,c:error,x:W-80,y:20}));
  s.appendChild(hdr);
  // Logo
  const lh=F('logo',W,40,{bg:white,y:103});
  lh.appendChild(T('🌿 ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:14,c:black,x:W/2-56,y:12}));
  s.appendChild(lh);
  // Store group
  const sg=F('StoreGroup',W-32,216,{bg:white,r:24,x:16,y:152});
  sg.effects=sh(2,10,0.07);
  sg.appendChild(T('🏪  Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:16,y:16}));
  sg.appendChild(Div(W-32-32,{x:16,y:42}));
  const citems=[{e:'🥐',n:'Круассан с миндалём',p:'150',o:'250',q:'2'},{e:'🥩',n:'Стейк рибай',p:'890',o:'1400',q:'1'}];
  citems.forEach((ci,i)=>{
    const row=F(`r${i}`,W-32-32,68,{bg:white,x:16,y:54+i*76});
    const thumb=F('t',52,52,{bg:grayBg,r:12,y:8});
    thumb.appendChild(T(ci.e,{sz:28,x:11,y:11})); row.appendChild(thumb);
    row.appendChild(T(ci.n,{fam:'Manrope',sty:'SemiBold',sz:13,c:black,x:60,y:8,w:W-32-32-60-96}));
    row.appendChild(T(ci.o+' ₽',{sz:11,c:grayMid,x:60,y:30}));
    row.appendChild(T(ci.p+' ₽',{fam:'Manrope',sty:'ExtraBold',sz:15,c:green,x:100,y:28}));
    const stp=F('s',80,28,{bg:grayBg,r:14,x:W-32-32-88,y:20});
    stp.appendChild(T('−',{fam:'Manrope',sty:'ExtraBold',sz:17,c:grayText,x:8,y:5}));
    stp.appendChild(T(ci.q,{fam:'Manrope',sty:'ExtraBold',sz:14,c:black,x:34,y:6}));
    stp.appendChild(T('+',{fam:'Manrope',sty:'ExtraBold',sz:17,c:black,x:56,y:5}));
    row.appendChild(stp);
    sg.appendChild(row);
    if(i<citems.length-1) sg.appendChild(Div(W-32-32,{x:16,y:122+i*76}));
  });
  s.appendChild(sg);
  // Summary
  const sum=F('Sum',W-32,96,{bg:white,r:24,x:16,y:380});
  sum.effects=sh(2,10,0.07);
  sum.appendChild(T('Итого',{fam:'Manrope',sty:'Bold',sz:15,c:black,x:16,y:14}));
  sum.appendChild(T('3 товара',{sz:13,c:grayText,x:16,y:38}));
  sum.appendChild(T('1 190 ₽',{fam:'Manrope',sty:'ExtraBold',sz:28,c:green,x:16,y:54}));
  sum.appendChild(Pill('−610 ₽ скидка',acid,black,{x:140,y:60,h:26}));
  s.appendChild(sum);
  // Promo
  const promo=F('Promo',W-32,52,{bg:white,r:16,x:16,y:488});
  promo.effects=sh(1,4,0.05);
  promo.appendChild(T('🎁  Промокод',{sz:14,c:black,x:16,y:16}));
  promo.appendChild(T('ROBIN10',{fam:'Manrope',sty:'Bold',sz:13,c:green,x:W-32-90,y:18}));
  s.appendChild(promo);
  s.appendChild(Btn('Оформить заказ',{x:16,y:558,w:W-32,h:52,bg:black,tc:acid}));
  BottomNav(s,2);
  addScreen(s);
}

// ── 13. PROFILE TAB ───────────────────────────────────────────────────────────
{
  const s=F('ProfileTab',W,H,{bg:grayBg});
  StatusBar(s);
  // Header card
  const phdr=F('ProfileHeader',W-32,180,{bg:white,r:24,x:16,y:56});
  phdr.effects=sh(2,10,0.07);
  // Logo
  phdr.appendChild(T('🌿 ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:14,c:black,x:W/2-72,y:12}));
  // Avatar
  const ava=F('ava',80,80,{bg:grayBg,r:40,x:phdr.width/2-40,y:36});
  const avaBorder=figma.createEllipse(); avaBorder.resize(86,86);
  avaBorder.x=-3; avaBorder.y=-3;
  avaBorder.fills=[]; avaBorder.strokes=[{type:'SOLID',color:rgb(acid)}]; avaBorder.strokeWeight=2;
  ava.appendChild(avaBorder);
  ava.appendChild(T('👤',{sz:40,x:20,y:20}));
  phdr.appendChild(ava);
  phdr.appendChild(T('Иван Петров',{fam:'Manrope',sty:'ExtraBold',sz:18,c:black,x:(W-32)/2-50,y:126}));
  phdr.appendChild(Pill('🌿 Лесной Страж',acid,black,{x:(W-32)/2-56,y:152,h:22,px:10}));
  s.appendChild(phdr);
  // Stats
  const stats=[{v:'15',l:'Заказов'},{v:'5 847',l:'Потрачено'},{v:'12.4кг',l:'Спасено CO₂'}];
  stats.forEach((st,i)=>{
    const sf=F(`st${i}`,Math.round((W-48)/3),64,{bg:white,r:16,x:16+i*Math.round((W-32)/3),y:248});
    sf.effects=sh(1,4,0.05);
    sf.appendChild(T(st.v,{fam:'Manrope',sty:'ExtraBold',sz:18,c:green,x:0,y:12,w:Math.round((W-48)/3),align:'CENTER'}));
    sf.appendChild(T(st.l,{sz:10,c:grayText,x:0,y:36,w:Math.round((W-48)/3),align:'CENTER'}));
    s.appendChild(sf);
  });
  // Menu
  const menuGroups=[
    {title:'УПРАВЛЕНИЕ', items:['Адреса','Способы оплаты','Заказы','Умные уведомления','Промокоды']},
    {title:'НАСТРОЙКИ', items:['Уведомления','Приватность']},
  ];
  let menuY=330;
  menuGroups.forEach(grp=>{
    s.appendChild(T(grp.title,{sz:10,c:grayMid,sty:'Bold',x:20,y:menuY})); menuY+=22;
    const grpF=F(grp.title,W-32,grp.items.length*44+8,{bg:white,r:20,x:16,y:menuY});
    grpF.effects=sh(1,4,0.05);
    grp.items.forEach((item,i)=>{
      grpF.appendChild(T(item,{fam:'Manrope',sty:'SemiBold',sz:14,c:black,x:16,y:14+i*44}));
      grpF.appendChild(T('›',{fam:'Manrope',sty:'ExtraBold',sz:18,c:grayMid,x:W-32-28,y:12+i*44}));
      if(i<grp.items.length-1) grpF.appendChild(Div(W-32-32,{x:16,y:44+i*44}));
    });
    s.appendChild(grpF);
    menuY+=grp.items.length*44+8+12;
  });
  s.appendChild(Btn('Выйти',{x:16,y:720,w:W-32,h:44,bg:grayBg,tc:error,r:16,shadow:false}));
  BottomNav(s,3);
  addScreen(s);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROW 3 — CHECKOUT FLOW
// ═══════════════════════════════════════════════════════════════════════════════

// ── 14. ORDER CONFIRMATION ────────────────────────────────────────────────────
{
  const s=F('OrderConfirmationScreen',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('hdr',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('← Оформление',{fam:'Manrope',sty:'Bold',sz:20,c:black,x:16,y:16}));
  s.appendChild(hdr);
  // Store order card
  const oc=F('OrderCard',W-32,200,{bg:white,r:24,x:16,y:120}); oc.effects=sh(2,10,0.07);
  oc.appendChild(T('📍 Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:16,y:16}));
  oc.appendChild(Pill('⏱ Забрать за 15 мин',acid,black,{x:16,y:40,h:24}));
  oc.appendChild(Div(W-32-32,{x:16,y:72}));
  const items3=[{e:'🥐',n:'Круассан × 2',p:'300 ₽'},{e:'🥩',n:'Стейк × 1',p:'890 ₽'}];
  items3.forEach((it,i)=>{
    const r=F('r',W-32-32,44,{bg:white,x:16,y:84+i*52});
    const th=F('t',36,36,{bg:grayBg,r:8,y:4}); th.appendChild(T(it.e,{sz:20,x:7,y:7})); r.appendChild(th);
    r.appendChild(T(it.n,{sz:13,c:black,x:44,y:13}));
    r.appendChild(T(it.p,{fam:'Manrope',sty:'Bold',sz:13,c:black,x:W-32-32-56,y:13}));
    oc.appendChild(r);
  });
  s.appendChild(oc);
  // Payment
  const pay=F('pay',W-32,60,{bg:white,r:20,x:16,y:332}); pay.effects=sh(2,8,0.06);
  pay.appendChild(T('Способ оплаты',{sz:13,c:grayText,x:16,y:10}));
  pay.appendChild(T('💳 Visa · · · 4242',{fam:'Manrope',sty:'Bold',sz:15,c:black,x:16,y:32}));
  pay.appendChild(T('Изменить',{sz:13,c:green,x:W-32-70,y:22}));
  s.appendChild(pay);
  // Total
  const tot=F('total',W-32,80,{bg:white,r:20,x:16,y:404}); tot.effects=sh(2,8,0.06);
  tot.appendChild(T('К оплате',{sz:14,c:grayText,x:16,y:12}));
  tot.appendChild(T('1 190 ₽',{fam:'Manrope',sty:'ExtraBold',sz:30,c:green,x:16,y:34}));
  tot.appendChild(Pill('−610 ₽ скидка',acid,black,{x:160,y:44,h:24}));
  s.appendChild(tot);
  // Consent
  const conRow=F('con',W-32,36,{bg:white,x:16,y:500});
  const cb2=F('cb',20,20,{bg:acid,r:6,y:8});
  cb2.appendChild(T('✓',{sz:11,c:black,x:3,y:3})); conRow.appendChild(cb2);
  conRow.appendChild(T('Согласен с условиями сервиса',{sz:12,c:black,x:28,y:10,w:W-32-36}));
  s.appendChild(conRow);
  s.appendChild(Btn('Оплатить 1 190 ₽',{x:16,y:556,w:W-32,h:52,bg:green,tc:white,r:16}));
  addScreen(s);
}

// ── 15. SBP PAYMENT SHEET ─────────────────────────────────────────────────────
{
  const s=F('SBPPaymentSheet',W,H,{bg:'none'});
  s.fills=sp(black,0.5);
  // Bottom sheet
  const bs=F('Sheet',W,560,{bg:white,r:36,x:0,y:H-560});
  // Drag handle
  const dh=R(44,4,{bg:grayMid,r:2,x:W/2-22,y:14}); bs.appendChild(dh);
  bs.appendChild(T('Оплата через СБП',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:W/2-94,y:36}));
  // QR code mock
  const qr=F('QR',200,200,{bg:black,r:12,x:W/2-100,y:76});
  for(let qi=0;qi<6;qi++) for(let qj=0;qj<6;qj++) {
    if(Math.random()>0.5) {
      const qrCell=R(28,28,{bg:white,r:2,x:8+qi*32,y:8+qj*32}); qr.appendChild(qrCell);
    }
  }
  bs.appendChild(qr);
  bs.appendChild(T('Отсканируйте QR-код или откройте\nприложение банка для оплаты',{sz:13,c:grayText,x:W/2-130,y:292,w:260,align:'CENTER'}));
  const timerBadge=Pill('⏱ Осталось: 14:32',acid,black,{x:W/2-68,y:356,h:28,px:12});
  bs.appendChild(timerBadge);
  bs.appendChild(Btn('Открыть приложение банка',{x:16,y:400,w:W-32,h:52,bg:black,tc:acid,r:16}));
  bs.appendChild(T('Отменить',{sz:14,c:error,x:W/2-36,y:468}));
  bs.appendChild(T('Отсканируйте через СБП или нажмите кнопку выше',{sz:11,c:grayMid,x:W/2-140,y:506,w:280,align:'CENTER'}));
  s.appendChild(bs);
  addScreen(s);
}

// ── 16. ORDER TRACKING ────────────────────────────────────────────────────────
{
  const s=F('OrderTrackingScreen',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('hdr',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('← Заказ #1234',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:16,y:16}));
  s.appendChild(hdr);
  // Tab bar
  const tabs=F('tabs',W,44,{bg:white,y:103});
  ['Статус','Состав','Чат'].forEach((t,i)=>{
    const isA=i===0;
    tabs.appendChild(T(t,{fam:'Manrope',sty:isA?'Bold':'Regular',sz:14,c:isA?black:grayMid,x:20+i*120,y:13}));
    if(isA){const ul=R(50,3,{bg:acid,r:2,x:16,y:41}); tabs.appendChild(ul);}
  });
  s.appendChild(tabs);
  // Status banner (ready)
  const banner2=F('Banner',W-32,72,{bg:acid,r:20,x:16,y:163});
  banner2.appendChild(T('🎉 Заказ собран!',{fam:'Manrope',sty:'ExtraBold',sz:18,c:black,x:16,y:12}));
  banner2.appendChild(T('Ваш заказ готов. Нажмите «Я на месте»',{sz:12,c:black,x:16,y:40}));
  s.appendChild(banner2);
  // Stepper
  const stepItems=['Ожидание','Подтверждён','Сборка','Готов','Выдача','Завершён'];
  const stepDone=4;
  const stepY=260;
  const stepW=(W-40)/6;
  stepItems.forEach((sl,i)=>{
    const cx=20+i*stepW+stepW/2;
    const isDone=i<stepDone, isCurr=i===stepDone;
    const dot=figma.createEllipse(); dot.resize(24,24);
    dot.x=cx-12; dot.y=stepY;
    dot.fills=sp(isDone||isCurr?acid:grayCard);
    dot.strokes=[{type:'SOLID',color:rgb(isDone||isCurr?black:grayMid)}];
    dot.strokeWeight=2;
    s.appendChild(dot);
    if(isDone){const ck=T('✓',{fam:'Manrope',sty:'ExtraBold',sz:12,c:black}); ck.x=cx-5; ck.y=stepY+6; s.appendChild(ck);}
    if(isCurr){const dot2=figma.createEllipse(); dot2.resize(10,10); dot2.x=cx-5; dot2.y=stepY+7; dot2.fills=sp(black); s.appendChild(dot2);}
    if(i<stepItems.length-1){const line=R(Math.round(stepW-24),2,{bg:isDone?acid:grayCard,x:cx+12,y:stepY+11}); s.appendChild(line);}
    const lt=T(sl,{sz:8,c:isDone||isCurr?black:grayMid,w:Math.round(stepW),align:'CENTER'});
    lt.x=cx-stepW/2; lt.y=stepY+30; s.appendChild(lt);
  });
  // Store info
  const storeCard=F('StoreCard',W-32,60,{bg:white,r:16,x:16,y:324}); storeCard.effects=sh(2,6,0.06);
  storeCard.appendChild(T('🏪 Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'SemiBold',sz:14,c:black,x:12,y:10}));
  storeCard.appendChild(T('🗺 Проложить маршрут',{sz:12,c:green,x:12,y:34}));
  s.appendChild(storeCard);
  // ArrivalButton
  s.appendChild(Btn('📍  Я на месте',{x:16,y:402,w:W-32,h:52,bg:green,tc:white,r:20}));
  s.appendChild(T('Отменить заказ',{sz:14,c:error,x:W/2-52,y:470}));
  // Chat preview
  const chat=F('Chat',W-32,200,{bg:white,r:20,x:16,y:500}); chat.effects=sh(2,8,0.06);
  chat.appendChild(T('Чат с пикером',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:12,y:12}));
  const msgBubble=F('msg',200,36,{bg:grayBg,r:16,x:12,y:40});
  msgBubble.appendChild(T('Есть замена для Круассана?',{sz:12,c:black,x:10,y:10}));
  chat.appendChild(msgBubble);
  const myBubble=F('my',180,36,{bg:green,r:16,x:W-32-192,y:84});
  myBubble.appendChild(T('Да, замените пожалуйста',{sz:12,c:white,x:10,y:10}));
  chat.appendChild(myBubble);
  const inputBar=F('input',W-32-24,44,{bg:grayBg,r:22,x:12,y:140});
  inputBar.appendChild(T('Написать...',{sz:13,c:grayText,x:16,y:14}));
  chat.appendChild(inputBar);
  s.appendChild(chat);
  BottomNav(s,0);
  addScreen(s);
}

// ── 17. ORDER HISTORY ─────────────────────────────────────────────────────────
{
  const s=F('OrderHistoryScreen',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('hdr',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('← История заказов',{fam:'Manrope',sty:'Bold',sz:20,c:black,x:16,y:16}));
  s.appendChild(hdr);
  // Filter tabs
  const ft=F('filter',W,44,{bg:white,y:103});
  ['Все','Активные','Завершённые','Отменённые'].forEach((t,i)=>{
    const isA=i===0;
    const chip=Pill(t,isA?black:grayBg,isA?acid:grayText,{x:8+i*96,y:8,h:28,px:12});
    ft.appendChild(chip);
  });
  s.appendChild(ft);
  const orders=[
    {n:'#1234',st:'Готов',sc:acid,stc:black,store:'Пятёрочка · Ленина',d:'Сегодня 14:30',total:'1 190 ₽',cnt:'3 товара'},
    {n:'#1233',st:'Завершён',sc:grayCard,stc:grayText,store:'Магнит · Мира',d:'Вчера 18:00',total:'450 ₽',cnt:'2 товара'},
    {n:'#1232',st:'Отменён',sc:'#FFE5E5',stc:error,store:'ВкусВилл · Садовая',d:'21.01',total:'380 ₽',cnt:'1 товар'},
    {n:'#1231',st:'Завершён',sc:grayCard,stc:grayText,store:'Пятёрочка · Ленина',d:'20.01',total:'890 ₽',cnt:'4 товара'},
  ];
  orders.forEach((o,i)=>{
    const oc=F(o.n,W-32,80,{bg:white,r:20,x:16,y:160+i*92}); oc.effects=sh(2,8,0.06);
    oc.appendChild(T(o.n,{fam:'Manrope',sty:'ExtraBold',sz:15,c:black,x:16,y:12}));
    const stBadge=Pill(o.st,o.sc,o.stc,{x:76,y:10,h:22,px:8}); oc.appendChild(stBadge);
    oc.appendChild(T('📍 '+o.store,{sz:12,c:grayText,x:16,y:38}));
    oc.appendChild(T(o.d+' · '+o.cnt,{sz:12,c:grayMid,x:16,y:56}));
    oc.appendChild(T(o.total,{fam:'Manrope',sty:'ExtraBold',sz:16,c:green,x:W-32-80,y:32}));
    s.appendChild(oc);
  });
  BottomNav(s,3);
  addScreen(s);
}

// ── 18. SMART ALERTS ──────────────────────────────────────────────────────────
{
  const s=F('SmartAlertsScreen',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('hdr',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('← Умные уведомления',{fam:'Manrope',sty:'Bold',sz:18,c:black,x:16,y:18}));
  hdr.appendChild(Pill('3/20',acid,black,{x:W-64,y:16,h:24}));
  s.appendChild(hdr);
  // Info card
  const info=F('info',W-32,68,{bg:acid,r:20,x:16,y:120}); 
  info.appendChild(T('⚡ Получай уведомления о скидках',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:16,y:12}));
  info.appendChild(T('Алёрт срабатывает когда цена падает на нужный %',{sz:12,c:black,x:16,y:36}));
  s.appendChild(info);
  const alerts=[
    {icon:'🥩',name:'Говядина',info:'−30% · 5 км · Утро 8–12',last:'Вчера, 09:15',on:true},
    {icon:'🥛',name:'Молочные продукты',info:'−20% · 3 км · Весь день',last:'2 дня назад',on:true},
    {icon:'🍞',name:'Выпечка',info:'−40% · 2 км · Вечер',last:'Никогда',on:false},
  ];
  alerts.forEach((al,i)=>{
    const ac=F(al.name,W-32,72,{bg:white,r:20,x:16,y:204+i*84}); ac.effects=sh(2,6,0.05);
    ac.appendChild(T(al.icon,{sz:28,x:12,y:22}));
    ac.appendChild(T(al.name,{fam:'Manrope',sty:'Bold',sz:14,c:black,x:52,y:10}));
    ac.appendChild(T(al.info,{sz:11,c:grayText,x:52,y:32}));
    ac.appendChild(T('Сработал: '+al.last,{sz:10,c:grayMid,x:52,y:52}));
    const toggle=F('tog',44,24,{bg:al.on?acid:grayCard,r:12,x:W-32-56,y:24});
    const knob=figma.createEllipse(); knob.resize(20,20); knob.x=al.on?22:2; knob.y=2;
    knob.fills=sp(white); knob.effects=sh(1,2,0.1); toggle.appendChild(knob);
    ac.appendChild(toggle);
    s.appendChild(ac);
  });
  const addBtn=F('+',W-32,52,{bg:white,r:20,x:16,y:456}); addBtn.effects=sh(1,4,0.05);
  addBtn.appendChild(T('+ Добавить алёрт',{fam:'Manrope',sty:'Bold',sz:15,c:black,x:W/2-80,y:15}));
  s.appendChild(addBtn);
  addScreen(s);
}

// ── 19. SETTINGS SCREEN ───────────────────────────────────────────────────────
{
  const s=F('SettingsScreen',W,H,{bg:grayBg});
  StatusBar(s);
  const hdr=F('hdr',W,56,{bg:white,y:47}); hdr.effects=sh(2,6,0.06);
  hdr.appendChild(T('← Настройки',{fam:'Manrope',sty:'Bold',sz:20,c:black,x:16,y:16}));
  s.appendChild(hdr);
  // Notifications section
  s.appendChild(T('УВЕДОМЛЕНИЯ',{sz:10,c:grayMid,sty:'Bold',x:20,y:120}));
  const notifCard=F('notif',W-32,52,{bg:white,r:20,x:16,y:140}); notifCard.effects=sh(1,4,0.05);
  notifCard.appendChild(T('Push-уведомления',{fam:'Manrope',sty:'SemiBold',sz:15,c:black,x:16,y:16}));
  const tog=F('tog',44,24,{bg:acid,r:12,x:W-32-56,y:14});
  const kn=figma.createEllipse(); kn.resize(20,20); kn.x=22; kn.y=2; kn.fills=sp(white); kn.effects=sh(1,2,0.1);
  tog.appendChild(kn); notifCard.appendChild(tog); s.appendChild(notifCard);
  // Theme section
  s.appendChild(T('ТЕМА',{sz:10,c:grayMid,sty:'Bold',x:20,y:208}));
  const themeCard=F('theme',W-32,100,{bg:white,r:20,x:16,y:226}); themeCard.effects=sh(1,4,0.05);
  ['Светлая','Тёмная','Системная'].forEach((t,i)=>{
    const isA=i===0;
    const opt=F(t,Math.round((W-32-32)/3),44,{bg:isA?black:grayBg,r:14,x:16+i*Math.round((W-32-32)/3+8),y:28});
    opt.appendChild(T(t,{sz:12,c:isA?acid:grayText,x:0,y:14,w:Math.round((W-32-32)/3),align:'CENTER'}));
    themeCard.appendChild(opt);
  });
  s.appendChild(themeCard);
  // Danger zone
  s.appendChild(T('АККАУНТ',{sz:10,c:grayMid,sty:'Bold',x:20,y:342}));
  const dangerCard=F('danger',W-32,88,{bg:white,r:20,x:16,y:360}); dangerCard.effects=sh(1,4,0.05);
  dangerCard.appendChild(T('⚠️  Удалить аккаунт',{fam:'Manrope',sty:'Bold',sz:15,c:error,x:16,y:14}));
  dangerCard.appendChild(T('Аккаунт будет удалён через 30 дней. Данные можно восстановить.',{sz:12,c:grayText,x:16,y:40,w:W-32-32}));
  s.appendChild(dangerCard);
  s.appendChild(Btn('Выйти из аккаунта',{x:16,y:700,w:W-32,h:50,bg:grayBg,tc:error,r:16,shadow:false}));
  addScreen(s);
}

// ── 20. SUCCESS SCREEN ────────────────────────────────────────────────────────
{
  const s=F('SuccessScreen',W,H,{bg:black});
  // Confetti dots
  const confettiColors=[acid,'#FFFFFF',green,'#FF5459'];
  for(let ci=0;ci<20;ci++){
    const dot=figma.createEllipse(); dot.resize(8,8);
    dot.x=Math.round(20+Math.random()*(W-40));
    dot.y=Math.round(100+Math.random()*(H-300));
    dot.fills=sp(confettiColors[ci%4],0.7); s.appendChild(dot);
  }
  // Check circle
  const circle=figma.createEllipse(); circle.resize(120,120);
  circle.x=W/2-60; circle.y=280;
  circle.fills=sp(acid); s.appendChild(circle);
  s.appendChild(T('✓',{fam:'Manrope',sty:'ExtraBold',sz:64,c:black,x:W/2-24,y:298}));
  s.appendChild(T('ЗАКАЗ\nОФОРМЛЕН!',{fam:'Manrope',sty:'ExtraBold',sz:36,c:acid,x:W/2-108,y:432,w:216,align:'CENTER'}));
  s.appendChild(T('Ожидайте уведомление. Заказ будет готов через 15 минут.',{sz:15,c:white,x:W/2-140,y:510,w:280,align:'CENTER'}));
  s.appendChild(Btn('К покупкам',{x:16,y:640,w:W-32,h:52}));
  addScreen(s);
}

// ─── Final ────────────────────────────────────────────────────────────────────
figma.currentPage=PAGE;
figma.viewport.scrollAndZoomIntoView(PAGE.children.slice(0,8));
return {
  ok: true,
  page: PAGE.name,
  total: PAGE.children.length,
  screens: PAGE.children.map(n=>n.name),
};

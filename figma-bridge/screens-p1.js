// PART 1: Helpers + Page + Onboarding flow (6 screens)
const FONTS=[
  {family:'Manrope',style:'Regular'},{family:'Manrope',style:'Medium'},
  {family:'Manrope',style:'SemiBold'},{family:'Manrope',style:'Bold'},
  {family:'Manrope',style:'ExtraBold'},
  {family:'Inter',style:'Regular'},{family:'Inter',style:'Medium'},
  {family:'Inter',style:'Semi Bold'},{family:'Inter',style:'Bold'},
];
for(const f of FONTS){try{await figma.loadFontAsync(f);}catch(e){}}

const acid='#BDFF00',green='#208C80',error='#FF5459',grayBg='#F5F5F5',black='#0D0D0D',white='#FFFFFF',grayCard='#EFEFEF',grayText='#757575',grayMid='#BDBDBD';

function rgb(h){const s=h.replace('#','');return{r:parseInt(s.substring(0,2),16)/255,g:parseInt(s.substring(2,4),16)/255,b:parseInt(s.substring(4,6),16)/255};}
function sp(h,a){const p={type:'SOLID',color:rgb(h)};if(a!==undefined&&a<1)p.opacity=a;return[p];}
function grd(h1,h2,vert=false){const c1=rgb(h1),c2=rgb(h2);const t=vert?[[0,1,0],[1,0,0]]:[[1,0,0],[0,1,0]];return[{type:'GRADIENT_LINEAR',gradientTransform:t,gradientStops:[{position:0,color:{...c1,a:1}},{position:1,color:{...c2,a:1}}]}];}
function sh(y=4,blur=12,a=0.08){return[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a},offset:{x:0,y},radius:blur,spread:0,visible:true,blendMode:'NORMAL'}];}
function F(n,w,h,{bg=white,r=0,x=0,y=0,clip=false}={}){const f=figma.createFrame();f.name=n;f.resize(w,h);f.x=x;f.y=y;f.fills=bg==='none'?[]:sp(bg);if(r)f.cornerRadius=r;if(clip)f.clipsContent=true;return f;}
function R(w,h,{bg=grayCard,r=0,x=0,y=0}={}){const rect=figma.createRectangle();rect.resize(w,h);rect.x=x;rect.y=y;rect.fills=sp(bg);if(r)rect.cornerRadius=r;return rect;}
function T(str,{fam='Inter',sty='Regular',sz=14,c=black,x=0,y=0,w,h,align='LEFT'}={}){const t=figma.createText();try{t.fontName={family:fam,style:sty};}catch(e){t.fontName={family:'Inter',style:'Regular'};}t.characters=String(str);t.fontSize=sz;t.fills=sp(c);if(w){t.resize(w,h||Math.ceil(sz*1.5));t.textAutoResize='HEIGHT';}else t.textAutoResize='WIDTH_AND_HEIGHT';if(align!=='LEFT')t.textAlignHorizontal=align;t.x=x;t.y=y;return t;}
function Div(w,{x=0,y=0,c=grayMid}={}){const r=figma.createRectangle();r.name='div';r.resize(w,1);r.x=x;r.y=y;r.fills=sp(c,0.3);return r;}
function Pill(label,bg2,tc,{x=0,y=0,h=24,px=10}={}){const b=F(label,10,h,{bg:bg2,r:100,x,y});b.layoutMode='HORIZONTAL';b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';b.paddingLeft=px;b.paddingRight=px;b.paddingTop=4;b.paddingBottom=4;b.primaryAxisSizingMode='AUTO';b.counterAxisSizingMode='AUTO';b.appendChild(T(label,{sz:11,c:tc,sty:'Bold'}));return b;}
function Btn(label,{x=0,y=0,w=361,h=50,bg2=black,tc=acid,r=16,sz=15,sty='Bold'}={}){const b=F(label,w,h,{bg:bg2,r,x,y});b.layoutMode='HORIZONTAL';b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';b.primaryAxisSizingMode='FIXED';b.counterAxisSizingMode='FIXED';b.effects=sh(4,16,0.2);b.appendChild(T(label,{fam:'Manrope',sty,sz,c:tc}));return b;}
function Input(ph,{x=0,y=0,w=361,h=52,bg2=grayBg,r=16,icon=''}={}){const f=F(ph,w,h,{bg:bg2,r,x,y});if(icon)f.appendChild(T(icon,{sz:18,x:14,y:(h-22)/2}));f.appendChild(T(ph,{sz:15,c:grayText,x:icon?44:16,y:(h-22)/2}));return f;}
function StatusBar(parent,{dark=false}={}){const sb=F('StatusBar',393,47,{bg:dark?black:white});sb.appendChild(T('9:41',{fam:'Manrope',sty:'SemiBold',sz:15,c:dark?white:black,x:20,y:15}));sb.appendChild(T('● WiFi 🔋',{sz:11,c:dark?white:grayText,x:310,y:17}));parent.appendChild(sb);}
function BottomNav(parent,active=0){const nav=F('BottomNav',393,56,{bg:white,y:796});nav.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.06},offset:{x:0,y:-2},radius:8,spread:0,visible:true,blendMode:'NORMAL'}];const tabs=[{icon:'📡',label:'Главная'},{icon:'🔍',label:'Каталог'},{icon:'🛒',label:'Корзина'},{icon:'👤',label:'Профиль'}];tabs.forEach((tab,i)=>{const isA=i===active;const tf=F(tab.label,98,56,{bg:white});tf.x=i*98;tf.y=0;tf.appendChild(T(tab.icon,{sz:22,c:isA?black:grayMid,x:38,y:4}));tf.appendChild(T(tab.label,{fam:'Inter',sty:isA?'Semi Bold':'Regular',sz:9,c:isA?black:grayMid,x:38,y:30}));if(isA){const dot=figma.createEllipse();dot.resize(5,5);dot.x=46;dot.y=48;dot.fills=sp(acid);tf.appendChild(dot);}if(i===2){const badge=F('badge',18,18,{bg:error,r:9,x:62,y:2});badge.appendChild(T('3',{sz:9,c:white,x:5,y:4,sty:'Bold'}));tf.appendChild(badge);}nav.appendChild(tf);});parent.appendChild(nav);}

// Page setup
const OLD=figma.root.children.find(p=>p.name==='🍏 Robin Food — Все экраны');
if(OLD)OLD.remove();
const PAGE=figma.createPage();PAGE.name='🍏 Robin Food — Все экраны';
figma.currentPage=PAGE;
const W=393,H=852,GAP=48,COL=5;
let si=0;
function add(f){const col=si%COL,row=Math.floor(si/COL);f.x=col*(W+GAP);f.y=row*(H+GAP+40);PAGE.appendChild(f);si++;}

// ─── 1. SPLASH ────────────────────────────────────────────────────────────────
{const s=F('SplashScreen',W,H,{bg:black});
const vp=F('BG',W,H,{bg:black,clip:true});
const g=R(W,H);g.fills=grd('#0A3320',black,true);vp.appendChild(g);s.appendChild(vp);
s.appendChild(T('🌿',{sz:90,x:W/2-54,y:260}));
s.appendChild(T('ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:40,c:acid,x:W/2-112,y:368,w:224,align:'CENTER'}));
s.appendChild(T('Бережное потребление',{sz:15,c:white,x:W/2-95,y:422,w:190,align:'CENTER'}));
const lb=F('lb',180,5,{bg:white,r:3,x:W/2-90,y:764});lb.fills=sp(white,0.2);
const lbf=F('f',130,5,{bg:acid,r:3});lb.appendChild(lbf);s.appendChild(lb);
add(s);}

// ─── 2. ONBOARDING 1 ──────────────────────────────────────────────────────────
{const s=F('Onboarding-1 (Свежесть)',W,H,{bg:grayBg});
const img=F('img',W,Math.round(H*0.55),{bg:'#0A3320',y:0,clip:true});
const imgBg=R(W,Math.round(H*0.55));imgBg.fills=grd('#164a2e',green);img.appendChild(imgBg);
img.appendChild(T('🥦',{sz:180,x:80,y:50}));
const ov=R(W,120,{x:0,y:Math.round(H*0.55)-120});ov.fills=grd('#00000000',grayBg,true);img.appendChild(ov);
s.appendChild(img);
const sheet=F('Sheet',W,Math.round(H*0.5),{bg:white,r:50,x:0,y:Math.round(H*0.5)-20});
[0,1,2,3].forEach((d,i)=>{const dot=figma.createEllipse();dot.resize(i===0?28:8,8);dot.x=W/2-28+i*16;dot.y=24;dot.fills=sp(i===0?acid:grayMid);sheet.appendChild(dot);});
sheet.appendChild(T('Свежесть с выгодой до 50%',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:24,y:50,w:W-48}));
sheet.appendChild(T('Покупайте продукты со скидкой до истечения срока годности. Помогайте планете — экономьте бюджет.',{sz:14,c:grayText,x:24,y:100,w:W-48}));
sheet.appendChild(Btn('Далее →',{x:16,y:240,w:W-32,h:50,bg2:black,tc:acid}));
sheet.appendChild(T('Пропустить',{sz:14,c:grayMid,x:W/2-44,y:308}));
s.appendChild(sheet);add(s);}

// ─── 3. ONBOARDING 3 ──────────────────────────────────────────────────────────
{const s=F('Onboarding-3 (Закажи и забери)',W,H,{bg:grayBg});
const img=F('img',W,Math.round(H*0.55),{bg:'#1a0a30',y:0,clip:true});
const imgBg=R(W,Math.round(H*0.55));imgBg.fills=grd('#1a0a30','#5a2380');img.appendChild(imgBg);
img.appendChild(T('🛒',{sz:180,x:90,y:50}));s.appendChild(img);
const sheet=F('Sheet',W,Math.round(H*0.5),{bg:white,r:50,x:0,y:Math.round(H*0.5)-20});
[0,1,2,3].forEach((d,i)=>{const dot=figma.createEllipse();dot.resize(i===2?28:8,8);dot.x=W/2-28+i*16;dot.y=24;dot.fills=sp(i===2?acid:grayMid);sheet.appendChild(dot);});
sheet.appendChild(T('Закажи и забери',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:24,y:50,w:W-48}));
sheet.appendChild(T('Выбери товары, оплати онлайн и забери в любое удобное время. Никаких очередей.',{sz:14,c:grayText,x:24,y:100,w:W-48}));
sheet.appendChild(Btn('Далее →',{x:16,y:240,w:W-32,h:50,bg2:black,tc:acid}));
sheet.appendChild(T('Пропустить',{sz:14,c:grayMid,x:W/2-44,y:308}));
s.appendChild(sheet);add(s);}

// ─── 4. BASKET BUILDER ────────────────────────────────────────────────────────
{const s=F('BasketBuilderScreen',W,H,{bg:white});
StatusBar(s);
s.appendChild(T('Что обычно\nпокупаешь?',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:20,y:62,w:W-40}));
s.appendChild(T('Выбери категории — будем показывать релевантные предложения',{sz:13,c:grayText,x:20,y:128,w:W-40}));
const cats=[['🥩','Мясо'],['🐟','Рыба'],['🥛','Молоко'],['🍞','Выпечка'],['🍎','Фрукты'],['🧃','Напитки'],['🥦','Овощи'],['❄️','Заморозка'],['🍱','Готовое']];
const cw=Math.floor((W-40-16)/3);
cats.forEach(([emoji,label],i)=>{
  const col=i%3,row=Math.floor(i/3),isA=i<4;
  const cell=F(label,cw,cw,{bg:isA?black:grayCard,r:20,x:20+col*(cw+8),y:178+row*(cw+8)});
  cell.appendChild(T(emoji,{sz:36,x:cw/2-22,y:20}));
  cell.appendChild(T(label,{fam:'Manrope',sty:'Bold',sz:12,c:isA?acid:black,x:4,y:cw-30,w:cw-8,align:'CENTER'}));
  if(isA){const ck=F('ck',22,22,{bg:acid,r:11,x:cw-28,y:6});ck.appendChild(T('✓',{fam:'Manrope',sty:'ExtraBold',sz:11,c:black,x:4,y:4}));cell.appendChild(ck);}
  s.appendChild(cell);
});
s.appendChild(T('Размер семьи',{fam:'Manrope',sty:'Bold',sz:16,c:black,x:20,y:580}));
['1','2','3','4+'].forEach((n,i)=>{const isA=i===1;const btn=F(n,80,44,{bg:isA?black:grayBg,r:12,x:20+i*84,y:604});btn.appendChild(T(n,{fam:'Manrope',sty:'ExtraBold',sz:18,c:isA?acid:grayText,x:isA?24:26,y:12}));s.appendChild(btn);});
s.appendChild(Btn('Начать покупки',{x:16,y:666,w:W-32,h:50,bg2:black,tc:acid}));
add(s);}

// ─── 5. LOGIN ─────────────────────────────────────────────────────────────────
{const s=F('LoginScreen',W,H,{bg:white});
StatusBar(s);
const logoArea=F('Logo',W,200,{bg:grayBg,y:47});
logoArea.appendChild(T('🌿',{sz:60,x:W/2-36,y:36}));
logoArea.appendChild(T('ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:28,c:black,x:W/2-82,y:106}));
logoArea.appendChild(T('Бережное потребление',{sz:12,c:green,x:W/2-70,y:142}));
s.appendChild(logoArea);
s.appendChild(T('Вход',{fam:'Manrope',sty:'ExtraBold',sz:32,c:black,x:20,y:268}));
s.appendChild(T('Введите номер телефона',{sz:14,c:grayText,x:20,y:312}));
s.appendChild(Input('+7 (999) 123-45-67',{x:16,y:344,w:W-32,bg2:grayBg,r:20,h:52}));
const cbRow=F('cb',W-32,40,{bg:white,x:16,y:412});
const cb=F('cb2',20,20,{bg:acid,r:6,y:10});cb.appendChild(T('✓',{sz:10,c:black,x:3,y:4}));cbRow.appendChild(cb);
cbRow.appendChild(T('Я согласен с правилами Robin Food',{sz:13,c:black,x:28,y:12,w:W-32-36}));
s.appendChild(cbRow);
s.appendChild(Btn('Отправить код',{x:16,y:474,w:W-32,h:52,bg2:black,tc:acid}));
s.appendChild(T('Вход через СМС — быстро и безопасно',{sz:12,c:grayMid,x:W/2-112,y:546,align:'CENTER',w:224}));
add(s);}

// ─── 6. SMS OTP ───────────────────────────────────────────────────────────────
{const s=F('SmsScreen (OTP)',W,H,{bg:white});
StatusBar(s);
s.appendChild(T('←',{fam:'Manrope',sty:'ExtraBold',sz:24,c:black,x:16,y:62}));
s.appendChild(T('Введите код\nиз SMS',{fam:'Manrope',sty:'ExtraBold',sz:32,c:black,x:20,y:108,w:W-40}));
s.appendChild(T('Код отправлен на +7 (999) 123-45-67',{sz:14,c:grayText,x:20,y:186,w:W-40}));
const digits=['3','7','','','',''];
const bw=52;
digits.forEach((d,i)=>{const filled=d!=='';const box=F(`otp${i}`,bw,64,{bg:filled?black:grayBg,r:16,x:16+i*(bw+8),y:226});box.appendChild(T(filled?d:'—',{fam:'Manrope',sty:'ExtraBold',sz:28,c:filled?acid:grayMid,x:filled?16:13,y:17}));s.appendChild(box);});
s.appendChild(T('Повторить через 00:54',{sz:14,c:grayMid,x:W/2-80,y:316}));
s.appendChild(Btn('Подтвердить',{x:16,y:392,w:W-32,h:52,bg2:black,tc:acid}));
add(s);}

figma.currentPage=PAGE;
figma.viewport.scrollAndZoomIntoView(PAGE.children);
return {ok:true,screens:PAGE.children.length,names:PAGE.children.map(n=>n.name)};

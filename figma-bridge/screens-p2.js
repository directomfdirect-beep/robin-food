// PART 2: Screens 11-20 (append to existing page, starting at index 10)
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
function Div(w,{x=0,y=0}={}){const r=figma.createRectangle();r.resize(w,1);r.x=x;r.y=y;r.fills=sp(grayMid,0.3);return r;}
function Pill(label,bg2,tc,{x=0,y=0,h=24,px=10}={}){const b=F(label,10,h,{bg:bg2,r:100,x,y});b.layoutMode='HORIZONTAL';b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';b.paddingLeft=px;b.paddingRight=px;b.paddingTop=4;b.paddingBottom=4;b.primaryAxisSizingMode='AUTO';b.counterAxisSizingMode='AUTO';b.appendChild(T(label,{sz:11,c:tc,sty:'Bold'}));return b;}
function Btn(label,{x=0,y=0,w=361,h=50,bg2=black,tc=acid,r=16,sz=15,sty='Bold'}={}){const b=F(label,w,h,{bg:bg2,r,x,y});b.layoutMode='HORIZONTAL';b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';b.primaryAxisSizingMode='FIXED';b.counterAxisSizingMode='FIXED';b.effects=sh(4,16,0.2);b.appendChild(T(label,{fam:'Manrope',sty,sz,c:tc}));return b;}
function StatusBar(parent,{dark=false}={}){const sb=F('StatusBar',393,47,{bg:dark?black:white});sb.appendChild(T('9:41',{fam:'Manrope',sty:'SemiBold',sz:15,c:dark?white:black,x:20,y:15}));sb.appendChild(T('● WiFi 🔋',{sz:11,c:dark?white:grayText,x:310,y:17}));parent.appendChild(sb);}
function BottomNav(parent,active=0){const nav=F('BottomNav',393,56,{bg:white,y:796});nav.effects=[{type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:0.06},offset:{x:0,y:-2},radius:8,spread:0,visible:true,blendMode:'NORMAL'}];const tabs=[{icon:'📡',label:'Главная'},{icon:'🔍',label:'Каталог'},{icon:'🛒',label:'Корзина'},{icon:'👤',label:'Профиль'}];tabs.forEach((tab,i)=>{const isA=i===active;const tf=F(tab.label,98,56,{bg:white});tf.x=i*98;tf.y=0;tf.appendChild(T(tab.icon,{sz:22,c:isA?black:grayMid,x:38,y:4}));tf.appendChild(T(tab.label,{fam:'Inter',sty:isA?'Semi Bold':'Regular',sz:9,c:isA?black:grayMid,x:38,y:30}));if(isA){const dot=figma.createEllipse();dot.resize(5,5);dot.x=46;dot.y=48;dot.fills=sp(acid);tf.appendChild(dot);}if(i===2){const badge=F('badge',18,18,{bg:error,r:9,x:62,y:2});badge.appendChild(T('3',{sz:9,c:white,x:5,y:4,sty:'Bold'}));tf.appendChild(badge);}nav.appendChild(tf);});parent.appendChild(nav);}

const PAGE=figma.root.children.find(p=>p.name==='🍏 Robin Food — Все экраны');
figma.currentPage=PAGE;
const W=393,H=852,GAP=48,COL=5;
let si=PAGE.children.length;
function add(f){const col=si%COL,row=Math.floor(si/COL);f.x=col*(W+GAP);f.y=row*(H+GAP+40);PAGE.appendChild(f);si++;}

// ─── 11. STORE SCREEN ─────────────────────────────────────────────────────────
{const s=F('StoreScreen',W,H,{bg:grayBg});
const hdr=F('StoreHeader',W,180,{bg:green});
hdr.appendChild(T('←',{sz:22,c:white,x:16,y:52}));
hdr.appendChild(T('♡',{sz:22,c:white,x:W-42,y:52}));
hdr.appendChild(T('🏪  Пятёрочка',{fam:'Manrope',sty:'ExtraBold',sz:24,c:white,x:20,y:86}));
hdr.appendChild(T('📍 ул. Ленина, 15   🕐 08:00–22:00',{sz:13,c:'#FFFFFFCC',x:20,y:120}));
hdr.appendChild(Pill('12 товаров со скидкой',acid,black,{x:20,y:148,h:26}));
s.appendChild(hdr);
// Category filter
let cx=16;
[['Все',acid,black],['Мясо',grayCard,black],['Выпечка',grayCard,black],['Молоко',grayCard,black]].forEach(([l,bg2,tc])=>{
  const ch=Pill(l,bg2,tc,{x:cx,y:194,h:28,px:12});s.appendChild(ch);cx+=76;
});
// Product grid
const prs=[{e:'🥐',n:'Круассан',p:'150',o:'250',d:'40'},{e:'🥩',n:'Стейк рибай',p:'890',o:'1400',d:'36'},{e:'🥛',n:'Молоко 3.2%',p:'89',o:'120',d:'26'},{e:'🍎',n:'Яблоки 1 кг',p:'120',o:'180',d:'33'}];
const cw=Math.round((W-40-8)/2);
prs.forEach((pr,i)=>{
  const col=i%2,row=Math.floor(i/2);
  const card=F(pr.n,cw,190,{bg:white,r:20,x:16+col*(cw+8),y:236+row*202});card.effects=sh(2,8,0.06);
  const img=F('img',cw,110,{bg:grayBg,r:16,clip:true});img.appendChild(T(pr.e,{sz:60,x:cw/2-36,y:22}));
  const db=F('d',46,20,{bg:black,r:6,x:6,y:84});db.appendChild(T('-'+pr.d+'%',{fam:'Manrope',sty:'ExtraBold',sz:9,c:acid,x:5,y:5}));
  img.appendChild(db);card.appendChild(img);
  card.appendChild(T(pr.n,{fam:'Manrope',sty:'SemiBold',sz:13,c:black,x:8,y:118,w:cw-16}));
  card.appendChild(T(pr.o+' ₽',{sz:11,c:grayMid,x:8,y:140}));
  card.appendChild(T(pr.p+' ₽',{fam:'Manrope',sty:'ExtraBold',sz:16,c:green,x:8,y:158}));
  const addBtn=F('+',32,32,{bg:acid,r:16,x:cw-40,y:150});addBtn.appendChild(T('+',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:7,y:4}));
  card.appendChild(addBtn);s.appendChild(card);
});
BottomNav(s,0);add(s);}

// ─── 12. CART SCREEN ──────────────────────────────────────────────────────────
{const s=F('CartTab',W,H,{bg:grayBg});
StatusBar(s);
const hdr=F('hdr',W,56,{bg:white,y:47});hdr.effects=sh(2,6,0.06);
hdr.appendChild(T('Корзина',{fam:'Manrope',sty:'ExtraBold',sz:24,c:black,x:16,y:16}));
hdr.appendChild(T('Очистить',{sz:13,c:error,x:W-80,y:20}));
s.appendChild(hdr);
// Logo
const lh=F('logo',W,40,{bg:white,y:103});lh.appendChild(T('🌿 ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:14,c:black,x:W/2-56,y:12}));s.appendChild(lh);
// Store group card
const sg=F('StoreGroup',W-32,220,{bg:white,r:24,x:16,y:150});sg.effects=sh(2,10,0.07);
sg.appendChild(T('🏪  Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:16,y:14}));
sg.appendChild(Div(W-32-32,{x:16,y:38}));
[{e:'🥐',n:'Круассан с миндалём',p:'150',o:'250',q:'2'},{e:'🥩',n:'Стейк рибай 200г',p:'890',o:'1400',q:'1'}].forEach((ci,i)=>{
  const row=F('r',W-32-32,66,{bg:white,x:16,y:50+i*78});
  const th=F('t',52,52,{bg:grayBg,r:12,y:7});th.appendChild(T(ci.e,{sz:28,x:11,y:11}));row.appendChild(th);
  row.appendChild(T(ci.n,{fam:'Manrope',sty:'SemiBold',sz:13,c:black,x:60,y:6,w:W-32-32-60-100}));
  row.appendChild(T(ci.o+' ₽',{sz:11,c:grayMid,x:60,y:28}));
  row.appendChild(T(ci.p+' ₽',{fam:'Manrope',sty:'Bold',sz:15,c:green,x:100,y:26}));
  const stp=F('stp',82,28,{bg:grayBg,r:14,x:W-32-32-90,y:18});
  stp.appendChild(T('−',{fam:'Manrope',sty:'ExtraBold',sz:18,c:grayText,x:8,y:5}));
  stp.appendChild(T(ci.q,{fam:'Manrope',sty:'ExtraBold',sz:14,c:black,x:36,y:6}));
  stp.appendChild(T('+',{fam:'Manrope',sty:'ExtraBold',sz:18,c:black,x:58,y:5}));
  row.appendChild(stp);sg.appendChild(row);
  if(i===0)sg.appendChild(Div(W-32-32,{x:16,y:122}));
});
s.appendChild(sg);
// Summary
const sum=F('Sum',W-32,90,{bg:white,r:20,x:16,y:382});sum.effects=sh(2,8,0.07);
sum.appendChild(T('Итого',{fam:'Manrope',sty:'Bold',sz:15,c:black,x:16,y:12}));
sum.appendChild(T('3 товара',{sz:12,c:grayText,x:16,y:34}));
sum.appendChild(T('1 190 ₽',{fam:'Manrope',sty:'ExtraBold',sz:26,c:green,x:16,y:52}));
sum.appendChild(Pill('−610 ₽ скидка',acid,black,{x:140,y:58,h:24}));
s.appendChild(sum);
// Promo field
const promo=F('Promo',W-32,52,{bg:white,r:16,x:16,y:484});promo.effects=sh(1,4,0.05);
promo.appendChild(T('🎁  Промокод',{sz:14,c:black,x:16,y:16}));
promo.appendChild(T('ROBIN10  ✓',{fam:'Manrope',sty:'Bold',sz:13,c:green,x:W-32-100,y:18}));
s.appendChild(promo);
s.appendChild(Btn('Оформить заказ',{x:16,y:552,w:W-32,h:52,bg2:black,tc:acid}));
BottomNav(s,2);add(s);}

// ─── 13. PROFILE TAB ─────────────────────────────────────────────────────────
{const s=F('ProfileTab',W,H,{bg:grayBg});
StatusBar(s);
const phdr=F('ProfileHeader',W-32,180,{bg:white,r:24,x:16,y:56});phdr.effects=sh(2,10,0.07);
phdr.appendChild(T('🌿 ROBIN FOOD',{fam:'Manrope',sty:'ExtraBold',sz:14,c:black,x:W/2-72,y:10}));
const ava=F('ava',76,76,{bg:grayBg,r:38,x:(W-32)/2-38,y:34});
const avaBorder=figma.createEllipse();avaBorder.resize(84,84);avaBorder.x=-4;avaBorder.y=-4;avaBorder.fills=[];avaBorder.strokes=[{type:'SOLID',color:rgb(acid)}];avaBorder.strokeWeight=2;ava.appendChild(avaBorder);
ava.appendChild(T('👤',{sz:38,x:18,y:18}));phdr.appendChild(ava);
phdr.appendChild(T('Иван Петров',{fam:'Manrope',sty:'ExtraBold',sz:18,c:black,x:(W-32)/2-52,y:122}));
phdr.appendChild(Pill('🌿 Лесной Страж',acid,black,{x:(W-32)/2-54,y:150,h:22,px:10}));
s.appendChild(phdr);
// Stats row
const statW=Math.round((W-48)/3);
[{v:'15',l:'Заказов'},{v:'5 847',l:'Потрачено'},{v:'12.4кг',l:'CO₂ спасено'}].forEach((st,i)=>{
  const sf=F(`st${i}`,statW,62,{bg:white,r:16,x:16+i*(statW+8),y:248});sf.effects=sh(1,4,0.05);
  sf.appendChild(T(st.v,{fam:'Manrope',sty:'ExtraBold',sz:18,c:green,x:0,y:10,w:statW,align:'CENTER'}));
  sf.appendChild(T(st.l,{sz:10,c:grayText,x:0,y:36,w:statW,align:'CENTER'}));
  s.appendChild(sf);
});
// Eco card
const eco=F('eco',W-32,52,{bg:green,r:20,x:16,y:322});
eco.appendChild(T('🌿 Спасено продуктов',{fam:'Manrope',sty:'Bold',sz:14,c:white,x:16,y:10}));
eco.appendChild(T('Ты сократил выброс CO₂ на 12.4 кг!',{sz:11,c:'#FFFFFFCC',x:16,y:32}));
s.appendChild(eco);
// Menu items
const menuItems=[['Адреса','🏠'],['Способы оплаты','💳'],['Заказы','📦'],['Умные уведомления','⚡'],['Промокоды','🎁'],['Предпочтения','⚙️'],['FAQ','❓'],['Выйти из аккаунта','→']];
const menuCard=F('menu',W-32,menuItems.length*44+8,{bg:white,r:20,x:16,y:386});menuCard.effects=sh(2,8,0.06);
menuItems.forEach(([item,icon],i)=>{
  menuCard.appendChild(T(icon,{sz:16,x:14,y:14+i*44}));
  menuCard.appendChild(T(item,{fam:'Manrope',sty:'SemiBold',sz:14,c:i===7?error:black,x:40,y:14+i*44}));
  menuCard.appendChild(T('›',{fam:'Manrope',sty:'ExtraBold',sz:18,c:i===7?error:grayMid,x:W-32-28,y:12+i*44}));
  if(i<menuItems.length-1)menuCard.appendChild(Div(W-32-28,{x:14,y:44+i*44}));
});
s.appendChild(menuCard);
BottomNav(s,3);add(s);}

// ─── 14. ORDER CONFIRMATION ───────────────────────────────────────────────────
{const s=F('OrderConfirmationScreen',W,H,{bg:grayBg});
StatusBar(s);
const hdr=F('hdr',W,56,{bg:white,y:47});hdr.effects=sh(2,6,0.06);
hdr.appendChild(T('← Оформление заказа',{fam:'Manrope',sty:'Bold',sz:20,c:black,x:16,y:16}));
s.appendChild(hdr);
const oc=F('OrderCard',W-32,200,{bg:white,r:24,x:16,y:120});oc.effects=sh(2,10,0.07);
oc.appendChild(T('📍 Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:16,y:14}));
oc.appendChild(Pill('⏱ Забрать за 15 мин',acid,black,{x:16,y:38,h:24}));
oc.appendChild(Div(W-32-32,{x:16,y:70}));
[{e:'🥐',n:'Круассан × 2',p:'300 ₽'},{e:'🥩',n:'Стейк × 1',p:'890 ₽'}].forEach((it,i)=>{
  const r=F('r',W-32-32,44,{bg:white,x:16,y:82+i*52});
  const th=F('t',36,36,{bg:grayBg,r:8,y:4});th.appendChild(T(it.e,{sz:20,x:7,y:7}));r.appendChild(th);
  r.appendChild(T(it.n,{sz:13,c:black,x:44,y:13}));
  r.appendChild(T(it.p,{fam:'Manrope',sty:'Bold',sz:13,c:black,x:W-32-32-56,y:13}));
  oc.appendChild(r);if(i===0)oc.appendChild(Div(W-32-32,{x:16,y:130}));
});
s.appendChild(oc);
const pay=F('pay',W-32,60,{bg:white,r:20,x:16,y:332});pay.effects=sh(2,8,0.06);
pay.appendChild(T('Способ оплаты',{sz:12,c:grayText,x:16,y:8}));
pay.appendChild(T('💳 Visa · · · 4242',{fam:'Manrope',sty:'Bold',sz:15,c:black,x:16,y:30}));
pay.appendChild(T('Изменить',{sz:13,c:green,x:W-32-72,y:22}));
s.appendChild(pay);
const tot=F('total',W-32,80,{bg:white,r:20,x:16,y:404});tot.effects=sh(2,8,0.06);
tot.appendChild(T('К оплате',{sz:14,c:grayText,x:16,y:10}));
tot.appendChild(T('1 190 ₽',{fam:'Manrope',sty:'ExtraBold',sz:30,c:green,x:16,y:32}));
tot.appendChild(Pill('−610 ₽ скидка',acid,black,{x:170,y:42,h:24}));
s.appendChild(tot);
const conRow=F('con',W-32,36,{bg:white,x:16,y:498});
const cb=F('cb',20,20,{bg:acid,r:6,y:8});cb.appendChild(T('✓',{sz:10,c:black,x:3,y:4}));conRow.appendChild(cb);
conRow.appendChild(T('Согласен с условиями Robin Food',{sz:12,c:black,x:28,y:10,w:W-32-36}));
s.appendChild(conRow);
s.appendChild(Btn('Оплатить 1 190 ₽',{x:16,y:550,w:W-32,h:52,bg2:green,tc:white,r:16}));
add(s);}

// ─── 15. SBP PAYMENT ──────────────────────────────────────────────────────────
{const s=F('SBPPaymentSheet',W,H,{bg:black});
s.fills=sp(black,0.6);
const bs=F('Sheet',W,550,{bg:white,r:36,x:0,y:H-550});
const dh=R(44,4,{bg:grayMid,r:2,x:W/2-22,y:12});bs.appendChild(dh);
bs.appendChild(T('Оплата через СБП',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:W/2-92,y:32}));
bs.appendChild(T('1 190 ₽',{fam:'Manrope',sty:'ExtraBold',sz:34,c:green,x:W/2-50,y:64}));
const qrFrame=F('QR',200,200,{bg:black,r:12,x:W/2-100,y:110});
for(let qi=0;qi<36;qi++){if(qi<4||qi%6===0||qi%6===5||Math.random()>0.4){const cell=R(28,28,{bg:white,r:3,x:6+(qi%6)*32,y:6+Math.floor(qi/6)*32});qrFrame.appendChild(cell);}}
bs.appendChild(qrFrame);
bs.appendChild(T('Отсканируйте QR-код или откройте\nприложение банка для оплаты',{sz:13,c:grayText,x:W/2-128,y:326,w:256,align:'CENTER'}));
bs.appendChild(Pill('⏱ Осталось: 14:32',acid,black,{x:W/2-66,y:378,h:28,px:12}));
bs.appendChild(Btn('Открыть приложение банка',{x:16,y:422,w:W-32,h:50,bg2:black,tc:acid,r:16}));
bs.appendChild(T('Отменить',{sz:14,c:error,x:W/2-36,y:486}));
s.appendChild(bs);add(s);}

// ─── 16. ORDER TRACKING ───────────────────────────────────────────────────────
{const s=F('OrderTrackingScreen',W,H,{bg:grayBg});
StatusBar(s);
const hdr=F('hdr',W,56,{bg:white,y:47});hdr.effects=sh(2,6,0.06);
hdr.appendChild(T('← Заказ #1234',{fam:'Manrope',sty:'ExtraBold',sz:20,c:black,x:16,y:16}));
s.appendChild(hdr);
const tabs=F('tabs',W,44,{bg:white,y:103});
['Статус','Состав','Чат'].forEach((t,i)=>{
  const isA=i===0;tabs.appendChild(T(t,{fam:'Manrope',sty:isA?'Bold':'Regular',sz:14,c:isA?black:grayMid,x:20+i*120,y:13}));
  if(isA){const ul=R(50,3,{bg:acid,r:2,x:16,y:41});tabs.appendChild(ul);}
});
s.appendChild(tabs);
const banner=F('Banner',W-32,68,{bg:acid,r:20,x:16,y:162});
banner.appendChild(T('🎉 Заказ готов к выдаче!',{fam:'Manrope',sty:'ExtraBold',sz:16,c:black,x:14,y:10}));
banner.appendChild(T('Подойдите к стойке самовывоза',{sz:12,c:black,x:14,y:38}));
s.appendChild(banner);
// Step progress
const steps=['Ожидание','Принят','Сборка','Готов','Выдача'];
const stepDone=3,W2=W-40,sw=Math.floor(W2/5);
steps.forEach((sl,i)=>{
  const cx=20+i*sw+sw/2,isDone=i<stepDone,isCurr=i===stepDone;
  const dot=figma.createEllipse();dot.resize(24,24);dot.x=cx-12;dot.y=250;
  dot.fills=sp(isDone||isCurr?acid:grayCard);dot.strokes=[{type:'SOLID',color:rgb(isDone||isCurr?black:grayMid)}];dot.strokeWeight=2;
  s.appendChild(dot);
  if(isDone){const ck=T('✓',{fam:'Manrope',sty:'ExtraBold',sz:11,c:black});ck.x=cx-4;ck.y=256;s.appendChild(ck);}
  if(isCurr){const inner=figma.createEllipse();inner.resize(10,10);inner.x=cx-5;inner.y=257;inner.fills=sp(black);s.appendChild(inner);}
  if(i<steps.length-1){const line=R(sw-24,3,{bg:isDone?acid:grayCard,r:2,x:cx+12,y:261});s.appendChild(line);}
  const lt=T(sl,{sz:8,c:isDone||isCurr?black:grayMid,w:sw,align:'CENTER'});lt.x=cx-sw/2;lt.y=282;s.appendChild(lt);
});
const sc=F('StoreCard',W-32,56,{bg:white,r:16,x:16,y:314});sc.effects=sh(2,6,0.06);
sc.appendChild(T('🏪  Пятёрочка, ул. Ленина, 15',{fam:'Manrope',sty:'SemiBold',sz:14,c:black,x:12,y:8}));
sc.appendChild(T('📍 Проложить маршрут',{sz:12,c:green,x:12,y:32}));
s.appendChild(sc);
s.appendChild(Btn('📍  Я на месте',{x:16,y:382,w:W-32,h:52,bg2:green,tc:white,r:20}));
s.appendChild(T('Отменить заказ',{sz:14,c:error,x:W/2-52,y:452}));
// Order contents
const items=[{e:'🥐',n:'Круассан с миндалём × 2',p:'300 ₽'},{e:'🥩',n:'Стейк рибай × 1',p:'890 ₽'}];
const itemCard=F('items',W-32,items.length*64+16,{bg:white,r:20,x:16,y:484});itemCard.effects=sh(2,8,0.06);
items.forEach((it,i)=>{
  const th=F('t',48,48,{bg:grayBg,r:12,x:12,y:8+i*64});th.appendChild(T(it.e,{sz:26,x:10,y:10}));itemCard.appendChild(th);
  itemCard.appendChild(T(it.n,{sz:13,c:black,x:68,y:20+i*64,w:W-32-68-60}));
  itemCard.appendChild(T(it.p,{fam:'Manrope',sty:'Bold',sz:13,c:black,x:W-32-56,y:22+i*64}));
  if(i<items.length-1)itemCard.appendChild(R(W-32-24,1,{bg:grayMid,r:0,x:12,y:64+i*64}));
});
s.appendChild(itemCard);
BottomNav(s,0);add(s);}

// ─── 17. ORDER HISTORY ────────────────────────────────────────────────────────
{const s=F('OrderHistoryScreen',W,H,{bg:grayBg});
StatusBar(s);
const hdr=F('hdr',W,56,{bg:white,y:47});hdr.effects=sh(2,6,0.06);
hdr.appendChild(T('← История заказов',{fam:'Manrope',sty:'Bold',sz:20,c:black,x:16,y:16}));
s.appendChild(hdr);
const ft=F('filter',W,44,{bg:white,y:103});
[['Все',black,acid],['Активные',grayCard,grayText],['Завершённые',grayCard,grayText],['Отменённые',grayCard,grayText]].forEach(([l,bg2,tc],i)=>{
  ft.appendChild(Pill(l,bg2,tc,{x:8+i*96,y:8,h:28,px:12}));
});
s.appendChild(ft);
[
  {n:'#1234',st:'Готов',sc:acid,stc:black,store:'Пятёрочка',d:'Сегодня 14:30',total:'1 190 ₽'},
  {n:'#1233',st:'Завершён',sc:grayCard,stc:grayText,store:'Магнит',d:'Вчера 18:00',total:'450 ₽'},
  {n:'#1232',st:'Отменён',sc:'#FFE5E5',stc:error,store:'ВкусВилл',d:'21.01 16:20',total:'380 ₽'},
  {n:'#1231',st:'Завершён',sc:grayCard,stc:grayText,store:'Пятёрочка',d:'20.01 09:45',total:'890 ₽'},
].forEach((o,i)=>{
  const oc=F(o.n,W-32,80,{bg:white,r:20,x:16,y:160+i*92});oc.effects=sh(2,8,0.06);
  oc.appendChild(T(o.n,{fam:'Manrope',sty:'ExtraBold',sz:15,c:black,x:16,y:10}));
  oc.appendChild(Pill(o.st,o.sc,o.stc,{x:78,y:8,h:22,px:8}));
  oc.appendChild(T('📍 '+o.store,{sz:12,c:grayText,x:16,y:36}));
  oc.appendChild(T(o.d,{sz:12,c:grayMid,x:16,y:54}));
  oc.appendChild(T(o.total,{fam:'Manrope',sty:'ExtraBold',sz:16,c:green,x:W-32-76,y:32}));
  s.appendChild(oc);
});
BottomNav(s,3);add(s);}

// ─── 18. SMART ALERTS ────────────────────────────────────────────────────────
{const s=F('SmartAlertsScreen',W,H,{bg:grayBg});
StatusBar(s);
const hdr=F('hdr',W,56,{bg:white,y:47});hdr.effects=sh(2,6,0.06);
hdr.appendChild(T('← Умные уведомления',{fam:'Manrope',sty:'Bold',sz:18,c:black,x:16,y:18}));
hdr.appendChild(Pill('3/20',acid,black,{x:W-64,y:16,h:24}));
s.appendChild(hdr);
const info=F('info',W-32,64,{bg:acid,r:20,x:16,y:116});
info.appendChild(T('⚡ Как работает алёрт?',{fam:'Manrope',sty:'Bold',sz:14,c:black,x:14,y:10}));
info.appendChild(T('1. Задай категорию  2. Укажи порог скидки  3. Радиус  4. Расписание',{sz:11,c:black,x:14,y:34}));
s.appendChild(info);
[
  {icon:'🥩',name:'Говядина',info:'−30% · 5 км · Утро 8–12',last:'Вчера, 09:15',on:true},
  {icon:'🥛',name:'Молочка',info:'−20% · 3 км · Весь день',last:'2 дня назад',on:true},
  {icon:'🍞',name:'Выпечка',info:'−40% · 2 км · Вечер 17–21',last:'Никогда',on:false},
].forEach((al,i)=>{
  const ac=F(al.name,W-32,72,{bg:white,r:20,x:16,y:196+i*84});ac.effects=sh(2,6,0.05);
  ac.appendChild(T(al.icon,{sz:28,x:12,y:22}));
  ac.appendChild(T(al.name,{fam:'Manrope',sty:'Bold',sz:14,c:black,x:52,y:8}));
  ac.appendChild(T(al.info,{sz:11,c:grayText,x:52,y:30}));
  ac.appendChild(T('Сработал: '+al.last,{sz:10,c:grayMid,x:52,y:50}));
  const toggle=F('tog',44,24,{bg:al.on?acid:grayCard,r:12,x:W-32-56,y:24});
  const knob=figma.createEllipse();knob.resize(20,20);knob.x=al.on?22:2;knob.y=2;knob.fills=sp(white);knob.effects=sh(1,2,0.1);toggle.appendChild(knob);
  ac.appendChild(toggle);s.appendChild(ac);
});
const addBtn=F('+ Alert',W-32,52,{bg:white,r:20,x:16,y:452});addBtn.effects=sh(1,4,0.05);
addBtn.appendChild(T('+ Добавить алёрт',{fam:'Manrope',sty:'Bold',sz:15,c:black,x:W/2-80,y:15}));
s.appendChild(addBtn);
add(s);}

// ─── 19. SETTINGS ────────────────────────────────────────────────────────────
{const s=F('SettingsScreen',W,H,{bg:grayBg});
StatusBar(s);
const hdr=F('hdr',W,56,{bg:white,y:47});hdr.effects=sh(2,6,0.06);
hdr.appendChild(T('← Настройки',{fam:'Manrope',sty:'Bold',sz:20,c:black,x:16,y:16}));
s.appendChild(hdr);
s.appendChild(T('УВЕДОМЛЕНИЯ',{sz:10,c:grayMid,sty:'Bold',x:20,y:120}));
const notifCard=F('notif',W-32,52,{bg:white,r:20,x:16,y:138});notifCard.effects=sh(1,4,0.05);
notifCard.appendChild(T('Push-уведомления',{fam:'Manrope',sty:'SemiBold',sz:15,c:black,x:16,y:16}));
const tog=F('tog',44,24,{bg:acid,r:12,x:W-32-56,y:14});
const kn=figma.createEllipse();kn.resize(20,20);kn.x=22;kn.y=2;kn.fills=sp(white);kn.effects=sh(1,2,0.1);tog.appendChild(kn);
notifCard.appendChild(tog);s.appendChild(notifCard);
s.appendChild(T('ТЕМА',{sz:10,c:grayMid,sty:'Bold',x:20,y:204}));
const themeCard=F('theme',W-32,92,{bg:white,r:20,x:16,y:222});themeCard.effects=sh(1,4,0.05);
const optW=Math.round((W-32-40)/3);
['Светлая','Тёмная','Системная'].forEach((t,i)=>{
  const isA=i===0;
  const opt=F(t,optW,44,{bg:isA?black:grayBg,r:12,x:12+i*(optW+8),y:24});
  opt.appendChild(T(t,{sz:12,c:isA?acid:grayText,x:0,y:14,w:optW,align:'CENTER'}));
  themeCard.appendChild(opt);
});
s.appendChild(themeCard);
s.appendChild(T('АККАУНТ',{sz:10,c:grayMid,sty:'Bold',x:20,y:330}));
const dangerCard=F('danger',W-32,80,{bg:white,r:20,x:16,y:348});dangerCard.effects=sh(1,4,0.05);
dangerCard.appendChild(T('⚠️  Удалить аккаунт',{fam:'Manrope',sty:'Bold',sz:15,c:error,x:16,y:12}));
dangerCard.appendChild(T('Аккаунт будет удалён через 30 дней.\nМожно восстановить до истечения срока.',{sz:12,c:grayText,x:16,y:36,w:W-32-32}));
s.appendChild(dangerCard);
s.appendChild(T('Версия приложения: 1.4.5',{sz:12,c:grayMid,x:W/2-72,y:460}));
s.appendChild(Btn('Выйти из аккаунта',{x:16,y:700,w:W-32,h:50,bg2:grayBg,tc:error,r:16}));
add(s);}

// ─── 20. SUCCESS SCREEN ───────────────────────────────────────────────────────
{const s=F('SuccessScreen',W,H,{bg:black});
const bg2=F('BG',W,H,{bg:black,clip:true});
const bgGrad=R(W,H);bgGrad.fills=grd('#0A3320',black,true);bg2.appendChild(bgGrad);s.appendChild(bg2);
// Particles
const confettiColors=[acid,'#FFFFFF',green,error];
for(let ci=0;ci<24;ci++){const dot=figma.createEllipse();dot.resize(8,8);dot.x=Math.round(20+Math.random()*(W-40));dot.y=Math.round(80+Math.random()*(H-280));dot.fills=sp(confettiColors[ci%4],0.7);s.appendChild(dot);}
const circle=figma.createEllipse();circle.resize(130,130);circle.x=W/2-65;circle.y=268;circle.fills=sp(acid);s.appendChild(circle);
s.appendChild(T('✓',{fam:'Manrope',sty:'ExtraBold',sz:72,c:black,x:W/2-26,y:283}));
s.appendChild(T('ЗАКАЗ\nОФОРМЛЕН!',{fam:'Manrope',sty:'ExtraBold',sz:36,c:acid,x:W/2-108,y:428,w:216,align:'CENTER'}));
s.appendChild(T('Ваш заказ готов к сборке.\nПодойдите через 15 минут.',{sz:16,c:white,x:W/2-120,y:512,w:240,align:'CENTER'}));
const confCard=F('conf',W-32,52,{bg:'#FFFFFF1A',r:16,x:16,y:590});
confCard.appendChild(T('⚡ +50 бонусных баллов за заказ!',{sz:13,c:acid,x:W/2-100,y:17,w:220,align:'CENTER'}));
s.appendChild(confCard);
s.appendChild(Btn('К покупкам',{x:16,y:658,w:W-32,h:52,bg2:acid,tc:black,r:20}));
add(s);}

figma.currentPage=PAGE;
figma.viewport.scrollAndZoomIntoView(PAGE.children);
return {ok:true,total:PAGE.children.length,added:PAGE.children.slice(10).map(n=>n.name)};

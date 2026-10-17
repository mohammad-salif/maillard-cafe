/* Maillard cafe: all behaviour lives here. GSAP, ScrollTrigger and Lenis load from CDNs in index.html. */
/* Failsafe: if the intro never finishes, show the page anyway. */
setTimeout(function(){var l=document.getElementById('load');if(l&&l.getBoundingClientRect().top>-5)document.documentElement.classList.add('fb')},7000)

/* Image paths */
const IMG={hero:'images/latte-flat-white.jpg',cake:'images/chocolate-cake.jpg',croissant:'images/croissants.jpg',dirty:'images/dirty-coffee.jpg',iced:'images/iced-latte.jpg',pour:'images/filter-pour.jpg',beans:'images/beans-and-latte.jpg',sundae:'images/sundae.jpg'};

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let n=0;
const drinks=[["Dirty jaggery cortado", "Espresso poured over cold milk and a spoon of melted jaggery.", "₹240", "c1", "dirty"], ["Iced cardamom latte", "Pods steeped in the milk overnight, poured over big cubes.", "₹280", "c2", "iced"], ["Filter kaapi", "Brewed all morning and poured at the bar. Ask for it with chicory.", "₹140", "c3", "pour"], ["Ganache slice", "Dark chocolate ganache over a brownie base, finished with cocoa nibs.", "₹240", "c4", "cake"], ["Butter croissant", "Laminated for three days and baked at six every morning.", "₹180", "c5", "croissant"], ["Mocha crumble sundae", "Whipped cream, granola crumble and warm chocolate.", "₹320", "c6", "sundae"]];
$('#track').innerHTML=drinks.map(d=>`<div class="card ${d[3]}"><div class="ph"><img src="${IMG[d[4]]}" alt="${d[0]}"></div><div><h3>${d[0]}</h3><p>${d[1]}</p><span class="pr">${d[2]}</span></div></div>`).join('');
$('#hcup').innerHTML=`<img src="${IMG.hero}" alt="Flat white with tulip latte art on a sunlit oak table">`;
const words=['Flat white','Kaapi','Croissant','Cold brew','Ganache','Sundae'];
$('#mq').innerHTML=[0,1].map(()=>words.map(w=>`<span>${w}<i></i></span>`).join('')).join('');
$('#story').innerHTML=$('#story').textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');

try{
gsap.registerPlugin(ScrollTrigger);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
let lenis;
if(window.Lenis&&!reduce){lenis=new Lenis({duration:1.8,easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)),smoothWheel:true,wheelMultiplier:.85});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);lenis.stop();
$$('nav a').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();lenis.scrollTo(a.getAttribute('href'),{duration:2.4})}))}

/* one orchestrated opening */
const c={v:0},cnt=$('#cnt');
gsap.timeline()
.to(c,{v:100,duration:2,ease:'power2.inOut',onUpdate:()=>cnt.textContent=Math.round(c.v)})
.to('#load',{yPercent:-100,duration:1.2,ease:'expo.inOut'})
.to('.hero .l>span',{y:0,yPercent:0,duration:1.4,stagger:.15,ease:'expo.out'},'-=.5')
.fromTo('#hcup',{clipPath:'inset(100% 0% 0% 0%)',scale:1.2},{clipPath:'inset(0% 0% 0% 0%)',scale:1,duration:1.8,ease:'expo.out'},'-=1.3')
.fromTo('.badge',{opacity:0,scale:.3,rotation:-90},{opacity:1,scale:1,rotation:0,duration:1.2,ease:'back.out(1.6)'},'-=.8')
.add(()=>{lenis&&lenis.start()},'-=1.2');

/* hero parallax */
gsap.to('#hcup',{yPercent:18,scale:1.08,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
gsap.to('.hero h1',{yPercent:-12,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

/* marquee that leans into the scroll */
const mq=$('#mq');
gsap.to(mq,{xPercent:-50,repeat:-1,duration:28,ease:'none'});
lenis&&lenis.on('scroll',({velocity:v})=>gsap.to(mq,{skewX:gsap.utils.clamp(-12,12,-v*1.2),duration:.6,overwrite:'auto'}));

/* pinned horizontal pour list */
const tr=$('#track');
const len=()=>tr.scrollWidth-innerWidth;
gsap.to(tr,{x:()=>-len(),ease:'none',scrollTrigger:{trigger:'.hs',start:'top top',end:()=>'+='+len(),pin:true,scrub:1,invalidateOnRefresh:true}});
gsap.fromTo('.ph img',{xPercent:-6,scale:1.2},{xPercent:6,scale:1.2,ease:'none',scrollTrigger:{trigger:'.hs',start:'top top',end:()=>'+='+len(),scrub:1,invalidateOnRefresh:true}});

/* story words light up as you read */
gsap.to('#story span',{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:'#story',start:'top 78%',end:'bottom 50%',scrub:true}});

/* roast curve draws itself */
const p=$('#cpath'),L=p.getTotalLength();
gsap.set(p,{strokeDasharray:L,strokeDashoffset:L});
const tl=gsap.timeline({scrollTrigger:{trigger:'#curve',start:'top 75%',end:'bottom 45%',scrub:1}});
tl.to(p,{strokeDashoffset:0,duration:4,ease:'none'});
$$('#curve text').forEach((t,i)=>tl.to(t,{opacity:1,duration:.4},[0,1.1,2.4,3.5][i]));
$$('#curve .dot').forEach((d,i)=>tl.to(d,{opacity:1,duration:.3},[1.6,3,4][i]-.2));
gsap.fromTo('.roast div:first-child',{y:80},{y:-40,ease:'none',scrollTrigger:{trigger:'.roast',start:'top bottom',end:'bottom top',scrub:true}});

gsap.fromTo('.ph7',{clipPath:'inset(18% 12% 18% 12% round 2rem)'},{clipPath:'inset(0% 0% 0% 0% round 2rem)',ease:'none',scrollTrigger:{trigger:'.ph7',start:'top 92%',end:'top 35%',scrub:true}});

/* menu list with floating preview */
const MENU=[['Coffee','Espresso','Double shot, pulled slow.','₹120','beans'],['Coffee','Flat white','Silky milk over a ristretto double.','₹260','hero'],['Coffee','Dirty jaggery cortado','Espresso over cold milk and jaggery.','₹240','dirty'],['Coffee','Filter kaapi','Brewed all morning, poured at the bar.','₹140','pour'],['Cold','Iced cardamom latte','Pods steeped in milk overnight.','₹280','iced'],['Cold','Cold brew tonic','Twenty hours steeped, orange peel.','₹280','dirty'],['Bakes','Butter croissant','Laminated for three days.','₹180','croissant'],['Bakes','Ganache slice','Dark chocolate over a brownie base.','₹240','cake'],['Bakes','Mocha crumble sundae','Cream, granola, warm chocolate.','₹320','sundae']];
let lastC='';$('#ml').innerHTML=MENU.map(m=>{const h=m[0]!==lastC?(lastC=m[0],`<h3 class="mh">${m[0]}</h3>`):'';return h+`<div class="mrow" data-k="${m[4]}"><span class="mn">${m[1]}</span><span class="md">${m[2]}</span><span class="mp">${m[3]}</span><i class="ln"></i></div>`}).join('');
const fl=$('#fl'),fim=fl.querySelector('img');gsap.set(fl,{scale:.6,opacity:0});
if(matchMedia('(hover:hover) and (pointer:fine)').matches){const fx=gsap.quickTo(fl,'x',{duration:.5,ease:'power3'}),fy=gsap.quickTo(fl,'y',{duration:.5,ease:'power3'});
$$('.mrow').forEach(r=>{r.addEventListener('mouseenter',()=>{fim.src=IMG[r.dataset.k];gsap.to(fl,{opacity:1,scale:1,rotation:-4,duration:.6,ease:'expo.out'})});r.addEventListener('mouseleave',()=>gsap.to(fl,{opacity:0,scale:.6,duration:.5,ease:'expo.out'}));r.addEventListener('mousemove',e=>{fx(e.clientX+40);fy(e.clientY-150)})})}
/* gallery rows drift in opposite directions */
[['g1',['hero','iced','cake','sundae','dirty','croissant']],['g2',['pour','beans','croissant','dirty','hero','cake']]].forEach(([id,ks])=>{$('#'+id).innerHTML=ks.map(k=>`<img src="${IMG[k]}" alt="Coffee and bakes at Maillard">`).join('')});
gsap.fromTo('#g1',{xPercent:0},{xPercent:-30,ease:'none',scrollTrigger:{trigger:'.gal',start:'top bottom',end:'bottom top',scrub:1}});
gsap.fromTo('#g2',{xPercent:-30},{xPercent:0,ease:'none',scrollTrigger:{trigger:'.gal',start:'top bottom',end:'bottom top',scrub:1}});
/* testimonials */
$('#tl').innerHTML=[['I came for the filter kaapi and stayed for the croissant. Now it is my Tuesday.','Rhea, Tuesday regular'],['The only cafe where the person pouring can tell you which farm the beans came from.','Karan, works two streets over'],['Twelve stools means you actually talk to people. I did not expect to like that.','Meera, Sunday regular']].map(q=>`<div class="q"><span>${q[1]}</span><p>${q[0]}</p><i class="ln"></i></div>`).join('');
ScrollTrigger.batch('.mrow,.q',{start:'top 92%',onEnter:b=>gsap.to(b.map(r=>r.querySelector('.ln')),{scaleX:1,duration:1.3,stagger:.08,ease:'expo.out'})});
$$('.rv').forEach(el=>gsap.fromTo(el.querySelectorAll('.l>span'),{yPercent:115,y:0},{yPercent:0,y:0,duration:1.4,stagger:.12,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
gsap.fromTo('.map',{rotation:-3,y:60},{rotation:0,y:-20,ease:'none',scrollTrigger:{trigger:'.find',start:'top bottom',end:'bottom bottom',scrub:true}});
$$('.stats b').forEach(b=>{const o={v:0};gsap.to(o,{v:+b.dataset.n,duration:2.2,ease:'power2.out',scrollTrigger:{trigger:b,start:'top 88%'},onUpdate:()=>{b.textContent=Math.round(o.v)}})});
/* nav colour follows the section beneath it */
const nv=$('nav');[['.hero','#2a1810'],['.band','#fbf7ee'],['.hs','#2a1810'],['.dark','#fbf7ee'],['.menu','#2a1810'],['.gal','#2a1810'],['.tst','#2a1810'],['.find','#fbf7ee'],['.foot','#fbf7ee']].forEach(([q,c])=>ScrollTrigger.create({trigger:q,start:'top 40px',end:'bottom 40px',onToggle:t=>{if(t.isActive)nv.style.color=c}}));
/* booking: circle wipe from the button, then WhatsApp */
/* WhatsApp booking: put the cafe number here with country code, e.g. '919876543210'.
   Left empty, WhatsApp opens with the message ready and the visitor picks who to send it to. */
const bk=$('#bk'),WA='';
function openBk(x,y){bk.style.visibility='visible';lenis&&lenis.stop();gsap.fromTo(bk,{clipPath:`circle(0px at ${x}px ${y}px)`},{clipPath:`circle(150vmax at ${x}px ${y}px)`,duration:1.2,ease:'expo.inOut'});gsap.fromTo('.bkin>*',{y:40,opacity:0},{y:0,opacity:1,stagger:.07,duration:.9,delay:.5,ease:'expo.out'})}
function closeBk(){gsap.to(bk,{clipPath:'circle(0px at 50% 90%)',duration:.9,ease:'expo.inOut',onComplete:()=>{bk.style.visibility='hidden';lenis&&lenis.start()}})}
function upd(){const n=$('#bn').value||'a guest',d=$('#bd').value||'a date to be confirmed';$('#bgo').href='https://wa.me/'+WA+'?text='+encodeURIComponent(`Hi Maillard, I would like to book a seat. Name: ${n}. Date: ${d}. Time: ${$('#bt').value}. Party: ${$('#bg').value}.`)}
['bn','bd','bt','bg'].forEach(i=>$('#'+i).addEventListener('input',upd));upd();
$$('[data-book]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openBk(e.clientX||innerWidth/2,e.clientY||innerHeight/2)}));
$('#bkx').addEventListener('click',closeBk);addEventListener('keydown',e=>{if(e.key==='Escape')closeBk()});
/* footer: headline rises, button is magnetic */
gsap.fromTo('.foot .l>span',{yPercent:115,y:0},{yPercent:0,y:0,duration:1.5,stagger:.15,ease:'expo.out',scrollTrigger:{trigger:'.foot',start:'top 60%'}});
gsap.fromTo('.foot',{borderRadius:'20vw 20vw 0 0'},{borderRadius:'6vw 6vw 0 0',ease:'none',scrollTrigger:{trigger:'.foot',start:'top bottom',end:'top 30%',scrub:true}});
const m=$('#mag');
m.addEventListener('mousemove',e=>{const r=m.getBoundingClientRect();gsap.to(m,{x:(e.clientX-r.left-r.width/2)*.4,y:(e.clientY-r.top-r.height/2)*.4,duration:.5,ease:'power3.out'})});
m.addEventListener('mouseleave',()=>gsap.to(m,{x:0,y:0,duration:1.1,ease:'elastic.out(1,.4)'}));
m.addEventListener('click',e=>e.preventDefault());

/* cursor */
const cu=$('.cur');
if(matchMedia('(hover:hover) and (pointer:fine)').matches){const qx=gsap.quickTo(cu,'x',{duration:.4,ease:'power3'}),qy=gsap.quickTo(cu,'y',{duration:.4,ease:'power3'});
addEventListener('mousemove',e=>{qx(e.clientX);qy(e.clientY)});
$$('a,.card,.mrow,button,.pill').forEach(el=>{el.addEventListener('mouseenter',()=>gsap.to(cu,{scale:3.2,duration:.4}));el.addEventListener('mouseleave',()=>gsap.to(cu,{scale:1,duration:.4}))})}
addEventListener('load',()=>ScrollTrigger.refresh());
}catch(e){document.documentElement.classList.add('fb');console.error(e)}

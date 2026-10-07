/* app.js — tutte le funzioni dell'app.
   Ogni pagina categoria dichiara <body data-cat="..."> (gli id sono in C qui sotto); la Home non ha data-cat. */
const KEY='pwm_v1';
const MSG='Ci sono modifiche non salvate. Scartarle?';
const B=[['nome','Sito/App','u'],['email','E-mail','e'],['pw','Password','s'],['user','Nome Utente'],['altro','Altro','a']];
// tipi di campo: e=email, s=segreto, n=segreto numerico, d=data, m=mese, a=testo lungo, p=foto
const C=[
 {id:'doc',p:'documenti.html',i:'doc',n:'Documenti',s:'Documenti',f:[['nome','Proprietario'],['tipo','Documento'],['num','Numero'],['email','E-mail','e'],['user','Nome Utente'],['pw','Password','s'],['pin','PIN','n'],['puk','PUK','n'],['ril','Data di rilascio','d'],['da','Rilasciato da'],['scad','Scadenza','d'],['altro','Altro','a'],['foto','Foto','p']]},
 {id:'banca',p:'banca.html',i:'bank',n:'Banca e carte',s:'Banca',f:[['nome','Banca'],['tipo','Tipo Carta'],['email','E-mail','e'],['user','Nome Utente'],['pw','Password','s'],['num','Numero'],['pin','PIN','n'],['cvv','CVV/CVC','n'],['scad','Scadenza','m'],['altro','Altro','a']]},
 {id:'mail',p:'email.html',i:'mail',n:'E-mail',s:'E-mail',f:B},
 {id:'acq',p:'acquisti.html',i:'bag',n:'Piattaforme di acquisto',s:'Acquisti',f:B},
 {id:'str',p:'streaming.html',i:'tv',n:'Streaming',s:'Streaming',f:B},
 {id:'ute',p:'utenze.html',i:'zap',n:'Utenze',s:'Utenze',f:B},
 {id:'var',p:'account-vari.html',i:'user',n:'Account vari',s:'Account',f:B},
 {id:'ter',p:'account-terzi.html',i:'users',n:'Account di terze persone',s:'Terzi',f:[['own','Proprietario Account'],...B]}
];
const PAGE=document.body.dataset.cat||'';

/* ---------- icone (SVG a linea, stile uniforme) ---------- */
const ICON={
 home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 edit:'<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
 save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
 eye:'<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
 eyeoff:'<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>',
 copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
 right:'<path d="M9 18l6-6-6-6"/>',
 left:'<path d="M15 18l-6-6 6-6"/>',
 x:'<path d="M18 6L6 18M6 6l12 12"/>',
 camera:'<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
 doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/>',
 bank:'<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
 mail:'<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/>',
 bag:'<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
 tv:'<rect x="2" y="7" width="20" height="15" rx="2"/><path d="M17 2l-5 5-5-5"/>',
 zap:'<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
 user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 users:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 link:'<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>'
};
const ic=n=>`<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
const pl=n=>n===1?'1 voce':n+' voci';

/* ---------- utilità ---------- */
const $=s=>document.querySelector(s);
const bind=(s,t,f)=>{const el=$(s);if(el)el.addEventListener(t,f)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cat=id=>C.find(c=>c.id===id);
const sec=t=>t==='s'||t==='n';
const fmt=(t,v)=>(t==='d'||t==='m')&&v?v.split('-').reverse().join('/'):v;
const title=e=>(e.cat==='doc'?e.f.tipo||e.f.nome:e.f.nome)||'(senza nome)';
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const kb=()=>Math.round((localStorage.getItem(KEY)||'').length/1024);

/* ---------- dati (localStorage) ---------- */
let dKey=null,dSalt=null,legacy=false,blocked=false,bootP=null;
async function atRestKey(pw,salt){   // chiave AES derivata dalla password di accesso, tenuta solo in memoria
  if(dKey&&(!salt||b64(salt)===b64(dSalt)))return dKey;
  dSalt=salt||crypto.getRandomValues(new Uint8Array(16));
  dKey=await deriveKey(pw,dSalt);
  return dKey;
}
const plainData=()=>{try{const o=JSON.parse(localStorage.getItem(KEY));return o&&Array.isArray(o.entries)?o:null}catch(e){return null}};
async function load(){
  const r=localStorage.getItem(KEY);
  if(!r)return{entries:[]};
  let o=null;
  try{o=JSON.parse(r)}catch(e){}
  if(o&&Array.isArray(o.entries)){legacy=true;return o}   // vecchio formato in chiaro: lo cifro subito dopo
  if(o&&o.ct){   // se non riesco a decifrare, errore: NON restituisco un archivio vuoto
    const key=await atRestKey(accessPw(),unb64(o.salt));
    const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(o.iv)},key,unb64(o.ct));
    const d=JSON.parse(td.decode(pt));
    if(!Array.isArray(d.entries))throw new Error('formato');
    return d;
  }
  try{localStorage.setItem(KEY+'_bak',r)}catch(e){}   // dati illeggibili: ne tengo una copia
  return{entries:[]};
}
async function persist(silent){
  if(blocked)return false;
  try{
    const pw=accessPw();if(!pw)return false;
    const key=await atRestKey(pw);
    const iv=crypto.getRandomValues(new Uint8Array(12));
    const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,te.encode(JSON.stringify(data)));
    localStorage.setItem(KEY,JSON.stringify({v:2,salt:b64(dSalt),iv:b64(iv),ct:b64(ct)}));
    if(!silent){try{localStorage.setItem(LMK,Date.now())}catch(e){}}
    return true;
  }catch(e){return false}
}

const LBK=KEY+'_lastbk';
const LMK=KEY+'_lastmod';
const lastMod=()=>+localStorage.getItem(LMK)||0;
const lastBackup=()=>+localStorage.getItem(LBK)||0;
const setLastBackup=()=>{try{localStorage.setItem(LBK,Date.now())}catch(e){}};
const backupDue=()=>!driveOn()&&Date.now()-lastBackup()>30*86400000;
function backupReminder(){
  lb(`<div class="sheet"><h1>Promemoria backup</h1><p class="mu">Sono passati più di 30 giorni dall'ultimo backup delle password. Ti consiglio di esportarne uno aggiornato.</p><div class="grp"><button class="row" data-act="exp"><div><strong>Esporta ora</strong><span class="r2"><span>Crea subito un backup cifrato delle password</span></span></div>${ic('right')}</button><button class="row" data-act="close"><div><strong>Più tardi</strong><span class="r2"><span>Te lo ricorderò alla prossima apertura della Home</span></span></div>${ic('right')}</button></div></div>`);
}

let data={entries:[]},draft=null,edit=false,dirty=false,S={v:PAGE?'list':'home'},q='',prev=null;
const src=()=>edit?draft:data;
const ent=id=>src().entries.find(e=>e.id===id);
const OWN={ter:'own',doc:'nome'};                  // categorie raggruppate per proprietario: campo che lo contiene
const UN={ter:['account','account'],doc:['documento','documenti']};
const own=e=>(e.f[OWN[e.cat]]||'').trim();         // proprietario
const oname=o=>o||'(senza proprietario)';
const up=e=>OWN[PAGE]?{v:'list',own:own(e)}:{v:'list'};   // dove tornare dal dettaglio
const ownData=()=>!OWN[PAGE]?'':`<datalist id="owners">${[...new Set(src().entries.filter(e=>e.cat===PAGE).map(own).filter(Boolean))].map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`;
const TIPI_DOC=['Carta d\'identità','Passaporto','Patente di guida','Tessera sanitaria','Codice fiscale','Permesso di soggiorno','Libretto di circolazione','Polizza assicurativa','Firma digitale'];
const tipiData=()=>PAGE!=='doc'?'':`<datalist id="tipiDoc">${[...new Set([...TIPI_DOC,...src().entries.filter(e=>e.cat==='doc').map(e=>(e.f.tipo||'').trim()).filter(Boolean)])].map(t=>`<option value="${esc(t)}">`).join('')}</datalist>`;
const emailData=()=>{
  const n=new Map();
  src().entries.forEach(e=>{const m=(e.f.email||'').trim();if(m)n.set(m,(n.get(m)||0)+1)});
  const ks=[...n.keys()].sort((a,b)=>n.get(b)-n.get(a)||a.localeCompare(b,'it'));
  return `<datalist id="emails">${ks.map(m=>`<option value="${esc(m)}">`).join('')}</datalist>`;
};

/* ---------- interfaccia di base ---------- */
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2400)}
function lb(h){const l=$('#lb');l.innerHTML=h;l.hidden=false}
function closeLb(){const l=$('#lb');l.hidden=true;l.innerHTML=''}
function mark(){dirty=true;$('#bSave').disabled=false;$('#bSave').classList.add('on')}
function startEdit(){draft=JSON.parse(JSON.stringify(data));edit=true;dirty=false}
function endEdit(){draft=null;edit=false;dirty=false}
function nav(u){if(dirty&&!confirm(MSG))return;dirty=false;location.href=u}

/* ---------- scadenze in arrivo (Documenti e Banca) ---------- */
const EXP_DAYS=30;
function expiring(){
  const t=new Date();t.setHours(0,0,0,0);
  const out=[];
  src().entries.forEach(e=>{
    const c=cat(e.cat),fld=c&&c.f.find(x=>x[0]==='scad');
    if(!fld||!e.f.scad)return;
    const p=e.f.scad.split('-').map(Number);
    if(!p[0]||!p[1])return;
    const end=fld[2]==='m'?new Date(p[0],p[1],0):new Date(p[0],p[1]-1,p[2]||1);   // carta: vale fino a fine mese
    const days=Math.round((end-t)/86400000);
    if(days<=EXP_DAYS)out.push({e,end,days});
  });
  return out.sort((a,b)=>a.end-b.end);
}
const expTxt=(d,end)=>{
  const dt=end.toLocaleDateString('it-IT');
  return d<0?`Scaduto il ${dt}`:d===0?`Scade oggi (${dt})`:d===1?`Scade domani (${dt})`:`Scade il ${dt} (tra ${d} giorni)`;
};
function expBlock(){
  const x=expiring();
  if(!x.length)return '';
  return `<p class="mu"><strong>In scadenza (entro ${EXP_DAYS} giorni)</strong></p><div class="grp" style="margin-bottom:24px">${x.map(({e,end,days})=>`<button class="row" data-act="open" data-id="${e.id}"><div><span class="rc">${esc(cat(e.cat).n)}</span><strong>${esc([e.f.tipo,e.f.nome].filter(Boolean).join(' · ')||title(e))}</strong><span class="r2"><span${days<0?' style="color:#b3261e"':''}>${expTxt(days,end)}</span></span></div>${ic('right')}</button>`).join('')}</div>`;
}

/* ---------- viste ---------- */
function home(){
  const n=id=>src().entries.filter(e=>e.cat===id).length;
  return `<h1>Le mie password</h1><p class="mu sub">Version 2.3.6<span style="display:block;margin-top:8px">Ultima modifica: ${lastMod()?new Date(lastMod()).toLocaleDateString('it-IT'):'—'}</span><span style="display:block;margin-top:8px">Password salvate: ${src().entries.length}</span></p>${expBlock()}<div class="grid">${C.map(c=>`<a class="cat" href="${c.p}">${ic(c.i)}<span>${c.n}</span><small>${pl(n(c.id))}</small></a>`).join('')}</div>
    <div class="bk">${driveBox()}${bkGrp(`Ultimo backup manuale: ${lastBackup()?new Date(lastBackup()).toLocaleDateString('it-IT'):'mai'}`,`<button data-act="exp" style="${BF}">Esporta backup</button><button data-act="imp" style="${BF}">Importa backup</button>`,'',18,'flex')}<small style="display:block;margin-top:32px">Spazio usato: ${kb()} KB su circa 5000 KB</small></div>`;
}
const row=(e,showCat)=>{
  const a=e.cat==='doc'?(e.f.scad?'Scade il '+fmt('d',e.f.scad):e.f.email||e.f.user||''):(e.f.email||e.f.user||e.f.tipo||''),p=e.f.pw||'';
  const c=showCat?`<span class="rc">${esc(cat(e.cat).n+(OWN[e.cat]&&own(e)?': '+own(e):''))}</span>`:'';
  return `<button class="row" data-act="open" data-id="${e.id}"><div>${c}<strong>${esc(title(e))}</strong>${a||p?`<span class="r2">${a?`<span>${esc(a)}</span>`:''}${p?`<span class="mono">${esc(p)}</span>`:''}</span>`:''}</div>${ic('right')}</button>`;
};
function viewOwners(all){
  const m=new Map();
  all.forEach(e=>m.set(own(e),(m.get(own(e))||0)+1));
  const ks=[...m.keys()].sort((a,b)=>oname(a).localeCompare(oname(b),'it'));
  return `<h1>${cat(PAGE).n}</h1>`+(ks.length?`<div class="grp">${ks.map(k=>`<button class="row" data-act="own" data-o="${esc(k)}"><div><strong>${esc(oname(k))}</strong><span class="r2"><span>${m.get(k)} ${UN[PAGE][m.get(k)===1?0:1]}</span></span></div>${ic('right')}</button>`).join('')}</div>`:`<p class="mu">Nessun proprietario. Usa il pulsante + in alto per aggiungere il primo ${UN[PAGE][0]}.</p>`);
}
function list(){
  const c=cat(PAGE),all=src().entries.filter(e=>e.cat===PAGE);
  if(OWN[PAGE]&&S.own==null)return viewOwners(all);
  const es=(OWN[PAGE]?all.filter(e=>own(e)===S.own):all).sort((a,b)=>title(a).localeCompare(title(b),'it'));
  const h=OWN[PAGE]
    ?`<button class="back" data-act="obk">${ic('left')}Proprietari</button><h1>${esc(oname(S.own))}</h1>`+(edit?`<div class="grp"><div class="f"><div class="fv"><label>${c.f.find(x=>x[0]===OWN[PAGE])[1]}</label><input data-own="1" autocomplete="off" value="${esc(S.own)}"></div></div></div>`:'')
    :`<h1>${c.n}</h1>`;
  return h+(es.length?`<div class="grp">${es.map(e=>row(e)).join('')}</div>`:'<p class="mu">Nessuna voce. Usa il pulsante + in alto per aggiungerne una.</p>');
}
function results(){
  const t=q.trim().toLowerCase();
  const es=src().entries.filter(e=>cat(e.cat).f.some(([k,,ty])=>!sec(ty)&&ty!=='p'&&fmt(ty,e.f[k]||'').toLowerCase().includes(t)));
  return '<h1>Risultati</h1>'+(es.length?`<div class="grp">${es.map(e=>row(e,1)).join('')}</div>`:'<p class="mu">Nessun risultato.</p>');
}
function photos(e){
  const p=e.photos||[];
  if(!p.length&&!edit)return '';
  return `<div class="f"><div class="fv"><label>Foto</label><div class="th">${p.map((s,i)=>`<span><img src="${esc(s)}" data-act="pv" data-i="${i}" alt="Foto ${i+1}">${edit?`<button data-act="pd" data-i="${i}" aria-label="Rimuovi foto">${ic('x')}</button>`:''}</span>`).join('')}${edit?`<button class="add" data-act="pa">${ic('camera')}Aggiungi foto</button>`:''}</div></div></div>`;
}
function detail(){
  const e=ent(S.id),c=cat(e.cat);
  let h=`<button class="back" data-act="back">${ic('left')}${OWN[PAGE]?esc(oname(own(e))):c.n}</button><h1>${esc(title(e))}</h1><div class="grp">`;
  for(const [k,l,t] of c.f){
    if(t==='p'){h+=photos(e);continue}
    const v=e.f[k]||'';
    if(edit){
      const a=`data-k="${k}" autocomplete="${sec(t)?'new-password':'off'}"`;
      const ty=sec(t)?(v?'password':'text'):t==='e'?'email':t==='d'?'date':t==='m'?'month':'text';
      const inp=t==='a'?`<textarea ${a} rows="3">${esc(v)}</textarea>`:`<input ${a} type="${ty}"${t==='n'?' inputmode="numeric"':''}${k==='tipo'?(e.cat==='doc'?' list="tipiDoc"':' list="tipi"'):k===OWN[e.cat]?' list="owners"':t==='e'?' list="emails"':''} value="${esc(v)}">`;
      h+=`<div class="f"><div class="fv"><label>${l}</label>${inp}</div>${sec(t)?`<button data-act="eyeIn" aria-label="Mostra">${ic(v?'eye':'eyeoff')}</button>`:''}</div>`;
    }else if(v){
      h+=`<div class="f"><div class="fv"><label>${l}</label><span id="v-${k}"${sec(t)||k==='num'?' class="mono"':''}>${sec(t)?'••••••••':esc(fmt(t,v))}</span></div>${sec(t)?`<button data-act="eye" data-k="${k}" aria-label="Mostra">${ic('eye')}</button>`:''}${t==='u'?`<button data-act="visit" data-k="${k}" aria-label="Apri sito">${ic('link')}</button>`:''}<button data-act="copy" data-k="${k}" aria-label="Copia">${ic('copy')}</button></div>`;
    }
  }
  h+='</div>';
  if(!edit&&!h.includes('class="f"'))h+='<p class="mu">Nessun dato. Attiva la modifica (matita in alto) per compilare la voce.</p>';
  return h+(edit?'<button class="del" data-act="del">Elimina voce</button>'+ownData()+tipiData()+emailData():'');
}
function render(){
  if(S.v==='detail'&&!ent(S.id))S={v:'list',own:S.own};
  document.body.classList.toggle('edit',edit);
  $('#bEdit').classList.toggle('on',edit);
  $('#bSave').disabled=!dirty;$('#bSave').classList.toggle('on',dirty);
  $('#main').innerHTML={home,list,detail,search:results}[S.v]();
}
function go(s){
  S=s;
  if(s.v!=='search'){q='';$('#q').value=''}
  render();$('#main').scrollTop=0;
}

/* ---------- azioni ---------- */
function addTo(){
  if(!edit)startEdit();
  const e={id:uid(),cat:PAGE,f:OWN[PAGE]&&S.own!=null?{[OWN[PAGE]]:S.own}:{}};
  draft.entries.push(e);mark();
  go({v:'detail',id:e.id,own:S.own});
}
function chooser(){
  lb(`<div class="sheet"><h1>Aggiungi in…</h1><div class="grp">${C.map(c=>`<button class="row" data-add="${c.id}">${ic(c.i)}<div><strong>${c.n}</strong></div></button>`).join('')}</div></div>`);
}
function copy(t){
  const ok=()=>toast('Copiato');
  const fb=()=>{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Copia non riuscita')}a.remove()};
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,fb);else fb();
}
async function visit(v){   // apre il sito; se è solo un nome, prova prima .it poi .com, altrimenti cerca su Google
  v=(v||'').trim();if(!v)return;
  const win=window.open('','_blank');   // apro subito la scheda: un redirect fatto dopo l'attesa verrebbe bloccato come popup
  const go=u=>win?win.location=u:window.open(u,'_blank','noopener');
  if(/^https?:\/\//i.test(v))return go(v);
  if(/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(v))return go('https://'+v);
  const slug=v.toLowerCase().replace(/\s+/g,'');
  for(const tld of['it','com']){
    const guess='https://'+slug+'.'+tld;
    try{await fetch(guess,{mode:'no-cors',signal:AbortSignal.timeout(2500)});return go(guess)}catch(e){}
  }
  go('https://www.google.com/search?q='+encodeURIComponent(v));
}
function shrink(f){   // ridimensiona la foto (max 1000px, JPEG) per non riempire il localStorage
  return new Promise((ok,ko)=>{
    const u=URL.createObjectURL(f),i=new Image();
    i.onload=()=>{
      const r=Math.min(1,1000/Math.max(i.width,i.height)),c=document.createElement('canvas');
      c.width=Math.round(i.width*r);c.height=Math.round(i.height*r);
      c.getContext('2d').drawImage(i,0,0,c.width,c.height);
      URL.revokeObjectURL(u);ok(c.toDataURL('image/jpeg',.6));
    };
    i.onerror=ko;i.src=u;
  });
}
/* ---------- cifratura backup (AES-256-GCM, chiave via PBKDF2) ---------- */
const te=new TextEncoder(),td=new TextDecoder();
const b64=b=>{const u=new Uint8Array(b);let s='';for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function deriveKey(pw,salt){
  const km=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function encryptJSON(obj,pw){
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const key=await deriveKey(pw,salt);
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,te.encode(JSON.stringify(obj)));
  return JSON.stringify({v:1,salt:b64(salt),iv:b64(iv),ct:b64(ct)});
}
async function decryptJSON(text,pw){
  const{salt,iv,ct}=JSON.parse(text);
  const key=await deriveKey(pw,unb64(salt));
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(iv)},key,unb64(ct));
  return JSON.parse(td.decode(pt));
}
let impPw=null;   // password inserita prima di scegliere il file da importare
function pwSheet(mode){   // mode: 'exp' (imposta password) | 'imp' (chiedi password)
  const exp=mode==='exp';
  lb(`<div class="sheet"><h1>${exp?'Imposta una password per il backup':'Password del backup'}</h1><div class="grp">
    <div class="f"><div class="fv"><label>Password</label><input id="pw1" type="password" autocomplete="${exp?'new-password':'current-password'}"></div></div>
    ${exp?'<div class="f"><div class="fv"><label>Conferma password</label><input id="pw2" type="password" autocomplete="new-password"></div></div>':''}
    </div><p class="mu">${exp?'Ti servirà per aprire questo backup su un altro telefono. Se la perdi, il backup non è più recuperabile.':'Inserisci la password che hai impostato quando hai creato questo backup.'}</p>
    <button data-act="${mode}Go">${exp?'Esporta':'Continua'}</button><button data-act="close">Annulla</button></div>`);
  setTimeout(()=>{const i=$('#pw1');if(i)i.focus()},0);
}
let pendingFile=null;
async function exportData(pw){
  try{
    toast('Preparo il backup…');
    const enc=await encryptJSON(data,pw);
    const name='password-backup-'+new Date().toISOString().slice(0,10)+'.json';
    pendingFile=new File([enc],name,{type:'application/json'});
    lb(`<div class="sheet"><h1>Backup pronto</h1><p class="mu">Scegli come salvare il file cifrato.</p><div class="grp"><button class="row" data-act="shareGo"><div><strong>Salva / Condividi</strong><span class="r2"><span>Scegli dove metterlo (Drive, File, WhatsApp, ecc.)</span></span></div>${ic('right')}</button><button class="row" data-act="dlGo"><div><strong>Scarica in Download</strong><span class="r2"><span>Salva il file nella cartella Download del telefono</span></span></div>${ic('right')}</button><button class="row" data-act="close"><div><strong>Annulla</strong><span class="r2"><span>Chiudi senza salvare il file</span></span></div>${ic('right')}</button></div></div>`);
  }catch(e){toast('Esportazione non riuscita')}
}
async function saveAll(){
  if(!edit||!dirty)return;
  const old=data;
  draft.entries=draft.entries.filter(e=>Object.entries(e.f).some(([k,v])=>k!==OWN[e.cat]&&v)||(e.photos||[]).length);   // scarta voci vuote
  data=draft;
  if(!await persist()){data=old;toast('Salvataggio non riuscito: spazio pieno. Riduci le foto o esporta un backup.');return}
  endEdit();render();toast('Salvato');
  if(driveOn())driveSync(false);
}
function toggleEdit(){
  if(!edit){startEdit();render();return}
  if(dirty&&!confirm(MSG))return;
  endEdit();render();
}
function search(ev){
  q=ev.target.value;
  if(q.trim()){if(S.v!=='search')prev=S;S={v:'search'}}
  else if(S.v==='search')S=prev||{v:PAGE?'list':'home'};
  render();
}
async function addPhoto(ev){
  const f=ev.target.files[0];ev.target.value='';
  const e=ent(S.id);
  if(!f||!e||!edit)return;
  try{(e.photos=e.photos||[]).push(await shrink(f));mark();render()}catch(x){toast('Immagine non valida')}
}
async function importData(ev){
  const f=ev.target.files[0];ev.target.value='';
  const pw=impPw;impPw=null;
  if(!f||!pw)return;
  let d;
  try{d=await decryptJSON(await f.text(),pw)}
  catch(e){toast('Password errata o file non valido');return}
  try{
    if(!Array.isArray(d.entries))throw 0;
    const ids=new Set(data.entries.map(e=>e.id));
    const n=d.entries.filter(e=>e&&e.id&&e.f&&cat(e.cat)&&!ids.has(e.id));   // unisce senza toccare i dati esistenti
    const old=data;
    data={entries:data.entries.concat(n)};
    if(!await persist()){data=old;throw 1}
    render();toast(n.length+' voci importate');
  }catch(x){toast('Backup non valido o spazio insufficiente')}
}
function onClick(ev){
  const a=ev.target.closest('a[href]');
  if(a&&dirty){if(confirm(MSG))dirty=false;else ev.preventDefault()}
  const b=ev.target.closest('[data-act],[data-add]');
  if(!b){if(ev.target.id==='lb')closeLb();return}
  const d=b.dataset;
  if(d.add){closeLb();return nav(cat(d.add).p+'#new')}
  const e=S.v==='detail'?ent(S.id):null;
  switch(d.act){
    case 'open':{const c=cat(ent(d.id).cat);if(c.id===PAGE)go({v:'detail',id:d.id,own:S.own});else nav(c.p+'#'+d.id);break}
    case 'back':go(up(e));break;
    case 'own':go({v:'list',own:d.o});break;
    case 'obk':go({v:'list'});break;
    case 'eye':{const s=$('#v-'+d.k),on=s.dataset.on==='1';s.dataset.on=on?'':'1';s.textContent=on?'••••••••':e.f[d.k];b.innerHTML=ic(on?'eye':'eyeoff');break}
    case 'eyeIn':{const i=b.parentNode.querySelector('input');i.type=i.type==='password'?'text':'password';b.innerHTML=ic(i.type==='password'?'eye':'eyeoff');break}
    case 'copy':{const t=cat(e.cat).f.find(x=>x[0]===d.k)[2];copy(fmt(t,e.f[d.k]));break}
    case 'visit':visit(e.f[d.k]);break
    case 'pa':$('#fPhoto').click();break;
    case 'pd':e.photos.splice(+d.i,1);mark();render();break;
    case 'pv':lb(`<img src="${esc(e.photos[+d.i])}" data-act="close" alt="">`);break;
    case 'close':closeLb();break;
    case 'del':if(confirm('Eliminare questa voce?')){draft.entries=draft.entries.filter(x=>x.id!==e.id);mark();go(up(e))}break;
    case 'exp':if(dirty)toast('Salva le modifiche prima di esportare');else if(accessPw())exportData(accessPw());else pwSheet('exp');break;
    case 'imp':if(edit)toast('Salva o annulla le modifiche prima di importare');else pwSheet('imp');break;
    case 'shareGo':{
      const f=pendingFile;if(!f)break;
      const t=new File([f],f.name.replace(/\.json$/,'.txt'),{type:'text/plain'});
      navigator.share({files:[t],title:'Backup password'})
        .then(()=>{setLastBackup();pendingFile=null;closeLb()})
        .catch(e=>{if(e.name!=='AbortError')toast(e.name+': '+e.message)});
      break}
    case 'dlGo':{
      const f=pendingFile;if(!f)break;
      const a=document.createElement('a');
      a.href=URL.createObjectURL(f);a.download=f.name;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),1000);
      setLastBackup();pendingFile=null;closeLb();break}
    case 'drvSync':driveSync(true);break;
    case 'drvLink':driveLink().then(ok=>{if(ok&&data.entries.length)driveSync(true)});break;
    case 'drvOff':driveUnlink();break;
    case 'offLink':closeLb();driveLink();break;
    case 'drvRes':if(edit)toast('Salva o annulla le modifiche prima di ripristinare');else pwSheet('drv');break;
    case 'drvGo':{const p=$('#pw1').value;if(!p){toast('Inserisci la password');break}closeLb();driveRestore(p);break}
    case 'expGo':{const p1=$('#pw1').value,p2=$('#pw2').value;if(p1.length<4){toast('Password troppo corta (minimo 4 caratteri)');break}if(p1!==p2){toast('Le password non coincidono');break}closeLb();exportData(p1);break}
    case 'impGo':{const p=$('#pw1').value;if(!p){toast('Inserisci la password');break}impPw=p;closeLb();$('#fImp').click();break}
  }
}
function onInput(ev){
  const t=ev.target;
  if(edit&&t.dataset.own){   // rinomina il proprietario su tutte le sue voci
    const v=t.value.trim();
    draft.entries.forEach(e=>{if(e.cat===PAGE&&own(e)===S.own)e.f[OWN[PAGE]]=v});
    S.own=v;mark();return;
  }
  const k=t.dataset.k;
  if(!k||!edit)return;
  const e=ent(S.id);if(!e)return;
  e.f[k]=ev.target.value;mark();
}

/* ---------- blocco app con password ---------- */
const LKEY=KEY+'_lock',LOCK_MS=60*1*1000;   // si blocca dopo 3 minuti di inattività
const lockData=()=>{try{return JSON.parse(localStorage.getItem(LKEY))}catch(e){return null}};
const accessPw=()=>sessionStorage.getItem('pwm_s')||'';
const touch=()=>{try{sessionStorage.setItem('pwm_t',Date.now())}catch(e){}};
const expired=()=>!accessPw()||Date.now()-(+sessionStorage.getItem('pwm_t')||0)>LOCK_MS;
async function hashPw(pw,salt){
  const km=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveBits']);
  return b64(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:300000,hash:'SHA-256'},km,256));
}
function setInert(on){[...document.body.children].forEach(el=>{if(el.id!=='lockScreen')on?el.setAttribute('inert',''):el.removeAttribute('inert')})}
function showLock(){
  if($('#lockScreen'))return;
  const first=!lockData();
  const o=document.createElement('div');o.id='lockScreen';
  o.style.cssText='position:fixed;inset:0;z-index:99999;background:#eef0f3;display:flex;align-items:center;justify-content:center;padding:24px';
  const st='width:100%;box-sizing:border-box;padding:12px;margin:0 0 10px;border:1px solid #c8ccd2;border-radius:8px;font-size:16px';
  const bt='width:100%;padding:12px;border:0;border-radius:8px;font-size:16px;margin:0 0 10px;';
  const pri=bt+'background:#1f3a5f;color:#fff',alt=bt+'background:#e4e7ec;color:#1f3a5f';
  const card=h=>`<div style="width:100%;max-width:340px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.12)">${h}</div>`;
  const hd=(t,p)=>`<h1 style="font-size:20px;margin:0 0 6px;color:#111">${t}</h1><p style="margin:0 0 16px;color:#667;font-size:14px">${p}</p>`;
  const er='<p id="lkErr" style="margin:0 0 10px;color:#b3261e;font-size:14px;min-height:18px"></p>';
  const V={
    welcome:()=>card(hd('Benvenuto','Hai già un backup su Google Drive o vuoi iniziare da zero?')+`<button data-lk="rest" style="${pri}">Ripristina da Google Drive</button><button data-lk="new" style="${alt}">Inizia da zero</button>`),
    rest:()=>card(hd('Ripristina da Drive','Inserisci la password del backup. Diventerà anche la password di accesso all\'app.')+`<input id="lk1" type="password" placeholder="Password del backup" autocomplete="current-password" style="${st}">${er}<button id="lkGo" data-lk="restGo" style="${pri}">Ripristina</button><button data-lk="back" style="${alt}">Indietro</button>`),
    make:()=>card(hd('Crea la password di accesso','Sarà anche la password dei backup. Se la perdi non c\'è recupero.')+`<input id="lk1" type="password" placeholder="Password" autocomplete="new-password" style="${st}"><input id="lk2" type="password" placeholder="Conferma password" autocomplete="new-password" style="${st}">${er}<button id="lkGo" data-lk="mk" style="${pri}">Salva e continua</button><button data-lk="back" style="${alt}">Indietro</button>`),
    ask:()=>card(hd('App bloccata','Inserisci la password per continuare.')+`<input id="lk1" type="password" placeholder="Password" autocomplete="current-password" style="${st}">${er}<button id="lkGo" data-lk="ask" style="${pri}">Sblocca</button>`)
  };
  const show=v=>{o.innerHTML=V[v]();const i=$('#lk1');if(i)setTimeout(()=>i.focus(),0)};
  const err=m=>{const e=$('#lkErr');if(e)e.textContent=m};
  const unlock=()=>{touch();o.remove();setInert(false);boot()};
  const saveLock=async p=>{
    const salt=crypto.getRandomValues(new Uint8Array(16));
    localStorage.setItem(LKEY,JSON.stringify({s:b64(salt),h:await hashPw(p,salt)}));
    try{sessionStorage.setItem('pwm_s',p)}catch(e){}
  };
  document.body.appendChild(o);setInert(true);
  if(first){show('welcome');loadGsi().catch(()=>{})}else show('ask');

  o.addEventListener('click',async ev=>{
    const b=ev.target.closest('[data-lk]');if(!b)return;
    const a=b.dataset.lk;
    if(a==='rest'){show('rest');return}
    if(a==='new'){show('make');return}
    if(a==='back'){show('welcome');return}
    if(a==='restGo'){
      const p=$('#lk1').value;if(!p)return err('Inserisci la password');
      b.disabled=true;
      try{sessionStorage.setItem('pwm_s',p)}catch(e){}   // serve a cifrare i dati ripristinati
      const lp=plainData();if(lp)data=lp;                // non perdere eventuali dati vecchi in chiaro
      const ok=await driveRestore(p,err);
      b.disabled=false;
      if(!ok){try{sessionStorage.removeItem('pwm_s')}catch(e){}return}
      try{await saveLock(p)}catch(e){return err('Salvataggio non riuscito')}
      unlock();return;
    }
    if(a==='mk'){
      const p=$('#lk1').value;
      if(p.length<4)return err('Minimo 4 caratteri');
      if(p!==$('#lk2').value)return err('Le password non coincidono');
      try{await saveLock(p)}catch(e){return err('Salvataggio non riuscito')}
      unlock();
      if(!driveOn())setTimeout(driveOffer,300);
      return;
    }
    if(a==='ask'){
      const p=$('#lk1').value,l=lockData();
      if(!p||await hashPw(p,unb64(l.s))!==l.h){$('#lk1').value='';return err('Password errata')}
      try{sessionStorage.setItem('pwm_s',p)}catch(e){}
      unlock();
    }
  });
  o.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT'){const g=$('#lkGo');if(g)g.click()}});
}
function lockCheck(){if(expired()&&!$('#lockScreen'))showLock()}
['click','keydown','touchstart','input'].forEach(t=>document.addEventListener(t,()=>{if($('#lockScreen'))return;if(expired())lockCheck();else touch()},true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)lockCheck()});
setInterval(lockCheck,15000);
lockCheck();

/* ---------- Google Drive (cartella nascosta dell'app) ---------- */
const DRIVE_ID='703220042826-9po68quqrj4vq1uhnqldegtoprn7nlq6.apps.googleusercontent.com';
const DRIVE_SCOPE='https://www.googleapis.com/auth/drive.appdata';
const DRIVE_FILE='dbpsw-backup.json';
const DK=KEY+'_drive',DLK=KEY+'_drivelast',DPK=KEY+'_drivepending';
const DEK=KEY+'_driveemail';
async function driveWho(tok){
  const r=await fetch('https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)',{headers:{Authorization:'Bearer '+tok}});
  if(!r.ok)return '';
  const j=await r.json();
  return ((j.user&&j.user.emailAddress)||'').toLowerCase();
}
let dTok='',dExp=0;
const driveOn=()=>localStorage.getItem(DK)==='1';
const BS='margin:0;width:100%;padding:10px 8px;font-size:14px';
const bkGrp=(top,btns,bottom='',mt=18,cols=2)=>{   // top: testo sopra i pulsanti, bottom: testo sotto
  const g=cols==='flex'?'display:flex;gap:8px':`display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px`;
  return `<div style="margin-top:${mt}px"><small style="display:block;margin-bottom:6px;line-height:1.6">${top}</small><div style="${g}">${btns}</div>${bottom?`<small style="display:block;margin-top:10px;line-height:1.6">${bottom}</small>`:''}</div>`;
};
const BF='margin:0;padding:10px 14px;font-size:14px';   // pulsanti larghi quanto il testo
const BS3='margin:0;width:100%;padding:10px 4px;font-size:12px';
const driveBox=()=>driveOn()
  ?bkGrp(`Ultimo salvataggio su Drive: ${localStorage.getItem(DPK)==='1'?'modifiche da sincronizzare':(+localStorage.getItem(DLK)?new Date(+localStorage.getItem(DLK)).toLocaleString('it-IT'):'mai')}`,
    `<button data-act="drvSync" style="${BS3}">Sincronizza</button><button data-act="drvRes" style="${BS3}">Ripristina</button><button data-act="drvOff" style="${BS3}">Scollega</button>`,
    `Account Drive: ${esc(localStorage.getItem(DEK)||'—')}<br>File: dbpsw-backup.json (cartella nascosta dell'app)`,4,3)
  :bkGrp('Cloud non collegato',`<button data-act="drvLink" style="${BS}">Collega cloud</button><button data-act="drvRes" style="${BS}">Ripristina da cloud</button>`,'',4);

function loadGsi(){
  return new Promise((ok,ko)=>{
    if(window.google&&google.accounts&&google.accounts.oauth2)return ok();
    const s=document.createElement('script');
    s.src='https://accounts.google.com/gsi/client';
    s.onload=()=>ok();s.onerror=()=>ko(new Error('Google non raggiungibile'));
    document.head.appendChild(s);
  });
}
function ensureToken(){   // va chiamata direttamente da un tocco, senza attese prima
  return new Promise((ok,ko)=>{
    if(!dTok){try{dTok=sessionStorage.getItem('pwm_dt')||'';dExp=+sessionStorage.getItem('pwm_de')||0}catch(e){}}
    if(dTok&&Date.now()<dExp)return ok(dTok);
    if(!(window.google&&google.accounts&&google.accounts.oauth2))return ko(new Error('Google non caricato'));
    const c=google.accounts.oauth2.initTokenClient({
      client_id:DRIVE_ID,scope:DRIVE_SCOPE,hint:localStorage.getItem(DEK)||undefined,
      callback:r=>{
        if(r.error)return ko(new Error(r.error));
        dTok=r.access_token;dExp=Date.now()+(r.expires_in-120)*1000;
        try{sessionStorage.setItem('pwm_dt',dTok);sessionStorage.setItem('pwm_de',dExp)}catch(e){}
        ok(dTok);
      },
      error_callback:e=>ko(new Error(e.type||'accesso annullato'))
    });
    c.requestAccessToken({prompt:''});
  });
}
async function driveFind(tok){
  const u='https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id)&q='+encodeURIComponent("name='"+DRIVE_FILE+"'");
  const r=await fetch(u,{headers:{Authorization:'Bearer '+tok}});
  if(!r.ok)throw new Error('ricerca '+r.status);
  const j=await r.json();
  return j.files&&j.files[0]?j.files[0].id:null;
}
async function driveUpload(tok,id,text){
  let r;
  if(id){
    r=await fetch('https://www.googleapis.com/upload/drive/v3/files/'+id+'?uploadType=media',{method:'PATCH',headers:{Authorization:'Bearer '+tok,'Content-Type':'application/json'},body:text});
  }else{
    const b='dbpsw'+uid();
    const meta=JSON.stringify({name:DRIVE_FILE,parents:['appDataFolder']});
    const body='--'+b+'\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n'+meta+'\r\n--'+b+'\r\nContent-Type: application/json\r\n\r\n'+text+'\r\n--'+b+'--';
    r=await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',{method:'POST',headers:{Authorization:'Bearer '+tok,'Content-Type':'multipart/related; boundary='+b},body});
  }
  if(!r.ok)throw new Error('caricamento '+r.status);
}
async function driveSync(manual){
  const pw=accessPw();
  if(!pw)return;
  let tok;
  try{tok=await ensureToken()}
  catch(e){
    try{localStorage.setItem(DPK,'1')}catch(x){}
    if(manual)toast('Accesso a Google non riuscito: '+e.message);
    if(S.v==='home')render();
    return;
  }
  const who=await driveWho(tok).catch(()=>'');
  const saved=(localStorage.getItem(DEK)||'').toLowerCase();
  if(saved&&who&&who!==saved){
    dTok='';dExp=0;
    try{sessionStorage.removeItem('pwm_dt');sessionStorage.removeItem('pwm_de')}catch(x){}
    try{localStorage.setItem(DPK,'1')}catch(x){}
    toast('Account diverso: usa '+saved);
    if(S.v==='home')render();
    return;
  }
  if(manual){try{localStorage.setItem(DK,'1')}catch(x){}}
  if(!data.entries.length){if(manual)toast('Nessun dato da salvare. Usa "Ripristina da Drive".');if(S.v==='home')render();return}
  try{
    const enc=await encryptJSON(data,pw);
    const id=await driveFind(tok);
    await driveUpload(tok,id,enc);
    if(who&&!saved){try{localStorage.setItem(DEK,who)}catch(x){}}
    try{localStorage.setItem(DK,'1');localStorage.setItem(DLK,Date.now());localStorage.removeItem(DPK)}catch(x){}
    toast('Salvato su Google Drive');
  }catch(e){
    try{localStorage.setItem(DPK,'1')}catch(x){}
    toast('Drive: '+e.message);
  }
  if(S.v==='home')render();
}
async function driveLink(){
  let tok;
  try{tok=await ensureToken()}catch(e){toast('Accesso a Google non riuscito: '+e.message);return false}
  try{
    const who=await driveWho(tok);
    if(who)localStorage.setItem(DEK,who);
    localStorage.setItem(DK,'1');
    toast('Drive collegato'+(who?': '+who:''));
  }catch(e){toast('Drive: '+e.message);return false}
  if(S.v==='home')render();
  return true;
}
function driveUnlink(){
  if(!confirm('Scollegare Google Drive? L\'app smette di aggiornare il backup. Il file già presente su Drive non viene cancellato.'))return;
  const t=dTok||sessionStorage.getItem('pwm_dt')||'';
  if(t&&window.google&&google.accounts&&google.accounts.oauth2){try{google.accounts.oauth2.revoke(t,()=>{})}catch(e){}}   // revoca il permesso concesso a Google
  dTok='';dExp=0;
  try{sessionStorage.removeItem('pwm_dt');sessionStorage.removeItem('pwm_de')}catch(e){}
  [DK,DLK,DPK,DEK].forEach(k=>{try{localStorage.removeItem(k)}catch(e){}});
  toast('Drive scollegato');
  render();
}
async function driveRestore(pw,err){
  const fail=m=>{(err||toast)(m);return false};
  let tok,text;
  try{
    tok=await ensureToken();   // deve restare la prima chiamata: il popup Google richiede un tocco diretto
    const id=await driveFind(tok);
    if(!id)return fail('Nessun backup trovato su Drive');
    const r=await fetch('https://www.googleapis.com/drive/v3/files/'+id+'?alt=media',{headers:{Authorization:'Bearer '+tok}});
    if(!r.ok)throw new Error('download '+r.status);
    text=await r.text();
  }catch(e){return fail('Drive: '+e.message)}
  let d;
  try{d=await decryptJSON(text,pw)}
  catch(e){return fail('Password errata o backup non valido')}
  try{
    if(!Array.isArray(d.entries))throw 0;
    const ids=new Set(data.entries.map(e=>e.id));
    const n=d.entries.filter(e=>e&&e.id&&e.f&&cat(e.cat)&&!ids.has(e.id));
    const old=data;
    data={entries:data.entries.concat(n)};
    if(!await persist()){data=old;throw 1}
    try{localStorage.setItem(DK,'1')}catch(x){}
    try{const w=await driveWho(tok);if(w)localStorage.setItem(DEK,w)}catch(x){}
    render();toast(n.length+' voci ripristinate');
    return true;
  }catch(x){return fail('Backup non valido o spazio insufficiente')}
}
function driveOffer(){
  loadGsi().catch(()=>{});
  lb(`<div class="sheet"><h1>Collegare Google Drive?</h1><p class="mu">Ogni volta che salvi, l'app aggiorna da sola un backup cifrato nel tuo Google Drive.</p><div class="grp"><button class="row" data-act="offLink"><div><strong>Collega Google Drive</strong><span class="r2"><span>Attiva il backup automatico</span></span></div>${ic('right')}</button><button class="row" data-act="close"><div><strong>Non ora</strong><span class="r2"><span>Potrai collegarlo più tardi dalla Home</span></span></div>${ic('right')}</button></div></div>`);
}

/* ---------- avvio ---------- */
document.addEventListener('click',onClick);
document.addEventListener('input',onInput);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});
addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
bind('#bAdd','click',()=>PAGE?addTo():chooser());
bind('#bEdit','click',toggleEdit);
bind('#bSave','click',saveAll);
bind('#q','input',search);
bind('#fPhoto','change',addPhoto);
bind('#fImp','change',importData);

$('#bar').innerHTML=C.map(c=>`<a href="${c.p}"${c.id===PAGE?' class="on"':''}>${ic(c.i)}${c.s}</a>`).join('');
[['#bHome','home'],['#bAdd','plus'],['#bEdit','edit'],['#bSave','save']].forEach(([s,n])=>{$(s).innerHTML=ic(n)});
$('#bEdit').disabled=!PAGE;   // in Home non c'è nulla da modificare
if(!expired())boot();   // se l'app è già sbloccata in questa sessione; altrimenti parte da unlock()

function boot(){return bootP||(bootP=bootRun())}
async function bootRun(){
  try{data=await load()}
  catch(e){
    blocked=true;
    $('#main').innerHTML='<h1>Dati non leggibili</h1><p class="mu">Non riesco a decifrare i dati salvati su questo dispositivo. Non li ho modificati. Chiudi l\'app e riprova; se il problema resta, ripristina da un backup.</p>';
    return;
  }
  if(legacy){legacy=false;await persist(true)}   // migrazione: i dati in chiaro diventano cifrati
  render();
  if(driveOn()||!PAGE)loadGsi().catch(()=>{});
  if(navigator.storage&&navigator.storage.persist)navigator.storage.persist();
  if(!PAGE&&data.entries.length&&backupDue())backupReminder();
  // apertura da altra pagina: #new = nuova voce, #id = apre quella voce
  const h=location.hash.slice(1);
  if(PAGE&&h){
    if(h==='new')addTo();else if(ent(h))go({v:'detail',id:h});
    try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
  }
}

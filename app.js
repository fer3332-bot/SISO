
{
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today=()=>iso(new Date());
const pd=s=>{const[a,b,c]=String(s).split('-').map(Number);return new Date(a,b-1,c)};
const addD=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return iso(d)};
const diff=(a,b)=>Math.round((pd(a)-pd(b))/864e5);
const MES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const DIA=['dom','lun','mar','mié','jue','vie','sáb'];
const fmt=s=>{if(!s)return'';const d=pd(s);return d.getDate()+' '+MES[d.getMonth()].slice(0,3)+' '+d.getFullYear()};
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',2600)};

/* ---------- catálogos (de los formatos del proyecto) ---------- */
const EQT=['Pick-up','Cabezal','Volqueta','Camión','Tanque de agua','Low boy','Motoniveladora','Excavadora','Retroexcavadora','Tractor','Vibrocompactador','Rodillo neumático','Cargadora','Distribuidor de emulsión','Esparcidor de agregados','Barredora','Planta / otro'];
const IT_PU=['Licencia de conducir vigente','EPP en buen estado','Alarma de reversa','Boleta de revisión vigente','Cinturón en buen estado','Triángulos (2)','Extintor con carga y revisado','Retrovisores','Bocina (pito)','Escobillas limpiaparabrisas','Jack y llave de rueda','Cabina limpia','Luces','Aceite de motor','Coolant','Baterías aseguradas','Placas de circulación','Llantas','Llanta de repuesto'];
const IT_PES=['Licencia de conducir vigente','EPP','Luces','Jack y llave de rueda','Conos (2)','Extintor 5 lb con carga y revisado','Placas','Escape en buenas condiciones','Baterías aseguradas','Parabrisas','Llantas','Certificado de operación vigente','Bocina (pito)','Alarma de reversa','Cinturón de seguridad','Sin fugas hidráulicas','Niveles (aceite, agua)','Cabina limpia'];
const IT_EXT=['Seguro','Pasador','Boquilla / manguera','Manómetro','Palanca de disparo','Arnés o base','Cilindro'];
const CAUSAS=['Error de operación','Descuido','Intención','Inevitable','Falta de mantenimiento','Error de chequeo','Omisión de reglamento','Aspectos de seguridad','Reglamentos y normas','Aspectos de control','Error de supervisión','Aspectos climáticos','Error de fabricación','Inexperiencia','Exceso de confianza','Otros'];
const CLASIF=['N/A (sin lesión)','Lesión física','Enfermedad profesional','Fatalidad','Lesión física en tránsito','Fatalidad en tránsito','Daño a equipo','Daño a instalaciones','Extravío / daño de componentes'];
const TEMAS=['Orden y limpieza 5S en áreas de trabajo','Manejo defensivo: maniobras en reversa','Identificación de riesgos y reconocimiento de peligros','Límites de velocidad y distancia de circulación','Ojos y mente en la tarea','Condición insegura y acto inseguro','Los buenos hábitos ayudan','Levantamiento manual de carga','Errores críticos que causan incidentes','Decálogo de normas básicas de higiene y seguridad','Plan de contingencias: riesgos en plantel','Cuidado y conservación del EPP','Precaución al ingreso al plantel con vehículos','Nunca te ubiques en la línea de fuego','Política de alcohol y drogas','Manejo de extintores y sus tipos','Manejo defensivo: alertas en conducción','Inspección preoperacional 360° de equipo móvil','Obligaciones de los colaboradores','Uso de herramientas manuales','Ahorro de energía','Qué hacer en caso de averías y accidentes en carretera','Posturas ergonómicas','Actitudes inseguras (bromas)','Prohibición de tabaco en áreas de trabajo','Código de vestimenta','Trabajo con emulsión asfáltica y riego','Banderilleros y control de tránsito','Manipulación de equipo de oxicorte'];
const SENALES=['10 KM/H VELOCIDAD MÁXIMA','20 KM/H VELOCIDAD MÁXIMA','DESVÍO ←','DESVÍO →','CARRIL DERECHO CERRADO','CARRIL IZQUIERDO CERRADO','SOLO UN CARRIL','BANDERILLERO (DIBUJO)','HOMBRES TRABAJANDO (DIBUJO)','DISCULPE TRABAJO EN EJECUCIÓN','FIN DE CARRETERA EN CONSTRUCCIÓN','INICIO DE CARRETERA EN CONSTRUCCIÓN','MAQUINAS TRABAJANDO','PELIGRO','PALETA PARE/SIGA','ADV. Banderilleros','ADV. Hombres trabajando','ADV. Máquinas trabajando','10 km/h máx.','30 km/h máx.','Inicio / fin de obra','Desvío izquierdo','Desvío derecho','Prohibido el paso','Peligro','Obra en construcción','Polines','Conos','Barricadas','Paletas Pare / Siga','Cinta de precaución'];
const EPP=['Chaleco reflectivo con logo','Casco','Guantes de cuero','Lentes de seguridad','Botas de seguridad','Tapones auditivos','Mascarilla','Capote','Arnés'];
const isPU=eqId=>{const e=(S.equipos||[]).find(x=>x.inv===eqId||x.id===eqId);return e?e.tipo==='Pick-up':/^PS/i.test(eqId||'')};

/* ---------- módulos ---------- */
const F=(k,l,t='text',o,x={})=>({k,l,t,o,...x});
const M={
 insp:{n:'Checklist de equipos',s:'Inspección de equipo',d:'Preoperatorio diario y auditoría del 27',f:[F('clase','Tipo','sel',['Preoperatorio diario','Auditoría mensual']),F('fecha','Fecha','date'),F('equipo','Equipo (inventario)','eq',null,{req:1}),F('conductor','Conductor / operador','per'),F('hora','Hora','time'),F('horometro','Horómetro / km','text'),F('items','Revisión','chk',r=>isPU(r.equipo)?IT_PU:IT_PES,{w:1}),F('obs','Observaciones','area',null,{w:1}),F('rec','Recomendaciones','area',null,{w:1})],
  sum:r=>[(r.equipo||'')+' · '+(r.conductor||'sin conductor'),r.clase,nc(r.items)?['bad',nc(r.items)+' no cumple']:['ok','Cumple']]},
 sucesos:{n:'Reporte de sucesos',s:'Reporte de suceso (REPSUC)',d:'Accidentes, incidentes, siniestros, robos',f:[F('codigo','Código','text',null,{ro:1}),F('tipo','Tipo','sel',['Incidente','Accidente','Siniestro','Robo','Pérdida']),F('fecha','Fecha del suceso','date'),F('hora','Hora','time'),F('lugar','Lugar / estación','text'),F('clima','Clima','sel',['Soleado','Nublado','Llovizna','Lluvia','Neblina']),F('afectado','Afectado','sel',['Persona(s)','Equipo(s)','Daño a terceros','Otro']),F('equipo','Equipo involucrado','eq'),F('participante','Participante','per'),F('relato','Relato de lo sucedido','area',null,{w:1}),F('vPart','Versión del participante','area',null,{w:1}),F('vTest','Versión del testigo','area',null,{w:1}),F('opinion','Opinión técnica','area',null,{w:1}),F('causa','Causa (clasificación)','sel',CAUSAS),F('factor','Factor','sel',['Humano','Externo']),F('clasif','Clasificación','sel',CLASIF),F('danoP','Daño personal','sel',['Ninguno','Leve','Medio','Mayor']),F('danoM','Daño material','sel',['Ninguno','Leve','Medio','Mayor','Inservible']),F('costo','Costo estimado (L)','num'),F('cobro','Cobro','sel',['No','Sí']),F('resp','Responsabilidad','sel',['Por definir','Responsable','No responsable']),F('acciones','Acciones a tomar','area',null,{w:1}),F('estado','Estado','sel',['Abierto','Cerrado'])],
  sum:r=>[(r.codigo||'')+' · '+(r.tipo||''),(r.equipo||r.participante||'')+' · '+(r.causa||''),r.estado==='Cerrado'?['ok','Cerrado']:['bad','Abierto']]},
 desvios:{n:'Desviaciones conductuales',s:'Desviación conductual',d:'Cuadro de los lunes',f:[F('fecha','Fecha','date'),F('involucrado','Nombre del involucrado','per',null,{req:1}),F('reporte','Desviación observada','area',null,{w:1}),F('accion','Acción realizada','area',null,{w:1}),F('obs','Observaciones','text'),F('coment','Comentarios SISO','text'),F('firma','Firma del involucrado','firma',null,{w:1})],
  sum:r=>[r.involucrado,r.reporte,null]},
 charlas:{n:'Charlas de seguridad',s:'Charla de seguridad',d:'Programadas e impartidas, con asistencia',f:[F('estado','Estado','sel',['Programada','Impartida']),F('fecha','Fecha','date'),F('tema','Tema','list',TEMAS,{w:1,req:1}),F('area','Área','sel',['Campo','Plantel','Oficinas','Primer ingreso']),F('instructor','Instructor','per'),F('hi','Hora inicio','time'),F('hf','Hora final','time'),F('asist','Asistentes (uno por línea: nombre – cargo)','area',null,{w:1})],
  sum:r=>[r.tema,(r.area||'')+' · '+nAs(r)+' asistentes',r.estado==='Impartida'?['ok','Impartida']:['yl','Programada']]},
 alcohol:{n:'Pruebas de alcohol',s:'Prueba de alcoholimetría',d:'Pruebas programadas al personal',f:[F('fecha','Fecha','date'),F('persona','Persona','per',null,{req:1}),F('cargo','Cargo','text'),F('resultado','Resultado','sel',['Negativo','Positivo']),F('lectura','Lectura (g/L)','text'),F('obs','Observaciones','text',null,{w:1}),F('firma','Firma del evaluado','firma',null,{w:1})],
  sum:r=>[r.persona,r.cargo,r.resultado==='Positivo'?['bad','Positivo']:['ok','Negativo']]},
 extintores:{n:'Extintores',s:'Inspección de extintor',d:'Inspección del 27, recarga y vencimiento',f:[F('fecha','Fecha de inspección','date'),F('equipo','Equipo o área','eq',null,{req:1,free:1}),F('cap','Capacidad (lb)','num'),F('recarga','Última recarga','date'),F('vence','Vencimiento de etiqueta','date'),F('items','Estado','chk',()=>IT_EXT,{w:1,labels:['Bueno','Malo','No tiene']}),F('obs','Observaciones','area',null,{w:1})],
  sum:r=>[(r.equipo||'')+' · '+(r.cap?r.cap+' lb':'s/capacidad'),r.vence?'Vence '+fmt(r.vence):'Sin etiqueta de vencimiento',venceTag(r.vence)||(ncx(r.items)?['bad',ncx(r.items)+' con falla']:['ok','Bien'])]},
 epp:{n:'EPP',s:'Entrega / movimiento de EPP',d:'Inventario real, entregas con firma y comprobante',inv:'catepp',f:[F('fecha','Fecha','date'),F('mov','Movimiento','sel',['Entrega a personal','Entrada / compra','Baja']),F('persona','Entregado a / proveedor','per'),F('cargo','Cargo','text'),F('lista','Artículos','lista',()=>catNames('catepp'),{w:1,vida:1}),F('obs','Observaciones','text',null,{w:1}),F('firma','Firma de quien recibe','firma',null,{w:1})],
  sum:r=>[eitems(r).map(i=>(i.cant||1)+' '+i.art).join(', ')||'(sin artículos)',(isIn(r)?'Entrada':r.mov==='Baja'?'Baja':'Entrega')+(r.persona?' · '+r.persona:'')+(r.cargo?' · '+r.cargo:''),r.mov==='Entrega a personal'?(r.firma?['ok','Firmado']:['yl','Sin firma']):isIn(r)?['','Entrada']:null]},
 botiquin:{n:'Botiquín',s:'Movimiento de botiquín',d:'Inventario real del botiquín y entregas de medicamentos',inv:'catbot',f:[F('fecha','Fecha','date'),F('mov','Movimiento','sel',['Salida / entrega','Entrada / requisición','Baja por vencimiento']),F('persona','Entregado a','per'),F('cargo','Cargo','text'),F('lista','Medicamentos o insumos','lista',()=>catNames('catbot'),{w:1}),F('obs','Observaciones / motivo','text',null,{w:1}),F('firma','Firma de quien recibe','firma',null,{w:1})],
  sum:r=>[eitems(r).map(i=>(i.cant||1)+' '+i.art).join(', ')||'(sin artículos)',(isIn(r)?'Entrada':String(r.mov).startsWith('Baja')?'Baja':'Entrega')+(r.persona?' · '+r.persona:''),r.mov==='Salida / entrega'?(r.firma?['ok','Firmado']:['yl','Sin firma']):isIn(r)?['','Entrada']:null]},
 catepp:{n:'Artículos de EPP',s:'Artículo de EPP',cat:1,nodate:1,mov:'epp',f:[F('nombre','Nombre del artículo','list',EPP,{req:1,w:1}),F('unidad','Unidad','sel',['Unidad','Par','Caja','Paquete']),F('inicial','Existencia inicial','num'),F('minimo','Mínimo (alerta para reponer)','num'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>{const st=stockRow('catepp',r);return[r.nombre,'Inicial '+st.ini+' · Entradas '+st.e+' · Salidas '+st.s,st.ex<=0?['bad','Existencia '+st.ex]:st.ex<=(+r.minimo||0)?['yl','Existencia '+st.ex]:['ok','Existencia '+st.ex]]}},
 catbot:{n:'Artículos de botiquín',s:'Medicamento / insumo',cat:1,nodate:1,mov:'botiquin',f:[F('nombre','Nombre','text',null,{req:1,w:1}),F('present','Presentación','list',['Tableta','Cápsula','Sobre','Frasco','Tubo','Unidad','Caja','Rollo','Par']),F('inicial','Existencia inicial','num'),F('minimo','Mínimo (alerta para reponer)','num'),F('vence','Vencimiento del lote','date'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>{const st=stockRow('catbot',r);return[r.nombre+(r.present?' ('+r.present+')':''),'Entradas '+st.e+' · Salidas '+st.s+(r.vence?' · vence '+fmt(r.vence):''),st.ex<=0?['bad','Existencia '+st.ex]:venceTag(r.vence)||(st.ex<=(+r.minimo||0)?['yl','Existencia '+st.ex]:['ok','Existencia '+st.ex])]}},
 senal:{n:'Señalización',s:'Señal / dispositivo',d:'Inventario del 25, ubicación por estación',nodate:1,f:[F('senal','Señal','list',SENALES,{req:1}),F('total','Total en proyecto','num'),F('uso','En uso','num'),F('danada','Dañadas','num'),F('extrav','Extraviadas','num'),F('ubic','Ubicación (estaciones)','text',null,{w:1}),F('act','Actualizado','date')],
  sum:r=>[r.senal,(r.ubic||'sin ubicación'),['',(r.uso||0)+' en uso · '+exist(r)+' en bodega']]},
 radios:{n:'Radios',s:'Radio',d:'Control del día 30',nodate:1,f:[F('modelo','Modelo'),F('serie','Serie',null,null,{req:1}),F('bateria','Modelo de batería'),F('cargador','Cargador','sel',['Sí','No']),F('asig','Asignado a','per'),F('puesto','Puesto'),F('estado','Estado','sel',['Operativo','Dañado','En reparación','Extraviado']),F('act','Última revisión','date'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>[(r.modelo||'Radio')+' · '+r.serie,(r.asig||'sin asignar')+(r.puesto?' · '+r.puesto:''),r.estado==='Operativo'?['ok','Operativo']:['bad',r.estado||'—']]},
 personal:{n:'Personal y licencias',s:'Persona',d:'Licencias de conducir y vencimientos',nodate:1,f:[F('nombre','Nombre completo',null,null,{req:1,w:1}),F('cargo','Cargo'),F('estado','Estado','sel',['Habilitado','No habilitado','Inactivo']),F('lic','Tipo de licencia','list',['Liviana Nacional','Pesada Nacional','Liviana Internacional','Pesada Internacional','No tiene']),F('emision','Emisión','date'),F('lvence','Vence','date'),F('obs','Observación','text',null,{w:1})],
  sum:r=>[r.nombre,(r.cargo||'')+(r.lic?' · '+r.lic:''),r.lic==='No tiene'?null:venceTag(r.lvence)||['ok','Vigente']]},
 equipos:{n:'Equipos y vehículos',s:'Equipo',d:'Inventario de equipo móvil',nodate:1,f:[F('inv','Inventario',null,null,{req:1}),F('tipo','Tipo','sel',EQT),F('modelo','Modelo'),F('placa','Placa'),F('asignado','Asignado a','per'),F('estado','Estado','sel',['Activo','Inactivo','En taller'])],
  sum:r=>[r.inv+' · '+(r.tipo||''),(r.modelo||'')+(r.placa?' · '+r.placa:'')+(r.asignado?' · '+r.asignado:''),r.estado==='Activo'?null:['yl',r.estado]]}
};
for(const k in M)if(!M[k].cat)M[k].f.push(F('fotos','Evidencia fotográfica','fotos',null,{w:1}));
const eitems=r=>r.lista&&r.lista.length?r.lista:((r.art||r.med)?[{art:r.art||r.med,cant:r.cant||1,vida:r.vida||''}]:[]);
const isIn=r=>String(r.mov||'').startsWith('Entrada');
const norm=x=>String(x||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9/ ]+/g,' ').split(/\s+/).filter(Boolean).map(w=>w.length>3&&/[lrndz]es$/.test(w)?w.slice(0,-2):w.length>3&&/s$/.test(w)?w.slice(0,-1):w).join(' ');
const catNames=c=>R(c).map(x=>x.nombre).filter(Boolean).sort((a,b)=>a.localeCompare(b));
function stockMap(c){const mk=M[c].mov,m={};for(const x of R(c))m[norm(x.nombre)]={cat:x,ini:+x.inicial||0,e:0,s:0};
 for(const r of R(mk))for(const i of eitems(r)){const k=norm(i.art);if(!k)continue;m[k]=m[k]||{cat:null,name:i.art,ini:0,e:0,s:0};if(isIn(r))m[k].e+=(+i.cant||0);else m[k].s+=(+i.cant||0)}
 for(const v of Object.values(m))v.ex=v.ini+v.e-v.s;return m}
function stockRow(c,cat){const v=stockMap(c)[norm(cat.nombre)]||{ini:+cat.inicial||0,e:0,s:0};v.ex=v.ini+v.e-v.s;return v}

const ORDER=['insp','charlas','alcohol','sucesos','desvios','extintores','epp','botiquin','senal','radios','personal','equipos'];
function nc(it){return it?Object.values(it).filter(v=>v==='N').length:0}
function ncx(it){return it?Object.values(it).filter(v=>v==='N'||v==='A').length:0}
function nAs(r){return String(r.asist||'').split('\n').filter(x=>x.trim()).length}
function exist(r){return Math.max(0,(+r.total||0)-(+r.uso||0)-(+r.danada||0)-(+r.extrav||0))}
function venceTag(v){if(!v)return null;const d=diff(v,today());if(d<0)return['bad','Vencido'];if(d<=30)return['yl','Vence en '+d+' d'];return null}

/* ---------- agenda mensual (de las carpetas del proyecto) ---------- */
const TASKS=[{id:'desv',t:'Cuadro de desviaciones conductuales',m:'desvios',dow:1},{id:'boti',t:'Inventario de botiquín y control de medicamentos',m:'botiquin',day:2},{id:'repsuc',t:'Plantilla de incidentes (control REPSUC)',m:'sucesos',day:5},{id:'epp15',t:'Inventario de EPP (1ª quincena)',m:'epp',day:15},{id:'inf',t:'Informe de seguridad SISO',m:'@informe',day:18},{id:'sen',t:'Inventario de señalización',m:'senal',day:25},{id:'aud',t:'Auditoría de equipos móviles',m:'insp',day:27},{id:'ext',t:'Inspección de extintores',m:'extintores',day:27},{id:'cal',t:'Calendario de charlas del mes siguiente',m:'charlas',day:28},{id:'epp30',t:'Inventario de EPP (2ª quincena)',m:'epp',day:30},{id:'rad',t:'Inspección de radios',m:'radios',day:30}];
function occ(from,to){const out=[];let d=pd(from);d.setDate(1);const end=pd(to);
 while(d<=end){const y=d.getFullYear(),mo=d.getMonth(),dim=new Date(y,mo+1,0).getDate();
  for(const t of TASKS){if(t.day){const due=iso(new Date(y,mo,Math.min(t.day,dim)));if(due>=from&&due<=to)out.push({t,due})}}
  for(let i=1;i<=dim;i++){const dd=new Date(y,mo,i);if(dd.getDay()===1){const due=iso(dd);if(due>=from&&due<=to)for(const t of TASKS)if(t.dow===1)out.push({t,due})}}
  d=new Date(y,mo+1,1)}
 return out.sort((a,b)=>a.due<b.due?-1:a.due>b.due?1:0)}
const done=o=>(S.entregas||[]).find(e=>e.id===o.t.id+'_'+o.due);

/* ---------- datos (Supabase + copia local + cola sin señal) ---------- */
const CONF=window.SISO_CONFIG||{};
const BUCKET=CONF.bucket||'evidencias',TBL=CONF.tabla||'registros';
const S={};let sb=null,user=null,as=null,cfg={},ready=false,loadNote='',authMsg='';
const ALL=[...ORDER,'entregas','catepp','catbot'];
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let queue=LS.get('siso_queue',[]),flushing=false,started=false;
function cacheSave(){clearTimeout(cacheSave.t);cacheSave.t=setTimeout(()=>LS.set('siso_cache',{S,cfg,t:Date.now()}),400)}
function applyRow(mod,id,data){if(!mod)return;if(mod==='config'){cfg=data||{};head();return}S[mod]=S[mod]||[];const i=S[mod].findIndex(x=>x.id===id);if(data==null){if(i>=0)S[mod].splice(i,1)}else{const o={...data,id};if(i>=0)S[mod][i]=o;else S[mod].push(o)}}
function head(){$('#ptitle').firstChild.nodeValue='SISO · '+(cfg.proyecto||'Yorito – Empalme RN-23');$('#psub').textContent=cfg.sub||'Pavimentación DTS · 13.65 km'}
async function boot(){
 const c=LS.get('siso_cache',null);if(c){Object.assign(S,c.S||{});cfg=c.cfg||{};head();ready=true}
 if(!window.supabase||!CONF.url||!CONF.anonKey||/TU-PROYECTO|PEGA/.test(CONF.url+CONF.anonKey)){authMsg=window.supabase?'config':'lib';route();return}
 sb=window.supabase.createClient(CONF.url,CONF.anonKey,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'siso-auth'}});
 try{const {data}=await sb.auth.getSession();user=data&&data.session?data.session.user:null}catch(e){user=null}
 sb.auth.onAuthStateChange((ev,ses)=>{const was=!!user;user=ses?ses.user:null;if(!!user!==was){if(user){route();start()}else render()}});
 route();if(user)start()}
async function start(){if(started)return;started=true;as=store;flush();await pull();subscribe();
 addEventListener('online',()=>{flush();pull()});addEventListener('offline',()=>{render()});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine){flush();pull()}});
 setInterval(()=>{if(!document.hidden&&navigator.onLine&&!queue.length)pull()},120000)}
async function pull(){if(!sb||!user)return;if(!navigator.onLine){if(!ready)loadNote='Sin conexión y sin copia guardada en este dispositivo todavía.';ready=true;render();return}
 try{const all=[];for(let f=0;;f+=1000){const {data,error}=await sb.from(TBL).select('modulo,id,data').range(f,f+999);if(error)throw error;all.push(...data);if(data.length<1000)break}
  for(const k of ALL)S[k]=[];let hadCfg=false;for(const r of all){if(r.modulo==='config')hadCfg=true;applyRow(r.modulo,r.id,r.data)}if(!hadCfg)cfg={};
  for(const q of queue)applyRow(q.m,q.id,q.op==='del'?null:q.data);
  ready=true;loadNote='';cacheSave();head();if(!cur)render();else syncBadge()}
 catch(e){loadNote='No se pudieron cargar los datos ('+(e.message||e)+'). Se muestra la última copia guardada en este dispositivo.';ready=true;render()}}
function subscribe(){try{sb.channel('siso-registros').on('postgres_changes',{event:'*',schema:'public',table:TBL},p=>{
 if(p.eventType==='DELETE'){const o=p.old||{};if(o.modulo)applyRow(o.modulo,o.id,null)}else{const r=p.new||{};if(queue.some(q=>q.m===r.modulo&&q.id===r.id))return;applyRow(r.modulo,r.id,r.data)}
 cacheSave();if(!cur)render();else syncBadge()}).subscribe()}catch(e){}}
function enqueue(q){queue=queue.filter(x=>!(x.m===q.m&&x.id===q.id));queue.push(q);LS.set('siso_queue',queue)}
async function save(k,id,data){if(!id)id='r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);applyRow(k,id,data);enqueue({op:'up',m:k,id,data});cacheSave();if(!cur)render();flush();return true}
async function del(k,id){applyRow(k,id,null);enqueue({op:'del',m:k,id});cacheSave();render();flush();return true}
async function flush(){if(flushing||!sb||!user||!navigator.onLine||!queue.length){syncBadge();return}flushing=true;syncBadge();
 try{while(queue.length){const q=queue[0];const r=q.op==='del'?await sb.from(TBL).delete().eq('modulo',q.m).eq('id',q.id):await sb.from(TBL).upsert({modulo:q.m,id:q.id,data:q.data,updated_at:new Date().toISOString()});if(r.error)throw r.error;queue.shift();LS.set('siso_queue',queue)}}
 catch(e){if(!/fetch|network|Load failed|Failed/i.test(e.message||''))toast('Error al sincronizar: '+(e.message||e))}
 flushing=false;syncBadge()}
function syncBadge(){const el=$('#sync');if(!el)return;if(!user){el.textContent='';el.className='sync';return}const n=queue.length,on=navigator.onLine;el.className='sync '+(!on?'off':n?'pend':'ok');el.textContent=!on?(n?'Sin señal · '+n+' por enviar':'Sin señal'):n?(flushing?'Enviando '+n+'…':n+' por enviar'):'Sincronizado'}
/* archivos: fotos, firmas y PDF en Supabase Storage */
const store={async upload(blob,o={}){const type=o.type||blob.type||'image/jpeg',ext={'application/pdf':'pdf','image/png':'png','image/webp':'webp','image/gif':'gif'}[type]||'jpg';const path=today().slice(0,7)+'/'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)+'.'+ext;const {error}=await sb.storage.from(BUCKET).upload(path,blob,{contentType:type,upsert:false,cacheControl:'31536000'});if(error)throw error;return{id:path}}};
const urlC={};
async function signed(paths){const need=paths.filter(p=>!urlC[p]||urlC[p].x<Date.now());if(need.length&&sb&&navigator.onLine){const {data}=await sb.storage.from(BUCKET).createSignedUrls(need,21600);for(const d of data||[])if(d&&d.signedUrl&&d.path)urlC[d.path]={u:d.signedUrl,x:Date.now()+18e6}}return paths.map(p=>urlC[p]&&urlC[p].u)}
let hyT=0;function hydrate(){clearTimeout(hyT);hyT=setTimeout(async()=>{const im=[...document.querySelectorAll('img[data-sid]:not([src])')];if(!im.length)return;try{await signed([...new Set(im.map(i=>i.dataset.sid))])}catch(e){}for(const i of im){const c=urlC[i.dataset.sid];if(c)i.src=c.u}},40)}
new MutationObserver(hydrate).observe(document.body,{childList:true,subtree:true});
async function fileBlob(id){const {data,error}=await sb.storage.from(BUCKET).download(id);if(error)throw error;return data}
async function openFile(id){const w=window.open('','_blank');try{const [u]=await signed([id]);if(!u)throw 0;if(w)w.location.href=u;else location.href=u}catch(e){if(w)w.close();toast('No se pudo abrir el archivo (revisa la conexión)')}}
async function saveFile(name,blob){const f=new File([blob],name,{type:blob.type||'application/octet-stream'});
 if(/iPhone|iPad|iPod/.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:name});return}catch(e){if(e&&e.name==='AbortError')return}}
 const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)}
/* acceso */
function vLogin(){const m=$('#main');
 if(authMsg){m.innerHTML=`<div class="login card"><h2>Falta configurar la conexión</h2><p>${authMsg==='lib'?'No se pudo cargar la librería de Supabase. Revisa tu conexión a internet y recarga la página.':'Abre el archivo <b>config.js</b> y pega la URL y la clave pública (anon key) de tu proyecto de Supabase. Los pasos están en LEEME.md.'}</p></div>`;return}
 m.innerHTML=`<form class="login card" id="lgf"><h2>Entrar</h2><p style="color:var(--mut);margin-top:6px">Plataforma SISO · ${esc(cfg.proyecto||'Yorito – Empalme RN-23')}</p><label class="f"><span>Correo</span><input id="lg_e" type="email" autocomplete="username" required></label><label class="f"><span>Contraseña</span><input id="lg_p" type="password" autocomplete="current-password" required></label><button class="btn pri" style="width:100%">Entrar</button><p id="lg_m" class="hint" role="status"></p></form>`;
 $('#lgf').onsubmit=async e=>{e.preventDefault();if(!navigator.onLine){$('#lg_m').textContent='Necesitas señal para entrar la primera vez.';return}$('#lg_m').textContent='Entrando…';const {error}=await sb.auth.signInWithPassword({email:$('#lg_e').value.trim(),password:$('#lg_p').value});if(error)$('#lg_m').textContent=/Invalid login/i.test(error.message)?'Correo o contraseña incorrectos.':error.message}}
function firstRun(){return ready&&navigator.onLine&&!cfg.proyecto&&!queue.length&&ALL.every(k=>!R(k).length)}
function seedBanner(){return `<div class="note">La base de datos está vacía. <button class="btn sm pri" data-act="seed">Cargar datos iniciales del proyecto</button><br><small>Equipos, licencias, extintores, señalización del inventario y los movimientos de EPP ya registrados.</small></div>`}
async function importData(d){const rows=[];if(d.config)rows.push({modulo:'config',id:'proyecto',data:d.config});for(const [k,arr] of Object.entries(d.datos||{}))for(const r of arr){const {id,...rest}=r;if(id)rows.push({modulo:k,id,data:rest})}
 for(let i=0;i<rows.length;i+=400){const {error}=await sb.from(TBL).upsert(rows.slice(i,i+400).map(x=>({...x,updated_at:new Date().toISOString()})));if(error)throw error}
 await pull();return rows.length}

/* ---------- vistas ---------- */
let view='hoy',modOpen=null,filt={q:'',mes:today().slice(0,7)},infMes=today().slice(0,7);
function route(){const h=location.hash.slice(1)||'hoy';if(h.startsWith('m-')&&M[h.slice(2)]){view='mod';modOpen=h.slice(2)}else view=['hoy','agenda','nuevo','registros','informe'].includes(h)?h:'hoy';
 for(const a of document.querySelectorAll('nav a'))a.classList.toggle('on',a.dataset.v===(view==='mod'?'registros':view));render();scrollTo(0,0)}
addEventListener('hashchange',route);
function render(){syncBadge();if(!user){vLogin();return}if(!ready&&!loadNote)return;const m=$('#main');m.innerHTML=(loadNote?'<p class="note">'+esc(loadNote)+'</p>':'')+(firstRun()?seedBanner():'')+({hoy:vHoy,agenda:vAgenda,nuevo:vNuevo,registros:vReg,informe:vInf,mod:vMod}[view])()}
const R=k=>S[k]||[];
const row=(o)=>`<div class="row ${o.click?'click':''}" ${o.click?`data-act="${o.click}" tabindex="0"`:''}>${o.left||''}<div class="tx"><b>${esc(o.t)}</b>${o.s?`<small>${esc(o.s)}</small>`:''}</div>${o.tag?`<span class="tag ${o.tag[0]}">${esc(o.tag[1])}</span>`:''}${o.right||''}</div>`;

function alerts(){const t=today(),a=[];
 for(const p of R('personal'))if(p.estado!=='Inactivo'&&p.lvence&&p.lic!=='No tiene'){const d=diff(p.lvence,t);if(d<=30)a.push({t:'Licencia de '+p.nombre,s:d<0?'Venció el '+fmt(p.lvence):'Vence el '+fmt(p.lvence),tag:d<0?['bad','Vencida']:['yl',d+' días'],click:'edit:personal:'+p.id})}
 const lastExt={};for(const e of R('extintores'))if(!lastExt[e.equipo]||e.fecha>lastExt[e.equipo].fecha)lastExt[e.equipo]=e;
 for(const e of Object.values(lastExt)){const d=e.vence?diff(e.vence,t):null,f=Object.entries(e.items||{}).filter(x=>x[1]!=='C').map(x=>x[0]+(x[1]==='A'?' (no tiene)':''));if(d!=null&&d<=30)a.push({t:'Extintor de '+e.equipo,s:'Etiqueta '+(d<0?'vencida el ':'vence el ')+fmt(e.vence),tag:d<0?['bad','Vencido']:['yl',d+' días'],click:'edit:extintores:'+e.id});if(f.length)a.push({t:'Extintor de '+e.equipo,s:'Falla: '+f.join(', '),tag:['bad','Revisar'],click:'edit:extintores:'+e.id})}
 for(const c of ['catepp','catbot']){const sm=stockMap(c);for(const v of Object.values(sm)){const nm=v.cat?v.cat.nombre:v.name,mn=v.cat?+v.cat.minimo||0:0;if(v.ex<0||(!v.cat&&v.ex<=0))a.push({t:nm+(c==='catbot'?' (botiquín)':' (EPP)'),s:v.cat?'Existencia negativa: revisa entradas o la existencia inicial':'No está en el catálogo de artículos',tag:['bad','Existencia '+v.ex],click:v.cat?'edit:'+c+':'+v.cat.id:'goto:'+M[c].mov});else if(v.cat&&mn>0&&v.ex<=mn)a.push({t:'Reponer '+nm,s:'Quedan '+v.ex+' (mínimo '+mn+')',tag:['yl','Existencia '+v.ex],click:'edit:'+c+':'+v.cat.id})}}
 for(const b of R('catbot'))if(b.vence&&diff(b.vence,t)<=30)a.push({t:b.nombre+' (botiquín)',s:'Lote vence el '+fmt(b.vence),tag:diff(b.vence,t)<0?['bad','Vencido']:['yl','Por vencer'],click:'edit:catbot:'+b.id});
 for(const s of R('sucesos'))if(s.estado!=='Cerrado')a.push({t:(s.codigo||'Suceso')+' abierto',s:(s.tipo||'')+' · '+fmt(s.fecha)+' · '+(s.acciones?'con acciones':'sin acciones definidas'),tag:['bad','Abierto'],click:'edit:sucesos:'+s.id});
 for(const i of R('insp'))if(nc(i.items)&&diff(t,i.fecha)<=7)a.push({t:i.equipo+': '+nc(i.items)+' no cumple',s:Object.entries(i.items).filter(x=>x[1]==='N').map(x=>x[0]).join(', '),tag:['or',fmt(i.fecha)],click:'edit:insp:'+i.id});
 for(const r of R('radios'))if(r.estado&&r.estado!=='Operativo')a.push({t:'Radio '+r.serie,s:r.estado,tag:['yl','Radio'],click:'edit:radios:'+r.id});
 return a}

function vHoy(){const t=today(),d=pd(t);
 const ini=cfg.inicio&&cfg.inicio>addD(t,-60)?cfg.inicio:t.slice(0,8)+'01',os=occ(ini,addD(t,7)),venc=os.filter(o=>o.due<t&&!done(o)),hoy=os.filter(o=>o.due===t),prox=os.filter(o=>o.due>t);
 const act=R('equipos').filter(e=>e.estado!=='Inactivo'&&e.estado!=='En taller');
 const pre=R('insp').filter(i=>i.fecha===t&&i.clase!=='Auditoría mensual'),con=new Set(pre.map(i=>i.equipo)),falta=act.filter(e=>!con.has(e.inv));
 const ch=R('charlas').filter(c=>c.fecha===t),alc=R('alcohol').filter(c=>c.fecha===t),al=alerts();
 const task=o=>{const dn=done(o);return row({left:`<div class="day">${pd(o.due).getDate()}<small>${DIA[pd(o.due).getDay()]}</small></div>`,t:o.t.t,s:dn?'Entregado el '+fmt(dn.hecho):(o.due<t?'Atrasado '+diff(t,o.due)+' días':o.due===t?'Vence hoy':'En '+diff(o.due,t)+' días'),tag:dn?null:o.due<t?['bad','Atrasado']:o.due===t?['or','Hoy']:null,right:`<button class="chk ${dn?'done':''}" data-act="tick:${o.t.id}_${o.due}" aria-label="Marcar entregado">${dn?'✓':''}</button>`,click:'goto:'+o.t.m})};
 return `<div class="hero"><div class="date"><span>${['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][d.getDay()]}</span><b>${d.getDate()} de ${MES[d.getMonth()]}</b><span>${venc.length?venc.length+' entrega'+(venc.length>1?'s':'')+' atrasada'+(venc.length>1?'s':''):'Sin entregas atrasadas'}${hoy.length?' · '+hoy.length+' vence'+(hoy.length>1?'n':'')+' hoy':''}</span></div>
 <div class="stats"><div class="stat ${act.length&&falta.length?'warn':'good'}" data-act="new:insp"><b>${pre.length}/${act.length}</b><small>Preoperatorios de hoy</small></div><div class="stat" data-act="new:charlas"><b>${ch.filter(c=>c.estado==='Impartida').length}/${ch.length}</b><small>Charlas de hoy</small></div><div class="stat" data-act="new:alcohol"><b>${alc.length}</b><small>Pruebas de alcohol hoy</small></div><div class="stat ${al.length?'warn':'good'}" data-act="scroll:alertas"><b>${al.length}</b><small>Alertas abiertas</small></div></div></div>
 ${venc.length+hoy.length?`<section><div class="sh"><h2>Pendiente</h2></div><div class="card">${[...venc,...hoy].map(task).join('')}</div></section>`:''}
 ${act.length?`<section><div class="sh"><h2>Preoperatorio de hoy</h2><small>${falta.length?'Toca un equipo para registrarlo':'Todos los equipos activos revisados'}</small></div><div class="chips">${act.map(e=>`<button class="chip" data-act="${con.has(e.inv)?'goto:insp':'pre:'+esc(e.inv)}" style="${con.has(e.inv)?'border-color:var(--ok);color:var(--ok)':''}">${con.has(e.inv)?'✓ ':''}${esc(e.inv)}</button>`).join('')}</div></section>`:''}
 ${ch.length?`<section><div class="sh"><h2>Charla del día</h2></div><div class="card">${ch.map(c=>row({t:c.tema,s:(c.area||'')+' · '+nAs(c)+' asistentes',tag:c.estado==='Impartida'?['ok','Impartida']:['yl','Programada'],click:'edit:charlas:'+c.id})).join('')}</div></section>`:''}
 <section id="alertas"><div class="sh"><h2>Alertas</h2></div><div class="card">${al.length?al.map(row).join(''):'<p class="empty">Nada vencido ni por vencer. Las licencias, extintores, sucesos abiertos y hallazgos aparecerán aquí.</p>'}</div></section>
 <section><div class="sh"><h2>Próximos 7 días</h2><a href="#agenda">Ver agenda</a></div><div class="card">${prox.length?prox.map(task).join(''):'<p class="empty">Sin entregas programadas.</p>'}</div></section>`}

let agMes=today().slice(0,7);
function vAgenda(){const[y,mo]=agMes.split('-').map(Number),from=agMes+'-01',to=iso(new Date(y,mo,0)),t=today(),os=occ(from,to),dn=os.filter(done).length;
 return `<div class="sh"><h2>Entregas de ${MES[mo-1]} ${y}</h2><div class="tools" style="margin:0"><button class="btn sm" data-act="ag:-1" aria-label="Mes anterior">‹</button><button class="btn sm" data-act="ag:0">Este mes</button><button class="btn sm" data-act="ag:1" aria-label="Mes siguiente">›</button></div></div>
 <p style="margin:0 0 6px">${dn} de ${os.length} entregadas</p><div class="bar" style="margin-bottom:16px"><i style="width:${os.length?Math.round(dn/os.length*100):0}%"></i></div>
 <div class="card">${os.map(o=>{const d=done(o);return row({left:`<div class="day">${pd(o.due).getDate()}<small>${DIA[pd(o.due).getDay()]}</small></div>`,t:o.t.t,s:d?'Entregado el '+fmt(d.hecho)+(d.nota?' · '+d.nota:''):(o.due<(cfg.inicio||'')?'':o.due<t?'Atrasado':o.due===t?'Vence hoy':''),tag:d?null:o.due<(cfg.inicio||'')?['','Antes del inicio']:o.due<t?['bad','Atrasado']:o.due===t?['or','Hoy']:null,right:`<button class="chk ${d?'done':''}" data-act="tick:${o.t.id}_${o.due}" aria-label="Marcar entregado">${d?'✓':''}</button>`,click:'goto:'+o.t.m})}).join('')}</div>
 <p class="note" style="margin-top:16px">Rutina diaria: checklist preoperatorio de cada equipo, charla de 5 minutos (lunes, miércoles y jueves en campo; martes en oficinas) y pruebas de alcohol programadas.</p>`}

function vNuevo(){return `<h2 style="margin-bottom:14px">¿Qué vas a registrar?</h2><div class="grid">${ORDER.map(k=>`<button class="tile" data-act="new:${k}"><b>${M[k].s}</b><small>${M[k].d}</small></button>`).join('')}</div>`}
function vReg(){return `<div class="sh"><h2>Registros</h2><button class="btn sm" data-act="xall">Exportar todo a Excel</button></div><div class="grid">`+['epp','botiquin'].map(k=>{const sm=Object.values(stockMap(M[k].inv));return `<a class="tile inv" href="#m-${k}" style="text-decoration:none"><b>Inventario de ${k==='epp'?'EPP':'botiquín'}</b><small>${sm.length} artículos · ${sm.reduce((a,v)=>a+Math.max(0,v.ex),0)} en existencia</small></a>`}).join('')+`${ORDER.map(k=>`<a class="tile" href="#m-${k}" style="text-decoration:none"><b>${M[k].n}</b><small>${R(k).length} registro${R(k).length===1?'':'s'}</small></a>`).join('')}</div>`}

function invTable(c){const sm=stockMap(c),rows=Object.values(sm).sort((a,b)=>String(a.cat?a.cat.nombre:a.name).localeCompare(String(b.cat?b.cat.nombre:b.name)));
 return `<section style="margin-top:0"><div class="sh"><h3>Inventario real</h3><div class="tools" style="margin:0"><button class="btn sm" data-act="new:${c}">+ Artículo</button><button class="btn sm" data-act="inmov:${M[c].mov}">+ Entrada</button></div></div>
 ${rows.length?`<div class="card scroll"><table class="inv"><thead><tr><th>Artículo</th><th class="n">Inicial</th><th class="n">Entradas</th><th class="n">Salidas</th><th class="n">Existencia</th></tr></thead><tbody>${rows.map(v=>{const mn=v.cat?+v.cat.minimo||0:0,cl=v.ex<=0?'bad':mn&&v.ex<=mn?'warn':'';return`<tr class="${v.cat?'click':''}" ${v.cat?`data-act="edit:${c}:${esc(v.cat.id)}" tabindex="0"`:''}><td>${esc(v.cat?v.cat.nombre:v.name)}${v.cat?'':' <span class="tag bad">sin catálogo</span>'}${c==='catbot'&&v.cat&&v.cat.vence?`<br><small style="color:var(--mut)">Vence ${fmt(v.cat.vence)}</small>`:''}</td><td class="n">${v.ini}</td><td class="n">${v.e}</td><td class="n">${v.s}</td><td class="n ex ${cl}">${v.ex}</td></tr>`}).join('')}</tbody></table></div>`:`<p class="empty card">Aún no hay artículos. Crea cada artículo una sola vez (por ejemplo “Chaleco reflectivo”) con su existencia inicial; luego cada entrada y entrega se suma o resta en su misma fila.</p>`}
 </section><h3 style="margin:22px 0 8px">Movimientos</h3>`}
function vMod(){const k=modOpen,m=M[k];let rs=R(k).slice();
 if(!m.nodate&&filt.mes)rs=rs.filter(r=>String(r.fecha||'').startsWith(filt.mes));
 if(filt.q){const q=filt.q.toLowerCase();rs=rs.filter(r=>JSON.stringify(r).toLowerCase().includes(q))}
 rs.sort((a,b)=>m.nodate?String(m.sum(a)[0]).localeCompare(String(m.sum(b)[0])):String(b.fecha||'').localeCompare(String(a.fecha||''))||String(b.hora||'').localeCompare(String(a.hora||'')));
 const meses=[...new Set(R(k).map(r=>String(r.fecha||'').slice(0,7)).filter(Boolean).concat(today().slice(0,7)))].sort().reverse();
 return `<div class="sh"><h2>${m.n}</h2><div class="tools" style="margin:0"><button class="btn pri" data-act="new:${k}">+ Nuevo</button><button class="btn" data-act="x:${k}">Excel</button></div></div>
 <div class="tools"><input id="q" type="search" placeholder="Buscar…" value="${esc(filt.q)}">${m.nodate?'':`<select id="mes"><option value="">Todos los meses</option>${meses.map(x=>`<option value="${x}" ${x===filt.mes?'selected':''}>${MES[+x.slice(5)-1]} ${x.slice(0,4)}</option>`).join('')}</select>`}</div>
 ${m.inv?invTable(m.inv):''}
 <div class="card">${rs.length?rs.map(r=>{const s=m.sum(r);return row({left:m.nodate?'':`<div class="day">${r.fecha?pd(r.fecha).getDate():'–'}<small>${r.fecha?MES[pd(r.fecha).getMonth()].slice(0,3):''}</small></div>`,t:s[0]||'(sin nombre)',s:(s[1]||'')+((r.fotos||[]).length?' · '+r.fotos.length+' foto'+(r.fotos.length>1?'s':''):''),tag:s[2]&&s[2][1]?s[2]:null,click:'edit:'+k+':'+r.id})}).join(''):`<p class="empty">${R(k).length?'Nada coincide con el filtro.':'Aún no hay registros. Usa “+ Nuevo”.'}</p>`}</div>`}

/* ---------- informe mensual ---------- */
function infData(mes){const inM=r=>String(r.fecha||'').startsWith(mes),g=k=>R(k).filter(inM);
 const ins=g('insp'),items=ins.flatMap(i=>Object.values(i.items||{})).filter(v=>v!=='A'),okI=items.filter(v=>v==='C').length;
 const ch=g('charlas').filter(c=>c.estado==='Impartida'),su=g('sucesos'),al=g('alcohol'),ep=g('epp').filter(e=>e.mov==='Entrega a personal'),bo=g('botiquin').filter(b=>b.mov==='Salida / entrega'),ex=g('extintores'),de=g('desvios');
 const cnt=(arr,f)=>{const o={};for(const x of arr){const v=f(x)||'—';o[v]=(o[v]||0)+(+x.cant||1)}return o};const epi=ep.flatMap(eitems);const fotos=ORDER.reduce((a,k)=>a+g(k).reduce((b,r)=>b+(r.fotos||[]).length,0),0);
 return{ins,pct:items.length?Math.round(okI/items.length*100):null,ch,asis:ch.reduce((a,c)=>a+nAs(c),0),su,al,pos:al.filter(a=>a.resultado==='Positivo').length,ep,eppA:cnt(epi,e=>e.art),eppN:epi.reduce((a,e)=>a+(+e.cant||1),0),fotos,firm:ep.filter(e=>e.firma).length,bo,boA:cnt(bo.flatMap(eitems),b=>b.art),ex,exMal:ex.filter(e=>ncx(e.items)).length,de,hall:ins.filter(i=>nc(i.items))}}
function vInf(){const[y,mo]=infMes.split('-').map(Number),d=infData(infMes);
 const tb=(h,rows)=>rows.length?`<div class="card scroll"><table class="stack"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="empty card">Sin registros este mes.</p>';
 return `<div class="sh"><h2>Informe SISO · ${MES[mo-1]} ${y}</h2><div class="tools" style="margin:0"><button class="btn sm" data-act="inf:-1">‹</button><button class="btn sm" data-act="inf:1">›</button><button class="btn sm" data-act="copyinf">Copiar texto</button><button class="btn sm pri" data-act="xinf">Excel del mes</button></div></div>
 <p class="note">Resumen de las actividades del mes para la Fase III del informe del día 18. Copia el texto al documento de Word y adjunta la evidencia fotográfica.</p>
 <div class="kv"><div><b>${d.ch.length}</b><small>Charlas impartidas</small></div><div><b>${d.asis}</b><small>Asistencias</small></div><div><b>${d.ins.length}</b><small>Inspecciones de equipo</small></div><div><b>${d.pct==null?'–':d.pct+'%'}</b><small>Ítems que cumplen</small></div><div><b>${d.ex.length}</b><small>Extintores inspeccionados</small></div><div><b>${d.al.length}</b><small>Pruebas de alcohol (${d.pos} positivas)</small></div><div><b>${d.su.length}</b><small>Sucesos reportados</small></div><div><b>${d.de.length}</b><small>Desviaciones</small></div><div><b>${d.eppN}</b><small>EPP entregado (${d.firm} de ${d.ep.length} entregas firmadas)</small></div><div><b>${d.fotos}</b><small>Fotos de evidencia</small></div></div>
 <section><h3 style="margin-bottom:8px">Charlas impartidas</h3>${tb(['Fecha','Tema','Área','Asistentes'],d.ch.sort((a,b)=>a.fecha<b.fecha?-1:1).map(c=>[fmt(c.fecha),c.tema,c.area||'',nAs(c)]))}</section>
 <section><h3 style="margin-bottom:8px">Hallazgos en equipos</h3>${tb(['Fecha','Equipo','No cumple'],d.hall.map(i=>[fmt(i.fecha),i.equipo,Object.entries(i.items).filter(x=>x[1]==='N').map(x=>x[0]).join(', ')]))}</section>
 <section><h3 style="margin-bottom:8px">Sucesos</h3>${tb(['Código','Fecha','Tipo','Causa','Estado'],d.su.map(s=>[s.codigo,fmt(s.fecha),s.tipo,s.causa||'',s.estado]))}</section>
 <section><h3 style="margin-bottom:8px">EPP entregado</h3>${tb(['Artículo','Cantidad'],Object.entries(d.eppA))}</section>
 <section><h3 style="margin-bottom:8px">Botiquín: salidas</h3>${tb(['Medicamento','Cantidad'],Object.entries(d.boA))}</section>`}
function infText(){const[y,mo]=infMes.split('-').map(Number),d=infData(infMes),L=[];
 L.push('ACTIVIDADES SISO EJECUTADAS – '+MES[mo-1].toUpperCase()+' '+y,'Proyecto: '+(cfg.proyecto||'Yorito – Empalme RN-23'),'');
 L.push('1. Charlas de seguridad: se impartieron '+d.ch.length+' charlas con '+d.asis+' asistencias en total.');d.ch.forEach(c=>L.push('   - '+fmt(c.fecha)+': '+c.tema+' ('+(c.area||'')+', '+nAs(c)+' asistentes)'));
 L.push('2. Inspecciones de equipo móvil: '+d.ins.length+' checklists'+(d.pct!=null?', con '+d.pct+'% de ítems en cumplimiento':'')+'.');d.hall.forEach(i=>L.push('   - '+i.equipo+' ('+fmt(i.fecha)+'): '+Object.entries(i.items).filter(x=>x[1]==='N').map(x=>x[0]).join(', ')));
 L.push('3. Extintores: '+d.ex.length+' inspeccionados; '+d.exMal+' con componentes en mal estado.');
 L.push('4. Pruebas de alcoholimetría: '+d.al.length+' aplicadas, '+d.pos+' positivas.');
 L.push('5. Sucesos: '+d.su.length+' reportados.');d.su.forEach(s=>L.push('   - '+s.codigo+' '+s.tipo+' ('+fmt(s.fecha)+'): '+(s.causa||'')+' – '+s.estado));
 L.push('6. Desviaciones conductuales registradas: '+d.de.length+'.');
 L.push('7. EPP entregado: '+(Object.entries(d.eppA).map(([a,c])=>c+' '+a).join(', ')||'ninguno')+'.');
 L.push('   Entregas firmadas: '+d.firm+' de '+d.ep.length+'. Evidencia fotográfica del mes: '+d.fotos+' fotos.');
 L.push('8. Botiquín, salidas: '+(Object.entries(d.boA).map(([a,c])=>c+' '+a).join(', ')||'ninguna')+'.');
 return L.join('\n')}

/* ---------- formulario ---------- */
let cur=null;
function fieldHTML(f,r){const v=r[f.k]??'',id='f_'+f.k,ro=f.ro?'readonly':'';let inp;
 if(f.t==='sel')inp=`<select id="${id}">${f.o.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
 else if(f.t==='area')inp=`<textarea id="${id}">${esc(v)}</textarea>`;
 else if(f.t==='fotos')return `<div class="f w" style="margin-bottom:12px"><span style="display:block;font:600 14px Barlow,sans-serif;color:var(--mut);margin-bottom:4px">${esc(f.l)}</span><div class="fotos" id="f_fotos">${fotosHTML()}</div></div>`;
 else if(f.t==='firma')return `<div class="f w sig" style="margin-bottom:12px"><span style="display:block;font:600 14px Barlow,sans-serif;color:var(--mut);margin-bottom:4px">${esc(f.l)}</span><div id="f_firma">${sigHTML()}</div></div>`;
 else if(f.t==='lista')return `<div class="f w" style="margin-bottom:12px"><span style="display:block;font:600 14px Barlow,sans-serif;color:var(--mut);margin-bottom:4px">${esc(f.l)}</span><div class="li-h ${f.vida?'':'nv'}"><span>Artículo</span><span>Cant.</span>${f.vida?'<span>Vida útil (meses)</span>':''}<span></span></div><div id="f_lista" data-vida="${f.vida?1:0}">${(eitems(r).length?eitems(r):[{art:'',cant:1}]).map(i=>liRow(i,f.vida)).join('')}</div><datalist id="dl_cat">${f.o().map(o=>`<option value="${esc(o)}">`).join('')}</datalist><p class="hint">${f.o().length?'Elige el artículo del inventario para que se sume o descuente en su fila.':'Tip: crea primero los artículos en el inventario (botón “+ Artículo”) para llevar la existencia real.'}</p><button type="button" class="btn sm" data-act="addli">+ Otro artículo</button></div>`;
 else if(f.t==='chk')inp=`<div id="${id}" class="chkbox">${chkHTML(f,r)}</div>`;
 else if(f.t==='eq'){inp=`<input id="${id}" list="dl_eq" value="${esc(v)}" autocomplete="off" placeholder="Ej. PS-764">`}
 else if(f.t==='per')inp=`<input id="${id}" list="dl_per" value="${esc(v)}" autocomplete="off">`;
 else if(f.t==='list')inp=`<input id="${id}" list="dl_${f.k}" value="${esc(v)}" autocomplete="off"><datalist id="dl_${f.k}">${f.o.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`;
 else inp=`<input id="${id}" type="${{date:'date',time:'time',num:'number'}[f.t]||'text'}" ${f.t==='num'?'inputmode="decimal" step="any"':''} value="${esc(v)}" ${ro}>`;
 return `<label class="f ${f.w?'w':''}"><span>${esc(f.l)}${f.req?' *':''}</span>${inp}</label>`}
function chkHTML(f,r){const its=f.o(r),cur=r[f.k]||{},lb=f.labels||['Cumple','No cumple','N/A'];
 return `<div style="display:flex;gap:8px;margin-bottom:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-act="allC:${f.k}">Todo ${lb[0].toLowerCase()}</button><small style="color:var(--mut);align-self:center">C = ${lb[0]} · X = ${lb[1]} · NA = ${lb[2]}</small></div>`+its.map((it,i)=>{const v=cur[it]||'C';return`<div class="ci"><span>${esc(it)}</span><div class="seg" data-it="${esc(it)}">${[['C','C'],['N','X'],['A','NA']].map(([c,t])=>`<button type="button" class="${v===c?c:''}" data-v="${c}" aria-label="${esc(it)}: ${[lb[0],lb[1],lb[2]][['C','N','A'].indexOf(c)]}">${t}</button>`).join('')}</div></div>`}).join('')}
const liRow=(i,vida)=>`<div class="li-row ${vida?'':'nv'}"><input class="li-a" list="dl_cat" value="${esc(i.art||'')}" placeholder="Buscar artículo…" aria-label="Artículo" autocomplete="off"><input class="li-c" type="number" inputmode="numeric" min="1" value="${esc(i.cant||1)}" aria-label="Cantidad">${vida?`<input class="li-v" type="number" inputmode="numeric" value="${esc(i.vida||'')}" aria-label="Vida útil en meses">`:''}<button type="button" class="btn sm" data-act="rmli" aria-label="Quitar artículo">✕</button></div>`;
function fotosHTML(){const f=cur?cur.fotos:[];return f.map((id,i)=>`<div class="ph"><img data-sid="${esc(id)}" alt="Foto ${i+1}"><button type="button" data-act="rmph:${i}" aria-label="Quitar foto">✕</button></div>`).join('')+(cur&&cur.up?`<div class="ph" style="display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--mut)">Subiendo ${cur.up}…</div>`:'')+(as&&navigator.onLine?`<label class="addph">+ Foto<br>cámara o galería<input class="phin" type="file" accept="image/*" multiple></label>`:'<small style="color:var(--mut)">Sin conexión: las fotos se agregan cuando vuelva la señal.</small>')}
function sigHTML(){if(cur&&cur.firma&&!cur.resign)return `<img data-sid="${esc(cur.firma)}" alt="Firma"><div class="sr"><small>Firmado${cur.r.firmaFecha?' el '+fmt(cur.r.firmaFecha):''}</small><button type="button" class="btn sm" data-act="resign">Volver a firmar</button></div>`;
 return `<canvas id="sigc" aria-label="Recuadro para firmar con el dedo"></canvas><div class="sr"><small>Que la persona firme con el dedo dentro del recuadro</small><button type="button" class="btn sm" data-act="sigclear">Borrar</button></div>`}
function initSig(){const c=$('#sigc');if(!c)return;const b=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=Math.round(b.width*dpr);c.height=Math.round(b.height*dpr);const x=c.getContext('2d');x.scale(dpr,dpr);x.lineWidth=2.6;x.lineCap='round';x.lineJoin='round';x.strokeStyle='#111';let dn=false;
 const pt=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 c.onpointerdown=e=>{e.preventDefault();dn=true;try{c.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+.1,p.y+.1);x.stroke();cur.sigDirty=true};
 c.onpointermove=e=>{if(!dn)return;e.preventDefault();const p=pt(e);x.lineTo(p.x,p.y);x.stroke()};
 c.onpointerup=c.onpointercancel=()=>{dn=false}}
async function compress(file){try{const u=URL.createObjectURL(file);const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u});const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);const b=await new Promise(ok=>c.toBlob(ok,'image/jpeg',.82));return b||file}catch(e){return file}}
async function upPhotos(files){if(!as||!cur)return;const c0=cur;for(const f of files){c0.up=(c0.up||0)+1}refreshPh();
 for(const f of files){try{const b=await compress(f);const r=await as.upload(b,{type:b.type&&/^image\/(jpeg|png|webp|gif)$/.test(b.type)?b.type:'image/jpeg'});c0.fotos.push(r.id)}catch(e){toast('No se pudo subir una foto: '+(e&&e.message||'revisa la conexión'))}c0.up--;if(cur===c0)refreshPh()}}
function refreshPh(){const el=$('#f_fotos');if(el)el.innerHTML=fotosHTML()}
function readChk(f){const o={};for(const s of document.querySelectorAll('#f_'+f.k+' .seg')){const b=s.querySelector('button.C,button.N,button.A');o[s.dataset.it]=b?b.dataset.v:'C'}return o}
function openForm(k,id,pre={}){const m=M[k];let r=id?{...R(k).find(x=>x.id===id)}:{fecha:today(),...pre};
 if(!id){for(const f of m.f)if(f.t==='sel'&&r[f.k]==null)r[f.k]=f.o[0];if(k==='charlas'&&!pre.estado)r.estado='Impartida';if(k==='sucesos')r.codigo=nextCode();if(k==='alcohol'||k==='charlas'||k==='desvios')r.instructor=r.instructor||cfg.siso||''}
 cur={k,id,r,fotos:[...(r.fotos||[])],firma:r.firma||'',resign:false,sigDirty:false,up:0};const eqs=R('equipos').map(e=>e.inv),pers=[...new Set(R('personal').map(p=>p.nombre).filter(Boolean))];
 $('#sheet').innerHTML=`<div class="hd"><h3>${id?'Editar':'Nuevo'}: ${m.s}</h3><button class="btn sm dk" data-act="close" aria-label="Cerrar" style="border-color:#555">✕</button></div>
 <form class="bd" id="frm"><div class="fg">${m.f.map(f=>fieldHTML(f,r)).join('')}</div><datalist id="dl_eq">${eqs.map(e=>`<option value="${esc(e)}">`).join('')}</datalist><datalist id="dl_per">${pers.map(e=>`<option value="${esc(e)}">`).join('')}</datalist></form>
 <div class="ft"><button class="btn pri" data-act="save">Guardar</button><button class="btn dk" data-act="pdf">${pdfLabel(k,r)}</button>${r.comprobante?`<button class="btn" data-act="openf:${esc(r.comprobante)}">Ver PDF guardado</button>`:''}${id?`<button class="btn" data-act="dup">Duplicar</button><span class="sp"></span><button class="btn" data-act="askdel" style="color:var(--bad)">Eliminar</button>`:''}</div>`;
 if(m.cat&&id){const nm=norm(r.nombre),hist=R(m.mov).filter(x=>eitems(x).some(i=>norm(i.art)===nm)).sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha))),st=stockRow(k,r);
  $('#frm').insertAdjacentHTML('beforeend',`<div class="kv" style="margin:6px 0 14px"><div><b>${st.ini}</b><small>Inicial</small></div><div><b>${st.e}</b><small>Entradas</small></div><div><b>${st.s}</b><small>Salidas</small></div><div><b style="color:${st.ex<=0?'var(--bad)':'var(--ok)'}">${st.ex}</b><small>Existencia real</small></div></div><h3 style="margin-bottom:8px">Movimientos de este artículo</h3><div class="card">${hist.length?hist.map(x=>{const q=eitems(x).filter(i=>norm(i.art)===nm).reduce((a,i)=>a+(+i.cant||0),0);return row({left:`<div class="day">${pd(x.fecha).getDate()}<small>${MES[pd(x.fecha).getMonth()].slice(0,3)}</small></div>`,t:(isIn(x)?'+':'−')+q+' · '+(isIn(x)?'Entrada':x.mov),s:x.persona||'',tag:null,click:'edit:'+m.mov+':'+x.id})}).join(''):'<p class="empty">Sin movimientos todavía.</p>'}</div>`)}
 $('#modal').classList.add('on');initSig();
const eqI=$('#f_equipo');if(eqI&&m.f.some(f=>f.t==='chk')&&k==='insp')eqI.addEventListener('change',()=>{const f=m.f.find(f=>f.t==='chk');const tmp={...r,equipo:eqI.value,[f.k]:readChk(f)};$('#f_'+f.k).innerHTML=chkHTML(f,tmp)})}
function nextCode(){const y=today().slice(0,4),n=R('sucesos').filter(s=>String(s.codigo||'').includes('-'+y+'-')).map(s=>+String(s.codigo).split('-').pop()||0);return 'RS-'+y+'-'+pad(Math.max(0,...n)+1).padStart(3,'0')}
function collect(){const m=M[cur.k],o={};for(const f of m.f){if(f.t==='chk'){o[f.k]=readChk(f);continue}if(f.t==='fotos'){o.fotos=cur.fotos.slice();continue}if(f.t==='firma'){o.firma=cur.firma||'';if(cur.r.firmaFecha)o.firmaFecha=cur.r.firmaFecha;continue}if(f.t==='lista'){o.lista=[...document.querySelectorAll('#f_lista .li-row')].map(x=>({art:x.querySelector('.li-a').value.trim(),cant:+x.querySelector('.li-c').value||1,vida:x.querySelector('.li-v')?x.querySelector('.li-v').value:''})).filter(i=>i.art);continue}let v=$('#f_'+f.k).value.trim();if(f.t==='num'&&v!=='')v=+v;o[f.k]=v}return o}
function pdfLabel(k,r){return k==='epp'?'Comprobante PDF':k==='botiquin'?'Comprobante PDF':'PDF con evidencia'}
function closeM(){$('#modal').classList.remove('on');cur=null;render()}

/* ---------- excel ---------- */
let xlsxP=null;
function loadX(){return xlsxP||(xlsxP=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=()=>ok(window.XLSX);s.onerror=()=>{xlsxP=null;no()};document.head.appendChild(s)}))}
function rowsFor(k,list){const m=M[k];return(list||R(k)).slice().sort((a,b)=>String(a.fecha||'').localeCompare(String(b.fecha||''))).map(r=>{const o={};for(const f of m.f){if(f.t==='chk'){for(const it of f.o(r)){const v=(r[f.k]||{})[it];o[it]=v==='N'?'X':v==='A'?'N/A':'✓'}}else if(f.t==='fotos')o['Fotos']=(r.fotos||[]).length;else if(f.t==='firma')o[f.l]=r.firma?'Firmado':'';else if(f.t==='lista')o[f.l]=eitems(r).map(i=>(i.cant||1)+' '+i.art+(i.vida?' ('+i.vida+' meses)':'')).join(', ');else o[f.l]=f.t==='date'&&r[f.k]?r[f.k]:r[f.k]??''}if(k==='charlas')o['N° asistentes']=nAs(r);if(k==='senal')o['Existencia en bodega']=exist(r);return o})}
async function exportX(name,sheets){
 let X;try{X=await loadX()}catch(e){toast('No se pudo cargar el generador de Excel');return}
 const wb=X.utils.book_new();for(const[n,rows]of sheets){const ws=X.utils.json_to_sheet(rows.length?rows:[{'':'Sin registros'}]);ws['!cols']=Object.keys(rows[0]||{a:1}).map(h=>({wch:Math.min(40,Math.max(10,h.length+2))}));X.utils.book_append_sheet(wb,ws,n.slice(0,31))}
 const buf=X.write(wb,{type:'array',bookType:'xlsx'});
 await saveFile(name+'.xlsx',new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));toast('Excel listo')}

function invRows(c){return Object.values(stockMap(c)).map(v=>({'Artículo':v.cat?v.cat.nombre:v.name,'Existencia inicial':v.ini,'Entradas':v.e,'Salidas':v.s,'Existencia real':v.ex,'Mínimo':v.cat?+v.cat.minimo||0:'',...(c==='catbot'?{'Vencimiento':v.cat&&v.cat.vence||''}:{})}))}
/* ---------- PDF ---------- */
let pdfP=null;
function loadPdf(){return pdfP||(pdfP=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=()=>ok(window.jspdf.jsPDF);s.onerror=()=>{pdfP=null;no()};document.head.appendChild(s)}))}
async function imgOf(id){const b=await fileBlob(id);const du=await new Promise((ok,no)=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=no;f.readAsDataURL(b)});const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=du});return{du,w:im.naturalWidth,h:im.naturalHeight,fmt:/^data:image\/png/.test(du)?'PNG':'JPEG'}}
const pdfTitle=(k,r)=>k==='epp'&&r.mov==='Entrega a personal'?'Comprobante de entrega de EPP':k==='botiquin'&&r.mov==='Salida / entrega'?'Comprobante de entrega de medicamentos':M[k].s;
const pdfName=(k,r)=>(pdfTitle(k,r)+' - '+(r.persona||r.equipo||r.involucrado||r.codigo||r.tema||'')+' - '+(r.fecha||today())).replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,' ').slice(0,120);
async function makePDF(k,r){const J=await loadPdf(),doc=new J({unit:'mm',format:'letter'}),W=215.9,X=14,CW=W-2*X;let y=0;
 const T=v=>String(v??'').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/×/g,'x').replace(/←/g,'<-').replace(/→/g,'->').replace(/[^\x00-\xFF]/g,'');
 const need=h=>{if(y+h>262){doc.addPage();y=18}};
 const H=t=>{need(14);y+=3;doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(20);doc.text(T(t),X,y);doc.setDrawColor(255,90,0);doc.setLineWidth(.8);doc.line(X,y+1.6,X+CW,y+1.6);y+=8};
 const kv=(l,v)=>{if(v===''||v==null)return;doc.setFontSize(10);const ln=doc.splitTextToSize(T(v),CW-50);need(ln.length*4.6+2);doc.setFont('helvetica','bold');doc.setTextColor(90);doc.text(T(l),X,y);doc.setFont('helvetica','normal');doc.setTextColor(20);doc.text(ln,X+50,y);y+=ln.length*4.6+2};
 const title=pdfTitle(k,r);
 doc.setFillColor(20,20,20);doc.rect(0,0,W,27,'F');doc.setFillColor(255,90,0);doc.rect(0,27,W,2.5,'F');
 doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(16);doc.text(T(title),X,12);doc.setFont('helvetica','normal');doc.setFontSize(9.5);
 doc.text(T((cfg.empresa?cfg.empresa+'  |  ':'')+'Proyecto '+(cfg.proyecto||'Yorito - Empalme RN-23')),X,19);doc.text(T('Seguridad y Salud Ocupacional (SISO)'),X,24);
 doc.setFontSize(9);doc.text(T((r.codigo?r.codigo+'  |  ':'')+'Fecha: '+fmt(r.fecha||today())),W-X,12,{align:'right'});
 y=40;doc.setTextColor(20);
 const m=M[k];const plain=m.f.filter(f=>!['chk','fotos','firma','lista','area'].includes(f.t)),areas=m.f.filter(f=>f.t==='area');
 H('Datos del registro');for(const f of plain){let v=r[f.k];if(f.t==='date')v=v?fmt(v):'';kv(f.l,v)}
 for(const f of m.f.filter(f=>f.t==='lista')){const its=eitems(r);H(f.l);need(8);doc.setFillColor(245,242,238);doc.rect(X,y-4.5,CW,7,'F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('Artículo',X+2,y);doc.text('Cantidad',X+CW-(f.vida?60:2),y,{align:'right'});if(f.vida)doc.text('Vida útil',X+CW-2,y,{align:'right'});y+=7;doc.setFont('helvetica','normal');
  for(const i of its){need(7);doc.text(T(i.art),X+2,y);doc.text(String(i.cant||1),X+CW-(f.vida?60:2),y,{align:'right'});if(f.vida)doc.text(i.vida?T(i.vida+' meses'):'-',X+CW-2,y,{align:'right'});doc.setDrawColor(220);doc.setLineWidth(.2);doc.line(X,y+2,X+CW,y+2);y+=7}
  doc.setFont('helvetica','bold');need(7);doc.text('Total de piezas',X+2,y);doc.text(String(its.reduce((a,i)=>a+(+i.cant||1),0)),X+CW-(f.vida?60:2),y,{align:'right'});y+=6}
 for(const f of m.f.filter(f=>f.t==='chk')){const its=f.o(r),v=r[f.k]||{},lb=f.labels||['Cumple','No cumple','N/A'];H(f.l+' ('+its.filter(i=>(v[i]||'C')==='C').length+' de '+its.length+' '+lb[0].toLowerCase()+')');doc.setFontSize(9.5);
  const half=Math.ceil(its.length/2);for(let i=0;i<half;i++){need(6);for(const [j,cx] of [[i,X],[i+half,X+CW/2+2]]){const it=its[j];if(!it)continue;const st=v[it]||'C';doc.setFont('helvetica','normal');doc.setTextColor(20);doc.text(T(it),cx,y,{maxWidth:CW/2-30});doc.setFont('helvetica','bold');if(st==='N')doc.setTextColor(200,35,27);else if(st==='A')doc.setTextColor(120);else doc.setTextColor(11,122,90);doc.text(T(lb[['C','N','A'].indexOf(st)]),cx+CW/2-6,y,{align:'right'})}y+=6}doc.setTextColor(20)}
 for(const f of areas)if(r[f.k]){H(f.l);doc.setFont('helvetica','normal');doc.setFontSize(10);const ln=doc.splitTextToSize(T(r[f.k]),CW);for(const l of ln){need(5);doc.text(l,X,y);y+=4.8}}
 if(m.f.some(f=>f.t==='firma')){const fl=m.f.find(f=>f.t==='firma');
  if(k==='epp'&&r.mov==='Entrega a personal'){H('Declaración de recepción');doc.setFont('helvetica','normal');doc.setFontSize(10);const ln=doc.splitTextToSize(T('Yo, '+(r.persona||'________________')+(r.cargo?', '+r.cargo:'')+', recibí el equipo de protección personal descrito arriba, nuevo y en buen estado. Me comprometo a usarlo de forma obligatoria durante mi jornada, a cuidarlo y a reportar cualquier daño o pérdida al Supervisor SISO para su reposición.'),CW);need(ln.length*4.8+4);doc.text(ln,X,y);y+=ln.length*4.8+2}
  if(k==='botiquin'&&r.mov==='Salida / entrega'){H('Declaración de recepción');doc.setFont('helvetica','normal');doc.setFontSize(10);const ln=doc.splitTextToSize(T('Recibí el medicamento o insumo descrito del botiquín del proyecto.'),CW);doc.text(ln,X,y);y+=ln.length*4.8+2}
  need(52);y+=4;const bw=CW/2-6;
  if(r.firma){try{const im=await imgOf(r.firma);const h=Math.min(30,bw*im.h/im.w),w=h*im.w/im.h;doc.addImage(im.du,im.fmt,X+(bw-w)/2,y,w,h)}catch(e){}}
  else{doc.setFont('helvetica','italic');doc.setFontSize(9);doc.setTextColor(200,35,27);doc.text('Sin firma registrada',X+bw/2,y+18,{align:'center'});doc.setTextColor(20)}
  doc.setDrawColor(20);doc.setLineWidth(.4);doc.line(X,y+33,X+bw,y+33);doc.line(X+CW-bw,y+33,X+CW,y+33);doc.setFont('helvetica','bold');doc.setFontSize(10);
  doc.text(T(r.persona||r.involucrado||''),X+bw/2,y+38,{align:'center'});doc.text(T(cfg.siso||'Supervisor SISO'),X+CW-bw/2,y+38,{align:'center'});
  doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(90);doc.text(T(fl.l+(r.firmaFecha?' - '+fmt(r.firmaFecha):'')),X+bw/2,y+43,{align:'center'});doc.text('Supervisor SISO',X+CW-bw/2,y+43,{align:'center'});doc.setTextColor(20);y+=50}
 const ph=r.fotos||[];if(ph.length){H('Evidencia fotográfica ('+ph.length+')');const cw=(CW-6)/2;let col=0,rowH=0;
  for(let i=0;i<ph.length;i++){let im;try{im=await imgOf(ph[i])}catch(e){continue}let w=cw,h=w*im.h/im.w;if(h>78){h=78;w=h*im.w/im.h}
   if(col===0){need(h+8)}const cx=X+col*(cw+6)+(cw-w)/2;doc.addImage(im.du,im.fmt,cx,y,w,h);doc.setFontSize(8);doc.setTextColor(90);doc.text('Foto '+(i+1),X+col*(cw+6),y+h+4);doc.setTextColor(20);rowH=Math.max(rowH,h+8);
   if(col===1){y+=rowH;col=0;rowH=0}else col=1}
  if(col===1)y+=rowH}
 const n=doc.getNumberOfPages();for(let i=1;i<=n;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(120);doc.text(T('Generado '+fmt(today())+' - Plataforma SISO '+(cfg.proyecto||'')),X,272);doc.text('Pág. '+i+' de '+n,W-X,272,{align:'right'})}
 return doc.output('blob')}

/* ---------- eventos ---------- */
document.addEventListener('click',async ev=>{
 if(ev.target.closest('.seg')){const s=ev.target.closest('.seg'),btn=ev.target.closest('button');if(btn){for(const x of s.children)x.className='';btn.className=btn.dataset.v}return}
 const b=ev.target.closest('[data-act]');if(!b)return;
 const[a,p1,p2]=b.dataset.act.split(':');
 if(a==='tick'){ev.stopPropagation();const ex=(S.entregas||[]).find(e=>e.id===p1);if(ex){await del('entregas',p1)}else{const[tid,due]=[p1.slice(0,p1.lastIndexOf('_')),p1.slice(p1.lastIndexOf('_')+1)];await save('entregas',p1,{task:tid,due,hecho:today()});toast('Marcado como entregado')}return}
 if(a==='new')return openForm(p1);
 if(a==='inmov')return openForm(p1,null,{mov:p1==='epp'?'Entrada / compra':'Entrada / requisición'});
 if(a==='openf'){openFile(b.dataset.act.slice(6));return}
 if(a==='pre')return openForm('insp',null,{equipo:p1,clase:'Preoperatorio diario',conductor:(R('equipos').find(e=>e.inv===p1)||{}).asignado||''});
 if(a==='edit')return openForm(p1,p2);
 if(a==='goto'){if(p1==='@informe')location.hash='informe';else location.hash='m-'+p1;return}
 if(a==='scroll'){const el=document.getElementById(p1);el&&el.scrollIntoView({behavior:'smooth'});return}
 if(a==='ag'){if(p1==='0')agMes=today().slice(0,7);else{const[y,m]=agMes.split('-').map(Number);agMes=iso(new Date(y,m-1+(+p1),1)).slice(0,7)}render();return}
 if(a==='inf'){const[y,m]=infMes.split('-').map(Number);infMes=iso(new Date(y,m-1+(+p1),1)).slice(0,7);render();return}
 if(a==='copyinf'){try{await navigator.clipboard.writeText(infText());toast('Texto copiado')}catch(e){$('#sheet').innerHTML=`<div class="hd"><h3>Texto del informe</h3><button class="btn sm dk" data-act="close">✕</button></div><div class="bd"><textarea style="min-height:60vh">${esc(infText())}</textarea></div>`;$('#modal').classList.add('on')}return}
 if(a==='xinf'){const inM=r=>String(r.fecha||'').startsWith(infMes);return exportX('Informe SISO '+infMes,ORDER.filter(k=>!M[k].nodate).map(k=>[M[k].n,rowsFor(k,R(k).filter(inM))]))}
 if(a==='x'){const sh=[[M[p1].n,rowsFor(p1)]];if(M[p1].inv)sh.unshift(['Inventario',invRows(M[p1].inv)]);return exportX(M[p1].n+' '+today(),sh)}
 if(a==='xall')return exportX('SISO Yorito '+today(),[['Inventario EPP',invRows('catepp')],['Inventario botiquín',invRows('catbot')],...ORDER.map(k=>[M[k].n,rowsFor(k)])]);
 if(a==='close')return closeM();
 if(a==='allC'){for(const s of document.querySelectorAll('#f_'+p1+' .seg'))for(const x of s.children)x.className=x.dataset.v==='C'?'C':'';return}
 if(a==='save'||a==='dup'||a==='pdf'){if(!cur)return;if(cur.up){toast('Espera a que terminen de subir las fotos');return}const o=collect(),m=M[cur.k];const miss=m.f.find(f=>f.req&&!o[f.k]);if(miss){toast('Falta: '+miss.l);return}
  if(m.inv&&!o.lista.length){toast('Agrega al menos un artículo');return}
  if(m.inv&&a!=='dup'){const c=m.inv,sm=stockMap(c),nw=o.lista.filter(i=>!R(c).some(x=>norm(x.nombre)===norm(i.art)));
   if(nw.length&&!cur.newOk){cur.newOk=1;toast('“'+nw.map(i=>i.art).join('”, “')+'” no está en el inventario. Toca de nuevo para crearlo como artículo nuevo.');return}
   for(const i of o.lista){const ex=R(c).find(x=>norm(x.nombre)===norm(i.art));if(ex)i.art=ex.nombre;else await save(c,'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),{nombre:i.art,inicial:0,minimo:0,obs:'Creado desde un movimiento'})}
   if(!isIn(o)){const prev=cur.id&&!isIn(cur.r)?eitems(cur.r):[];const neg=o.lista.filter(i=>{const v=sm[norm(i.art)];const back=prev.filter(p=>norm(p.art)===norm(i.art)).reduce((a,p)=>a+(+p.cant||0),0);return (v?v.ex:0)+back-(+i.cant||0)<0});if(neg.length&&!cur.negOk){cur.negOk=1;toast('Atención: '+neg.map(i=>i.art).join(', ')+' quedará en negativo. Toca de nuevo para guardar igual.');return}}}
  if(m.cat&&R(cur.k).some(x=>x.id!==cur.id&&norm(x.nombre)===norm(o.nombre))){toast('Ese artículo ya existe en el inventario');return}

  if(cur.k==='equipos'&&!cur.id&&R('equipos').some(e=>e.inv===o.inv)){toast('Ese inventario ya existe');return}
  if(a==='dup'){const k=cur.k,c={...o};delete c.codigo;delete c.firma;delete c.firmaFecha;delete c.comprobante;c.fotos=[];if(!m.nodate)c.fecha=today();closeM();openForm(k,null,c);toast('Copia lista: revisa y guarda');return}
  b.disabled=true;
  if(cur.sigDirty&&$('#sigc')){if(!as||!navigator.onLine){toast('Sin conexión: la firma necesita señal para guardarse');b.disabled=false;return}try{const bl=await new Promise(ok=>$('#sigc').toBlob(ok,'image/png'));const up=await as.upload(bl,{type:'image/png'});o.firma=up.id;o.firmaFecha=today();cur.firma=up.id;cur.sigDirty=false;cur.resign=false;cur.r.firmaFecha=o.firmaFecha}catch(e){toast('No se pudo guardar la firma: '+(e&&e.message||'revisa la conexión'));b.disabled=false;return}}
  if(cur.r.comprobante)o.comprobante=cur.r.comprobante;
  const id=cur.id||(cur.k==='equipos'?o.inv.replace(/[^\w.~@+-]/g,'_'):'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
  const ok=await save(cur.k,id,o);if(!ok){b.disabled=false;return}
  if(a==='save'){b.disabled=false;toast('Guardado');closeM();return}
  cur.id=id;cur.r={...o};const k=cur.k;b.textContent='Generando PDF…';
  try{const blob=await makePDF(k,o);let pid='';if(as&&navigator.onLine){try{pid=(await as.upload(blob,{type:'application/pdf'})).id;await save(k,id,{...o,comprobante:pid})}catch(e){}}
   closeM();await saveFile(pdfName(k,o)+'.pdf',blob);toast(pid?'PDF guardado en el registro y descargado':'PDF descargado (sin señal no se guardó copia en el registro)')}
  catch(e){b.disabled=false;b.textContent=pdfLabel(k,o);toast('No se pudo generar el PDF')}
  return}
 if(a==='rmph'){cur.fotos.splice(+p1,1);refreshPh();return}
 if(a==='sigclear'){const c=$('#sigc');if(c){c.getContext('2d').clearRect(0,0,c.width,c.height);cur.sigDirty=false}return}
 if(a==='resign'){cur.resign=true;$('#f_firma').innerHTML=sigHTML();initSig();return}
 if(a==='addli'){const L=$('#f_lista');L.insertAdjacentHTML('beforeend',liRow({art:'',cant:1},L.dataset.vida==='1'));return}
 if(a==='rmli'){const r=b.closest('.li-row');if(document.querySelectorAll('#f_lista .li-row').length>1)r.remove();else{r.querySelector('.li-a').value=''}return}
 if(a==='askdel'){b.outerHTML='<span style="align-self:center">¿Eliminar?</span><button class="btn" data-act="del" style="background:var(--bad);color:#fff;border-color:var(--bad)">Sí, eliminar</button>';return}
 if(a==='del'){const k=cur.k,id=cur.id;if(await del(k,id)){toast('Eliminado');closeM()}return}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal').classList.contains('on'))closeM();if(e.key==='Enter'&&e.target.classList.contains('row')&&e.target.dataset.act)e.target.click()});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeM()});
document.addEventListener('input',e=>{if(e.target.id==='q'){filt.q=e.target.value;const pos=e.target.selectionStart;render();const q=$('#q');q.focus();q.setSelectionRange(pos,pos)}});
document.addEventListener('change',e=>{if(e.target.id==='mes'){filt.mes=e.target.value;render()}if(e.target.classList.contains('phin')){const fs=[...e.target.files];e.target.value='';if(fs.length)upPhotos(fs)}});
document.addEventListener('submit',e=>e.preventDefault());
$('#cfgBtn').addEventListener('click',()=>{if(!user){toast('Primero entra con tu usuario');return}
 $('#sheet').innerHTML=`<div class="hd"><h3>Proyecto y cuenta</h3><button class="btn sm dk" data-act="close" aria-label="Cerrar">✕</button></div><div class="bd">
 <label class="f"><span>Nombre corto del proyecto</span><input id="c_p" value="${esc(cfg.proyecto||'Yorito – Empalme RN-23')}"></label>
 <label class="f"><span>Subtítulo</span><input id="c_s" value="${esc(cfg.sub||'Pavimentación DTS · 13.65 km')}"></label>
 <label class="f"><span>Inicio de tus entregas (no se marcan atrasadas las anteriores)</span><input id="c_i" type="date" value="${esc(cfg.inicio||'')}"></label>
 <label class="f"><span>Supervisor SISO (aparece en los comprobantes)</span><input id="c_u" value="${esc(cfg.siso||'')}"></label>
 <label class="f"><span>Empresa</span><input id="c_e" value="${esc(cfg.empresa||'')}"></label>
 <button class="btn pri" data-act="cfgsave">Guardar datos del proyecto</button>
 <h3 style="margin:22px 0 8px">Respaldo</h3><div class="tools"><button class="btn" data-act="bk">Descargar respaldo (.json)</button><label class="btn" style="display:inline-flex;align-items:center;cursor:pointer">Importar respaldo<input id="imp" type="file" accept=".json,application/json" style="position:absolute;width:1px;height:1px;opacity:0"></label></div>
 ${queue.length?`<p class="hint">${queue.length} cambio(s) guardados en este dispositivo esperando señal. <button class="btn sm" data-act="flushnow">Enviar ahora</button> <button class="btn sm" data-act="clearq" style="color:var(--bad)">Descartar</button></p>`:''}
 <h3 style="margin:22px 0 8px">Cuenta</h3><p style="margin:0 0 10px">${esc(user.email||'')}</p><button class="btn" data-act="logout">Cerrar sesión</button>
 <p class="hint" style="margin-top:16px">Para instalar: en el celular abre el menú del navegador y elige “Agregar a pantalla de inicio”; en la computadora, el ícono de instalar en la barra de direcciones.</p></div>`;
 $('#modal').classList.add('on')});
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='cfgsave'){await save('config','proyecto',{...cfg,proyecto:$('#c_p').value.trim(),sub:$('#c_s').value.trim(),inicio:$('#c_i').value,siso:$('#c_u').value.trim(),empresa:$('#c_e').value.trim()});head();toast('Guardado');closeM();render()}
 if(a==='bk'){const d={app:'SISO',version:2,fecha:new Date().toISOString(),config:cfg,datos:{}};for(const k of ALL)d.datos[k]=R(k);await saveFile('Respaldo SISO '+today()+'.json',new Blob([JSON.stringify(d,null,1)],{type:'application/json'}));toast('Respaldo listo')}
 if(a==='logout'){if(queue.length){toast('Tienes cambios sin enviar. Conéctate antes de cerrar sesión.');return}await sb.auth.signOut();LS.set('siso_cache',null);for(const k of ALL)S[k]=[];cfg={};closeM();render()}
 if(a==='clearq'){queue=[];LS.set('siso_queue',queue);closeM();pull();toast('Cambios pendientes descartados')}
 if(a==='flushnow'){closeM();flush()}
 if(a==='seed'){b.disabled=true;b.textContent='Cargando…';try{const r=await fetch('datos-iniciales.json',{cache:'no-store'});const d=await r.json();const n=await importData(d);toast(n+' registros cargados')}catch(e){b.disabled=false;b.textContent='Cargar datos iniciales del proyecto';toast('No se pudieron cargar: '+(e.message||e))}}
});
document.addEventListener('change',async e=>{if(e.target.id!=='imp')return;const f=e.target.files[0];e.target.value='';if(!f)return;try{const d=JSON.parse(await f.text());if(!d.datos)throw new Error('El archivo no es un respaldo de SISO');const n=await importData(d);closeM();toast(n+' registros importados')}catch(err){toast('No se pudo importar: '+(err.message||err))}});
boot();
}


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
const fdmy=s=>{if(!s)return'';const d=pd(s);return pad(d.getDate())+'-'+pad(d.getMonth()+1)+'-'+d.getFullYear()};
const fmt=s=>{if(!s)return'';const d=pd(s);return d.getDate()+' '+MES[d.getMonth()].slice(0,3)+' '+d.getFullYear()};
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',2600)};

/* ---------- catálogos (de los formatos del proyecto) ---------- */
const EQT=['Pick-up','Cabezal','Volqueta','Camión','Tanque de agua','Low boy','Motoniveladora','Excavadora','Retroexcavadora','Tractor','Vibrocompactador','Rodillo neumático','Cargadora','Distribuidor de emulsión','Esparcidor de agregados','Barredora','Planta / otro'];
const IT_PU=['Boleta de revisión vigente','Cinturón en buen estado','Triángulos (2)','Extintor','Retrovisores en buen estado','Bocina','Parabrisas en buen estado','Jack y llave de rueda','Cabina limpia','Luces en buen estado','Aceite de motor','Coolant','Baterías aseguradas','Placas de circulación','Llantas en buen estado','Llanta de repuesto','Viñeta de próximo mantenimiento','Alarma de reversa','Limpieza externa'];
const IT_PES=['Licencia de conducir vigente','EPP','Luces en buen estado','Jack y llave de rueda','Conos (2)','Extintor con carga y revisado','Placas','Escape en buenas condiciones','Baterías aseguradas','Parabrisas en buen estado','Llantas en buen estado','Certificado de operación vigente','Bocina','Boleta de revisión vigente','Retrovisores en buen estado','Cinturón','Aceite de motor','Coolant','Cabina limpia','Viñeta de próximo mantenimiento','Alarma de reversa','Cinta reflectiva','Llanta de repuesto','Limpieza externa'];
const IT_EXT=['Seguro','Pasador','Boquilla','Manómetro','Palanca de disparo','Arnés o base del extintor','Estado del cilindro','Manguera / boquilla'];
const CAUSAS=['Error de operación','Descuido','Intención','Inevitable','Falta de mantenimiento','Error de chequeo','Omisión de reglamento','Aspectos de seguridad','Reglamentos y normas','Aspectos de control','Error de supervisión','Aspectos climáticos','Error de fabricación','Inexperiencia','Exceso de confianza','Otros'];
const CLASIF=['N/A (sin lesión)','Lesión física','Enfermedad profesional','Fatalidad','Lesión física en tránsito','Fatalidad en tránsito','Daño a equipo','Daño a instalaciones','Extravío / daño de componentes'];
const TEMAS=['Orden y limpieza 5S en áreas de trabajo','Manejo defensivo: maniobras en reversa','Identificación de riesgos y reconocimiento de peligros','Límites de velocidad y distancia de circulación','Ojos y mente en la tarea','Condición insegura y acto inseguro','Los buenos hábitos ayudan','Levantamiento manual de carga','Errores críticos que causan incidentes','Decálogo de normas básicas de higiene y seguridad','Plan de contingencias: riesgos en plantel','Cuidado y conservación del EPP','Precaución al ingreso al plantel con vehículos','Nunca te ubiques en la línea de fuego','Política de alcohol y drogas','Manejo de extintores y sus tipos','Manejo defensivo: alertas en conducción','Inspección preoperacional 360° de equipo móvil','Obligaciones de los colaboradores','Uso de herramientas manuales','Ahorro de energía','Qué hacer en caso de averías y accidentes en carretera','Posturas ergonómicas','Actitudes inseguras (bromas)','Prohibición de tabaco en áreas de trabajo','Código de vestimenta','Trabajo con emulsión asfáltica y riego','Banderilleros y control de tránsito','Manipulación de equipo de oxicorte'];
const SENALES=['10 KM/H VELOCIDAD MÁXIMA','20 KM/H VELOCIDAD MÁXIMA','DESVÍO ←','DESVÍO →','CARRIL DERECHO CERRADO','CARRIL IZQUIERDO CERRADO','SOLO UN CARRIL','BANDERILLERO (DIBUJO)','HOMBRES TRABAJANDO (DIBUJO)','DISCULPE TRABAJO EN EJECUCIÓN','FIN DE CARRETERA EN CONSTRUCCIÓN','INICIO DE CARRETERA EN CONSTRUCCIÓN','MAQUINAS TRABAJANDO','PELIGRO','PALETA PARE/SIGA','ADV. Banderilleros','ADV. Hombres trabajando','ADV. Máquinas trabajando','10 km/h máx.','30 km/h máx.','Inicio / fin de obra','Desvío izquierdo','Desvío derecho','Prohibido el paso','Peligro','Obra en construcción','Polines','Conos','Barricadas','Paletas Pare / Siga','Cinta de precaución'];
const EPP=['Chaleco reflectivo con logo','Casco','Guantes de cuero','Lentes de seguridad','Botas de seguridad','Tapones auditivos','Mascarilla','Capote','Arnés'];
const isPU=eqId=>{const e=(S.equipos||[]).find(x=>x.inv===eqId||x.id===eqId);return e?e.tipo==='Pick-up':/^PS/i.test(eqId||'')};

/* ---------- módulos ---------- */
const F=(k,l,t='text',o,x={})=>({k,l,t,o,...x});
const M={
 insp:{n:'Inspección de vehículos y equipo',s:'Inspección de vehículo / equipo',d:'Camiones, pick-ups y equipo amarillo',f:[F('fecha','Fecha','date'),F('equipo','Inventario','eq',null,{req:1}),F('placa','Placa','text'),F('conductor','Asignado a','per'),F('items','Revisión','chk',r=>isPU(r.equipo)?IT_PU:(!r.equipo||LIGEROS.includes(eqTipo(r.equipo)))?IT_PES:IT_PES.filter(i=>i!=='Placas'),{w:1}),F('obs','Observaciones','area',null,{w:1})],
  sum:r=>[(r.equipo||'')+' · '+(r.conductor||'sin asignar'),inspGrp(r.equipo),nc(r.items)?['bad',nc(r.items)+' no cumple']:['ok','Cumple']]},
 sucesos:{n:'Reporte de sucesos',s:'Reporte de suceso (REPSUC)',d:'Accidentes, incidentes, siniestros, robos, pérdidas',f:[F('codigo','Código','text',null,{ro:1}),F('tipo','Tipo','sel',['Incidente','Accidente','Siniestro','Robo','Pérdida']),F('fechaRep','Fecha del reporte','date'),F('fecha','Fecha del suceso','date'),F('hora','Hora','time'),F('lugar','Lugar / estación','text'),F('clima','Datos del clima','sel',['Soleado','Llovizna','Lluvia','Neblina']),F('relato','Evento (título del suceso)','text',null,{w:1,req:1}),
 F('h0','Afectado','hdr'),F('participante','Persona(s) afectada(s)','area',null,{w:1}),F('equipo','Equipo afectado (inventario)','eq'),F('otro','Otro (equipo o bien de terceros)','text'),F('dano','Daño','area',null,{w:1}),
 F('h1','Versión del participante 1','hdr'),F('n1','Nombre','per'),F('c1','Cargo','text'),F('i1','Número de identidad','text'),F('vPart','Versión','area',null,{w:1}),F('firma1','Firma del participante 1','firma',null,{w:1}),
 F('h2','Versión del participante 2','hdr'),F('n2','Nombre','per'),F('c2','Cargo','text'),F('i2','Número de identidad','text'),F('vTest','Versión','area',null,{w:1}),F('firma2','Firma del participante 2','firma',null,{w:1}),
 F('h3','Versión técnica','hdr'),F('nT','Responsable','per'),F('cT','Cargo','text'),F('iT','Número de identidad','text'),F('opinion','Versión técnica','area',null,{w:1}),F('firmaT','Firma de la versión técnica','firma',null,{w:1}),
 F('h4','Análisis','hdr'),F('causaP','Causa presunta','area',null,{w:1}),F('criterio','Criterio de análisis','area',null,{w:1}),F('causas','Clasificación de causas (marca las que apliquen)','multi',CAUSAS,{w:1}),F('danoP','Daños personales','sel',['Ninguno','Leves','Medios','Mayor','Inservible']),F('danoM','Daños materiales','sel',['Ninguno','Leves','Medios','Mayor','Inservible']),F('obsD','Observaciones de los daños','area',null,{w:1}),F('factor','Factor','sel',['Humano','Externo']),F('clasif','Clasificación del evento','sel',CLASIF),
 F('h6','Inspector SISO','hdr'),F('firmaS','Firma del inspector SISO','firma',null,{w:1}),
 F('h5','Respuesta de gerencia (se llena cuando respondan)','hdr'),F('costo','Costo estimado (L)','num'),F('cobro','Cobro','sel',['Pendiente','No','Sí']),F('resp','Responsabilidad','sel',['Pendiente','Responsable','No responsable']),F('acciones','Acciones a tomar','area',null,{w:1}),F('estado','Estado','sel',['Abierto','Cerrado'])],
  sum:r=>[(r.codigo||'')+' · '+(r.tipo||'')+(r.relato?' · '+r.relato:''),[r.equipo,(Array.isArray(r.causas)?r.causas.join(', '):r.causa)].filter(Boolean).join(' · '),r.estado==='Cerrado'?['ok','Cerrado']:(!r.resp||r.resp==='Pendiente'||r.resp==='Por definir')?['yl','Espera gerencia']:['bad','Abierto']]},
 desvios:{n:'Desviaciones conductuales',s:'Desviación conductual',d:'Cuadro de los lunes',f:[F('fecha','Fecha','date'),F('involucrado','Nombre del involucrado','per',null,{req:1}),F('reporte','Desviación observada','area',null,{w:1}),F('accion','Acción realizada','area',null,{w:1}),F('obs','Observaciones','text'),F('coment','Comentarios SISO','text'),F('firma','Firma del involucrado','firma',null,{w:1})],
  sum:r=>[r.involucrado,r.reporte,null]},
 charlas:{n:'Charlas de seguridad',s:'Charla de seguridad',d:'Programadas e impartidas, con asistencia',f:[F('estado','Estado','sel',['Programada','Impartida']),F('fecha','Fecha','date'),F('tema','Tema','list',TEMAS,{w:1,req:1}),F('area','Área','sel',['Campo','Plantel','Oficinas','Primer ingreso']),F('instructor','Instructor','per'),F('hi','Hora inicio','time'),F('hf','Hora final','time'),F('asist','Asistentes (uno por línea: nombre – cargo)','area',null,{w:1})],
  sum:r=>[r.tema,(r.area||'')+' · '+nAs(r)+' asistentes',r.estado==='Impartida'?['ok','Impartida']:['yl','Programada']]},
 alcohol:{n:'Pruebas de alcohol',s:'Prueba de alcoholimetría',d:'Pruebas programadas al personal',f:[F('fecha','Fecha','date'),F('persona','Persona','per',null,{req:1}),F('cargo','Cargo','text'),F('resultado','Resultado','sel',['Negativo','Positivo']),F('lectura','Lectura (g/L)','text'),F('obs','Observaciones','text',null,{w:1}),F('firma','Firma del evaluado','firma',null,{w:1})],
  sum:r=>[r.persona,r.cargo,r.resultado==='Positivo'?['bad','Positivo']:['ok','Negativo']]},
 extintores:{n:'Extintores',s:'Inspección de extintor',d:'Inspección del 27, recarga y vencimiento',f:[F('fecha','Fecha de inspección','date'),F('equipo','Inventario del equipo','eq',null,{req:1,free:1}),F('tipoeq','Tipo de equipo','text'),F('modelo','Modelo','text'),F('cap','Capacidad (lbs)','num'),F('etq','Etiqueta del extintor','sel',['Legible','No se lee','No tiene etiqueta']),F('recarga','Última recarga','date'),F('vence','Etiqueta de vencimiento','date'),F('items','Estado','chk',()=>IT_EXT,{w:1,labels:['Bueno','Malo','No tiene']}),F('obs','Observaciones','area',null,{w:1})],
  sum:r=>[(r.equipo||'')+' · '+(r.cap?r.cap+' lb':'s/capacidad'),r.vence?'Vence '+fmt(r.vence):'Sin etiqueta de vencimiento',venceTag(r.vence)||(ncx(r.items)?['bad',ncx(r.items)+' con falla']:['ok','Bien'])]},
 epp:{n:'EPP',s:'Entrega / movimiento de EPP',d:'Inventario real, entregas con firma y comprobante',inv:'catepp',f:[F('fecha','Fecha','date'),F('mov','Movimiento','sel',['Entrega a personal','Entrada / compra','Baja']),F('persona','Entregado a / proveedor','per'),F('cargo','Cargo','text'),F('lista','Artículos','lista',()=>catNames('catepp'),{w:1,vida:1}),F('obs','Observaciones','text',null,{w:1}),F('firma','Firma de quien recibe','firma',null,{w:1})],
  sum:r=>[eitems(r).map(i=>(i.cant||1)+' '+i.art).join(', ')||'(sin artículos)',(isIn(r)?'Entrada':r.mov==='Baja'?'Baja':'Entrega')+(r.persona?' · '+r.persona:'')+(r.cargo?' · '+r.cargo:''),r.mov==='Entrega a personal'?(r.firma?['ok','Firmado']:['yl','Sin firma']):isIn(r)?['','Entrada']:null]},
 botiquin:{n:'Botiquín',s:'Movimiento de botiquín',d:'Inventario real del botiquín y entregas de medicamentos',inv:'catbot',f:[F('fecha','Fecha','date'),F('mov','Movimiento','sel',['Salida / entrega','Entrada / requisición','Baja por vencimiento']),F('persona','Entregado a','per'),F('cargo','Cargo','text'),F('lista','Medicamentos o insumos','lista',()=>catNames('catbot'),{w:1}),F('obs','Observaciones / motivo','text',null,{w:1}),F('firma','Firma de quien recibe','firma',null,{w:1})],
  sum:r=>[eitems(r).map(i=>(i.cant||1)+' '+i.art).join(', ')||'(sin artículos)',(isIn(r)?'Entrada':String(r.mov).startsWith('Baja')?'Baja':'Entrega')+(r.persona?' · '+r.persona:''),r.mov==='Salida / entrega'?(r.firma?['ok','Firmado']:['yl','Sin firma']):isIn(r)?['','Entrada']:null]},
 catepp:{n:'Artículos de EPP',s:'Artículo de EPP',cat:1,nodate:1,mov:'epp',f:[F('nombre','Nombre del artículo','list',EPP,{req:1,w:1}),F('unidad','Unidad','sel',['Unidad','Par','Caja','Paquete']),F('inicial','Existencia inicial','num'),F('minimo','Mínimo (alerta para reponer)','num'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>{const st=stockRow('catepp',r);return[r.nombre,'Inicial '+st.ini+' · Entradas '+st.e+' · Salidas '+st.s,st.ex<=0?['bad','Existencia '+st.ex]:st.ex<=(+r.minimo||0)?['yl','Existencia '+st.ex]:['ok','Existencia '+st.ex]]}},
 catbot:{n:'Artículos de botiquín',s:'Medicamento / insumo',cat:1,nodate:1,mov:'botiquin',f:[F('nombre','Nombre','text',null,{req:1,w:1}),F('present','Presentación','list',['Tableta','Cápsula','Sobre','Frasco','Tubo','Unidad','Caja','Rollo','Par']),F('inicial','Existencia inicial','num'),F('minimo','Mínimo (alerta para reponer)','num'),F('vence','Vencimiento del lote','date'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>{const st=stockRow('catbot',r);return[r.nombre+(r.present?' ('+r.present+')':''),'Entradas '+st.e+' · Salidas '+st.s+(r.vence?' · vence '+fmt(r.vence):''),st.ex<=0?['bad','Existencia '+st.ex]:venceTag(r.vence)||(st.ex<=(+r.minimo||0)?['yl','Existencia '+st.ex]:['ok','Existencia '+st.ex])]}},
 senal:{n:'Señalización',s:'Señal / dispositivo',d:'Inventario del 25, ubicación por estación',nodate:1,f:[F('senal','Señal','list',SENALES,{req:1}),F('total','Total en proyecto','num'),F('uso','En uso (solo si no hay despliegue)','num'),F('danada','Dañadas','num'),F('extrav','Extraviadas','num'),F('ubic','Ubicación (solo si no hay despliegue)','text',null,{w:1}),F('act','Actualizado','date')],
  sum:r=>{const d=depOf(r.senal);return[r.senal,d?(d.uso?d.est:'En plantel')+' · despliegue '+fdmy(d.fecha):(r.ubic||'sin ubicación'),['',usoOf(r)+' en uso · '+exist(r)+' en plantel']]}},
 radios:{n:'Radios',s:'Radio',d:'Control del día 30',nodate:1,f:[F('modelo','Modelo'),F('serie','Serie',null,null,{req:1}),F('bateria','Modelo de batería'),F('cargador','Cargador','sel',['Sí','No']),F('asig','Asignado a','per'),F('puesto','Puesto'),F('estado','Estado','sel',['Operativo','Dañado','En reparación','Extraviado']),F('act','Última revisión','date'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>[(r.modelo||'Radio')+' · '+r.serie,(r.asig||'sin asignar')+(r.puesto?' · '+r.puesto:''),r.estado==='Operativo'?['ok','Operativo']:['bad',r.estado||'—']]},
 personal:{n:'Personal del proyecto',s:'Persona',d:'Cargos, unidad asignada y licencias',nodate:1,f:[F('nombre','Nombre completo',null,null,{req:1,w:1}),F('identidad','Número de identidad'),F('cargo','Cargo','list',['Ingeniero Residente','Ingeniero Asistente','Supervisor SISO','Topógrafo','Laboratorista','Capataz','Chequeador de producción','Operador de excavadora','Operador de motoniveladora','Operador de tractor','Operador de vibrocompactador','Operador de cargadora','Operador de retroexcavadora','Motorista de volqueta','Motorista de cisterna','Motorista de cabezal','Conductor de pick-up','Mecánico','Ayudante de mecánico','Soldador','Bodeguero','Banderillero','Ayudante general','Vigilante']),F('area','Área','sel',['Campo','Plantel','Taller','Oficinas','Laboratorio']),F('unidad','Unidad asignada','eq'),F('telefono','Teléfono','text'),F('ingreso','Fecha de ingreso al proyecto','date'),F('estado','Estado','sel',['Habilitado','No habilitado','Inactivo']),F('lic','Tipo de licencia','list',['Liviana Nacional','Pesada Nacional','Liviana Internacional','Pesada Internacional','No tiene']),F('emision','Emisión de licencia','date'),F('lvence','Vencimiento de licencia','date'),F('obs','Observación','text',null,{w:1})],
  sum:r=>[r.nombre,[r.cargo,r.unidad&&'Unidad '+r.unidad,r.area].filter(Boolean).join(' · '),r.estado==='Inactivo'?['','Inactivo']:r.lic==='No tiene'||!r.lic?null:venceTag(r.lvence)||['ok','Licencia vigente']]},
 equipos:{n:'Equipos y vehículos',s:'Equipo',d:'Inventario de equipo móvil',nodate:1,f:[F('inv','Inventario',null,null,{req:1}),F('tipo','Tipo','sel',EQT),F('marca','Marca','list',['Caterpillar','Volvo','Mack','Bomag','Foton','John Deere','Komatsu','Hino','Isuzu','Toyota','Nissan','International','Freightliner']),F('modelo','Modelo'),F('placa','Placa (vehículos)'),F('asignado','Conductor / operador asignado','per'),F('estado','Estado','sel',['Activo','Inactivo','En taller'])],
  sum:r=>{const p=perOfEq(r);return[r.inv+' · '+(r.tipo||''),[[r.marca,r.modelo].filter(Boolean).join(' '),r.placa,p?p.nombre:r.asignado].filter(Boolean).join(' · '),r.estado==='Activo'?null:['yl',r.estado]]}}
};
const SOLES=['SOL#1 · Limpieza en plantel principal','SOL#2 · Limpieza en plantel secundario','SOL#3 · Limpieza en casas de personal','SOL#4 · Traslado de basura al botadero','SOL#5 · Flageo de maquinaria expuesta','SOL#6 · Orden, aseo y disciplina en planteles','Otro'];
const IT_AEPP=['Casco','Chaleco reflectivo','Botas de seguridad','Lentes de seguridad','Guantes','Protección auditiva','Mascarilla','Barbiquejo'];
const TIPOS_INSP=['Escritorios / oficinas','Apartamentos del personal','Taller','Señalización vial en frente de trabajo','Plantel','Bodega','Otro'];
Object.assign(M,{
 despliegue:{n:'Despliegue de señalización',s:'Despliegue de señalización del día',d:'Dónde quedó cada rótulo hoy, por estación',f:[F('fecha','Fecha','date'),F('frente','Frente de trabajo','text'),F('desde','Desde estación','text'),F('hasta','Hasta estación','text'),F('lista','Rótulos en la vía','lista',()=>R('senal').map(s=>s.senal).filter(Boolean),{w:1,vida:'est'}),F('resp','Banderillero / responsable','per'),F('obs','Observaciones','text',null,{w:1})],
  sum:r=>[(r.frente||'Frente de trabajo')+(r.desde?' · Est. '+r.desde+(r.hasta?' a '+r.hasta:''):''),eitems(r).reduce((a,i)=>a+(+i.cant||0),0)+' rótulos en la vía'+(r.resp?' · '+r.resp:''),lastDep()&&r.id===lastDep().id?['ok','Vigente']:null]},
 audepp:{n:'Auditorías de EPP',s:'Auditoría de EPP',d:'Verificación del uso de EPP al personal',f:[F('fecha','Fecha','date'),F('persona','Persona auditada','per',null,{req:1}),F('cargo','Cargo','text'),F('frente','Frente / lugar','text'),F('items','EPP verificado','chk',()=>IT_AEPP,{w:1,labels:['Usa','No usa','N/A']}),F('obs','Observaciones / acción tomada','area',null,{w:1})],
  sum:r=>[r.persona,(r.cargo||'')+(r.frente?' · '+r.frente:''),nc(r.items)?['bad',nc(r.items)+' sin usar']:['ok','Cumple']]},
 sol:{n:'SOLES (orden y limpieza)',s:'Actividad SOL',d:'Jornadas de orden, limpieza y disciplina',f:[F('fecha','Fecha','date'),F('sol','Actividad','sel',SOLES,{w:1}),F('sitio','Sitio','text'),F('personas','N° de personas','num'),F('desc','Descripción de lo realizado','area',null,{w:1})],
  sum:r=>[r.sol,(r.sitio||'')+(r.personas?' · '+r.personas+' personas':''),null]},
 inspareas:{n:'Inspecciones de áreas',s:'Inspección de área',d:'Escritorios, apartamentos, taller y señalización vial',f:[F('fecha','Fecha','date'),F('tipo','Tipo de inspección','sel',TIPOS_INSP,{w:1}),F('lugar','Lugar / estación','text'),F('resultado','Resultado','sel',['Sin hallazgos','Con hallazgos']),F('hallazgos','Hallazgos','area',null,{w:1}),F('acciones','Acciones correctivas','area',null,{w:1})],
  sum:r=>[r.tipo,r.lugar||'',r.resultado==='Con hallazgos'?['bad','Con hallazgos']:['ok','Sin hallazgos']]},
 reuniones:{n:'Reuniones',s:'Reunión',d:'Reuniones de seguridad programadas',f:[F('fecha','Fecha','date'),F('tipo','Tipo','sel',['Reunión de seguridad','Comité de seguridad','Coordinación con supervisión','Reunión con subcontratistas','Otra']),F('tema','Tema','text',null,{w:1,req:1}),F('hi','Hora','time'),F('lugar','Lugar','text'),F('part','Participantes (uno por línea)','area',null,{w:1}),F('acuerdos','Acuerdos','area',null,{w:1})],
  sum:r=>[r.tema,(r.tipo||'')+(r.part?' · '+String(r.part).split('\n').filter(x=>x.trim()).length+' participantes':''),null]}
});
for(const k in M)if(!M[k].cat)M[k].f.push(F('fotos','Evidencia fotográfica','fotos',null,{w:1}));
const eitems=r=>r.lista&&r.lista.length?r.lista:((r.art||r.med)?[{art:r.art||r.med,cant:r.cant||1,vida:r.vida||''}]:[]);
const isIn=r=>String(r.mov||'').startsWith('Entrada');
const norm=x=>String(x||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9/ ]+/g,' ').split(/\s+/).filter(Boolean).map(w=>w.length>3&&/[lrndz]es$/.test(w)?w.slice(0,-2):w.length>3&&/s$/.test(w)?w.slice(0,-1):w).join(' ');
const catNames=c=>R(c).map(x=>x.nombre).filter(Boolean).sort((a,b)=>a.localeCompare(b));
function stockMap(c){const mk=M[c].mov,m={};for(const x of R(c))m[norm(x.nombre)]={cat:x,ini:+x.inicial||0,e:0,s:0};
 for(const r of R(mk))for(const i of eitems(r)){const k=norm(i.art);if(!k)continue;m[k]=m[k]||{cat:null,name:i.art,ini:0,e:0,s:0};if(isIn(r))m[k].e+=(+i.cant||0);else m[k].s+=(+i.cant||0)}
 for(const v of Object.values(m))v.ex=v.ini+v.e-v.s;return m}
function stockRow(c,cat){const v=stockMap(c)[norm(cat.nombre)]||{ini:+cat.inicial||0,e:0,s:0};v.ex=v.ini+v.e-v.s;return v}

const ORDER=['insp','despliegue','audepp','charlas','alcohol','sol','inspareas','reuniones','sucesos','desvios','extintores','epp','botiquin','senal','radios','personal','equipos'];
function nc(it){return it?Object.values(it).filter(v=>v==='N').length:0}
function ncx(it){return it?Object.values(it).filter(v=>v==='N'||v==='A').length:0}
function nAs(r){return String(r.asist||'').split('\n').filter(x=>x.trim()).length}
function exist(r){return Math.max(0,(+r.total||0)-usoOf(r)-(+r.danada||0)-(+r.extrav||0))}
function venceTag(v){if(!v)return null;const d=diff(v,today());if(d<0)return['bad','Vencido'];if(d<=30)return['yl','Vence en '+d+' d'];return null}

/* ---------- agenda mensual (de las carpetas del proyecto) ---------- */
const TASKS=[{id:'desv',t:'Cuadro de desviaciones conductuales',m:'desvios',dow:1},{id:'boti',t:'Inventario de botiquín y control de medicamentos',m:'botiquin',day:2},{id:'repsuc',t:'Plantilla de incidentes (control REPSUC)',m:'sucesos',day:5},{id:'epp15',t:'Inventario de EPP (1ª quincena)',m:'epp',day:15},{id:'inf',t:'Informe de seguridad SISO',m:'@informe',day:18},{id:'sen',t:'Inventario de señalización',m:'senal',day:25},{id:'aud',t:'Inspección de vehículos y equipo amarillo',m:'insp',day:27},{id:'ext',t:'Inspección de extintores',m:'extintores',day:27},{id:'cal',t:'Calendario de charlas del mes siguiente',m:'charlas',day:28},{id:'epp30',t:'Inventario de EPP (2ª quincena)',m:'epp',day:30},{id:'rad',t:'Inspección de radios',m:'radios',day:30}];
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
 let U=String(CONF.url).trim();try{const u=new URL(U);U=/supabase\.co$/.test(u.hostname)?u.origin:U.replace(/\/(rest|auth|storage)\/v1.*$/,'').replace(/\/+$/,'')}catch(e){}
 sb=window.supabase.createClient(U,String(CONF.anonKey).trim(),{auth:{persistSession:true,autoRefreshToken:true,storageKey:'siso-auth'}});
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
  ready=true;loadNote='';cacheSave();head();if(!cur)render();else syncBadge();setTimeout(migrar,500)}
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
 if(/iPhone|iPad|iPod/.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){if(e&&e.name==='AbortError')return}}
 const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000)}
/* acceso */
function vLogin(){const m=$('#main');
 if(authMsg){m.innerHTML=`<div class="login card"><h2>Falta configurar la conexión</h2><p>${authMsg==='lib'?'No se pudo cargar la librería de Supabase. Revisa tu conexión a internet y recarga la página.':'Abre el archivo <b>config.js</b> y pega la URL y la clave pública (anon key) de tu proyecto de Supabase. Los pasos están en LEEME.md.'}</p></div>`;return}
 m.innerHTML=`<form class="login card" id="lgf"><h2>Entrar</h2><p style="color:var(--mut);margin-top:6px">Plataforma SISO · ${esc(cfg.proyecto||'Yorito – Empalme RN-23')}</p><label class="f"><span>Correo</span><input id="lg_e" type="email" autocomplete="username" required></label><label class="f"><span>Contraseña</span><input id="lg_p" type="password" autocomplete="current-password" required></label><button class="btn pri" style="width:100%">Entrar</button><p id="lg_m" class="hint" role="status"></p></form>`;
 $('#lgf').onsubmit=async e=>{e.preventDefault();if(!navigator.onLine){$('#lg_m').textContent='Necesitas señal para entrar la primera vez.';return}$('#lg_m').textContent='Entrando…';const {error}=await sb.auth.signInWithPassword({email:$('#lg_e').value.trim(),password:$('#lg_p').value});if(error)$('#lg_m').textContent=/Invalid login/i.test(error.message)?'Correo o contraseña incorrectos.':/Email not confirmed/i.test(error.message)?'El usuario no está confirmado: en Supabase → Authentication → Users, confírmalo o créalo con Auto Confirm.':'Error '+(error.status||'')+': '+error.message+' (librería '+(window.supabase&&window.supabase.SupabaseClient?'cargada':'—')+')'}}
function firstRun(){return ready&&navigator.onLine&&!cfg.proyecto&&!queue.length&&ALL.every(k=>!R(k).length)}
function seedBanner(){return `<div class="note">La base de datos está vacía. <button class="btn sm pri" data-act="seed">Cargar datos iniciales del proyecto</button><br><small>Equipos, licencias, extintores, señalización del inventario y los movimientos de EPP ya registrados.</small></div>`}
async function importData(d){const rows=[];if(d.config)rows.push({modulo:'config',id:'proyecto',data:d.config});for(const [k,arr] of Object.entries(d.datos||{}))for(const r of arr){const {id,...rest}=r;if(id)rows.push({modulo:k,id,data:rest})}
 for(let i=0;i<rows.length;i+=400){const {error}=await sb.from(TBL).upsert(rows.slice(i,i+400).map(x=>({...x,updated_at:new Date().toISOString()})));if(error)throw error}
 await pull();return rows.length}

/* ---------- vistas ---------- */
let view='hoy',modOpen=null,filt={q:'',mes:today().slice(0,7)},infMes=today().slice(0,7);
function route(){const h=location.hash.slice(1)||'hoy';if(h.startsWith('m-')&&M[h.slice(2)]){view='mod';modOpen=h.slice(2)}else view=['hoy','agenda','nuevo','registros','informe','control','fotos'].includes(h)?h:'hoy';
 for(const a of document.querySelectorAll('nav a'))a.classList.toggle('on',a.dataset.v===(view==='mod'?'registros':view==='control'?'informe':view==='fotos'?'registros':view));render();scrollTo(0,0)}
addEventListener('hashchange',route);
function render(){syncBadge();if(!user){vLogin();return}if(!ready&&!loadNote)return;const m=$('#main');m.innerHTML=(loadNote?'<p class="note">'+esc(loadNote)+'</p>':'')+(firstRun()?seedBanner():'')+({hoy:vHoy,agenda:vAgenda,nuevo:vNuevo,registros:vReg,informe:vInf,mod:vMod,control:vCtl,fotos:vFotos}[view])()}
const R=k=>S[k]||[];
const row=(o)=>`<div class="row ${o.click?'click':''}" ${o.click?`data-act="${o.click}" tabindex="0"`:''}>${o.left||''}<div class="tx"><b>${esc(o.t)}</b>${o.s?`<small>${esc(o.s)}</small>`:''}</div>${o.tag?`<span class="tag ${o.tag[0]}">${esc(o.tag[1])}</span>`:''}${o.right||''}</div>`;

function alerts(){const t=today(),a=[];
 if(R('senal').length&&pd(t).getDay()!==0&&!R('despliegue').some(d=>d.fecha===t)&&(!cfg.inicio||t>=cfg.inicio))a.push({t:'Despliegue de señalización de hoy',s:'Registra dónde quedaron los rótulos (puedes duplicar el de ayer)',tag:['yl','Pendiente'],click:'duplast'});
 for(const p of R('personal'))if(p.estado!=='Inactivo'&&p.lvence&&p.lic!=='No tiene'){const d=diff(p.lvence,t);if(d<=30)a.push({t:'Licencia de '+p.nombre,s:d<0?'Venció el '+fmt(p.lvence):'Vence el '+fmt(p.lvence),tag:d<0?['bad','Vencida']:['yl',d+' días'],click:'edit:personal:'+p.id})}
 const lastExt={};for(const e of R('extintores'))if(!lastExt[e.equipo]||e.fecha>lastExt[e.equipo].fecha)lastExt[e.equipo]=e;
 for(const e of Object.values(lastExt)){if(e.etq&&e.etq!=='Legible')a.push({t:'Extintor de '+e.equipo,s:'Etiqueta: '+e.etq.toLowerCase()+' (revisar recarga)',tag:['yl','Etiqueta'],click:'edit:extintores:'+e.id});const d=e.vence?diff(e.vence,t):null,f=Object.entries(e.items||{}).filter(x=>x[1]!=='C').map(x=>x[0]+(x[1]==='A'?' (no tiene)':''));if(d!=null&&d<=30)a.push({t:'Extintor de '+e.equipo,s:'Etiqueta '+(d<0?'vencida el ':'vence el ')+fmt(e.vence),tag:d<0?['bad','Vencido']:['yl',d+' días'],click:'edit:extintores:'+e.id});if(f.length)a.push({t:'Extintor de '+e.equipo,s:'Falla: '+f.join(', '),tag:['bad','Revisar'],click:'edit:extintores:'+e.id})}
 for(const c of ['catepp','catbot']){const sm=stockMap(c);for(const v of Object.values(sm)){const nm=v.cat?v.cat.nombre:v.name,mn=v.cat?+v.cat.minimo||0:0;if(v.ex<0||(!v.cat&&v.ex<=0))a.push({t:nm+(c==='catbot'?' (botiquín)':' (EPP)'),s:v.cat?'Existencia negativa: revisa entradas o la existencia inicial':'No está en el catálogo de artículos',tag:['bad','Existencia '+v.ex],click:v.cat?'edit:'+c+':'+v.cat.id:'goto:'+M[c].mov});else if(v.cat&&mn>0&&v.ex<=mn)a.push({t:'Reponer '+nm,s:'Quedan '+v.ex+' (mínimo '+mn+')',tag:['yl','Existencia '+v.ex],click:'edit:'+c+':'+v.cat.id})}}
 for(const b of R('catbot'))if(b.vence&&diff(b.vence,t)<=30)a.push({t:b.nombre+' (botiquín)',s:'Lote vence el '+fmt(b.vence),tag:diff(b.vence,t)<0?['bad','Vencido']:['yl','Por vencer'],click:'edit:catbot:'+b.id});
 for(const s of R('sucesos'))if(s.estado!=='Cerrado')a.push({t:(s.codigo||'Suceso')+' abierto',s:(s.tipo||'')+' · '+fmt(s.fecha)+' · '+(s.acciones?'con acciones':'sin acciones definidas'),tag:['bad','Abierto'],click:'edit:sucesos:'+s.id});
 for(const i of R('insp'))if(nc(i.items)&&diff(t,i.fecha)<=7)a.push({t:i.equipo+': '+nc(i.items)+' no cumple',s:Object.entries(i.items).filter(x=>x[1]==='N').map(x=>x[0]).join(', '),tag:['or',fmt(i.fecha)],click:'edit:insp:'+i.id});
 for(const r of R('radios'))if(r.estado&&r.estado!=='Operativo')a.push({t:'Radio '+r.serie,s:r.estado,tag:['yl','Radio'],click:'edit:radios:'+r.id});
 return a}

function vHoy(){const t=today(),d=pd(t);
 const ini=cfg.inicio&&cfg.inicio>addD(t,-60)?cfg.inicio:t.slice(0,8)+'01',os=occ(ini,addD(t,7)),venc=os.filter(o=>o.due<t&&!done(o)),hoy=os.filter(o=>o.due===t),prox=os.filter(o=>o.due>t);
 const act=R('equipos').filter(e=>e.estado!=='Inactivo'&&e.estado!=='En taller');
 const pre=R('insp').filter(i=>String(i.fecha||'').startsWith(t.slice(0,7))),con=new Set(pre.map(i=>String(i.equipo||'').toUpperCase())),falta=act.filter(e=>!con.has(String(e.inv).toUpperCase()));
 const ch=R('charlas').filter(c=>c.fecha===t),alc=R('alcohol').filter(c=>c.fecha===t),al=alerts();
 const task=o=>{const dn=done(o);return row({left:`<div class="day">${pd(o.due).getDate()}<small>${DIA[pd(o.due).getDay()]}</small></div>`,t:o.t.t,s:dn?'Entregado el '+fmt(dn.hecho):(o.due<t?'Atrasado '+diff(t,o.due)+' días':o.due===t?'Vence hoy':'En '+diff(o.due,t)+' días'),tag:dn?null:o.due<t?['bad','Atrasado']:o.due===t?['or','Hoy']:null,right:`<button class="chk ${dn?'done':''}" data-act="tick:${o.t.id}_${o.due}" aria-label="Marcar entregado">${dn?'✓':''}</button>`,click:'goto:'+o.t.m})};
 return `<div class="hero"><div class="date"><span>${['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][d.getDay()]}</span><b>${d.getDate()} de ${MES[d.getMonth()]}</b><span>${venc.length?venc.length+' entrega'+(venc.length>1?'s':'')+' atrasada'+(venc.length>1?'s':''):'Sin entregas atrasadas'}${hoy.length?' · '+hoy.length+' vence'+(hoy.length>1?'n':'')+' hoy':''}</span></div>
 <div class="stats"><div class="stat ${act.length&&falta.length?'warn':'good'}" data-act="new:insp"><b>${act.length-falta.length}/${act.length}</b><small>Inspección de vehículos del mes</small></div><div class="stat" data-act="new:charlas"><b>${ch.filter(c=>c.estado==='Impartida').length}/${ch.length}</b><small>Charlas de hoy</small></div><div class="stat" data-act="new:alcohol"><b>${alc.length}</b><small>Pruebas de alcohol hoy</small></div><div class="stat ${al.length?'warn':'good'}" data-act="scroll:alertas"><b>${al.length}</b><small>Alertas abiertas</small></div></div></div>
 <section><div class="card" style="padding:12px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><div style="flex:1 1 170px"><b>Reporte diario SISO</b><br><small class="muted">PDF con las actividades y fotos del día</small></div><input type="date" id="rdfecha" value="${t}" style="min-height:44px;border:1px solid var(--line);border-radius:8px;padding:0 8px;font:inherit"><button class="btn pri" data-act="rdiario">Generar PDF</button></div></section>
 ${venc.length+hoy.length?`<section><div class="sh"><h2>Pendiente</h2></div><div class="card">${[...venc,...hoy].map(task).join('')}</div></section>`:''}
 ${act.length&&falta.length?`<section>${inspPend()}</section>`:''}
 ${ch.length?`<section><div class="sh"><h2>Charla del día</h2></div><div class="card">${ch.map(c=>row({t:c.tema,s:(c.area||'')+' · '+nAs(c)+' asistentes',tag:c.estado==='Impartida'?['ok','Impartida']:['yl','Programada'],click:'edit:charlas:'+c.id})).join('')}</div></section>`:''}
 ${(()=>{const p=pace(),late=p.filter(x=>x.st==='late');return p.length?`<section><div class="sh"><h2>Control de riesgo del mes</h2><a href="#control">Ver tabla</a></div><div class="card">${p.map(x=>`<div class="row click" data-act="new:${x.a.go}" tabindex="0"><div class="tx"><b>${esc(x.a.n)}</b><div class="bar" style="margin-top:6px"><i style="width:${Math.min(100,Math.round(x.v/x.obj*100))}%;background:${x.st==='late'?'var(--bad)':x.st==='on'?'var(--or)':'var(--ok)'}"></i></div></div><span class="tag ${x.st==='late'?'bad':x.st==='ok'?'ok':'or'}">${x.v} / ${x.obj}</span></div>`).join('')}</div><p class="hint">${late.length?late.length+' actividad'+(late.length>1?'es van':' va')+' atrasada'+(late.length>1?'s':'')+' respecto al día del mes.':'Todas las actividades van al día con su meta.'}</p></section>`:''})()}${(()=>{const n=ORDER.reduce((a,k)=>a+R(k).filter(r=>r.fecha===today()).reduce((b,r)=>b+(r.fotos||[]).length,0),0);return n?`<section><div class="sh"><h2>Fotos de hoy</h2><a href="#fotos">Ver y compartir (${n})</a></div></section>`:''})()}<section id="alertas"><div class="sh"><h2>Alertas</h2></div><div class="card">${al.length?al.map(row).join(''):'<p class="empty">Nada vencido ni por vencer. Las licencias, extintores, sucesos abiertos y hallazgos aparecerán aquí.</p>'}</div></section>
 <section><div class="sh"><h2>Próximos 7 días</h2><a href="#agenda">Ver agenda</a></div><div class="card">${prox.length?prox.map(task).join(''):'<p class="empty">Sin entregas programadas.</p>'}</div></section>`}

let agMes=today().slice(0,7);
function vAgenda(){const[y,mo]=agMes.split('-').map(Number),from=agMes+'-01',to=iso(new Date(y,mo,0)),t=today(),os=occ(from,to),dn=os.filter(done).length;
 return `<div class="sh"><h2>Entregas de ${MES[mo-1]} ${y}</h2><div class="tools" style="margin:0"><button class="btn sm" data-act="ag:-1" aria-label="Mes anterior">‹</button><button class="btn sm" data-act="ag:0">Este mes</button><button class="btn sm" data-act="ag:1" aria-label="Mes siguiente">›</button></div></div>
 <p style="margin:0 0 6px">${dn} de ${os.length} entregadas</p><div class="bar" style="margin-bottom:16px"><i style="width:${os.length?Math.round(dn/os.length*100):0}%"></i></div>
 <div class="card">${os.map(o=>{const d=done(o);return row({left:`<div class="day">${pd(o.due).getDate()}<small>${DIA[pd(o.due).getDay()]}</small></div>`,t:o.t.t,s:d?'Entregado el '+fmt(d.hecho)+(d.nota?' · '+d.nota:''):(o.due<(cfg.inicio||'')?'':o.due<t?'Atrasado':o.due===t?'Vence hoy':''),tag:d?null:o.due<(cfg.inicio||'')?['','Antes del inicio']:o.due<t?['bad','Atrasado']:o.due===t?['or','Hoy']:null,right:`<button class="chk ${d?'done':''}" data-act="tick:${o.t.id}_${o.due}" aria-label="Marcar entregado">${d?'✓':''}</button>`,click:'goto:'+o.t.m})}).join('')}</div>
 <p class="note" style="margin-top:16px">Rutina diaria: charla de 5 minutos (lunes, miércoles y jueves en campo; martes en oficinas) y pruebas de alcohol programadas.</p>`}

function vNuevo(){return `<h2 style="margin-bottom:14px">¿Qué vas a registrar?</h2><div class="grid">${ORDER.map(k=>`<button class="tile" data-act="new:${k}"><b>${M[k].s}</b><small>${M[k].d}</small></button>`).join('')}</div>`}
function vReg(){return `<div class="sh"><h2>Registros</h2><button class="btn sm" data-act="xall">Exportar todo a Excel</button></div><div class="grid"><a class="tile inv" href="#fotos" style="text-decoration:none"><b>Fotos del día</b><small>Ver, descargar y compartir por WhatsApp</small></a>`+['epp','botiquin'].map(k=>{const sm=Object.values(stockMap(M[k].inv));return `<a class="tile inv" href="#m-${k}" style="text-decoration:none"><b>Inventario de ${k==='epp'?'EPP':'botiquín'}</b><small>${sm.length} artículos · ${sm.reduce((a,v)=>a+Math.max(0,v.ex),0)} en existencia</small></a>`}).join('')+`${ORDER.map(k=>`<a class="tile" href="#m-${k}" style="text-decoration:none"><b>${M[k].n}</b><small>${R(k).length} registro${R(k).length===1?'':'s'}</small></a>`).join('')}</div>`}

function invTable(c){const sm=stockMap(c),rows=Object.values(sm).sort((a,b)=>String(a.cat?a.cat.nombre:a.name).localeCompare(String(b.cat?b.cat.nombre:b.name)));
 return `<section style="margin-top:0"><div class="sh"><h3>Inventario real</h3><div class="tools" style="margin:0"><button class="btn sm" data-act="new:${c}">+ Artículo</button><button class="btn sm" data-act="inmov:${M[c].mov}">+ Entrada</button></div></div>
 ${rows.length?`<div class="card scroll"><table class="inv"><thead><tr><th>Artículo</th><th class="n">Inicial</th><th class="n">Entradas</th><th class="n">Salidas</th><th class="n">Existencia</th></tr></thead><tbody>${rows.map(v=>{const mn=v.cat?+v.cat.minimo||0:0,cl=v.ex<=0?'bad':mn&&v.ex<=mn?'warn':'';return`<tr class="${v.cat?'click':''}" ${v.cat?`data-act="edit:${c}:${esc(v.cat.id)}" tabindex="0"`:''}><td>${esc(v.cat?v.cat.nombre:v.name)}${v.cat?'':' <span class="tag bad">sin catálogo</span>'}${c==='catbot'&&v.cat&&v.cat.vence?`<br><small style="color:var(--mut)">Vence ${fmt(v.cat.vence)}</small>`:''}</td><td class="n">${v.ini}</td><td class="n">${v.e}</td><td class="n">${v.s}</td><td class="n ex ${cl}">${v.ex}</td></tr>`}).join('')}</tbody></table></div>`:`<p class="empty card">Aún no hay artículos. Crea cada artículo una sola vez (por ejemplo “Chaleco reflectivo”) con su existencia inicial; luego cada entrada y entrega se suma o resta en su misma fila.</p>`}
 </section><h3 style="margin:22px 0 8px">Movimientos</h3>`}
function vMod(){const k=modOpen,m=M[k];let rs=R(k).slice();
 if(!m.nodate&&filt.mes)rs=rs.filter(r=>String(r.fecha||'').startsWith(filt.mes));
 if(filt.q){const q=filt.q.toLowerCase();rs=rs.filter(r=>JSON.stringify(r).toLowerCase().includes(q))}
 rs.sort((a,b)=>m.nodate?String(m.sum(a)[0]).localeCompare(String(m.sum(b)[0])):String(b.fecha||'').localeCompare(String(a.fecha||''))||String(b.hora||'').localeCompare(String(a.hora||'')));
 const meses=[...new Set(R(k).map(r=>String(r.fecha||'').slice(0,7)).filter(Boolean).concat(today().slice(0,7)))].sort().reverse();
 return `<div class="sh"><h2>${m.n}</h2><div class="tools" style="margin:0"><button class="btn pri" data-act="new:${k}">+ Nuevo</button>${k==='despliegue'?'<button class="btn" data-act="duplast">Duplicar el último</button>':''}<button class="btn" data-act="x:${k}">Excel</button></div></div>
 <div class="tools"><input id="q" type="search" placeholder="Buscar…" value="${esc(filt.q)}">${m.nodate?'':`<select id="mes"><option value="">Todos los meses</option>${meses.map(x=>`<option value="${x}" ${x===filt.mes?'selected':''}>${MES[+x.slice(5)-1]} ${x.slice(0,4)}</option>`).join('')}</select>`}</div>
 ${m.inv?invTable(m.inv):k==='extintores'?extPend():k==='insp'?inspPend():k==='charlas'?agendaBox():''}
 <div class="card">${rs.length?rs.map(r=>{const s=m.sum(r);return row({left:m.nodate?'':`<div class="day">${r.fecha?pd(r.fecha).getDate():'–'}<small>${r.fecha?MES[pd(r.fecha).getMonth()].slice(0,3):''}</small></div>`,t:s[0]||'(sin nombre)',s:(s[1]||'')+((r.fotos||[]).length?' · '+r.fotos.length+' foto'+(r.fotos.length>1?'s':''):''),tag:s[2]&&s[2][1]?s[2]:null,click:'edit:'+k+':'+r.id})}).join(''):`<p class="empty">${R(k).length?'Nada coincide con el filtro.':'Aún no hay registros. Usa “+ Nuevo”.'}</p>`}</div>`}

/* ---------- informe mensual ---------- */
function infData(mes){const inM=r=>String(r.fecha||'').startsWith(mes),g=k=>R(k).filter(inM);
 const ins=g('insp'),items=ins.flatMap(i=>Object.values(i.items||{})).filter(v=>v!=='A'),okI=items.filter(v=>v==='C').length;
 const ch=g('charlas').filter(c=>c.estado==='Impartida'),su=g('sucesos'),al=g('alcohol'),ep=g('epp').filter(e=>e.mov==='Entrega a personal'),bo=g('botiquin').filter(b=>b.mov==='Salida / entrega'),ex=g('extintores'),de=g('desvios');
 const cnt=(arr,f)=>{const o={};for(const x of arr){const v=f(x)||'—';o[v]=(o[v]||0)+(+x.cant||1)}return o};const epi=ep.flatMap(eitems);const fotos=ORDER.reduce((a,k)=>a+g(k).reduce((b,r)=>b+(r.fotos||[]).length,0),0);
 return{ins,pct:items.length?Math.round(okI/items.length*100):null,ch,asis:ch.reduce((a,c)=>a+nAs(c),0),su,al,pos:al.filter(a=>a.resultado==='Positivo').length,ep,eppA:cnt(epi,e=>e.art),eppN:epi.reduce((a,e)=>a+(+e.cant||1),0),fotos,firm:ep.filter(e=>e.firma).length,bo,boA:cnt(bo.flatMap(eitems),b=>b.art),ex,exMal:ex.filter(e=>ncx(e.items)).length,de,hall:ins.filter(i=>nc(i.items))}}
function vInf(){const[y,mo]=infMes.split('-').map(Number),d=infData(infMes);
 const tb=(h,rows)=>rows.length?`<div class="card scroll"><table class="stack"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="empty card">Sin registros este mes.</p>';
 return `<div class="sh"><h2>Informe SISO · ${MES[mo-1]} ${y}</h2><div class="tools" style="margin:0"><a class="btn sm dk" href="#control" style="display:inline-flex;align-items:center;text-decoration:none">Control de riesgo</a><button class="btn sm" data-act="inf:-1">‹</button><button class="btn sm" data-act="inf:1">›</button><button class="btn sm" data-act="copyinf">Copiar texto</button><button class="btn sm pri" data-act="xinf">Excel del mes</button></div></div>
 <p class="note">Resumen de las actividades del mes para la Fase III del informe del día 18. Copia el texto al documento de Word y adjunta la evidencia fotográfica.</p>
 <div class="kv"><div><b>${d.ch.length}</b><small>Charlas impartidas</small></div><div><b>${d.asis}</b><small>Asistencias</small></div><div><b>${d.ins.length}</b><small>Inspecciones de equipo</small></div><div><b>${d.pct==null?'–':d.pct+'%'}</b><small>Ítems que cumplen</small></div><div><b>${d.ex.length}</b><small>Extintores inspeccionados</small></div><div><b>${d.al.length}</b><small>Pruebas de alcohol (${d.pos} positivas)</small></div><div><b>${d.su.length}</b><small>Sucesos reportados</small></div><div><b>${d.de.length}</b><small>Desviaciones</small></div><div><b>${d.eppN}</b><small>EPP entregado (${d.firm} de ${d.ep.length} entregas firmadas)</small></div><div><b>${d.fotos}</b><small>Fotos de evidencia</small></div></div>
 <section><h3 style="margin-bottom:8px">Charlas impartidas</h3>${tb(['Fecha','Tema','Área','Asistentes'],d.ch.sort((a,b)=>a.fecha<b.fecha?-1:1).map(c=>[fdmy(c.fecha),c.tema,c.area||'',nAs(c)]))}</section>
 <section><h3 style="margin-bottom:8px">Hallazgos en equipos</h3>${tb(['Fecha','Equipo','No cumple'],d.hall.map(i=>[fdmy(i.fecha),i.equipo,Object.entries(i.items).filter(x=>x[1]==='N').map(x=>x[0]).join(', ')]))}</section>
 <section><h3 style="margin-bottom:8px">Sucesos</h3>${tb(['Código','Fecha','Tipo','Causa','Estado'],d.su.map(s=>[s.codigo,fdmy(s.fecha),s.tipo,s.causa||'',s.estado]))}</section>
 <section><h3 style="margin-bottom:8px">EPP entregado</h3>${tb(['Artículo','Cantidad'],Object.entries(d.eppA))}</section>
 <section><h3 style="margin-bottom:8px">Botiquín: salidas</h3>${tb(['Medicamento','Cantidad'],Object.entries(d.boA))}</section>`}
function infText(){const[y,mo]=infMes.split('-').map(Number),d=infData(infMes),L=[];
 L.push('ACTIVIDADES SISO EJECUTADAS – '+MES[mo-1].toUpperCase()+' '+y,'Proyecto: '+(cfg.proyecto||'Yorito – Empalme RN-23'),'');
 L.push('1. Charlas de seguridad: se impartieron '+d.ch.length+' charlas con '+d.asis+' asistencias en total.');d.ch.forEach(c=>L.push('   - '+fdmy(c.fecha)+': '+c.tema+' ('+(c.area||'')+', '+nAs(c)+' asistentes)'));
 L.push('2. Inspecciones de equipo móvil: '+d.ins.length+' checklists'+(d.pct!=null?', con '+d.pct+'% de ítems en cumplimiento':'')+'.');d.hall.forEach(i=>L.push('   - '+i.equipo+' ('+fdmy(i.fecha)+'): '+Object.entries(i.items).filter(x=>x[1]==='N').map(x=>x[0]).join(', ')));
 L.push('3. Extintores: '+d.ex.length+' inspeccionados; '+d.exMal+' con componentes en mal estado.');
 L.push('4. Pruebas de alcoholimetría: '+d.al.length+' aplicadas, '+d.pos+' positivas.');
 L.push('5. Sucesos: '+d.su.length+' reportados.');d.su.forEach(s=>L.push('   - '+s.codigo+' '+s.tipo+' ('+fdmy(s.fecha)+'): '+(s.causa||'')+' – '+s.estado));
 L.push('6. Desviaciones conductuales registradas: '+d.de.length+'.');
 L.push('7. EPP entregado: '+(Object.entries(d.eppA).map(([a,c])=>c+' '+a).join(', ')||'ninguno')+'.');
 L.push('   Entregas firmadas: '+d.firm+' de '+d.ep.length+'. Evidencia fotográfica del mes: '+d.fotos+' fotos.');
 L.push('8. Botiquín, salidas: '+(Object.entries(d.boA).map(([a,c])=>c+' '+a).join(', ')||'ninguna')+'.');
 L.push('9. Control de riesgo del mes (realizado / meta mensual):');for(const a of CTL){const mt=meta(a);if(mt.off)continue;const v=a.c(null,f=>String(f||'').startsWith(infMes));L.push('   - '+a.n+': '+v+(mt.obj?' de '+mt.obj+' ('+Math.round(v/mt.obj*100)+'%)':''))}
 return L.join('\n')}

/* ---------- formulario ---------- */
let cur=null;
function fieldHTML(f,r){const v=r[f.k]??'',id='f_'+f.k,ro=f.ro?'readonly':'';let inp;
 if(f.t==='sel')inp=`<select id="${id}">${f.o.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
 else if(f.t==='area')inp=`<textarea id="${id}">${esc(v)}</textarea>`;
 else if(f.t==='hdr')return `<h3 class="fh">${esc(f.l)}</h3>`;
 else if(f.t==='fotos')return `<div class="f w" style="margin-bottom:12px"><span style="display:block;font:600 14px Barlow,sans-serif;color:var(--mut);margin-bottom:4px">${esc(f.l)}</span><div class="fotos" id="f_fotos">${fotosHTML()}</div></div>`;
 else if(f.t==='firma')return `<div class="f w sig" style="margin-bottom:12px"><span style="display:block;font:600 14px Barlow,sans-serif;color:var(--mut);margin-bottom:4px">${esc(f.l)}</span><div id="f_${f.k}">${sigHTML(f.k)}</div></div>`;
 else if(f.t==='lista')return `<div class="f w" style="margin-bottom:12px"><span style="display:block;font:600 14px Barlow,sans-serif;color:var(--mut);margin-bottom:4px">${esc(f.l)}</span><div class="li-h ${f.vida?'':'nv'}"><span>Artículo</span><span>Cant.</span>${f.vida==='est'?'<span>Estación</span>':f.vida?'<span>Vida útil (meses)</span>':''}<span></span></div><div id="f_lista" data-vida="${f.vida||0}">${(eitems(r).length?eitems(r):[{art:'',cant:1}]).map(i=>liRow(i,f.vida)).join('')}</div><datalist id="dl_cat">${f.o().map(o=>`<option value="${esc(o)}">`).join('')}</datalist><p class="hint">${f.o().length?'Elige el artículo del inventario para que se sume o descuente en su fila.':'Tip: crea primero los artículos en el inventario (botón “+ Artículo”) para llevar la existencia real.'}</p><button type="button" class="btn sm" data-act="addli">+ Otro artículo</button></div>`;
 else if(f.t==='multi')inp=multiHTML(f,r);
 else if(f.t==='chk')inp=`<div id="${id}" class="chkbox">${chkHTML(f,r)}</div>`;
 else if(f.t==='eq'){const e0=findEq(v);inp=`<input id="${id}" list="dl_eq" value="${esc(v)}" autocomplete="off" placeholder="Ej. PS-764"><small id="eqinfo" class="hint" style="display:block">${e0?esc([e0.tipo,[e0.marca,e0.modelo].filter(Boolean).join(' '),e0.placa&&'Placa '+e0.placa].filter(Boolean).join(' · ')):''}</small>`}
 else if(f.t==='per')inp=`<input id="${id}" list="dl_per" value="${esc(v)}" autocomplete="off">`;
 else if(f.t==='list')inp=`<input id="${id}" list="dl_${f.k}" value="${esc(v)}" autocomplete="off"><datalist id="dl_${f.k}">${f.o.map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`;
 else inp=`<input id="${id}" type="${{date:'date',time:'time',num:'number'}[f.t]||'text'}" ${f.t==='num'?'inputmode="decimal" step="any"':''} value="${esc(v)}" ${ro}>`;
 return `<label class="f ${f.w?'w':''}"><span>${esc(f.l)}${f.req?' *':''}</span>${inp}</label>`}
function chkHTML(f,r){const its=f.o(r),cur=r[f.k]||{},lb=f.labels||['Cumple','No cumple','N/A'];
 return `<div style="display:flex;gap:8px;margin-bottom:6px;flex-wrap:wrap"><button type="button" class="btn sm" data-act="allC:${f.k}">Todo ${lb[0].toLowerCase()}</button><small style="color:var(--mut);align-self:center">C = ${lb[0]} · X = ${lb[1]} · ${lb[2]==='No tiene'?'NT':'NA'} = ${lb[2]}</small></div>`+its.map((it,i)=>{const v=cur[it]||'C';return`<div class="ci"><span>${esc(it)}</span><div class="seg" data-it="${esc(it)}">${[['C','C'],['N','X'],['A',lb[2]==='No tiene'?'NT':'NA']].map(([c,t])=>`<button type="button" class="${v===c?c:''}" data-v="${c}" aria-label="${esc(it)}: ${[lb[0],lb[1],lb[2]][['C','N','A'].indexOf(c)]}">${t}</button>`).join('')}</div></div>`}).join('')}
const liRow=(i,vida)=>`<div class="li-row ${vida&&vida!=='0'?'':'nv'}"><input class="li-a" list="dl_cat" value="${esc(i.art||'')}" placeholder="Buscar artículo…" aria-label="Artículo" autocomplete="off"><input class="li-c" type="number" inputmode="numeric" min="1" value="${esc(i.cant||1)}" aria-label="Cantidad">${vida==='est'?`<input class="li-e" value="${esc(i.est||'')}" placeholder="12+300" aria-label="Estación" autocomplete="off">`:vida&&vida!=='0'?`<input class="li-v" type="number" inputmode="numeric" value="${esc(i.vida||'')}" aria-label="Vida útil en meses">`:''}<button type="button" class="btn sm" data-act="rmli" aria-label="Quitar artículo">✕</button></div>`;
function fotosHTML(){const f=cur?cur.fotos:[];return f.map((id,i)=>`<div class="ph"><img data-sid="${esc(id)}" alt="Foto ${i+1}" data-act="viewph:${i}" role="button" tabindex="0" style="cursor:zoom-in"><button type="button" data-act="rmph:${i}" aria-label="Quitar foto">✕</button></div>`).join('')+(cur&&cur.up?`<div class="ph" style="display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--mut)">Subiendo ${cur.up}…</div>`:'')+(as&&navigator.onLine?`<label class="addph">+ Foto<br>cámara o galería<input class="phin" type="file" accept="image/*" multiple></label>`:'<small style="color:var(--mut)">Sin conexión: las fotos se agregan cuando vuelva la señal.</small>')}
function sigHTML(k='firma'){const g=cur&&cur.sig[k]||{};
 if(g.prev)return `<img src="${g.prev}" alt="Firma"><div class="sr"><small>Firma nueva, se guarda al tocar Guardar</small><button type="button" class="btn sm" data-act="sigopen:${k}">Volver a firmar</button></div>`;
 if(g.id)return `<img data-sid="${esc(g.id)}" alt="Firma"><div class="sr"><small>Firmado${cur.r[k+'Fecha']?' el '+fdmy(cur.r[k+'Fecha']):''}</small><button type="button" class="btn sm" data-act="sigopen:${k}">Volver a firmar</button></div>`;
 return `<button type="button" class="btn pri sigbtn" data-act="sigopen:${k}"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17c3-1 4-6 6-6s1 5 3 5 3-4 5-4 2 2 4 2"/><path d="M3 21h18"/></svg>Firmar</button><small class="hint" style="display:block">Se abre a pantalla completa; gira el teléfono en horizontal.</small>`}
function initSig(){for(const c of document.querySelectorAll('canvas.sigc'))initSig1(c)}
function initSig1(c){if(c.dataset.ok)return;c.dataset.ok='1';const k=c.dataset.k;const b=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=Math.round(b.width*dpr);c.height=Math.round(b.height*dpr);const x=c.getContext('2d');x.scale(dpr,dpr);x.lineWidth=2.6;x.lineCap='round';x.lineJoin='round';x.strokeStyle='#111';let dn=false;
 const pt=e=>{const r=c.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
 c.onpointerdown=e=>{e.preventDefault();dn=true;try{c.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);x.beginPath();x.moveTo(p.x,p.y);x.lineTo(p.x+.1,p.y+.1);x.stroke();cur.sig[k].dirty=true};
 c.onpointermove=e=>{if(!dn)return;e.preventDefault();const p=pt(e);x.lineTo(p.x,p.y);x.stroke()};
 c.onpointerup=c.onpointercancel=()=>{dn=false}}
async function compress(file,st){try{const u=URL.createObjectURL(file);const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u});const k=Math.min(1,1600/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);if(st){try{await stamp(c,st)}catch(e){}}const b=await new Promise(ok=>c.toBlob(ok,'image/jpeg',.82));return b||file}catch(e){return file}}
async function upPhotos(files){if(!as||!cur)return;const c0=cur;for(const f of files){c0.up=(c0.up||0)+1}refreshPh();
 for(const f of files){try{const b=await compress(f,await stampCtx(f).catch(()=>null));const r=await as.upload(b,{type:b.type&&/^image\/(jpeg|png|webp|gif)$/.test(b.type)?b.type:'image/jpeg'});c0.fotos.push(r.id)}catch(e){toast('No se pudo subir una foto: '+(e&&e.message||'revisa la conexión'))}c0.up--;if(cur===c0)refreshPh()}}
function refreshPh(){const el=$('#f_fotos');if(el)el.innerHTML=fotosHTML()}
function readChk(f){const o={};for(const s of document.querySelectorAll('#f_'+f.k+' .seg')){const b=s.querySelector('button.C,button.N,button.A');o[s.dataset.it]=b?b.dataset.v:'C'}return o}
function openForm(k,id,pre={}){const m=M[k];let r=id?{...R(k).find(x=>x.id===id)}:{fecha:today(),...pre};
 if(!id){for(const f of m.f)if(f.t==='sel'&&r[f.k]==null)r[f.k]=f.o[0];if(k==='charlas'&&!pre.estado)r.estado='Impartida';if(k==='sucesos'){r.codigo=nextCode();r.fechaRep=r.fechaRep||today()}if(k==='alcohol'||k==='charlas'||k==='desvios')r.instructor=r.instructor||cfg.siso||''}
 cur={k,id,r,fotos:[...(r.fotos||[])],sig:Object.fromEntries(m.f.filter(f=>f.t==='firma').map(f=>[f.k,{id:r[f.k]||'',resign:false,dirty:false}])),up:0};const eqs=R('equipos').map(e=>e.inv),pers=[...new Set(R('personal').map(p=>p.nombre).filter(Boolean))];
 $('#sheet').innerHTML=`<div class="hd"><h3>${id?'Editar':'Nuevo'}: ${m.s}</h3><button class="btn sm dk" data-act="close" aria-label="Cerrar" style="border-color:#555">✕</button></div>
 <form class="bd" id="frm"><div class="fg">${m.f.map(f=>fieldHTML(f,r)).join('')}</div><datalist id="dl_eq">${R('equipos').map(e=>`<option value="${esc(e.inv)}">${esc([e.tipo,e.marca,e.modelo].filter(Boolean).join(' '))}</option>`).join('')}</datalist><datalist id="dl_per">${R('personal').filter(p=>p.estado!=='Inactivo').map(p=>`<option value="${esc(p.nombre)}">${esc([p.cargo,p.unidad].filter(Boolean).join(' · '))}</option>`).join('')}</datalist></form>
 <div class="ft"><button class="btn pri" data-act="save">Guardar</button><button class="btn dk" data-act="pdf">${pdfLabel(k,r)}</button>${r.comprobante?`<button class="btn" data-act="openf:${esc(r.comprobante)}">Ver PDF guardado</button>`:''}${id?`<button class="btn" data-act="dup">Duplicar</button><span class="sp"></span><button class="btn" data-act="askdel" style="color:var(--bad)">Eliminar</button>`:''}</div>`;
 if(m.cat&&id){const nm=norm(r.nombre),hist=R(m.mov).filter(x=>eitems(x).some(i=>norm(i.art)===nm)).sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha))),st=stockRow(k,r);
  $('#frm').insertAdjacentHTML('beforeend',`<div class="kv" style="margin:6px 0 14px"><div><b>${st.ini}</b><small>Inicial</small></div><div><b>${st.e}</b><small>Entradas</small></div><div><b>${st.s}</b><small>Salidas</small></div><div><b style="color:${st.ex<=0?'var(--bad)':'var(--ok)'}">${st.ex}</b><small>Existencia real</small></div></div><h3 style="margin-bottom:8px">Movimientos de este artículo</h3><div class="card">${hist.length?hist.map(x=>{const q=eitems(x).filter(i=>norm(i.art)===nm).reduce((a,i)=>a+(+i.cant||0),0);return row({left:`<div class="day">${pd(x.fecha).getDate()}<small>${MES[pd(x.fecha).getMonth()].slice(0,3)}</small></div>`,t:(isIn(x)?'+':'−')+q+' · '+(isIn(x)?'Entrada':x.mov),s:x.persona||'',tag:null,click:'edit:'+m.mov+':'+x.id})}).join(''):'<p class="empty">Sin movimientos todavía.</p>'}</div>`)}
 if(k==='senal'&&id){const h=senHist(r.senal),dd=depOf(r.senal);$('#frm').insertAdjacentHTML('beforeend',`<div class="kv" style="margin:6px 0 14px"><div><b>${+r.total||0}</b><small>Total</small></div><div><b>${usoOf(r)}</b><small>En uso hoy</small></div><div><b>${exist(r)}</b><small>En plantel</small></div></div>${dd?`<p class="hint" style="margin:0 0 10px">Según el despliegue del ${fdmy(dd.fecha)}: ${esc(dd.est||'no está en la vía')}</p>`:''}<h3 style="margin-bottom:8px">Dónde ha estado</h3><div class="card">${h.length?h.map(x=>row({left:`<div class="day">${pd(x.d.fecha).getDate()}<small>${MES[pd(x.d.fecha).getMonth()].slice(0,3)}</small></div>`,t:x.cant+' en la vía · '+(x.est||'sin estación'),s:x.d.frente||'',tag:null,click:'edit:despliegue:'+x.d.id})).join(''):'<p class="empty">Todavía no aparece en ningún despliegue.</p>'}</div>`)}
 $('#modal').classList.add('on');initSig();
const eqI=$('#f_equipo');if(eqI&&m.f.some(f=>f.t==='chk')&&k==='insp')eqI.addEventListener('change',()=>{const f=m.f.find(f=>f.t==='chk');const tmp={...r,equipo:eqI.value,[f.k]:readChk(f)};$('#f_'+f.k).innerHTML=chkHTML(f,tmp)})}
function nextCode(){const y=today().slice(0,4),n=R('sucesos').filter(s=>String(s.codigo||'').includes('-'+y+'-')).map(s=>+String(s.codigo).split('-').pop()||0);return 'RS-'+y+'-'+pad(Math.max(0,...n)+1).padStart(3,'0')}
function collect(){const m=M[cur.k],o={};for(const f of m.f){if(f.t==='hdr')continue;if(f.t==='chk'){o[f.k]=readChk(f);continue}if(f.t==='fotos'){o.fotos=cur.fotos.slice();continue}if(f.t==='firma'){o[f.k]=cur.sig[f.k].id||'';if(cur.r[f.k+'Fecha'])o[f.k+'Fecha']=cur.r[f.k+'Fecha'];continue}if(f.t==='lista'){o.lista=[...document.querySelectorAll('#f_lista .li-row')].map(x=>({art:x.querySelector('.li-a').value.trim(),cant:+x.querySelector('.li-c').value||1,vida:x.querySelector('.li-v')?x.querySelector('.li-v').value:'',est:x.querySelector('.li-e')?x.querySelector('.li-e').value.trim():''})).filter(i=>i.art);continue}if(f.t==='multi'){o[f.k]=readMulti(f.k);continue}let v=$('#f_'+f.k).value.trim();if(f.t==='num'&&v!=='')v=+v;o[f.k]=v}return o}
function pdfLabel(k,r){return k==='sucesos'?'Reporte en Excel':k==='epp'?'Comprobante PDF':k==='botiquin'?'Comprobante PDF':'PDF con evidencia'}
function closeM(){$('#modal').classList.remove('on');cur=null;render()}

/* ---------- excel ---------- */
function rowsFor(k,list){if(k==='extintores')return extRows(list||R(k));const m=M[k];return(list||R(k)).slice().sort((a,b)=>String(a.fecha||'').localeCompare(String(b.fecha||''))).map(r=>{const o={};for(const f of m.f){if(f.t==='hdr')continue;if(f.t==='chk'){for(const it of f.o(r)){const v=(r[f.k]||{})[it];o[it]=v==='N'?'X':v==='A'?((f.labels||[])[2]==='No tiene'?'NT':'N/A'):'✓'}}else if(f.t==='fotos'){}else if(f.t==='firma')o[f.l]='';else if(f.t==='lista')o[f.l]=eitems(r).map(i=>(i.cant||1)+' '+i.art+(i.vida?' ('+i.vida+' meses)':'')+(i.est?' en '+i.est:'')).join(', ');else if(f.t==='multi')o[f.l]=(Array.isArray(r[f.k])?r[f.k]:[r[f.k]||r.causa].filter(Boolean)).join(', ');else o[f.l]=f.t==='date'&&r[f.k]?r[f.k]:r[f.k]??''}if(k==='charlas')o['N° asistentes']=nAs(r);if(k==='senal'){const dd=depOf(r.senal);o['En uso hoy']=usoOf(r);o['Existencia en plantel']=exist(r);o['Ubicación hoy']=dd?dd.est:(r.ubic||'')}const fl=m.f.find(f=>f.t==='firma');o[META]={fotos:(r.fotos||[]).slice(),firmas:m.f.filter(f=>f.t==='firma').map(f=>({col:f.l,id:r[f.k]||''})),needSig:!!fl&&!(m.inv&&(isIn(r)||String(r.mov||'').startsWith('Baja')))};return o})}
let xlsxP=null,logoP=null;
const META=Symbol('meta');
async function longLinks(paths){const out={};if(!paths.length||!sb||!navigator.onLine)return out;for(let i=0;i<paths.length;i+=100){try{const {data}=await sb.storage.from(BUCKET).createSignedUrls(paths.slice(i,i+100),31536000);for(const d of data||[])if(d&&d.signedUrl&&d.path)out[d.path]=d.signedUrl}catch(e){}}return out}
async function sigImg(id){try{const b=await fileBlob(id);const du=await new Promise((ok,no)=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=no;f.readAsDataURL(b)});const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=du});return{du,w:im.naturalWidth,h:im.naturalHeight}}catch(e){return null}}
function loadX(){return xlsxP||(xlsxP=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';s.onload=()=>ok(window.ExcelJS);s.onerror=()=>{xlsxP=null;no()};document.head.appendChild(s)}))}
function loadLogo(){return Promise.race([loadLogo0(),new Promise(r=>setTimeout(()=>r(null),6000))])}
function loadLogo0(){return logoP||(logoP=fetch('icons/logo-empresa.png').then(r=>{if(!r.ok)throw 0;return r.blob()}).then(b=>new Promise((ok,no)=>{const f=new FileReader();f.onload=()=>{const i=new Image();i.onload=()=>ok({du:f.result,w:i.naturalWidth,h:i.naturalHeight});i.onerror=no;i.src=f.result};f.onerror=no;f.readAsDataURL(b)})).catch(()=>{logoP=null;return null}))}
const PROY_TITULO=()=>cfg.titulo||'Proyecto Pavimentación con Doble Tratamiento Superficial, Ruta 43, Tramo Yorito – Empalme RN-23 (13.65 km), Departamento de Yoro';
const RESP=()=>{const n=cfg.siso||'Fernando Domínguez';return(/^ing/i.test(n)?n:'Ing. '+n)+' – Supervisor SISO'};
const fechaLarga=s=>{const d=pd(s);return d.getDate()+' de '+MES[d.getMonth()]+' de '+d.getFullYear()};
/* Excel con el formato de Cordon's: logo + título, proyecto, franja, fecha/responsable/área y tabla */
async function exportX(name,sheets){
 let X;try{X=await loadX()}catch(e){toast('No se pudo cargar el generador de Excel (revisa la conexión)');return}
 const logo=await loadLogo();const wb=new X.Workbook();wb.creator=cfg.siso||'SISO';wb.created=new Date();
 const C={ink:'FF141414',navy:'FF17324D',amber:'FFFFC000',teal:'FF177E89',info:'FFEAF2F5',or:'FFFF5A00',z1:'FFF2F6F8',z2:'FFF7F4EF',line:'FFD9D4CA',ok:'FF0B7A5A',bad:'FFC8231B',white:'FFFFFFFF'};
 const used=new Set(),med={style:'medium',color:{argb:C.ink}},thin={style:'thin',color:{argb:C.line}};
 const nombre=(cfg.siso||'Fernando Domínguez').replace(/^ing\.?\s*/i,'');
 const proy=PROY_TITULO().replace(/^proyecto\s+/i,'');
 for(const[sheetName,rows0,docTitle]of sheets){
  let nm=String(sheetName).replace(/[\\\/?*\[\]:]/g,' ').slice(0,31).trim()||'Hoja';let n=2;while(used.has(nm.toLowerCase()))nm=nm.slice(0,28)+' '+(n++);used.add(nm.toLowerCase());
  const ws=wb.addWorksheet(nm,{views:[{state:'frozen',ySplit:6,showGridLines:false}],pageSetup:{orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,paperSize:1,horizontalCentered:true,margins:{left:.4,right:.4,top:.5,bottom:.5,header:.3,footer:.3}}});
  let rows=rows0.length?rows0:[{'Registros':'Sin registros en este periodo','Observación':''}];
  const metas=rows.map(r=>r[META]||null),nF=Math.min(12,Math.max(0,...metas.map(m=>m&&m.fotos?m.fotos.length:0))),fCols=[...new Set(metas.flatMap(m=>m&&m.firmas?m.firmas.map(f=>f.col):[]))];
  if(nF)rows=rows.map((r,i)=>{const o={...r};for(let j=1;j<=nF;j++)o['Foto '+j]='';return o});
  let cols=Object.keys(rows[0]);
  if(cols.length<2){cols=[...cols,'Observación'];rows=rows.map(r=>({...r,'Observación':''}))}
  const numCol=cols.map(c=>rows.every(r=>r[c]===''||r[c]==null||typeof r[c]==='number'));
  const len=v=>Math.max(...String(v??'').split('\n').map(s=>s.length));
  let W=cols.map((c,i)=>/^Foto \d+$/.test(c)?12:fCols.includes(c)?22:Math.min(48,Math.max(numCol[i]?9:11,len(c)+4,...rows.map(r=>len(r[c])+3))));
  const tot=W.reduce((a,b)=>a+b,0);if(tot<100){let k=numCol.indexOf(false);if(k<0)k=0;W[k]+=100-tot}
  const last=cols.length,px=w=>w*7+5;
  // espacio para el logo (como en el formato: logo a la izquierda, título a la derecha)
  const LH=54,LW=logo?Math.round(LH*logo.w/logo.h):300;let span=1,acc=px(W[0]);while(acc<LW+16&&span<last-1){acc+=px(W[span]);span++}
  if(acc<LW+16)W[span-1]+=Math.ceil((LW+16-acc)/7);
  ws.columns=W.map(w=>({width:w}));
  const mg=(r,c1,c2)=>{if(c2>c1)(ws.mergeCellsWithoutStyle||ws.mergeCells).call(ws,r,c1,r,c2)};
  const box=(r,c1,c2)=>{for(let c=c1;c<=c2;c++){const x=ws.getCell(r,c);x.border={top:med,bottom:med,left:c===c1?med:undefined,right:c===c2?med:undefined}}};
  const fillRow=(r,argb)=>{for(let c=1;c<=last;c++)ws.getCell(r,c).fill={type:'pattern',pattern:'solid',fgColor:{argb}}};
  // fila 1: logo | título del documento
  ws.getRow(1).height=46;box(1,1,span);box(1,span+1,last);mg(1,1,span);mg(1,span+1,last);
  if(logo){const id=wb.addImage({base64:logo.du,extension:'png'});ws.addImage(id,{tl:{col:0.08,row:0.05},ext:{width:LW,height:LH},editAs:'oneCell'})}
  const t=ws.getCell(1,span+1);t.value=String(docTitle||sheetName).toUpperCase();t.font={name:'Calibri',size:15,bold:true,color:{argb:C.ink}};t.alignment={horizontal:'center',vertical:'middle',wrapText:true};
  // fila 2: proyecto (ámbar)
  ws.getRow(2).height=35;fillRow(2,C.amber);mg(2,1,last);const p2=ws.getCell(2,1);
  p2.value={richText:[{text:'PROYECTO | ',font:{name:'Calibri',size:10,bold:true,color:{argb:C.ink}}},{text:proy,font:{name:'Calibri',size:10,bold:true,color:{argb:C.ink}}}]};p2.alignment={horizontal:'center',vertical:'middle',wrapText:true};
  // fila 3: franja verde azulado
  ws.getRow(3).height=8;fillRow(3,C.teal);mg(3,1,last);
  // fila 4: fecha | responsable | área
  ws.getRow(4).height=27;fillRow(4,C.info);mg(4,1,last);const f4=ws.getCell(4,1);
  f4.value='FECHA: '+fdmy(today())+'     |     RESPONSABLE: Ing. '+nombre+'     |     ÁREA: Seguridad Industrial y Salud Ocupacional (SISO)';f4.font={name:'Calibri',size:10,bold:true,color:{argb:C.navy}};f4.alignment={horizontal:'left',vertical:'middle',indent:1,wrapText:true};
  ws.getRow(5).height=8;
  // fila 6: encabezados de la tabla
  const hr=ws.getRow(6);hr.height=33;cols.forEach((c,i)=>{const x=hr.getCell(i+1);x.value=c;x.font={name:'Calibri',size:10,bold:true,color:{argb:C.white}};x.fill={type:'pattern',pattern:'solid',fgColor:{argb:C.navy}};x.alignment={vertical:'middle',horizontal:'center',wrapText:true};x.border={bottom:{style:'medium',color:{argb:C.or}},left:{style:'thin',color:{argb:'FF2C4A68'}},right:{style:'thin',color:{argb:'FF2C4A68'}}}});
  // datos
  rows.forEach((r,ri)=>{const row=ws.getRow(7+ri);let lines=1;cols.forEach((c,i)=>{const x=row.getCell(i+1);let v=r[c];const raw=String(v??'');lines=Math.max(lines,...raw.split('\n').map(s=>Math.ceil((s.length||1)/Math.max(1,W[i]-2))));
   if(typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)){const d=pd(v);v=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));x.numFmt='dd-mm-yyyy'}x.value=v??'';
   const f={name:'Calibri',size:10,color:{argb:C.ink}};if(v==='X'||v==='No cumple'||v==='Positivo'||v==='Abierto'||v==='Con hallazgos'||v==='MALO'||v==='NO TIENE'||v==='NO SE LEE'||v==='NO TIENE ETIQUETA'){f.color={argb:C.bad};f.bold=true}else if(v==='✓'||v==='Cumple'||v==='Negativo'||v==='Cerrado'||v==='Sin hallazgos'||v==='BUENO'){f.color={argb:C.ok};f.bold=true}if(typeof v==='number'&&v<0){f.color={argb:C.bad};f.bold=true}x.font=f;
   x.alignment={vertical:'middle',horizontal:numCol[i]?'right':(v instanceof Date||raw.length<=3?'center':'left'),wrapText:true,indent:numCol[i]?0:0};
   x.fill={type:'pattern',pattern:'solid',fgColor:{argb:ri%2?C.z2:C.z1}};x.border={top:thin,bottom:thin,left:thin,right:thin}});row.height=Math.max(28,lines*14+8)});
  // fotos: enlace de descarga · firma: imagen dentro de la celda
  const allF=[...new Set(metas.flatMap(m=>m&&m.fotos?m.fotos.slice(0,nF):[]))],links=await longLinks(allF);
  for(let ri=0;ri<rows.length;ri++){const m=metas[ri];if(!m)continue;const row=ws.getRow(7+ri);
   (m.fotos||[]).slice(0,nF).forEach((pth,j)=>{const x=row.getCell(cols.indexOf('Foto '+(j+1))+1);const u=links[pth];x.value=u?{text:'Ver foto '+(j+1),hyperlink:u,tooltip:'Abrir o descargar la fotografía'}:(navigator.onLine?'No disponible':'Sin conexión');x.font={name:'Calibri',size:10,bold:true,underline:!!u,color:{argb:u?'FF1F5FBF':C.bad}};x.alignment={horizontal:'center',vertical:'middle'}});
   for(const fs of (m.firmas||[])){const fIdx=cols.indexOf(fs.col);if(fIdx<0)continue;const x=row.getCell(fIdx+1);if(fs.id){const im=await sigImg(fs.id);if(im){x.value='';const id=wb.addImage({base64:im.du,extension:'png'});const h=40,w=Math.min(140,Math.round(h*im.w/im.h));ws.addImage(id,{tl:{col:fIdx+0.08,row:6+ri+0.1},ext:{width:w,height:h},editAs:'oneCell'});row.height=Math.max(row.height||28,36)}else x.value='Firmado'}else if(m.needSig){x.value='Sin firma';x.font={name:'Calibri',size:10,italic:true,color:{argb:C.bad}};x.alignment={horizontal:'center',vertical:'middle'}}}}
  if(rows0.length)ws.autoFilter={from:{row:6,column:1},to:{row:6,column:last}};
  ws.pageSetup.printTitlesRow='1:6';
  ws.headerFooter.oddFooter='&L&8'+String(cfg.empresa||"Cordon's Heavy Equipment").replace(/&/g,'&&')+' · SISO&R&8Página &P de &N';
 }
 const buf=await wb.xlsx.writeBuffer();
 await saveFile(name+'.xlsx',new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));toast('Excel listo')}


function invRows(c){return Object.values(stockMap(c)).map(v=>({'Artículo':v.cat?v.cat.nombre:v.name,'Existencia inicial':v.ini,'Entradas':v.e,'Salidas':v.s,'Existencia real':v.ex,'Mínimo':v.cat?+v.cat.minimo||0:'',...(c==='catbot'?{'Vencimiento':v.cat&&v.cat.vence||''}:{})}))}
/* ---------- autollenado desde la base de datos (personal y equipos) ---------- */
const findPer=n=>{const k=norm(n);return k?R('personal').find(p=>norm(p.nombre)===k):null};
const findEq=v=>{const k=String(v||'').trim().toUpperCase();return k?R('equipos').find(e=>String(e.inv||'').toUpperCase()===k):null};
const perOfEq=e=>e?(R('personal').find(p=>p.unidad&&String(p.unidad).toUpperCase()===String(e.inv).toUpperCase()&&p.estado!=='Inactivo')||findPer(e.asignado)):null;
function fillF(k,v,force){const el=$('#f_'+k);if(!el||v==null||v==='')return false;if(el.value&&!el.dataset.auto&&!force)return false;if(el.value===String(v))return false;el.value=v;el.dataset.auto='1';el.classList.add('autof');setTimeout(()=>el.classList.remove('autof'),1200);return true}
function licOk(p){return !!(p&&p.lic&&p.lic!=='No tiene'&&p.lvence&&p.lvence>=today())}
function markLic(p){const s=document.querySelector('#modal .seg[data-it="Licencia de conducir vigente"]');if(!s||!p)return;const v=licOk(p)?'C':'N';for(const b of s.children)b.className=b.dataset.v===v?v:'';if(v==='N')toast('Atención: '+p.nombre+' no tiene licencia vigente registrada')}
function eqInfo(e){const pl=$('#f_placa');if(pl&&e){const am=e.tipo!=='Pick-up'&&!LIGEROS.includes(e.tipo);pl.placeholder=am?'No aplica (equipo amarillo)':'';pl.disabled=am;if(am)pl.value=''}const el=$('#eqinfo');if(!el)return;el.textContent=e?[e.tipo,[e.marca,e.modelo].filter(Boolean).join(' '),e.placa&&'Placa '+e.placa].filter(Boolean).join(' · '):''}
function autoFill(t,src){if(!cur)return;const k=t.id.slice(2);const f=M[cur.k].f.find(x=>x.k===k);if(!f)return;
 if(f.t==='eq'){const e=findEq(t.value);eqInfo(e);if(!e)return;fillF('marca',e.marca);fillF('modelo',e.modelo);fillF('placa',e.placa);fillF('tipoeq',e.tipo);
  const p=perOfEq(e);if(p){for(const pk of ['conductor','participante','persona'])if(M[cur.k].f.some(x=>x.k===pk)){fillF(pk,p.nombre);break}fillF('cargo',p.cargo);if(cur.k==='insp')setTimeout(()=>markLic(p),0)}}
 if(f.t==='per'){const p=findPer(t.value);if(!p)return;if(t.value!==p.nombre)t.value=p.nombre;fillF('cargo',p.cargo);const sx={n1:'1',n2:'2',nT:'T'}[k];if(sx){fillF('c'+sx,p.cargo);fillF('i'+sx,p.identidad);return}
  if(p.unidad){const e=findEq(p.unidad);if(e&&M[cur.k].f.some(x=>x.k==='equipo')&&fillF('equipo',e.inv)){eqInfo(e);fillF('marca',e.marca);fillF('modelo',e.modelo);fillF('placa',e.placa);const eq=$('#f_equipo');if(eq&&cur.k==='insp')eq.dispatchEvent(new Event('change'))}}
  if(cur.k==='insp')setTimeout(()=>markLic(p),0)}}
document.addEventListener('change',e=>{const t=e.target;if(t.id&&t.id.startsWith('f_')&&t.closest('#modal'))autoFill(t,'change')});
document.addEventListener('input',e=>{const t=e.target;if(!t.id||!t.id.startsWith('f_')||!t.closest('#modal'))return;if(t.dataset)delete t.dataset.auto;const k=t.id.slice(2),f=cur&&M[cur.k].f.find(x=>x.k===k);if(f&&((f.t==='eq'&&findEq(t.value))||(f.t==='per'&&findPer(t.value)&&R('personal').some(p=>p.nombre===t.value))))autoFill(t,'input')});
/* una sola vez: separar marca del modelo y enlazar personal con su unidad */
let migrated=false;
async function migrar(){if(migrated||!ready||!navigator.onLine||!R('equipos').length)return;migrated=true;
 for(const e of R('equipos')){if('marca' in e)continue;const m=String(e.modelo||'').match(/^(CAT|CATERPILLAR|VOLVO|MACK|FOTON|BOMAG|JOHN DEERE|KOMATSU|HINO|ISUZU|TOYOTA|NISSAN|INTERNATIONAL|FREIGHTLINER|KENWORTH)\b\s*(.*)$/i);
  const {id,...d}=e;d.marca=m?(m[1].toUpperCase()==='CAT'?'Caterpillar':m[1][0].toUpperCase()+m[1].slice(1).toLowerCase()):'';if(m)d.modelo=m[2]||e.modelo;await save('equipos',id,d)}
 /* suc migr */for(const x of R('sucesos')){const fx={Leve:'Leves',Medio:'Medios'};if(Array.isArray(x.causas)&&!fx[x.danoP]&&!fx[x.danoM])continue;const {id,...d}=x;if(!Array.isArray(d.causas))d.causas=d.causa?[d.causa]:[];if(fx[d.danoP])d.danoP=fx[d.danoP];if(fx[d.danoM])d.danoM=fx[d.danoM];if(!d.fechaRep)d.fechaRep=d.fecha||'';if(d.clima==='Nublado')d.clima='';await save('sucesos',id,d)}
 /* ext migr */for(const x of R('extintores')){const it=x.items||{};if(!('Boquilla / manguera' in it)&&!('Cilindro' in it)&&!('Arnés o base' in it))continue;const n={...it};if('Boquilla / manguera' in n){n['Boquilla']=n['Boquilla']||n['Boquilla / manguera'];n['Manguera / boquilla']=n['Manguera / boquilla']||n['Boquilla / manguera'];delete n['Boquilla / manguera']}if('Cilindro' in n){n['Estado del cilindro']=n['Cilindro'];delete n['Cilindro']}if('Arnés o base' in n){n['Arnés o base del extintor']=n['Arnés o base'];delete n['Arnés o base']}const {id,...d}=x;d.items=n;const eq=findEq(x.equipo)||{};if(!d.tipoeq)d.tipoeq=eq.tipo||'';if(!d.etq)d.etq=(!x.recarga&&/ilegible/i.test(x.obs||''))?'No se lee':'Legible';await save('extintores',id,d)}
 for(const e of R('equipos')){if(!e.asignado)continue;const p=findPer(e.asignado);if(p&&!p.unidad){const {id,...d}=p;d.unidad=e.inv;await save('personal',id,d)}}}

/* ---------- control de riesgo: actividades del mes contra la meta ---------- */
const LIGEROS=['Pick-up','Cabezal','Volqueta','Camión','Tanque de agua','Low boy'];
const eqTipo=inv=>{const e=findEq(inv);return e?e.tipo:(/^PS/i.test(inv||'')?'Pick-up':'')};
const CTL=[
 {k:'sol',n:'SOL programado',obj:4,anual:36,c:(r,m)=>R('sol').filter(x=>m(x.fecha)).length,go:'sol'},
 {k:'audem',n:'Auditoría de equipo móvil',obj:30,anual:132,c:(r,m)=>R('insp').filter(x=>m(x.fecha)&&LIGEROS.includes(eqTipo(x.equipo))).length,go:'insp'},
 {k:'audep',n:'Auditoría equipo pesado',obj:0,anual:0,c:(r,m)=>R('insp').filter(x=>m(x.fecha)&&!LIGEROS.includes(eqTipo(x.equipo))).length,go:'insp'},
 {k:'audepp',n:'Auditoría de EPP programadas',obj:20,anual:180,c:(r,m)=>R('audepp').filter(x=>m(x.fecha)).length,go:'audepp'},
 {k:'alcohol',n:'Pruebas de alcoholemia programadas',obj:10,anual:90,c:(r,m)=>R('alcohol').filter(x=>m(x.fecha)).length,go:'alcohol'},
 {k:'ext',n:'Inspección de extintores',obj:1,anual:9,c:(r,m)=>new Set(R('extintores').filter(x=>m(x.fecha)).map(x=>x.fecha)).size,go:'extintores'},
 {k:'escr',n:'Inspección de escritorios',obj:10,anual:90,c:(r,m)=>R('inspareas').filter(x=>m(x.fecha)&&x.tipo==='Escritorios / oficinas').length,go:'inspareas'},
 {k:'apto',n:'Inspección de apartamentos',obj:1,anual:9,c:(r,m)=>R('inspareas').filter(x=>m(x.fecha)&&x.tipo==='Apartamentos del personal').length,go:'inspareas'},
 {k:'senv',n:'Inspecciones de señalización vial',obj:30,anual:270,c:(r,m)=>R('inspareas').filter(x=>m(x.fecha)&&x.tipo==='Señalización vial en frente de trabajo').length+R('despliegue').filter(x=>m(x.fecha)).length,go:'despliegue'},
 {k:'taller',n:'Inspecciones en taller',obj:30,anual:270,c:(r,m)=>R('inspareas').filter(x=>m(x.fecha)&&x.tipo==='Taller').length,go:'inspareas'},
 {k:'reun',n:'Reuniones programadas',obj:4,anual:36,c:(r,m)=>R('reuniones').filter(x=>m(x.fecha)).length,go:'reuniones'},
 {k:'charlas',n:'Charlas de seguridad impartidas',obj:12,anual:108,c:(r,m)=>R('charlas').filter(x=>m(x.fecha)&&x.estado==='Impartida').length,go:'charlas'}];
const MESC=['Ene.','Feb.','Mar.','Abr.','May.','Jun.','Jul.','Ago.','Sep.','Oct.','Nov.','Dic.'];
const meta=a=>{const m=(cfg.metas||{})[a.k]||{};return{obj:m.obj!=null&&m.obj!==''?+m.obj:a.obj,anual:m.anual!=null&&m.anual!==''?+m.anual:a.anual,off:!!m.off}};
let ctlYear=today().slice(0,4);
const iniYM=()=>String(cfg.inicio||'').slice(0,7);
function objFor(a,ym){const mt=meta(a);if(!mt.obj)return 0;if(cfg.inicio&&iniYM()===ym){const d=pd(cfg.inicio),dim=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();return Math.max(1,Math.round(mt.obj*(dim-d.getDate()+1)/dim))}return mt.obj}
function ctlData(y){const t=today();return CTL.filter(a=>!meta(a).off).map(a=>{const mt=meta(a),months=MESC.map((_,i)=>{const ym=y+'-'+pad(i+1);return ym>t.slice(0,7)||(iniYM()&&ym<iniYM())?null:a.c(null,f=>String(f||'').startsWith(ym))});const tot=months.reduce((s,v)=>s+(v||0),0);return{a,mt,months,tot,pct:mt.anual?Math.round(tot/mt.anual*100):null}})}
function pace(){const t=today(),d=pd(t),dim=new Date(d.getFullYear(),d.getMonth()+1,0).getDate(),ym=t.slice(0,7),d0=cfg.inicio&&iniYM()===ym?pd(cfg.inicio).getDate():1,f=Math.min(1,(d.getDate()-d0+1)/(dim-d0+1));
 return CTL.filter(a=>!meta(a).off&&meta(a).obj>0).map(a=>{const o=objFor(a,ym),v=a.c(null,x=>String(x||'').startsWith(ym)),exp=o*f;return{a,v,obj:o,exp,st:v>=o?'ok':v>=exp-0.5?'on':'late'}})}
function vCtl(){const y=+ctlYear,rows=ctlData(y),cm=today().slice(0,7),ci=+cm.slice(5)-1,isCur=String(y)===cm.slice(0,4);
 const cell=(v,i,mt,a)=>{if(v==null)return'<td class="n fut"></td>';const o=objFor(a,y+'-'+pad(i+1));const cls=!o?'':v>=o?'ok':(isCur&&i===ci)?'run':v>0?'warn':'bad';return`<td class="n m ${cls}">${v}</td>`};
 const p=isCur?pace():[];const ok=p.filter(x=>x.st!=='late').length;
 return `<div class="sh"><h2>Control de riesgo ${y}</h2><div class="tools" style="margin:0"><button class="btn sm" data-act="cy:-1" aria-label="Año anterior">‹</button><button class="btn sm" data-act="cy:1" aria-label="Año siguiente">›</button><button class="btn sm" data-act="metas">Metas</button><button class="btn sm pri" data-act="xctl">Excel</button></div></div>
 ${isCur?`<p class="note">${MES[ci][0].toUpperCase()+MES[ci].slice(1)}: <b>${ok} de ${p.length}</b> actividades van al día con su meta mensual${cfg.inicio&&iniYM()===cm?' (mes parcial desde el '+fdmy(cfg.inicio)+': la meta se ajusta a los días trabajados)':''}. Verde: meta cumplida · naranja: en curso · rojo: el mes cerró por debajo de la meta.</p>`:''}
 <div class="card scroll"><table class="ctl"><thead><tr><th>No.</th><th>Actividades</th>${MESC.map((m,i)=>`<th class="n ${isCur&&i===ci?'cur':''}">${m}</th>`).join('')}<th class="n">Obj. mensual</th><th class="n">Meta anual</th><th class="n">Real acum.</th><th class="n">% acum.</th></tr></thead><tbody>
 ${rows.map((r,i)=>`<tr class="click" data-act="goto:${r.a.go}" tabindex="0"><td class="n">${i+1}</td><td class="act">${esc(r.a.n)}</td>${r.months.map((v,j)=>cell(v,j,r.mt,r.a)).join('')}<td class="n">${r.mt.obj||'—'}</td><td class="n">${r.mt.anual||'—'}</td><td class="n"><b>${r.tot}</b></td><td class="n pct">${r.pct==null?'—':r.pct+'%'}</td></tr>`).join('')}</tbody></table></div>
 ${isCur?`<section><div class="sh"><h3>Avance de ${MES[ci]}</h3><small>Meta proporcional al día ${pd(today()).getDate()}</small></div><div class="card">${p.map(x=>`<div class="row click" data-act="new:${x.a.go}" tabindex="0"><div class="tx"><b>${esc(x.a.n)}</b><div class="bar" style="margin-top:6px"><i style="width:${Math.min(100,Math.round(x.v/x.obj*100))}%;background:${x.st==='late'?'var(--bad)':x.st==='on'?'var(--or)':'var(--ok)'}"></i></div></div><span class="tag ${x.st==='late'?'bad':x.st==='ok'?'ok':'or'}">${x.v} / ${x.obj}</span></div>`).join('')}</div><p class="hint">Toca una actividad para registrarla.</p></section>`:''}`}
function ctlRows(){const y=+ctlYear;return ctlData(y).map((r,i)=>{const o={'No.':i+1,'Actividades':r.a.n};MESC.forEach((m,j)=>o[m]=r.months[j]==null?'':r.months[j]);o['Obj. mensual']=r.mt.obj||'';o['Meta anual']=r.mt.anual||'';o['Real acumulado']=r.tot;o['% acumulado']=r.pct==null?'':r.pct+'%';return o})}
function metasForm(){$('#sheet').innerHTML=`<div class="hd"><h3>Metas del control de riesgo</h3><button class="btn sm dk" data-act="close" aria-label="Cerrar">✕</button></div><div class="bd"><p class="hint" style="margin:0 0 12px">Objetivo mensual y meta anual de cada actividad. Desmarca las que no apliquen al proyecto.</p>
 ${CTL.map(a=>{const mt=meta(a);return`<div class="li-row nv" style="grid-template-columns:minmax(0,1fr) 70px 80px 44px;align-items:center"><span>${esc(a.n)}</span><input class="mt-o" data-k="${a.k}" type="number" inputmode="numeric" value="${mt.obj||''}" aria-label="Objetivo mensual de ${esc(a.n)}" placeholder="Mes"><input class="mt-a" data-k="${a.k}" type="number" inputmode="numeric" value="${mt.anual||''}" aria-label="Meta anual de ${esc(a.n)}" placeholder="Año"><input class="mt-on" data-k="${a.k}" type="checkbox" ${mt.off?'':'checked'} aria-label="Incluir ${esc(a.n)}" style="min-height:24px"></div>`}).join('')}
 <div class="li-h nv" style="grid-template-columns:minmax(0,1fr) 70px 80px 44px"><span></span><span>Mensual</span><span>Anual</span><span>Usar</span></div></div><div class="ft"><button class="btn pri" data-act="metasave">Guardar metas</button></div>`;$('#modal').classList.add('on')}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a.startsWith('cy:')){ctlYear=String(+ctlYear+(+a.slice(3)));render()}
 if(a==='metas')metasForm();
 if(a==='metasave'){const mt={};for(const x of CTL){mt[x.k]={obj:$(`.mt-o[data-k="${x.k}"]`).value,anual:$(`.mt-a[data-k="${x.k}"]`).value,off:!$(`.mt-on[data-k="${x.k}"]`).checked}}await save('config','proyecto',{...cfg,metas:mt});toast('Metas guardadas');closeM()}
 if(a==='xctl')exportX('Control de riesgo '+ctlYear,[['Control de riesgo '+ctlYear,ctlRows(),'Control de riesgo '+ctlYear]]);
});

/* ---------- despliegue diario de señalización ---------- */
function lastDep(){return R('despliegue').slice().sort((a,b)=>String(b.fecha||'').localeCompare(String(a.fecha||''))||String(b.creado||'').localeCompare(String(a.creado||'')))[0]||null}
function depOf(name){const d=lastDep();if(!d)return null;const its=eitems(d).filter(i=>norm(i.art)===norm(name));return{uso:its.reduce((a,i)=>a+(+i.cant||0),0),est:its.map(i=>(i.cant>1?i.cant+'× ':'')+(i.est||'¿?')).join(', '),fecha:d.fecha,frente:d.frente||''}}
const usoOf=r=>{const d=depOf(r.senal);return d?d.uso:(+r.uso||0)};
function senHist(name){return R('despliegue').filter(d=>eitems(d).some(i=>norm(i.art)===norm(name))).sort((a,b)=>String(b.fecha).localeCompare(String(a.fecha))).slice(0,15).map(d=>{const its=eitems(d).filter(i=>norm(i.art)===norm(name));return{d,cant:its.reduce((a,i)=>a+(+i.cant||0),0),est:its.map(i=>i.est).filter(Boolean).join(', ')}})}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;
 if(b.dataset.act==='duplast'){const d=lastDep();if(!d){openForm('despliegue');return}const {id,creado,firma,firmaFecha,comprobante,...c}=d;c.fecha=today();c.fotos=[];c.obs='';openForm('despliegue',null,c);toast('Copia del despliegue del '+fdmy(d.fecha)+': cambia solo lo que se movió')}});
/* ---------- marca de agua en las fotos ---------- */
const DIAC=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const WMO={0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',45:'Niebla',48:'Niebla',51:'Llovizna ligera',53:'Llovizna',55:'Llovizna intensa',61:'Lluvias ligeras',63:'Lluvia moderada',65:'Lluvia fuerte',66:'Lluvia helada',67:'Lluvia helada',80:'Chubascos ligeros',81:'Chubascos',82:'Chubascos fuertes',95:'Tormenta eléctrica',96:'Tormenta con granizo',99:'Tormenta con granizo'};
async function exifOf(file){try{if(!/jpe?g/i.test(file.type||'')&&!/\.jpe?g$/i.test(file.name||''))return{};const buf=await file.slice(0,262144).arrayBuffer(),v=new DataView(buf);if(v.getUint16(0)!==0xFFD8)return{};let o=2;
 while(o<v.byteLength-10){const m=v.getUint16(o),len=v.getUint16(o+2);if(m===0xFFE1&&v.getUint32(o+4)===0x45786966)return tiff(v,o+10);if((m&0xFF00)!==0xFF00)break;o+=2+len}return{}}catch(e){return{}}}
function tiff(v,t){const le=v.getUint16(t)===0x4949,u16=p=>v.getUint16(p,le),u32=p=>v.getUint32(p,le),res={};
 const ifd=(off,cb)=>{const n=u16(t+off);for(let i=0;i<n;i++){const e=t+off+2+i*12;cb(u16(e),u32(e+4),e+8)}};
 const str=(p,c)=>{let s='';for(let i=0;i<c-1;i++)s+=String.fromCharCode(v.getUint8(p+i));return s},rat=p=>u32(p)/(u32(p+4)||1);
 let ex=0,gp=0;ifd(u32(t+4),(tag,cnt,vp)=>{if(tag===0x8769)ex=u32(vp);if(tag===0x8825)gp=u32(vp);if(tag===0x0132)res.dt=str(t+u32(vp),cnt)});
 if(ex)ifd(ex,(tag,cnt,vp)=>{if(tag===0x9003)res.dt=str(t+u32(vp),cnt)});
 if(gp){const g={};ifd(gp,(tag,cnt,vp)=>{if(tag===1||tag===3)g[tag]=String.fromCharCode(v.getUint8(vp));if(tag===2||tag===4){const p=t+u32(vp);g[tag]=rat(p)+rat(p+8)/60+rat(p+16)/3600}});if(g[2]&&g[4]){res.lat=g[2]*(g[1]==='S'?-1:1);res.lon=g[4]*(g[3]==='W'?-1:1)}}
 const m=String(res.dt||'').match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2})/);if(m)res.date=new Date(+m[1],m[2]-1,+m[3],+m[4],+m[5]);return res}
const tfetch=(u,ms=6000)=>{const c=new AbortController();const t=setTimeout(()=>c.abort(),ms);return fetch(u,{signal:c.signal}).then(r=>r.ok?r.json():null).catch(()=>null).finally(()=>clearTimeout(t))};
let geoC=null,envC={};
function here(){return new Promise(ok=>{if(!navigator.geolocation)return ok(null);const tt=setTimeout(()=>ok(geoC||null),10000);const ok0=ok;ok=v=>{clearTimeout(tt);ok0(v)};if(geoC&&Date.now()-geoC.t<120000)return ok(geoC);navigator.geolocation.getCurrentPosition(p=>{geoC={lat:p.coords.latitude,lon:p.coords.longitude,t:Date.now()};ok(geoC)},()=>ok(null),{enableHighAccuracy:true,timeout:9000,maximumAge:120000})})}
async function envAt(lat,lon,live){const key=lat.toFixed(3)+','+lon.toFixed(3)+(live?'L':'');if(envC[key]&&Date.now()-envC[key].t<600000)return envC[key];const out={t:Date.now()};if(!navigator.onLine)return out;
 const [pl,wx]=await Promise.all([tfetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`),live?tfetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`):null]);
 if(pl){const a=pl.locality||pl.city||'',b=String(pl.principalSubdivision||'').replace(/^Departamento de /i,'');out.lugar=[a,b].filter(Boolean).filter((x,i,arr)=>arr.indexOf(x)===i).join(', ')}
 if(wx&&wx.current){const c=wx.current;out.clima=(WMO[c.weather_code]||'')+(c.temperature_2m!=null?' '+Math.round(c.temperature_2m)+'°C':'')+(c.wind_speed_10m!=null?' · Viento '+Math.round(c.wind_speed_10m)+' km/h':'')}
 envC[key]=out;return out}
function contexto(){if(!cur)return'';const g=k=>{const e=$('#f_'+k);return e&&e.value?e.value.trim():''};const m=M[cur.k];
 const qui=g('equipo')||g('persona')||g('involucrado')||g('conductor')||g('tema')||(g('sol')||'').replace(/ · .*/,'')||g('tipo');
 const est=g('desde')&&g('hasta')?'Est. '+g('desde')+' a '+g('hasta'):g('lugar')||g('frente')||g('sitio');
 return [m.s,qui,est].filter(Boolean).join(' · ')}
async function stampCtx(file){if(cfg.marca===false)return null;const ex=await exifOf(file);const now=Date.now();
 let date=ex.date||null,src='exif';if(!date){date=new Date(file.lastModified||now);src=now-(file.lastModified||now)<900000?'now':'file'}
 const live=Math.abs(now-date.getTime())<900000;let pos=(ex.lat!=null)?{lat:ex.lat,lon:ex.lon}:null;if(!pos&&live)pos=await here();
 const env=pos?await envAt(pos.lat,pos.lon,live):{};return{date,src,pos,env,ctx:contexto(),live}}
async function stamp(c,st){const x=c.getContext('2d'),W=c.width,H=c.height,u=Math.max(12,Math.round(Math.min(W,H)*0.034)),pad=Math.round(u*0.9);
 const d=st.date,mo=MES[d.getMonth()].slice(0,3);
 const L=[DIAC[d.getDay()]+', '+d.getDate()+' de '+mo+' '+d.getFullYear()+' '+pad2(d.getHours())+':'+pad2(d.getMinutes())+(st.src==='file'&&!st.live?' (fecha del archivo)':'')];
 if(st.env.clima)L.push(st.env.clima);if(st.env.lugar)L.push(st.env.lugar);
 if(st.pos)L.push(Math.abs(st.pos.lat).toFixed(6)+'°'+(st.pos.lat>=0?'N':'S')+', '+Math.abs(st.pos.lon).toFixed(6)+'°'+(st.pos.lon>=0?'E':'W'));
 if(st.ctx)L.push(st.ctx);L.push('Proyecto '+(cfg.proyecto||'Yorito – Empalme RN-23'));
 const lh=Math.round(u*1.32),logo=await loadLogo().catch(()=>null);let lw=0,lhh=0,li=null;
 if(logo){li=await new Promise(ok=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=logo.du});if(li){lw=Math.round(Math.min(W*0.42,u*17));lhh=Math.round(lw*li.naturalHeight/li.naturalWidth)}}
 const blockH=(li?lhh+Math.round(u*0.6):0)+L.length*lh+pad;const y0=H-blockH-pad;
 const gr=x.createLinearGradient(0,y0-u*2,0,H);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(.35,'rgba(0,0,0,.35)');gr.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=gr;x.fillRect(0,y0-u*2,W,H-y0+u*2);
 let y=y0;if(li){x.drawImage(li,pad,y,lw,lhh);y+=lhh+Math.round(u*0.6)}
 x.fillStyle='rgba(255,255,255,.85)';x.fillRect(pad,y,Math.max(2,Math.round(u*0.12)),L.length*lh-Math.round(u*0.2));
 x.font=`600 ${u}px "Barlow Condensed",Barlow,Arial,sans-serif`;x.textBaseline='top';x.shadowColor='rgba(0,0,0,.8)';x.shadowBlur=Math.round(u*0.25);x.shadowOffsetX=1;x.shadowOffsetY=1;
 for(const t of L){x.fillStyle='#fff';let s=t;while(x.measureText(s).width>W-pad*3.5&&s.length>8)s=s.slice(0,-2);if(s!==t)s=s.slice(0,-1)+'…';x.fillText(s,pad+Math.round(u*0.6),y);y+=lh}
 x.shadowColor='transparent';
 x.font=`600 ${Math.round(u*0.55)}px Barlow,Arial,sans-serif`;x.fillStyle='rgba(255,255,255,.75)';x.textAlign='right';x.fillText('SISO · '+(cfg.empresa||"Cordon's Heavy Equipment"),W-pad,H-pad-Math.round(u*0.6));x.textAlign='left'}
const pad2=n=>String(n).padStart(2,'0');

/* ---------- fotos: ver, descargar y compartir (con marca de agua) ---------- */
const phBlob={};
function getPh(id){return phBlob[id]||(phBlob[id]=fileBlob(id).catch(e=>{delete phBlob[id];throw e}))}
const quien=(k,r)=>r.equipo||r.persona||r.involucrado||r.tema||r.frente||(r.sol||'').replace(/ · .*/,'')||r.tipo||r.senal||'';
const phName=(k,r,i)=>(fdmy(r.fecha||today())+' '+M[k].s+(quien(k,r)?' - '+quien(k,r):'')+' ('+(i+1)+').jpg').replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,' ');
async function shareFiles(files,title){
 if(navigator.canShare&&navigator.canShare({files})){try{await navigator.share({files});return true}catch(e){if(e&&e.name==='AbortError')return true}}
 for(const f of files){await saveFile(f.name,f);await new Promise(r=>setTimeout(r,350))}toast(files.length>1?files.length+' fotos descargadas':'Foto descargada');return true}
/* visor a pantalla completa */
let vw=null;
function viewer(k,r,i){const id=(r.fotos||[])[i];if(!id)return;getPh(id).catch(()=>{});
 if(!vw){vw=document.createElement('div');vw.id='viewer';document.body.appendChild(vw)}
 const n=(r.fotos||[]).length;
 vw.innerHTML=`<div class="vw-top"><span>${esc(M[k].s)} · ${fdmy(r.fecha)} · ${i+1} de ${n}</span><button class="btn sm dk" data-act="vwclose" aria-label="Cerrar">✕</button></div>
 <div class="vw-img"><img data-sid="${esc(id)}" alt="Foto ${i+1}"></div>
 <div class="vw-bar">${n>1?`<button class="btn" data-act="vwgo:${i-1}" ${i?'':'disabled'} aria-label="Foto anterior">‹</button>`:''}<button class="btn pri" data-act="vwshare">Compartir</button><button class="btn" data-act="vwdl">Descargar</button>${n>1?`<button class="btn" data-act="vwgo:${i+1}" ${i<n-1?'':'disabled'} aria-label="Foto siguiente">›</button>`:''}</div>`;
 vw.dataset.k=k;vw.dataset.i=i;vw._r=r;vw.classList.add('on')}
/* galería del día */
let galDate=today(),galMod='',sel=new Set();
function galItems(){const out=[];for(const k of ORDER){if(galMod&&k!==galMod)continue;for(const r of R(k))if(r.fecha===galDate&&(r.fotos||[]).length)out.push({k,r})}return out.sort((a,b)=>String(a.r.creado||'').localeCompare(String(b.r.creado||'')))}
function vFotos(){const it=galItems(),all=it.flatMap(x=>x.r.fotos.map((id,i)=>({...x,id,i}))),ns=[...sel].filter(id=>all.some(a=>a.id===id)).length;
 const mods=[...new Set(ORDER.filter(k=>R(k).some(r=>r.fecha===galDate&&(r.fotos||[]).length)))];
 return `<div class="sh"><h2>Fotos del día</h2><a href="#registros">Registros</a></div>
 <div class="tools"><input id="galdate" type="date" value="${galDate}" aria-label="Fecha"><select id="galmod" aria-label="Formato"><option value="">Todos los formatos</option>${mods.map(k=>`<option value="${k}" ${k===galMod?'selected':''}>${esc(M[k].n)}</option>`).join('')}</select></div>
 ${all.length?`<div class="tools"><button class="btn" data-act="galall">${ns===all.length?'Quitar selección':'Seleccionar todas'}</button><button class="btn pri" data-act="galshare" ${ns?'':'disabled'}>Compartir (${ns})</button><button class="btn" data-act="galdl" ${ns?'':'disabled'}>Descargar (${ns})</button></div>
 ${it.map(x=>`<section style="margin:16px 0"><h3 style="margin-bottom:6px">${esc(M[x.k].s)}${quien(x.k,x.r)?' · '+esc(quien(x.k,x.r)):''}</h3><div class="gal">${x.r.fotos.map((id,i)=>`<div class="gph ${sel.has(id)?'sel':''}"><img data-sid="${esc(id)}" alt="Foto ${i+1}" data-act="galview:${x.k}:${esc(x.r.id)}:${i}" role="button" tabindex="0"><button class="ck" data-act="galtog:${esc(id)}" aria-pressed="${sel.has(id)}" aria-label="Seleccionar foto ${i+1}">✓</button></div>`).join('')}</div></section>`).join('')}`
 :`<p class="empty card">No hay fotos registradas el ${fdmy(galDate)}.</p>`}
 <p class="hint">Toca una foto para verla, descargarla o compartirla. Marca varias con ✓ para mandarlas juntas. Las fotos se descargan y comparten tal como se guardaron, con su marca de agua. En el celular, “Compartir” abre WhatsApp y las demás apps.</p>`}
async function filesOf(ids){const all=galItems().flatMap(x=>x.r.fotos.map((id,i)=>({...x,id,i})));const out=[];for(const id of ids){const a=all.find(x=>x.id===id);try{const b=await getPh(id);out.push(new File([b],a?phName(a.k,a.r,a.i):'foto.jpg',{type:b.type||'image/jpeg'}))}catch(e){}}return out}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a.startsWith('viewph:')&&cur){let cv={};try{cv=collect()}catch(e){}viewer(cur.k,{...cur.r,...cv,fotos:cur.fotos,fecha:cv.fecha||cur.r.fecha||today()},+a.slice(7));return}
 if(a==='vwclose'){vw.classList.remove('on');vw.innerHTML='';return}
 if(a.startsWith('vwgo:')){viewer(vw.dataset.k,vw._r,+a.slice(5));return}
 if(a==='vwshare'||a==='vwdl'){const k=vw.dataset.k,i=+vw.dataset.i,r=vw._r,id=r.fotos[i];b.disabled=true;try{const bl=await getPh(id);const f=new File([bl],phName(k,r,i),{type:bl.type||'image/jpeg'});if(a==='vwshare')await shareFiles([f],M[k].s+' '+fdmy(r.fecha));else{await saveFile(f.name,f);toast('Foto descargada')}}catch(e){toast('No se pudo obtener la foto (revisa la señal)')}b.disabled=false;return}
 if(a.startsWith('galtog:')){const id=a.slice(7);if(sel.has(id))sel.delete(id);else{sel.add(id);getPh(id).catch(()=>{})}render();return}
 if(a==='galall'){const all=galItems().flatMap(x=>x.r.fotos);const ns=[...sel].filter(id=>all.includes(id)).length;if(ns===all.length)sel.clear();else for(const id of all){sel.add(id);getPh(id).catch(()=>{})}render();return}
 if(a.startsWith('galview:')){const [,k,id,i]=a.split(':');const r=R(k).find(x=>x.id===id);if(r)viewer(k,r,+i||0);return}
 if(a==='galshare'||a==='galdl'){const all=galItems().flatMap(x=>x.r.fotos);const ids=[...sel].filter(id=>all.includes(id));if(!ids.length)return;b.disabled=true;b.textContent='Preparando…';
  const fs=await filesOf(ids);if(!fs.length){toast('No se pudieron obtener las fotos (revisa la señal)');render();return}
  if(a==='galshare')await shareFiles(fs,'Informe diario SISO '+fdmy(galDate)+' · '+(cfg.proyecto||''));else{for(const f of fs){await saveFile(f.name,f);await new Promise(r=>setTimeout(r,350))}toast(fs.length+' fotos descargadas')}
  render();return}
});
document.addEventListener('change',e=>{if(e.target.id==='galdate'){galDate=e.target.value||today();galMod='';render()}if(e.target.id==='galmod'){galMod=e.target.value;render()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&vw&&vw.classList.contains('on')){vw.classList.remove('on');vw.innerHTML=''}});

/* ---------- reporte de suceso: PDF compacto en una hoja carta ---------- */
async function pdfSuc(doc,r,T){const W=215.9,X=12,CW=W-2*X;let y=34;
 const lab=(t,x,yy)=>{doc.setFont('helvetica','normal');doc.setFontSize(6.8);doc.setTextColor(110);doc.text(T(t).toUpperCase(),x,yy)};
 const val=(t,x,yy,w,b)=>{doc.setFont('helvetica',b?'bold':'normal');doc.setFontSize(8.6);doc.setTextColor(20);const ln=doc.splitTextToSize(T(t||'—'),w);doc.text(ln.slice(0,2),x,yy);return ln.length};
 const bar=(t,yy)=>{doc.setFillColor(23,50,77);doc.rect(X,yy,CW,5.6,'F');doc.setFont('helvetica','bold');doc.setFontSize(8.5);doc.setTextColor(255);doc.text(T(t),X+2,yy+3.9);doc.setTextColor(20)};
 const e=findEq(r.equipo)||{};
 // evento
 lab('Evento',X,y);doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(20);const ev=doc.splitTextToSize(T(r.relato||'—'),CW);doc.text(ev.slice(0,2),X,y+5);y+=5+ev.slice(0,2).length*5+1;
 // datos en 4 columnas
 const D=[['Código',r.codigo],['Tipo',r.tipo],['Fecha',fdmy(r.fecha)],['Hora',r.hora],['Lugar / estación',r.lugar],['Clima',r.clima],['Afectado',r.afectado],['Equipo',[r.equipo,[e.marca,e.modelo].filter(Boolean).join(' ')].filter(Boolean).join(' · ')],['Causa',r.causa],['Factor',r.factor],['Clasificación',r.clasif],['Estado',r.estado],['Daño personal',r.danoP],['Daño material',r.danoM]];
 const cw=CW/4,ch=9.6;doc.setDrawColor(210);doc.setLineWidth(.2);
 D.forEach(([l,v],i)=>{const cx=X+(i%4)*cw,cy=y+Math.floor(i/4)*ch;doc.rect(cx,cy,cw,ch);lab(l,cx+1.6,cy+3.2);val(v,cx+1.6,cy+7,cw-3,l==='Estado'||l==='Código')});
 y+=Math.ceil(D.length/4)*ch;
 const inv=String(r.participante||'').split('\n').map(s=>s.trim()).filter(Boolean).join(', ');doc.rect(X,y,CW,ch);lab('Involucrados',X+1.6,y+3.2);val(inv,X+1.6,y+7,CW-3);y+=ch+3;
 // versiones con su firma
 const V=[['Versión del participante 1',r.n1,r.vPart,r.firma1,r.firma1Fecha],['Versión del participante 2',r.n2,r.vTest,r.firma2,r.firma2Fecha],['Versión técnica',r.nT,r.opinion,r.firmaT,r.firmaTFecha]].filter(v=>v[1]||v[2]||v[3]);
 const sigW=50,tw=CW-sigW-6;let fs=8.4,lh=3.5;
 const linesOf=v=>doc.splitTextToSize(T(v[2]||'Sin versión registrada'),tw);
 const est=()=>V.reduce((a,v)=>{doc.setFontSize(fs);return a+5.6+Math.max(26,linesOf(v).length*lh+4)+2},0);
 const resto=262-y-34-(r.fotos&&r.fotos.length?0:0);while(est()>resto&&fs>6.6){fs-=.4;lh=fs*0.42}
 for(const v of V){doc.setFontSize(fs);const ln=linesOf(v),h=Math.max(26,ln.length*lh+4);if(y+5.6+h>262){doc.addPage();y=16}
  bar(v[0]+(v[1]?'  ·  '+v[1]:''),y);y+=5.6;doc.setDrawColor(210);doc.rect(X,y,CW,h);
  doc.setFont('helvetica','normal');doc.setFontSize(fs);doc.setTextColor(20);doc.text(ln,X+2,y+lh+0.6);
  const sx=X+CW-sigW-2;doc.setDrawColor(225);doc.line(sx-2,y+1.5,sx-2,y+h-1.5);
  if(v[3]){try{const im=await imgOf(v[3]);const hh=Math.min(h-11,16),ww=Math.min(sigW-4,hh*im.w/im.h);doc.addImage(im.du,im.fmt,sx+(sigW-ww)/2,y+2,ww,Math.min(hh,ww*im.h/im.w))}catch(e){}}
  else{doc.setFont('helvetica','italic');doc.setFontSize(7.5);doc.setTextColor(200,35,27);doc.text('Sin firma',sx+sigW/2,y+h/2-2,{align:'center'});doc.setTextColor(20)}
  doc.setDrawColor(60);doc.setLineWidth(.3);doc.line(sx+2,y+h-7,sx+sigW-2,y+h-7);doc.setLineWidth(.2);doc.setFont('helvetica','bold');doc.setFontSize(7.2);doc.text(T(v[1]||'Firma'),sx+sigW/2,y+h-4,{align:'center',maxWidth:sigW-2});
  doc.setFont('helvetica','normal');doc.setFontSize(6.5);doc.setTextColor(110);doc.text(v[4]?'Firmó el '+fdmy(v[4]):'',sx+sigW/2,y+h-1.3,{align:'center'});doc.setTextColor(20);y+=h+2}
 // respuesta de gerencia
 if(y+30>262){doc.addPage();y=16}y+=1;bar('Respuesta de gerencia',y);y+=5.6;
 const pend=v=>!v||v==='Pendiente'||v==='Por definir';const G=[['Costo estimado',r.costo!==''&&r.costo!=null?'L '+Number(r.costo).toLocaleString('es-HN',{minimumFractionDigits:2}):'Pendiente'],['Cobro',pend(r.cobro)?'Pendiente':r.cobro],['Responsabilidad',pend(r.resp)?'Pendiente':r.resp]];
 const gw=CW/3;G.forEach(([l,v],i)=>{doc.setDrawColor(210);doc.rect(X+i*gw,y,gw,ch);lab(l,X+i*gw+1.6,y+3.2);val(v,X+i*gw+1.6,y+7,gw-3,v!=='Pendiente')});y+=ch;
 doc.setFontSize(8.4);const ac=doc.splitTextToSize(T(r.acciones||'Pendiente de respuesta de gerencia'),CW-4).slice(0,4);const ah=Math.max(ch,ac.length*3.5+5);doc.rect(X,y,CW,ah);lab('Acciones a tomar',X+1.6,y+3.2);doc.setFont('helvetica',r.acciones?'normal':'italic');doc.setFontSize(8.4);doc.setTextColor(r.acciones?20:110);doc.text(ac,X+1.6,y+7);doc.setTextColor(20);y+=ah+4;
 // elaborado por
 if(y+12<=262){doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(90);doc.text(T('Elaborado por: Ing. '+String(cfg.siso||'Fernando Domínguez').replace(/^ing\.?\s*/i,'')+' - Supervisor SISO'),X,y+3);doc.setDrawColor(60);doc.line(X+CW-60,y+3,X+CW,y+3);doc.text('Firma SISO',X+CW-30,y+7,{align:'center'});doc.setTextColor(20);y+=10}
 // fotos: miniaturas si cabe una fila; el resto en otra hoja
 const ph=r.fotos||[];if(ph.length){let i0=0;const tw4=(CW-9)/4;
  if(262-y>=40){doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text('Evidencia fotográfica ('+ph.length+')',X,y+2);y+=4;const hmax=262-y-1;
   for(;i0<Math.min(4,ph.length);i0++){try{const im=await imgOf(ph[i0]);let w=tw4,h=w*im.h/im.w;if(h>hmax){h=hmax;w=h*im.w/im.h}doc.addImage(im.du,im.fmt,X+i0*(tw4+3)+(tw4-w)/2,y,w,h)}catch(e){}}}
  if(i0<ph.length){doc.addPage();y=18;doc.setFont('helvetica','bold');doc.setFontSize(11);doc.text('Evidencia fotográfica',X,y);y+=6;const c2=(CW-6)/2;let col=0,rh=0;
   for(let i=i0;i<ph.length;i++){let im;try{im=await imgOf(ph[i])}catch(e){continue}let w=c2,h=w*im.h/im.w;if(h>80){h=80;w=h*im.w/im.h}if(col===0&&y+h>262){doc.addPage();y=18}doc.addImage(im.du,im.fmt,X+col*(c2+6)+(c2-w)/2,y,w,h);rh=Math.max(rh,h+5);if(col){y+=rh;rh=0;col=0}else col=1}}}}

/* ---------- firma a pantalla completa, en horizontal ---------- */
const SIGNAME={firma1:'n1',firma2:'n2',firmaT:'nT'};
function signerOf(k){const nk=SIGNAME[k];const g=id=>{const e=$('#f_'+id);return e&&e.value?e.value.trim():''};return (nk&&g(nk))||g('persona')||g('involucrado')||g('conductor')||''}
let spad=null;
async function openPad(k){const f=M[cur.k].f.find(x=>x.k===k);const who=signerOf(k);
 spad=document.createElement('div');spad.id='sigpad';spad.innerHTML=`<div class="sp-top"><div class="sp-t"><b>${esc(f?f.l:'Firma')}</b>${who?`<span>${esc(who)}</span>`:''}</div><button class="btn sm" data-act="padclear">Borrar</button><button class="btn sm" data-act="padcancel">Cancelar</button><button class="btn sm pri" data-act="padok">Listo</button></div><div class="sp-area"><canvas></canvas><div class="sp-line"><span>Firme sobre la línea</span></div></div>`;
 spad.dataset.k=k;document.body.appendChild(spad);
 const tmo=(p,ms)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(new Error('t')),ms))]);
 try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement)await tmo(document.documentElement.requestFullscreen({navigationUI:'hide'}),700)}catch(e){}
 let locked=false;try{if(screen.orientation&&screen.orientation.lock){await tmo(screen.orientation.lock('landscape'),900);locked=true}}catch(e){}
 const layout=()=>{const rot=!locked&&innerHeight>innerWidth;spad.classList.toggle('rot',rot);spad._rot=rot;const c=spad.querySelector('canvas'),a=spad.querySelector('.sp-area');setTimeout(()=>{const w=a.clientWidth,h=a.clientHeight,dpr=window.devicePixelRatio||1;if(c._w===w&&c._h===h)return;const old=c._w?c.toDataURL():null;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.style.width=w+'px';c.style.height=h+'px';c._w=w;c._h=h;const x=c.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.lineWidth=Math.max(2.6,Math.min(w,h)/110);x.lineCap='round';x.lineJoin='round';x.strokeStyle='#111';if(old){const im=new Image();im.onload=()=>x.drawImage(im,0,0,w,h);im.src=old}},30)};
 layout();spad._lay=()=>setTimeout(layout,250);addEventListener('resize',spad._lay);
 const c=spad.querySelector('canvas'),x=()=>c.getContext('2d');let dn=false;spad._ink=false;
 const pt=e=>{const r=c.getBoundingClientRect();if(spad._rot)return{x:e.clientY-r.top,y:r.right-e.clientX};return{x:e.clientX-r.left,y:e.clientY-r.top}};
 c.onpointerdown=e=>{e.preventDefault();dn=true;try{c.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);const g=x();g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+.1,p.y+.1);g.stroke();spad._ink=true};
 c.onpointermove=e=>{if(!dn)return;e.preventDefault();const p=pt(e),g=x();g.lineTo(p.x,p.y);g.stroke()};
 c.onpointerup=c.onpointercancel=()=>{dn=false}}
async function closePad(){if(!spad)return;removeEventListener('resize',spad._lay);spad.remove();spad=null;try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}try{if(document.fullscreenElement)await document.exitFullscreen()}catch(e){}}
function trimSig(c){const w=c.width,h=c.height,d=c.getContext('2d').getImageData(0,0,w,h).data;let x0=w,y0=h,x1=-1,y1=-1;
 for(let y=0;y<h;y+=2)for(let x=0;x<w;x+=2){if(d[(y*w+x)*4+3]>20){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}}
 if(x1<0)return null;const p=Math.round(Math.min(w,h)*0.04);x0=Math.max(0,x0-p);y0=Math.max(0,y0-p);x1=Math.min(w,x1+p);y1=Math.min(h,y1+p);
 const sw=x1-x0,sh=y1-y0,k=Math.min(1,1000/sw),o=document.createElement('canvas');o.width=Math.round(sw*k);o.height=Math.round(sh*k);o.getContext('2d').drawImage(c,x0,y0,sw,sh,0,0,o.width,o.height);return o}
function sigPreview(k){const el=$('#f_'+k);if(el)el.innerHTML=sigHTML(k)}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a.startsWith('sigopen:')){if(cur)openPad(a.slice(8));return}
 if(a==='padclear'&&spad){const c=spad.querySelector('canvas');c.getContext('2d').clearRect(0,0,c._w||c.width,c._h||c.height);spad._ink=false;return}
 if(a==='padcancel'){await closePad();return}
 if(a==='padok'&&spad){if(!spad._ink){toast('Firme dentro del recuadro');return}const k=spad.dataset.k,o=trimSig(spad.querySelector('canvas'));if(!o){toast('Firme dentro del recuadro');return}
  const blob=await new Promise(ok=>o.toBlob(ok,'image/png'));const prev=o.toDataURL('image/png');await closePad();
  cur.sig[k]={...(cur.sig[k]||{}),blob,prev,dirty:true,resign:false};sigPreview(k);toast('Firma lista: se guarda al tocar Guardar');return}
});

/* ---------- extintores según el formato del proyecto ---------- */
const EXTV={C:'BUENO',N:'MALO',A:'NO TIENE'};
function extRows(list){const ord=R('equipos').map(e=>String(e.inv).toUpperCase());const pos=r=>{const i=ord.indexOf(String(r.equipo||'').toUpperCase());return i<0?999:i};
 return list.slice().sort((a,b)=>String(a.fecha||'').localeCompare(String(b.fecha||''))||pos(a)-pos(b)).map((r,n)=>{const e=findEq(r.equipo)||{};const o={'Nº':n+1,'Fecha de inspección':r.fecha||'','Tipo de equipo':String(r.tipoeq||e.tipo||'').toUpperCase(),'Inventario':r.equipo||'','Modelo':String(r.modelo||[e.marca==='Caterpillar'?'CAT':e.marca,e.modelo].filter(Boolean).join(' ')).toUpperCase(),'Capacidad lbs':r.cap===''||r.cap==null?'':+r.cap,
  'Última recarga':r.etq&&r.etq!=='Legible'&&!r.recarga?String(r.etq).toUpperCase():(r.recarga||''),'Etiqueta vencimiento':r.etq&&r.etq!=='Legible'&&!r.vence?String(r.etq).toUpperCase():(r.vence||'')};
  for(const it of IT_EXT)o[it.toUpperCase()]=r.items&&r.items[it]?EXTV[r.items[it]]:'';o['Observaciones']=r.obs||'';o[META]={fotos:(r.fotos||[]).slice(),firmas:[]};return o})}
function extPend(){const mes=filt.mes||today().slice(0,7);const done=new Set(R('extintores').filter(r=>String(r.fecha||'').startsWith(mes)).map(r=>String(r.equipo||'').toUpperCase()));
 const act=R('equipos').filter(e=>e.estado!=='Inactivo');const pend=act.filter(e=>!done.has(String(e.inv).toUpperCase()));
 return `<section style="margin-top:0"><div class="sh"><h3>Inspección de ${MES[+mes.slice(5)-1]}: ${act.length-pend.length} de ${act.length}</h3><small>${pend.length?'Toca un equipo pendiente':'Todos los extintores inspeccionados'}</small></div><div class="chips" style="margin-bottom:14px">${act.map(e=>{const ok=done.has(String(e.inv).toUpperCase());return`<button class="chip" data-act="${ok?'goto:extintores':'extnew:'+esc(e.inv)}" style="${ok?'border-color:var(--ok);color:var(--ok)':''}">${ok?'✓ ':''}${esc(e.inv)}</button>`}).join('')}</div></section>`}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a.startsWith('extnew:')){const inv=a.slice(7),e=findEq(inv)||{};const last=R('extintores').filter(r=>String(r.equipo).toUpperCase()===inv.toUpperCase()).sort((x,y)=>String(y.fecha).localeCompare(String(x.fecha)))[0]||{};
  openForm('extintores',null,{equipo:e.inv||inv,tipoeq:e.tipo||last.tipoeq||'',modelo:[e.marca==='Caterpillar'?'CAT':e.marca,e.modelo].filter(Boolean).join(' ')||last.modelo||'',cap:last.cap??'',recarga:last.recarga||'',vence:last.vence||'',etq:last.etq||'Legible'});if(last.fecha)toast('Capacidad, recarga y vencimiento copiados de la inspección del '+fdmy(last.fecha))}});

const sucFile=o=>('REPSUC '+String(o.codigo||'').trim()).trim().replace(/[\\/:*?"<>|]/g,'-')+'.xlsx';
/* ---------- reporte de suceso en Excel con el formato de la empresa ---------- */
function multiHTML(f,r){const v=Array.isArray(r[f.k])?r[f.k]:(r[f.k]?[r[f.k]]:[]);
 return `<div id="f_${f.k}" class="multi">${f.o.map((o,i)=>`<label><input type="checkbox" value="${esc(o)}" ${v.includes(o)?'checked':''}><span>${i+1}. ${esc(o)}</span></label>`).join('')}</div>`}
const readMulti=k=>[...document.querySelectorAll('#f_'+k+' input:checked')].map(x=>x.value);
function wrapC(x,t,w){const out=[];for(const par of String(t||'').split('\n')){const ws=par.split(/\s+/);let ln='';for(const wd of ws){const tr=ln?ln+' '+wd:wd;if(x.measureText(tr).width>w&&ln){out.push(ln);ln=wd}else ln=tr}out.push(ln)}return out}
const loadIm=du=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=du});
/* hoja de versión (como la hoja que firma cada participante) */
async function verImg(r,v,logo){const W=1100,H=1420,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,W,H);x.strokeStyle='#17324d';x.lineWidth=3;x.strokeRect(30,30,W-60,H-60);let y=60;
 if(logo){try{const im=await loadIm(logo.du);const h=72,w=h*logo.w/logo.h;x.drawImage(im,60,y,Math.min(w,520),h)}catch(e){}}
 x.fillStyle='#555';x.font='600 22px Arial';x.textAlign='right';x.fillText('REPORTE DE SUCESOS',W-60,y+28);x.fillText((r.codigo||'')+'',W-60,y+58);x.textAlign='left';
 y+=120;x.fillStyle='#17324d';x.font='bold 38px Arial';x.textAlign='center';x.fillText(v.t.toUpperCase(),W/2,y);x.textAlign='left';y+=50;
 const e=findEq(r.equipo)||{};
 const F2=[['INVENTARIO',[r.equipo,e.tipo].filter(Boolean).join(' · ')],['FECHA',fdmy(r.fecha)],['HORA',r.hora||''],['NOMBRE',v.n||''],['NÚMERO DE IDENTIDAD',v.i||''],['CARGO U OCUPACIÓN',v.c||'']];
 for(const [l,val] of F2){x.fillStyle='#111';x.font='bold 24px Arial';x.fillText(l+':',60,y);const lw=x.measureText(l+': ').width;x.font='24px Arial';x.fillText(String(val),60+lw,y);x.strokeStyle='#999';x.lineWidth=1;x.beginPath();x.moveTo(60+lw,y+6);x.lineTo(W-60,y+6);x.stroke();y+=44}
 y+=10;x.font='bold 26px Arial';x.textAlign='center';x.fillText('VERSIÓN',W/2,y);x.textAlign='left';y+=16;
 const bx=60,bw=W-120,bTop=y,bH=H-y-330;x.strokeStyle='#333';x.lineWidth=1.5;x.strokeRect(bx,bTop,bw,bH);
 let fs=26,lines;for(;fs>=14;fs-=1){x.font=fs+'px Arial';lines=wrapC(x,v.txt||'Sin versión registrada',bw-30);if(lines.length*fs*1.35<=bH-24)break}
 x.fillStyle='#111';lines.forEach((ln,i)=>{if((i+1)*fs*1.35<bH-12)x.fillText(ln,bx+15,bTop+14+(i+1)*fs*1.35-fs*.3)});
 y=bTop+bH+60;
 const sigRow=async(lbl,id,name)=>{x.fillStyle='#111';x.font='bold 24px Arial';x.fillText(lbl,60,y+70);const lx=60+x.measureText(lbl+' ').width;x.strokeStyle='#333';x.lineWidth=1.5;x.beginPath();x.moveTo(lx,y+74);x.lineTo(lx+460,y+74);x.stroke();
  if(id){const s=await sigImg(id);if(s){try{const im=await loadIm(s.du);const h=90,w=Math.min(440,h*s.w/s.h);x.drawImage(im,lx+10,y+74-h+8,w,w*s.h/s.w>h?h:w*s.h/s.w)}catch(e){}}}
  x.font='20px Arial';x.fillStyle='#444';x.fillText(name||'',lx,y+100);y+=125};
 await sigRow('Firma:',v.f,v.n);await sigRow('Inspector SISO:',r.firmaS,RESP().replace(/ – .*/,''));
 return c.toDataURL('image/jpeg',.88)}
async function photoDU(id){try{const b=await fileBlob(id);const u=URL.createObjectURL(b);const im=await loadIm(u);URL.revokeObjectURL(u);const s=Math.min(1,1280/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return{du:c.toDataURL('image/jpeg',.82),w:c.width,h:c.height}}catch(e){return null}}
async function sucX(r){const X=await loadX();const logo=await loadLogo();const wb=new X.Workbook();wb.creator=cfg.siso||'SISO';wb.created=new Date();
 const AR='Arial',thin={style:'thin',color:{argb:'FF000000'}},GR='FFD9D9D9',NAVY='FF002060';
 const merge=(ws,a)=>{if(ws.mergeCellsWithoutStyle)ws.mergeCellsWithoutStyle(a);else ws.mergeCells(a)};
 /* ===== hoja 1: REPORTE DE SUCESOS ===== */
 const ws=wb.addWorksheet('REPORTE DE SUCESOS',{views:[{showGridLines:false}]});
 const CW={A:2.8,B:3,C:2.8,D:11.2,E:4.4,F:20.2,G:8.8,H:22.8,I:10.6,J:17.8,K:10.6,L:17.8,M:6,N:18.2,O:7.2,P:18.4,Q:8.2,R:16.2,S:7,T:23.8,U:3.4};
 Object.entries(CW).forEach(([k,w])=>ws.getColumn(k).width=w);
 const RH={2:36,3:34,4:18,5:16.2,6:20,7:33.75,8:21.6,9:24.75,10:32.25,11:32.25,12:32.25,13:32.25,14:70.5,15:32.25,16:32.25,17:99.45,18:67.5,19:39.45,20:55.05,21:48,22:43.5,23:24,24:25.5,25:27,26:21,27:32.25,28:21.45,29:21.75,30:18.75,31:16.5,32:21.6,33:15,34:15,35:15,36:16.5,37:15.75,38:22.2,39:23.55,40:23.55,41:21,42:22.2};
 Object.entries(RH).forEach(([r0,h])=>ws.getRow(+r0).height=h);
 const cols='BCDEFGHIJKLMNOPQRST'.split('');
 for(let rr=2;rr<=42;rr++)for(const c of cols)ws.getCell(c+rr).border={top:thin,left:thin,bottom:thin,right:thin};
 const put=(a,v,o={})=>{const c=ws.getCell(a);c.value=v;c.font={name:AR,size:o.sz||10,bold:!!o.b,color:{argb:o.col||'FF000000'}};c.alignment={horizontal:o.h||'left',vertical:o.v||'middle',wrapText:o.wrap!==false};if(o.fill)c.fill={type:'pattern',pattern:'solid',fgColor:{argb:o.fill}};return c};
 const box=on=>on?'☒':'☐';
 const chk=(a,on)=>{const c=put(a,box(on),{h:'center',sz:13,b:on});c.font={name:'Segoe UI Symbol',size:13,bold:!!on,color:{argb:on?'FFC00000':'FF000000'}}};
 const M_=[];const mg=a=>M_.push(a);
 // encabezado
 mg('B2:F3');mg('G2:P2');put('G2','REPORTE DE SUCESOS',{b:1,sz:24,h:'center'});
 mg('Q2:T2');put('Q2','PROYECTO:',{b:1,sz:10,v:'top'});mg('Q3:T3');put('Q3',PROY_TITULO(),{sz:7.5,v:'top'});
 [['G3','H3','Accidente'],['I3','J3','Incidente'],['K3','L3','Siniestro'],['M3','N3','Robo'],['O3','P3','Pérdida']].forEach(([b,l,t])=>{chk(b,norm(r.tipo)===norm(t));put(l,t.toUpperCase().replace('É','E'),{b:1})});
 mg('B4:I4');put('B4','AFECTADO',{b:1,sz:12,h:'center'});mg('J4:O4');put('J4','DATOS GENERALES',{b:1,sz:12,h:'center'});mg('P4:T4');put('P4','FECHA DEL REPORTE : '+fdmy(r.fechaRep||r.fecha||today()),{b:1,sz:11});
 mg('C5:D5');put('C5','PERSONA(s)',{b:1,h:'center'});put('F5','EQUIPO(s)',{b:1,h:'center'});put('H5','DAÑO',{b:1,h:'center'});
 mg('J5:O5');put('J5','LUGAR:',{b:1});mg('P5:T5');put('P5','CÓDIGO: '+(r.codigo||''),{b:1});
 const e=findEq(r.equipo)||{};
 mg('B6:E7');put('B6',String(r.participante||'').split('\n').map(s=>s.trim()).filter(Boolean).join(', '),{sz:9,v:'top'});
 put('F6','INV: '+(r.equipo||''),{sz:10});put('F7','OTRO: '+(r.otro||''),{sz:9,v:'top'});
 mg('G6:I7');put('G6',r.dano||'',{sz:9,v:'top'});
 mg('J6:O6');put('J6',r.lugar||'',{sz:10});put('J7','FECHA :',{b:1});mg('K7:O7');put('K7',fdmy(r.fecha)+(r.hora?'   ·   HORA: '+r.hora:''),{sz:10});
 put('P6','Datos del Clima:',{sz:9});put('P7','',{});
 [['Q6','R6','Neblina'],['S6','T6','Lluvia'],['Q7','R7','Llovizna'],['S7','T7','Soleado']].forEach(([b,l,t])=>{chk(b,norm(r.clima)===norm(t));put(l,t.toUpperCase(),{sz:10})});
 // relato y versiones
 mg('B8:L8');put('B8','RELATO DE LO SUCEDIDO'+(r.relato?' — '+r.relato:''),{b:1,sz:13,h:'center',fill:GR});
 mg('M8:T8');put('M8','CAUSA PRESUNTA',{b:1,sz:13,h:'center',fill:GR});
 const vh=(n,c,t)=>t+(n?' '+n:'')+(c?'          CARGO: '+c:'          CARGO:');
 mg('B9:L9');put('B9',vh(r.n1,r.c1,'VERSIÓN DEL PARTICIPANTE 1:'),{b:1});
 mg('B10:L15');put('B10',r.vPart||'',{sz:10,v:'top'});
 mg('B16:L16');put('B16',vh(r.n2,r.c2,'VERSIÓN DEL PARTICIPANTE 2:'),{b:1});
 mg('B17:L24');put('B17',r.vTest||'',{sz:10,v:'top'});
 mg('B25:L25');put('B25',vh(r.nT,r.cT,'VERSIÓN TÉCNICA:'),{b:1});
 mg('B26:L42');put('B26',r.opinion||'',{sz:10,v:'top'});
 mg('M9:T12');put('M9',r.causaP||'',{sz:10,v:'top'});
 mg('M13:T13');put('M13','CRITERIO DE ANÁLISIS',{b:1,sz:13,h:'center',fill:GR});
 mg('M14:T23');put('M14',r.criterio||'',{sz:10,v:'top'});
 mg('M24:T24');put('M24','CLASIFICACIÓN DE CAUSAS',{b:1,sz:10,h:'center',fill:GR});
 const cs=Array.isArray(r.causas)?r.causas:(r.causa?[r.causa]:[]);
 CAUSAS.forEach((t,i)=>{const row=25+Math.floor(i/4)*2,bc='MOQS'[i%4],lc='NPRT'[i%4];mg(bc+row+':'+bc+(row+1));mg(lc+row+':'+lc+(row+1));const on=cs.some(x=>norm(x)===norm(t));chk(bc+row,on);put(lc+row,(i+1)+'. '+t,{sz:8.5,b:on})});
 mg('M33:T33');put('M33','DAÑOS OCASIONADOS',{b:1,h:'center'});
 mg('M34:N34');put('M34','PERSONALES',{b:1,h:'center',fill:GR});mg('O34:P34');put('O34','MATERIALES',{b:1,h:'center',fill:GR});mg('Q34:T34');put('Q34','OBSERVACIONES',{b:1,h:'center',fill:GR});
 ['Leves','Medios','Mayor','Inservible'].forEach((t,i)=>{const row=35+i;chk('M'+row,norm(r.danoP)===norm(t));put('N'+row,t,{sz:10});chk('O'+row,norm(r.danoM)===norm(t));put('P'+row,t,{sz:10})});
 mg('Q35:T38');put('Q35',r.obsD||'',{sz:9,v:'top'});
 mg('M39:T39');put('M39','ACCIONES A TOMAR :',{b:1});mg('M40:T42');put('M40',r.acciones||'',{sz:10,v:'top'});
 // cajas de texto largas: agrandar filas si el texto no cabe
 const wOf=(a,b)=>{let s=0;for(let i=a.charCodeAt(0);i<=b.charCodeAt(0);i++)s+=CW[String.fromCharCode(i)];return s};
 const fit=(t,c1,c2,r1,r2,sz)=>{if(!t)return;const cpl=Math.max(10,wOf(c1,c2)*1.18*10/sz);const ln=String(t).split('\n').reduce((a,p)=>a+Math.max(1,Math.ceil(p.length/cpl)),0);const need=ln*sz*1.32+8;let have=0;for(let i=r1;i<=r2;i++)have+=ws.getRow(i).height;if(need>have){const add=(need-have)/(r2-r1+1);for(let i=r1;i<=r2;i++)ws.getRow(i).height+=add}};
 fit(r.vPart,'B','L',10,15,10);fit(r.vTest,'B','L',17,24,10);fit(r.opinion,'B','L',26,42,10);fit(r.causaP,'M','T',9,12,10);fit(r.criterio,'M','T',14,23,10);fit(r.acciones,'M','T',40,42,10);
 for(const a of M_)merge(ws,a);
 if(logo){const id=wb.addImage({base64:logo.du,extension:'png'});const h=50,w=Math.min(285,h*logo.w/logo.h);ws.addImage(id,{tl:{col:1.15,row:1.25},ext:{width:w,height:w*logo.h/logo.w},editAs:'oneCell'})}
 ws.pageSetup={orientation:'landscape',paperSize:1,fitToPage:true,fitToWidth:1,fitToHeight:1,horizontalCentered:true,margins:{left:.25,right:.25,top:.3,bottom:.3,header:.1,footer:.1},printArea:'A1:U43'};
 /* ===== hoja 2: VERSIONES (hoja firmada de cada participante) ===== */
 const V=[{t:'Versión del participante 1',n:r.n1,c:r.c1,i:r.i1,txt:r.vPart,f:r.firma1},{t:'Versión del participante 2',n:r.n2,c:r.c2,i:r.i2,txt:r.vTest,f:r.firma2},{t:'Versión técnica',n:r.nT,c:r.cT,i:r.iT,txt:r.opinion,f:r.firmaT}].filter(v=>v.n||v.txt||v.f);
 if(V.length){const w2=wb.addWorksheet('VERSIONES',{views:[{showGridLines:false}]});for(let i=1;i<=19;i++)w2.getColumn(i).width=i%6===1?2.5:10.5;
  for(let i=1;i<=31;i++)w2.getRow(i).height=15;
  const slot=['B','H','N'],end=['F','L','R'];
  for(let k=0;k<V.length;k++){const du=await verImg(r,V[k],logo);const id=wb.addImage({base64:du,extension:'jpeg'});
   const c0=1+k*6,bw=5*10.5*7.4,bh=26*20;const s=Math.min(bw/1100,bh/1420),iw=1100*s,ih=1420*s;
   w2.addImage(id,{tl:{col:c0+((bw-iw)/2)/(bw/5),row:2},ext:{width:iw,height:ih},editAs:'oneCell'});
   const a=slot[k]+'29:'+end[k]+'30';const c=w2.getCell(slot[k]+'29');c.value=V[k].t.toUpperCase();c.font={name:AR,size:11,bold:true,color:{argb:'FFFFFFFF'}};c.alignment={horizontal:'center',vertical:'middle'};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:NAVY}};merge(w2,a)}
  w2.pageSetup={orientation:'landscape',paperSize:1,fitToPage:true,fitToWidth:1,fitToHeight:1,horizontalCentered:true,margins:{left:.3,right:.3,top:.4,bottom:.4,header:.2,footer:.2}}}
 /* ===== hoja 3: RESPALDO FOTOGRÁFICO ===== */
 const fotos=(r.fotos||[]);
 if(fotos.length){const w3=wb.addWorksheet('RESPALDO FOTOGRAFICO',{views:[{showGridLines:false}]});for(let i=1;i<=16;i++)w3.getColumn(i).width=(i===1||i===6||i===11||i===16)?2.5:10.5;
  const t=w3.getCell('B1');t.value='RESPALDO FOTOGRÁFICO  ·  '+(r.codigo||'')+(r.relato?'  ·  '+r.relato:'');t.font={name:AR,size:13,bold:true,color:{argb:'FF17324D'}};t.alignment={horizontal:'center',vertical:'middle'};merge(w3,'B1:O1');w3.getRow(1).height=26;
  const SL=[['B','E',1],['G','J',6],['L','O',11]];
  for(let k=0;k<fotos.length;k++){const p=await photoDU(fotos[k]);const blk=Math.floor(k/3),sl=SL[k%3],r0=2+blk*25;
   for(let i=r0;i<r0+25;i++)w3.getRow(i).height=15;
   const cap=sl[0]+(r0+22)+':'+sl[1]+(r0+23);const c=w3.getCell(sl[0]+(r0+22));c.value='RESPALDO FOTOGRÁFICO '+(k+1);c.font={name:AR,size:10,bold:true,color:{argb:'FFFFFFFF'}};c.alignment={horizontal:'center',vertical:'middle'};c.fill={type:'pattern',pattern:'solid',fgColor:{argb:NAVY}};merge(w3,cap);
   if(!p){w3.getCell(sl[0]+(r0+10)).value='(foto no disponible sin conexión)';continue}
   const id=wb.addImage({base64:p.du,extension:'jpeg'});const bw=4*10.5*7.4,bh=21*20,s=Math.min(bw/p.w,bh/p.h),iw=p.w*s,ih=p.h*s;
   w3.addImage(id,{tl:{col:sl[2]+((bw-iw)/2)/(bw/4),row:r0-1+((bh-ih)/2)/20+0.5},ext:{width:iw,height:ih},editAs:'oneCell'})}
  w3.pageSetup={orientation:'portrait',paperSize:1,fitToPage:true,fitToWidth:1,fitToHeight:0,horizontalCentered:true,margins:{left:.3,right:.3,top:.4,bottom:.4,header:.2,footer:.2}}}
 const buf=await wb.xlsx.writeBuffer();return new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}

/* ---------- inspección de vehículos y equipo amarillo (formato mensual del proyecto) ---------- */
const inspGrp=inv=>isPU(inv)?'Pick-up':LIGEROS.includes(eqTipo(inv))?'Camión':'Equipo amarillo';
const INSPV={C:'✓',N:'X',A:'N/A'};
function inspRows(list,g){const ord=R('equipos').map(e=>String(e.inv).toUpperCase());const pos=r=>{const i=ord.indexOf(String(r.equipo||'').toUpperCase());return i<0?999:i};
 const its=g==='Pick-up'?IT_PU:g==='Camión'?IT_PES:IT_PES.filter(i=>i!=='Placas');
 return list.slice().sort((a,b)=>String(a.fecha||'').localeCompare(String(b.fecha||''))||pos(a)-pos(b)).map(r=>{const e=findEq(r.equipo)||{};const o={'Mes':r.fecha?(m=>m[0].toUpperCase()+m.slice(1))(MES[+String(r.fecha).slice(5,7)-1]):'','Fecha':r.fecha||'','Inventario':r.equipo||''};
  if(g!=='Equipo amarillo')o['Placa']=r.placa||e.placa||'';o['Asignado a']=r.conductor||'';
  for(const it of its)o[it]=r.items&&r.items[it]?INSPV[r.items[it]]:'';o['Observaciones']=r.obs||'';o[META]={fotos:(r.fotos||[]).slice(),firmas:[]};return o})}
function inspSheets(list,sfx){return ['Camión','Pick-up','Equipo amarillo'].map(g=>{const l=list.filter(r=>inspGrp(r.equipo)===g);return l.length?[g,inspRows(l,g),'Inspecciones de '+(g==='Camión'?'camión':g==='Pick-up'?'pick-up':'equipo amarillo')+(sfx?' · '+sfx:'')]:null}).filter(Boolean)}
function inspPend(){const mes=filt.mes||today().slice(0,7);const done=new Set(R('insp').filter(r=>String(r.fecha||'').startsWith(mes)).map(r=>String(r.equipo||'').toUpperCase()));
 const act=R('equipos').filter(e=>e.estado!=='Inactivo'&&e.estado!=='En taller');const n=act.filter(e=>done.has(String(e.inv).toUpperCase())).length;
 return `<section style="margin-top:0"><div class="sh"><h3>Inspección de ${MES[+mes.slice(5)-1]}: ${n} de ${act.length}</h3><small>${n<act.length?'Toca un equipo pendiente':'Todos los equipos inspeccionados'}</small></div>${['Camión','Pick-up','Equipo amarillo'].map(g=>{const l=act.filter(e=>inspGrp(e.inv)===g);return l.length?`<div class="muted" style="font-size:12px;margin:6px 0 4px">${g}</div><div class="chips" style="margin-bottom:8px">${l.map(e=>{const ok=done.has(String(e.inv).toUpperCase());return`<button class="chip" data-act="${ok?'goto:insp':'pre:'+esc(e.inv)}" style="${ok?'border-color:var(--ok);color:var(--ok)':''}">${ok?'✓ ':''}${esc(e.inv)}</button>`}).join('')}</div>`:''}).join('')}</section>`}

/* ---------- REPORTE DIARIO SISO (PDF con todas las actividades del día y sus fotos) ---------- */
const recTime=r=>{const m=/^r([0-9a-z]+)[0-9a-z]{4}$/.exec(r.id||'');if(!m)return '';const d=new Date(parseInt(m[1],36));return isNaN(d)||d.getFullYear()<2024?'':pad(d.getHours())+':'+pad(d.getMinutes())};
const horaDe=(k,r)=>r.hora||r.hi||recTime(r);
async function thumbDU(id,max=1000){try{const b=await fileBlob(id);const u=URL.createObjectURL(b);const im=await loadIm(u);URL.revokeObjectURL(u);const s=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return{du:c.toDataURL('image/jpeg',.78),w:c.width,h:c.height}}catch(e){return null}}
function rdFields(k,r){const out=[];const fx=r.fecha;
 for(const f of M[k].f){const v=r[f.k];if(['hdr','fotos'].includes(f.t)||f.k==='fecha')continue;
  if(f.t==='firma'){if(v)out.push([f.l,'Firmado']);continue}
  if(f.t==='chk'){const it=v||{};const n=Object.entries(it).filter(x=>x[1]==='N').map(x=>x[0]);const tot=Object.keys(it).length;if(tot)out.push([f.l,n.length?(f.labels?f.labels[1]:'No cumple')+' ('+n.length+' de '+tot+'): '+n.join(', '):'Todo '+(f.labels?f.labels[0].toLowerCase():'cumple')+' ('+tot+' puntos)']);continue}
  if(f.t==='lista'){const its=eitems(r);if(its.length)out.push([f.l,its.map(i=>(i.cant||1)+' '+i.art+(i.vida?' ('+i.vida+')':'')).join(', ')]);continue}
  if(f.t==='multi'){const a=Array.isArray(v)?v:(v?[v]:[]);if(a.length)out.push([f.l,a.join(', ')]);continue}
  if(v===''||v==null)continue;
  let t=f.t==='date'?fdmy(v):String(v);if(f.t==='area'&&t.length>700)t=t.slice(0,700)+'…';out.push([f.l,t])}
 return out}
async function reporteDiario(dia){let J;try{J=await loadPdf()}catch(e){toast('No se pudo cargar el generador de PDF (revisa la conexión)');return}
 const acts=[];for(const k of ORDER){if(M[k].nodate||M[k].cat)continue;for(const r of R(k))if(r.fecha===dia)acts.push({k,r,h:horaDe(k,r)})}
 acts.sort((a,b)=>(a.h||'99').localeCompare(b.h||'99')||ORDER.indexOf(a.k)-ORDER.indexOf(b.k));
 const doc=new J({unit:'mm',format:'letter'}),W=215.9,HP=279.4,X=14,CW=W-2*X;let y=0;
 const T=v=>String(v??'').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/×/g,'x').replace(/[✓☒]/g,'Sí').replace(/·/g,'-').replace(/[^\x00-\xFF]/g,'');
 const need=h=>{if(y+h>HP-16){doc.addPage();y=16;return true}return false};
 const d=pd(dia),dn=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][d.getDay()];
 // encabezado
 doc.setFillColor(23,50,77);doc.rect(0,0,W,30,'F');doc.setFillColor(255,90,0);doc.rect(0,30,W,2.2,'F');
 let lg=null;try{lg=await loadLogo()}catch(e){}
 if(lg){doc.setFillColor(255,255,255);doc.roundedRect(W-X-62,5,62,20,2,2,'F');const lh=13,lw=Math.min(56,lh*lg.w/lg.h);doc.addImage(lg.du,'PNG',W-X-31-lw/2,5+(20-lw*lg.h/lg.w)/2,lw,lw*lg.h/lg.w)}
 doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text('REPORTE DIARIO SISO',X,14);
 doc.setFont('helvetica','normal');doc.setFontSize(9.5);doc.text(T('Seguridad Industrial y Salud Ocupacional (SISO)'),X,20.5);doc.text(T(dn+' '+fdmy(dia)),X,26);
 y=40;doc.setTextColor(20);
 // datos del proyecto
 const info=[['Proyecto',PROY_TITULO()],['Contratista',cfg.empresa||"Cordon's Heavy Equipment"],['Responsable del informe',RESP()],['Fecha del reporte',dn+' '+fdmy(dia)],['Generado',fdmy(today())+' '+pad(new Date().getHours())+':'+pad(new Date().getMinutes())]];
 doc.setFontSize(9.5);let ih=0;const ils=info.map(([l,v])=>{const ln=doc.splitTextToSize(T(v),CW-48);ih+=ln.length*4.4+2.2;return[l,ln]});
 doc.setFillColor(244,246,249);doc.setDrawColor(205,212,222);doc.roundedRect(X,y-5,CW,ih+5,2,2,'FD');
 for(const [l,ln] of ils){doc.setFont('helvetica','bold');doc.setTextColor(80);doc.text(T(l),X+4,y);doc.setFont('helvetica','normal');doc.setTextColor(20);doc.text(ln,X+48,y);y+=ln.length*4.4+2.2}
 y+=8;
 const H=t=>{need(34);doc.setFont('helvetica','bold');doc.setFontSize(12.5);doc.setTextColor(23,50,77);doc.text(T(t),X,y);doc.setDrawColor(255,90,0);doc.setLineWidth(.7);doc.line(X,y+1.8,X+CW,y+1.8);y+=8;doc.setTextColor(20)};
 // resumen
 H('Resumen de actividades del día');
 const by={};for(const a of acts)(by[a.k]=by[a.k]||[]).push(a);
 const nfot=acts.reduce((s,a)=>s+(a.r.fotos||[]).length,0);
 if(!acts.length){doc.setFont('helvetica','italic');doc.setFontSize(10);doc.text('No hay actividades registradas en esta fecha.',X,y);y+=8}else{
  doc.setFillColor(23,50,77);doc.rect(X,y-4.5,CW,7,'F');doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(9.5);doc.text('Actividad',X+2,y);doc.text('Cant.',X+70,y,{align:'right'});doc.text('Detalle',X+76,y);y+=6;doc.setTextColor(20);
  let z=0;for(const k of Object.keys(by)){const l=by[k];const det=l.map(a=>{if(a.k==='sucesos')return 'REPSUC '+(a.r.codigo||'')+' - '+(a.r.relato||'');const sm=M[a.k].sum?M[a.k].sum(a.r):[];return(a.h?a.h+' ':'')+(sm[0]||'')+(sm[2]&&sm[2][1]?' ('+sm[2][1]+')':'')}).join('; ');
   doc.setFont('helvetica','normal');doc.setFontSize(9);const ln=doc.splitTextToSize(T(det),CW-78);const hh=ln.length*4+2.6;need(hh);
   if(z++%2){doc.setFillColor(246,247,249);doc.rect(X,y-4,CW,hh,'F')}
   doc.setFont('helvetica','bold');doc.text(T(M[k].n),X+2,y,{maxWidth:60});doc.text(String(l.length),X+70,y,{align:'right'});doc.setFont('helvetica','normal');doc.text(ln,X+76,y);y+=hh}
  y+=2;doc.setFontSize(9);doc.setTextColor(90);doc.text(T(acts.length+' actividades registradas · '+nfot+' fotografías'),X,y);doc.setTextColor(20);y+=9}
 // reportes de sucesos: solo lista numerada con número, evento e imagen
 const sucs=acts.filter(a=>a.k==='sucesos'),resto=acts.filter(a=>a.k!=='sucesos');
 if(sucs.length){H('Reportes de sucesos (REPSUC)');let i=0;
  for(const a of sucs){i++;const r=a.r;const ttl=i+'. REPSUC '+(r.codigo||'')+' - '+(r.relato||'Sin título');
   doc.setFontSize(10.5);doc.setFont('helvetica','bold');const ln=doc.splitTextToSize(T(ttl),CW-34);const fs=r.fotos||[];const cols=3,gap=4,cw=(CW-gap*(cols-1))/cols,chh=cw*0.75;
   need(ln.length*5+6+(fs.length?chh+8:0));doc.setFillColor(255,240,230);doc.rect(X,y-5,CW,ln.length*5+3,'F');doc.setFillColor(255,90,0);doc.rect(X,y-5,1.6,ln.length*5+3,'F');
   doc.setTextColor(20);doc.text(ln,X+4,y);doc.setFontSize(9.5);doc.setTextColor(23,50,77);doc.text(T(a.h||''),X+CW-2,y,{align:'right'});doc.setTextColor(20);y+=ln.length*5+3;
   if(fs.length){for(let i2=0;i2<fs.length;i2+=cols){need(chh+8);const rowY=y;
     for(let j=0;j<cols&&i2+j<fs.length;j++){const p=await thumbDU(fs[i2+j]);const cx=X+j*(cw+gap);doc.setDrawColor(210);doc.setFillColor(240,240,240);doc.rect(cx,rowY,cw,chh,'FD');
      if(p){const sc=Math.min(cw/p.w,chh/p.h),w2=p.w*sc,h2=p.h*sc;doc.addImage(p.du,'JPEG',cx+(cw-w2)/2,rowY+(chh-h2)/2,w2,h2)}else{doc.setFontSize(8);doc.setTextColor(120);doc.text('Foto no disponible sin conexión',cx+cw/2,rowY+chh/2,{align:'center'});doc.setTextColor(20)}
      doc.setFontSize(7.5);doc.setTextColor(90);doc.text(T('Foto '+(i2+j+1)+' - REPSUC '+(r.codigo||'')),cx,rowY+chh+3.5,{maxWidth:cw});doc.setTextColor(20)}
     y=rowY+chh+7}}else{doc.setFont('helvetica','italic');doc.setFontSize(9);doc.setTextColor(120);doc.text('Sin fotografía',X+4,y);doc.setTextColor(20);y+=6}
   y+=4}
  y+=2}
 // detalle de cada actividad
 if(resto.length)H('Detalle de actividades y reporte fotográfico');
 let n=0;for(const a of resto){n++;const m=M[a.k];const sm=m.sum?m.sum(a.r):[];
  need(22);doc.setFillColor(255,240,230);doc.rect(X,y-5,CW,8,'F');doc.setFillColor(255,90,0);doc.rect(X,y-5,1.6,8,'F');
  doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.setTextColor(20);doc.text(T(n+'. '+m.s+(sm[0]?' - '+sm[0]:'')),X+4,y,{maxWidth:CW-34});
  doc.setFontSize(9.5);doc.setTextColor(23,50,77);doc.text(T(fdmy(a.r.fecha)+(a.h?'  '+a.h:'')),X+CW-2,y,{align:'right'});y+=8;doc.setTextColor(20);
  for(const [l,v] of rdFields(a.k,a.r)){doc.setFontSize(9);const ln=doc.splitTextToSize(T(v),CW-50);for(let i=0;i<ln.length;i+=40){const part=ln.slice(i,i+40);need(part.length*4+1.5);doc.setFont('helvetica','bold');doc.setTextColor(95);if(i===0)doc.text(T(l),X+2,y,{maxWidth:44});doc.setFont('helvetica','normal');doc.setTextColor(20);doc.text(part,X+48,y);y+=part.length*4+1.5}}
  const fs=a.r.fotos||[];
  if(fs.length){y+=1;const cols=3,gap=4,cw=(CW-gap*(cols-1))/cols,chh=cw*0.75;
   for(let i=0;i<fs.length;i+=cols){need(chh+8);const rowY=y;
    for(let j=0;j<cols&&i+j<fs.length;j++){const p=await thumbDU(fs[i+j]);const cx=X+j*(cw+gap);doc.setDrawColor(210);doc.setFillColor(240,240,240);doc.rect(cx,rowY,cw,chh,'FD');
     if(p){const s=Math.min(cw/p.w,chh/p.h),iw=p.w*s,ih2=p.h*s;doc.addImage(p.du,'JPEG',cx+(cw-iw)/2,rowY+(chh-ih2)/2,iw,ih2)}else{doc.setFontSize(8);doc.setTextColor(120);doc.text('Foto no disponible sin conexión',cx+cw/2,rowY+chh/2,{align:'center'});doc.setTextColor(20)}
     doc.setFontSize(7.5);doc.setTextColor(90);doc.text(T('Foto '+(i+j+1)+' - '+m.s),cx,rowY+chh+3.5,{maxWidth:cw});doc.setTextColor(20)}
    y=rowY+chh+7}}
  y+=5}
 // firma del responsable
 need(32);y+=10;doc.setDrawColor(60);doc.setLineWidth(.3);doc.line(X+CW/2-40,y+12,X+CW/2+40,y+12);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(T(RESP().replace(/ – .*/,'')),X+CW/2,y+17,{align:'center'});doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(T('Responsable SISO - Elaboró'),X+CW/2,y+21.5,{align:'center'});
 // pie de página
 const np=doc.getNumberOfPages();for(let i=1;i<=np;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(120);doc.setDrawColor(220);doc.line(X,HP-11,W-X,HP-11);doc.text(T('Reporte diario SISO - '+fdmy(dia)+' - '+(cfg.empresa||"Cordon's Heavy Equipment")),X,HP-7);doc.text('Página '+i+' de '+np,W-X,HP-7,{align:'right'})}
 const blob=doc.output('blob');await saveFile('Reporte diario SISO '+fdmy(dia)+'.pdf',blob);return{acts:acts.length,fotos:nfot,pages:np}}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act="rdiario"]');if(!b)return;const dia=($('#rdfecha')&&$('#rdfecha').value)||today();
 b.disabled=true;const t0=b.textContent;b.textContent='Generando…';try{const r=await reporteDiario(dia);if(r)toast('Reporte diario listo: '+r.acts+' actividades, '+r.fotos+' fotos')}catch(e){toast('No se pudo generar el reporte'+(navigator.onLine?'':' (revisa la conexión)'))}b.disabled=false;b.textContent=t0});

/* ---------- agenda sugerida de charlas (10 min al cierre de la jornada) ---------- */
const AGENDA=[
 ['2026-11-24','Banderilleros y control de tránsito en el frente de trabajo'],
 ['2026-11-25','Distancia segura y radio de giro de excavadora, tractor y cargadora'],
 ['2026-11-26','Nunca te ubiques en la línea de fuego'],
 ['2026-11-27','Puntos ciegos y maniobras en reversa de volquetas y cargadora'],
 ['2026-11-30','Hidratación y golpe de calor en jornadas al sol'],
 ['2026-12-01','Ojos y mente en la tarea'],
 ['2026-12-02','Inspección preoperacional 360° de equipo móvil'],
 ['2026-12-03','Cuidado y conservación del EPP'],
 ['2026-12-08','Riesgos en la limpieza del derecho de vía: caída de árboles, ramas, animales e insectos'],
 ['2026-12-09','Qué hacer en caso de una emergencia'],
 ['2026-12-10','Manejo de extintores y sus tipos'],
 ['2026-12-15','Levantamiento manual de carga'],
 ['2026-12-16','Fatiga y somnolencia en la conducción'],
 ['2026-12-17','Prevención de derrames al abastecer combustible a la maquinaria'],
 ['2026-12-22','Política de alcohol y drogas'],
 ['2026-12-23','Qué hacer en caso de averías y accidentes en carretera'],
 ['2026-12-29','Condición insegura y acto inseguro'],
 ['2026-12-30','Errores críticos que causan incidentes']];
const TEMAS_ETAPA=['Distancia segura y radio de giro de excavadora, tractor y cargadora','Puntos ciegos y maniobras en reversa de volquetas y cargadora','Riesgos en la limpieza del derecho de vía: caída de árboles, ramas, animales e insectos','Hidratación y golpe de calor en jornadas al sol','Prevención de derrames al abastecer combustible a la maquinaria','Carga segura de volquetas con excavadora y cargadora','Trabajo seguro en taludes y bordes de corte','Polvo en el frente de trabajo: protección respiratoria y visual','Comunicación con señales entre operador y ayudante','Terracería: compactación y tránsito de equipo en capas'];
const agFree=()=>AGENDA.filter(([d])=>d>=today()&&!R('charlas').some(c=>c.fecha===d));
function agendaBox(){const n=agFree().length;if(!n)return '';return `<section style="margin-top:0"><div class="card" style="padding:12px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><div style="flex:1 1 200px"><b>Agenda sugerida de charlas</b><br><small class="muted">${n} charla${n>1?'s':''} de 10 min al cierre de la jornada, para cumplir las 12 del mes. Revísalas y cambia el tema que no te sirva.</small></div><button class="btn pri" data-act="agview">Revisar y cargar</button></div></section>`}
function agView(){const L=agFree();const dn=d=>['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][pd(d).getDay()];
 const opts=[...new Set([...TEMAS_ETAPA,...TEMAS,...AGENDA.map(a=>a[1])])];
 $('#sheet').innerHTML=`<div class="hd"><h3>Agenda sugerida de charlas</h3><button class="btn sm dk" data-act="close">✕</button></div><div class="bd">
 <p class="note" style="margin-top:0">Desmarca las que no quieras y cambia el tema escribiendo o escogiendo de la lista. Se guardan como <b>Programadas</b>; después puedes editarlas o borrarlas desde el módulo.</p>
 <datalist id="dl_ag">${opts.map(t=>`<option value="${esc(t)}">`).join('')}</datalist>
 ${L.map(([d,t],i)=>`<div style="display:flex;gap:8px;align-items:center;border-bottom:1px solid var(--line);padding:8px 0"><input type="checkbox" class="ag-on" data-i="${i}" checked style="width:22px;height:22px;flex:none"><div style="flex:none;width:64px;font-size:13px"><b>${dn(d)} ${pd(d).getDate()}</b><br><small class="muted">${MES[pd(d).getMonth()].slice(0,3)}</small></div><input class="ag-t" data-i="${i}" list="dl_ag" value="${esc(t)}" style="flex:1;min-width:0;min-height:42px;border:1px solid var(--line);border-radius:8px;padding:0 8px;font:inherit"></div>`).join('')}
 <label style="display:flex;gap:8px;align-items:center;margin-top:12px"><span style="flex:none">Hora</span><input id="ag-h" type="time" value="${esc(cfg.horaCharla||'16:45')}" style="min-height:42px;border:1px solid var(--line);border-radius:8px;padding:0 8px;font:inherit"><small class="muted">10 minutos al cierre</small></label>
 <div style="display:flex;gap:8px;margin-top:14px"><button class="btn pri" data-act="agsave" style="flex:1">Cargar seleccionadas</button></div></div>`;
 $('#modal').classList.add('on');agView.L=L}
async function agSave(){const L=agView.L||[];const h=$('#ag-h').value||'16:45';const ins=cfg.siso||'Fernando Domínguez';let n=0;
 const on=[...document.querySelectorAll('.ag-on')].filter(x=>x.checked).map(x=>+x.dataset.i);
 for(const i of on){const t=(document.querySelector('.ag-t[data-i="'+i+'"]').value||'').trim();if(!t)continue;const [d]=L[i];
  const end=(()=>{const [a,b]=h.split(':').map(Number);const m=a*60+b+10;return pad(Math.floor(m/60)%24)+':'+pad(m%60)})();
  await save('charlas','ag-'+d,{estado:'Programada',fecha:d,tema:t,area:'Campo',instructor:ins,hi:h,hf:end,asist:''});n++}
 if(cfg.horaCharla!==h)await save('config','proyecto',{...cfg,horaCharla:h});
 closeM();toast(n+' charlas programadas')}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='agview')agView();if(a==='agsave'){b.disabled=true;agSave()}});
for(const t of TEMAS_ETAPA)if(!TEMAS.includes(t))TEMAS.push(t);

/* ---------- PDF ---------- */
let pdfP=null;
function loadPdf(){return pdfP||(pdfP=new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=()=>ok(window.jspdf.jsPDF);s.onerror=()=>{pdfP=null;no()};document.head.appendChild(s)}))}
async function imgOf(id){const b=await fileBlob(id);const du=await new Promise((ok,no)=>{const f=new FileReader();f.onload=()=>ok(f.result);f.onerror=no;f.readAsDataURL(b)});const im=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=du});return{du,w:im.naturalWidth,h:im.naturalHeight,fmt:/^data:image\/png/.test(du)?'PNG':'JPEG'}}
const pdfTitle=(k,r)=>k==='epp'&&r.mov==='Entrega a personal'?'Comprobante de entrega de EPP':k==='botiquin'&&r.mov==='Salida / entrega'?'Comprobante de entrega de medicamentos':M[k].s;
const pdfName=(k,r)=>(pdfTitle(k,r)+' - '+(k==='sucesos'?(r.codigo||'')+' '+(r.relato||''):(r.persona||r.equipo||r.involucrado||r.codigo||r.tema||''))+' - '+fdmy(r.fecha||today())).replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,' ').slice(0,120);
async function makePDF(k,r){const J=await loadPdf(),doc=new J({unit:'mm',format:'letter'}),W=215.9,X=14,CW=W-2*X;let y=0;
 const T=v=>String(v??'').replace(/[–—]/g,'-').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/×/g,'x').replace(/←/g,'<-').replace(/→/g,'->').replace(/[^\x00-\xFF]/g,'');
 const need=h=>{if(y+h>262){doc.addPage();y=18}};
 const H=t=>{need(14);y+=3;doc.setFont('helvetica','bold');doc.setFontSize(12);doc.setTextColor(20);doc.text(T(t),X,y);doc.setDrawColor(255,90,0);doc.setLineWidth(.8);doc.line(X,y+1.6,X+CW,y+1.6);y+=8};
 const kv=(l,v)=>{if(v===''||v==null)return;doc.setFontSize(10);const ln=doc.splitTextToSize(T(v),CW-50);need(ln.length*4.6+2);doc.setFont('helvetica','bold');doc.setTextColor(90);doc.text(T(l),X,y);doc.setFont('helvetica','normal');doc.setTextColor(20);doc.text(ln,X+50,y);y+=ln.length*4.6+2};
 const title=pdfTitle(k,r);
 doc.setFillColor(20,20,20);doc.rect(0,0,W,27,'F');doc.setFillColor(255,90,0);doc.rect(0,27,W,2.5,'F');
 try{const lg=await loadLogo();if(lg){const lh=11,lw=lh*lg.w/lg.h;doc.addImage(lg.du,'PNG',W-X-lw,3.5,lw,lh)}}catch(e){}
 doc.setTextColor(255);doc.setFont('helvetica','bold');doc.setFontSize(15);doc.text(T(title),X,12,{maxWidth:W-2*X-74});doc.setFont('helvetica','normal');doc.setFontSize(9.5);
 doc.text(T((cfg.empresa?cfg.empresa+'  |  ':'')+'Proyecto '+(cfg.proyecto||'Yorito - Empalme RN-23')),X,19);doc.text(T('Seguridad Industrial y Salud Ocupacional (SISO)'),X,24);
 doc.setFontSize(9);doc.text(T((r.codigo?r.codigo+'  |  ':'')+'Fecha: '+fdmy(r.fecha||today())),W-X,23,{align:'right'});
 y=40;doc.setTextColor(20);
 if(k==='sucesos')await pdfSuc(doc,r,T);else{
 const m=M[k];const plain=m.f.filter(f=>!['chk','fotos','firma','lista','area','hdr','multi'].includes(f.t)),areas=m.f.filter(f=>f.t==='area');
 H('Datos del registro');for(const f of plain){let v=r[f.k];if(f.t==='date')v=v?fdmy(v):'';kv(f.l,v)}
 for(const f of m.f.filter(f=>f.t==='lista')){const its=eitems(r);H(f.l);need(8);doc.setFillColor(245,242,238);doc.rect(X,y-4.5,CW,7,'F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text('Artículo',X+2,y);doc.text('Cantidad',X+CW-(f.vida?60:2),y,{align:'right'});if(f.vida)doc.text(f.vida==='est'?'Estación':'Vida útil',X+CW-2,y,{align:'right'});y+=7;doc.setFont('helvetica','normal');
  for(const i of its){need(7);doc.text(T(i.art),X+2,y);doc.text(String(i.cant||1),X+CW-(f.vida?60:2),y,{align:'right'});if(f.vida)doc.text(f.vida==='est'?T(i.est||'-'):i.vida?T(i.vida+' meses'):'-',X+CW-2,y,{align:'right'});doc.setDrawColor(220);doc.setLineWidth(.2);doc.line(X,y+2,X+CW,y+2);y+=7}
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
  doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(90);doc.text(T(fl.l+(r.firmaFecha?' - '+fdmy(r.firmaFecha):'')),X+bw/2,y+43,{align:'center'});doc.text('Supervisor SISO',X+CW-bw/2,y+43,{align:'center'});doc.setTextColor(20);y+=50}
 const ph=r.fotos||[];if(ph.length){H('Evidencia fotográfica ('+ph.length+')');const cw=(CW-6)/2;let col=0,rowH=0;
  for(let i=0;i<ph.length;i++){let im;try{im=await imgOf(ph[i])}catch(e){continue}let w=cw,h=w*im.h/im.w;if(h>78){h=78;w=h*im.w/im.h}
   if(col===0){need(h+8)}const cx=X+col*(cw+6)+(cw-w)/2;doc.addImage(im.du,im.fmt,cx,y,w,h);doc.setFontSize(8);doc.setTextColor(90);doc.text('Foto '+(i+1),X+col*(cw+6),y+h+4);doc.setTextColor(20);rowH=Math.max(rowH,h+8);
   if(col===1){y+=rowH;col=0;rowH=0}else col=1}
  if(col===1)y+=rowH}
 }
 const n=doc.getNumberOfPages();for(let i=1;i<=n;i++){doc.setPage(i);doc.setFontSize(8);doc.setTextColor(120);doc.text(T('Generado '+fdmy(today())+' - Plataforma SISO '+(cfg.proyecto||'')),X,272);doc.text('Pág. '+i+' de '+n,W-X,272,{align:'right'})}
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
 if(a==='pre'){const e=findEq(p1)||{},p=perOfEq(e);return openForm('insp',null,{equipo:p1,conductor:p?p.nombre:(e.asignado||''),marca:e.marca||'',modelo:e.modelo||'',placa:e.placa||''})}
 if(a==='edit')return openForm(p1,p2);
 if(a==='goto'){if(p1==='@informe')location.hash='informe';else location.hash='m-'+p1;return}
 if(a==='scroll'){const el=document.getElementById(p1);el&&el.scrollIntoView({behavior:'smooth'});return}
 if(a==='ag'){if(p1==='0')agMes=today().slice(0,7);else{const[y,m]=agMes.split('-').map(Number);agMes=iso(new Date(y,m-1+(+p1),1)).slice(0,7)}render();return}
 if(a==='inf'){const[y,m]=infMes.split('-').map(Number);infMes=iso(new Date(y,m-1+(+p1),1)).slice(0,7);render();return}
 if(a==='copyinf'){try{await navigator.clipboard.writeText(infText());toast('Texto copiado')}catch(e){$('#sheet').innerHTML=`<div class="hd"><h3>Texto del informe</h3><button class="btn sm dk" data-act="close">✕</button></div><div class="bd"><textarea style="min-height:60vh">${esc(infText())}</textarea></div>`;$('#modal').classList.add('on')}return}
 if(a==='xinf'){const inM=r=>String(r.fecha||'').startsWith(infMes);const ml=MES[+infMes.slice(5)-1]+' '+infMes.slice(0,4);return exportX('Informe SISO '+infMes,ORDER.filter(k=>!M[k].nodate).flatMap(k=>k==='insp'?inspSheets(R(k).filter(inM),ml):[[M[k].n,rowsFor(k,R(k).filter(inM)),'Informe SISO '+ml+' · '+M[k].n]]))}
 if(a==='x'&&p1==='insp')return exportX('Inspección de vehículos y equipo '+today(),inspSheets(R('insp')));
 if(a==='x'){const sh=[[M[p1].n,rowsFor(p1)]];if(M[p1].inv)sh.unshift(['Inventario',invRows(M[p1].inv),'Inventario de '+(p1==='epp'?'EPP':'botiquín')]);return exportX(M[p1].n+' '+today(),sh)}
 if(a==='xall')return exportX('SISO Yorito '+today(),[['Inventario EPP',invRows('catepp'),'Inventario de EPP'],['Inventario botiquín',invRows('catbot'),'Inventario de botiquín'],...ORDER.map(k=>[M[k].n,rowsFor(k)])]);
 if(a==='close')return closeM();
 if(a==='allC'){for(const s of document.querySelectorAll('#f_'+p1+' .seg'))for(const x of s.children)x.className=x.dataset.v==='C'?'C':'';return}
 if(a==='save'||a==='dup'||a==='pdf'){if(!cur)return;if(cur.up){toast('Espera a que terminen de subir las fotos');return}const o=collect(),m=M[cur.k];const miss=m.f.find(f=>f.req&&!o[f.k]);if(miss){toast('Falta: '+miss.l);return}
  o.creado=(cur.r&&cur.r.creado)||new Date().toISOString();
  if(m.inv&&!o.lista.length){toast('Agrega al menos un artículo');return}
  if(m.inv&&a!=='dup'){const c=m.inv,sm=stockMap(c),nw=o.lista.filter(i=>!R(c).some(x=>norm(x.nombre)===norm(i.art)));
   if(nw.length&&!cur.newOk){cur.newOk=1;toast('“'+nw.map(i=>i.art).join('”, “')+'” no está en el inventario. Toca de nuevo para crearlo como artículo nuevo.');return}
   for(const i of o.lista){const ex=R(c).find(x=>norm(x.nombre)===norm(i.art));if(ex)i.art=ex.nombre;else await save(c,'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),{nombre:i.art,inicial:0,minimo:0,obs:'Creado desde un movimiento'})}
   if(!isIn(o)){const prev=cur.id&&!isIn(cur.r)?eitems(cur.r):[];const neg=o.lista.filter(i=>{const v=sm[norm(i.art)];const back=prev.filter(p=>norm(p.art)===norm(i.art)).reduce((a,p)=>a+(+p.cant||0),0);return (v?v.ex:0)+back-(+i.cant||0)<0});if(neg.length&&!cur.negOk){cur.negOk=1;toast('Atención: '+neg.map(i=>i.art).join(', ')+' quedará en negativo. Toca de nuevo para guardar igual.');return}}}
  if(m.cat&&R(cur.k).some(x=>x.id!==cur.id&&norm(x.nombre)===norm(o.nombre))){toast('Ese artículo ya existe en el inventario');return}

  if(cur.k==='equipos'&&!cur.id&&R('equipos').some(e=>e.inv===o.inv)){toast('Ese inventario ya existe');return}
  if(a==='dup'){const k=cur.k,c={...o};delete c.codigo;for(const f of m.f.filter(f=>f.t==='firma')){delete c[f.k];delete c[f.k+'Fecha']}delete c.comprobante;c.fotos=[];if(!m.nodate)c.fecha=today();closeM();openForm(k,null,c);toast('Copia lista: revisa y guarda');return}
  b.disabled=true;
  const sk=Object.keys(cur.sig).filter(k=>cur.sig[k].dirty&&cur.sig[k].blob);if(sk.length){if(!as||!navigator.onLine){toast('Sin conexión: la firma necesita señal para guardarse');b.disabled=false;return}try{for(const k of sk){const bl=cur.sig[k].blob;const up=await as.upload(bl,{type:'image/png'});o[k]=up.id;o[k+'Fecha']=today();cur.sig[k]={id:up.id,dirty:false,resign:false};cur.r[k+'Fecha']=o[k+'Fecha']}}catch(e){toast('No se pudo guardar la firma: '+(e&&e.message||'revisa la conexión'));b.disabled=false;return}}
  if(cur.r.comprobante)o.comprobante=cur.r.comprobante;
  const id=cur.id||(cur.k==='equipos'?o.inv.replace(/[^\w.~@+-]/g,'_'):'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6));
  const ok=await save(cur.k,id,o);if(!ok){b.disabled=false;return}
  if(cur.k==='personal'&&o.unidad){const e=findEq(o.unidad);if(e&&e.asignado!==o.nombre){const {id:eid,...d}=e;d.asignado=o.nombre;await save('equipos',eid,d)}}
  if(a==='save'){b.disabled=false;toast('Guardado');closeM();return}
  cur.id=id;cur.r={...o};const k=cur.k;
  if(k==='sucesos'){b.textContent='Generando Excel…';try{const blob=await sucX(o);closeM();await saveFile(sucFile(o),blob);toast('Reporte de suceso en Excel listo')}catch(e){b.disabled=false;b.textContent=pdfLabel(k,o);toast('No se pudo generar el Excel'+(navigator.onLine?'':' (revisa la conexión)'))}return}
  b.textContent='Generando PDF…';
  try{const blob=await makePDF(k,o);let pid='';if(as&&navigator.onLine){try{pid=(await as.upload(blob,{type:'application/pdf'})).id;await save(k,id,{...o,comprobante:pid})}catch(e){}}
   closeM();await saveFile(pdfName(k,o)+'.pdf',blob);toast(pid?'PDF guardado en el registro y descargado':'PDF descargado (sin señal no se guardó copia en el registro)')}
  catch(e){b.disabled=false;b.textContent=pdfLabel(k,o);toast('No se pudo generar el PDF')}
  return}
 if(a==='rmph'){cur.fotos.splice(+p1,1);refreshPh();return}
 if(a==='sigclear'){const c=$('#sigc_'+(p1||'firma'));if(c){c.getContext('2d').clearRect(0,0,c.width,c.height);cur.sig[p1||'firma'].dirty=false}return}
 if(a==='resign'){const k=p1||'firma';cur.sig[k].resign=true;$('#f_'+k).innerHTML=sigHTML(k);initSig();return}
 if(a==='addli'){const L=$('#f_lista');L.insertAdjacentHTML('beforeend',liRow({art:'',cant:1},L.dataset.vida));return}
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
 <label class="f"><span>Título completo del proyecto (encabezado de Excel y PDF)</span><textarea id="c_t" style="min-height:64px">${esc(cfg.titulo||'Proyecto Pavimentación con Doble Tratamiento Superficial, Ruta 43, Tramo Yorito – Empalme RN-23 (13.65 km), Departamento de Yoro')}</textarea></label>
 <label class="f"><span>Subtítulo</span><input id="c_s" value="${esc(cfg.sub||'Pavimentación DTS · 13.65 km')}"></label>
 <label class="f"><span>Inicio de tus entregas (no se marcan atrasadas las anteriores)</span><input id="c_i" type="date" value="${esc(cfg.inicio||'')}"></label>
 <label class="f"><span>Supervisor SISO (aparece en los comprobantes)</span><input id="c_u" value="${esc(cfg.siso||'')}"></label>
 <label class="f"><span>Empresa</span><input id="c_e" value="${esc(cfg.empresa||'')}"></label>
 <label class="f" style="display:flex;gap:10px;align-items:center"><input id="c_m" type="checkbox" ${cfg.marca===false?'':'checked'} style="width:24px;min-height:24px"><span style="margin:0">Marca de agua en las fotos (logo, fecha, hora, clima, lugar, coordenadas y registro)</span></label>
 <button class="btn pri" data-act="cfgsave">Guardar datos del proyecto</button>
 <h3 style="margin:22px 0 8px">Datos iniciales del proyecto</h3><p class="hint" style="margin:0 0 8px">Agrega los equipos, licencias, extintores, señalización y movimientos de EPP de los archivos del proyecto que todavía no estén en tu base.</p><button class="btn" data-act="seedmerge">Revisar qué falta</button><div id="seedres" style="margin-top:10px"></div>
 <h3 style="margin:22px 0 8px">Respaldo</h3><div class="tools"><button class="btn" data-act="bk">Descargar respaldo (.json)</button><label class="btn" style="display:inline-flex;align-items:center;cursor:pointer">Importar respaldo<input id="imp" type="file" accept=".json,application/json" style="position:absolute;width:1px;height:1px;opacity:0"></label></div>
 ${queue.length?`<p class="hint">${queue.length} cambio(s) guardados en este dispositivo esperando señal. <button class="btn sm" data-act="flushnow">Enviar ahora</button> <button class="btn sm" data-act="clearq" style="color:var(--bad)">Descartar</button></p>`:''}
 <h3 style="margin:22px 0 8px">Cuenta</h3><p style="margin:0 0 10px">${esc(user.email||'')}</p><button class="btn" data-act="logout">Cerrar sesión</button>
 <p class="hint" style="margin-top:16px">Para instalar: en el celular abre el menú del navegador y elige “Agregar a pantalla de inicio”; en la computadora, el ícono de instalar en la barra de direcciones.</p></div>`;
 $('#modal').classList.add('on')});
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='cfgsave'){await save('config','proyecto',{...cfg,proyecto:$('#c_p').value.trim(),titulo:$('#c_t').value.trim(),sub:$('#c_s').value.trim(),inicio:$('#c_i').value,siso:$('#c_u').value.trim(),empresa:$('#c_e').value.trim(),marca:$('#c_m').checked});head();toast('Guardado');closeM();render()}
 if(a==='bk'){const d={app:'SISO',version:2,fecha:new Date().toISOString(),config:cfg,datos:{}};for(const k of ALL)d.datos[k]=R(k);await saveFile('Respaldo SISO '+today()+'.json',new Blob([JSON.stringify(d,null,1)],{type:'application/json'}));toast('Respaldo listo')}
 if(a==='logout'){if(queue.length){toast('Tienes cambios sin enviar. Conéctate antes de cerrar sesión.');return}await sb.auth.signOut();LS.set('siso_cache',null);for(const k of ALL)S[k]=[];cfg={};closeM();render()}
 if(a==='clearq'){queue=[];LS.set('siso_queue',queue);closeM();pull();toast('Cambios pendientes descartados')}
 if(a==='flushnow'){closeM();flush()}
 if(a==='seed'){b.disabled=true;b.textContent='Cargando…';try{const r=await fetch('datos-iniciales.json',{cache:'no-store'});const d=await r.json();const n=await importData(d);toast(n+' registros cargados')}catch(e){b.disabled=false;b.textContent='Cargar datos iniciales del proyecto';toast('No se pudieron cargar: '+(e.message||e))}}
});
document.addEventListener('change',async e=>{if(e.target.id!=='imp')return;const f=e.target.files[0];e.target.value='';if(!f)return;try{const d=JSON.parse(await f.text());if(!d.datos)throw new Error('El archivo no es un respaldo de SISO');const n=await importData(d);closeM();toast(n+' registros importados')}catch(err){toast('No se pudo importar: '+(err.message||err))}});
/* completar la base con los datos iniciales sin borrar ni reemplazar lo que ya registraste */
const NK={equipos:r=>String(r.inv||'').trim().toUpperCase(),personal:r=>norm(r.nombre),catepp:r=>norm(r.nombre),catbot:r=>norm(r.nombre),senal:r=>norm(r.senal),extintores:r=>String(r.equipo||'').toUpperCase()+'|'+r.fecha,epp:r=>r.fecha+'|'+r.mov+'|'+norm(r.persona)+'|'+eitems(r).map(i=>norm(i.art)+':'+(+i.cant||1)).join(',')};
const NOMB={equipos:'equipos',personal:'personas',catepp:'artículos de EPP',catbot:'artículos de botiquín',senal:'rótulos de señalización',extintores:'inspecciones de extintor',epp:'movimientos de EPP',config:'datos del proyecto'};
let seedPlan=null;
async function planSeed(){const d=await (await fetch('datos-iniciales.json',{cache:'no-store'})).json();const plan=[];
 for(const [k,arr] of Object.entries(d.datos||{})){const key=NK[k]||(r=>r.id);for(const r of arr){const {id,...data}=r;const ex=R(k).find(x=>x.id===id)||R(k).find(x=>key(x)===key(r));
  if(!ex){plan.push({k,id,data,t:'add'});continue}const upd={};for(const [f,v] of Object.entries(data))if(v!==''&&v!=null&&!(Array.isArray(v)&&!v.length)&&(ex[f]===''||ex[f]==null))upd[f]=v;
  if(Object.keys(upd).length){const {id:eid,...old}=ex;plan.push({k,id:eid,data:{...old,...upd},t:'fill'})}}}
 if(d.config){const upd={};for(const [f,v] of Object.entries(d.config))if(v&&!cfg[f])upd[f]=v;if(Object.keys(upd).length)plan.push({k:'config',id:'proyecto',data:{...cfg,...upd},t:cfg.proyecto?'fill':'add'})}
 return plan}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
 if(a==='seedmerge'){b.disabled=true;try{seedPlan=await planSeed()}catch(e){b.disabled=false;toast('No se pudo leer datos-iniciales.json');return}
  const add={},fill={};for(const p of seedPlan)(p.t==='add'?add:fill)[p.k]=((p.t==='add'?add:fill)[p.k]||0)+1;
  const li=o=>Object.entries(o).map(([k,n])=>`<li>${n} ${NOMB[k]||k}</li>`).join('');
  $('#seedres').innerHTML=seedPlan.length?`<div class="note"><b>Se agregarán:</b><ul style="margin:6px 0">${li(add)||'<li>nada nuevo</li>'}</ul>${Object.keys(fill).length?`<b>Se completarán campos vacíos en:</b><ul style="margin:6px 0">${li(fill)}</ul>`:''}<small>No se borra ni se reemplaza nada de lo que ya registraste. Lo que ya existe (mismo inventario, mismo nombre o mismo movimiento) no se duplica.</small><br><button class="btn pri" data-act="seedapply" style="margin-top:10px">Aplicar</button></div>`:'<p class="note">Tu base ya tiene todos los datos iniciales. No hay nada que agregar.</p>';b.disabled=false}
 if(a==='seedapply'&&seedPlan){b.disabled=true;b.textContent='Guardando…';let n=0;for(const p of seedPlan){await save(p.k,p.id,p.data);n++}seedPlan=null;closeM();toast(n+' registros agregados o completados')}
});
boot();
}

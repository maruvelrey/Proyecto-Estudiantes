const API_URL = "http://localhost:8080/students";

let allowClickSound = true; 

function bloquearClickMientrasSuena(audioElement){
  allowClickSound = false;
  audioElement.onended = () => {
    allowClickSound = true;
  };
}

//Sonidos
function playClick(){
  if(!allowClickSound) return; 
  const s = document.getElementById("soundClick");
  if(s){
    s.pause();
    s.currentTime = 0;
    s.play().catch(()=>{});
  }
}

function playSuccess(){
  const s = document.getElementById("soundSuccess");
  if(s){
    bloquearClickMientrasSuena(s); 
    s.pause();
    s.currentTime = 0;
    s.play().catch(()=>{});
  }
}

function playError(){
  const s = document.getElementById("soundError");
  if(s){
    bloquearClickMientrasSuena(s); 
    s.pause();
    s.currentTime = 0;
    s.play().catch(()=>{});
  }
}

//Mensajes
function showMessage(containerId, htmlMessage, typeClass = "alert", durationMs = 3000){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = `<div class="${typeClass}">${htmlMessage}</div>`;
  if(durationMs > 0){
    setTimeout(()=> { if(container.innerHTML.includes(htmlMessage)) container.innerHTML = ""; }, durationMs);
  }
}

function limpiarTodo(){
  const idsToClear = ["buscarId","resultadoBuscar","agregadoMsg","editId","editNombre","editApellido","editCorreo","editTelefono","editIdioma","editarCompletoMsg","editParcialId","parcialOpciones","parcialCampo","deleteId","deleteInfo"];
  idsToClear.forEach(id => { const el=document.getElementById(id); if(!el) return; if(el.tagName==="INPUT"||el.tagName==="SELECT") el.value=""; else el.innerHTML=""; });
  const f1 = document.getElementById("formAgregar"); if(f1) f1.reset();
  const f2 = document.getElementById("formEditar"); if(f2) f2.reset();
}

//Navegación
function abrirSeccion(id){
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  const sec = document.getElementById(id);
  if(sec) sec.classList.add("active");
  if(id === "menuPrincipal") limpiarTodo();
}

//Validar Información
function esNombreValido(texto){
  if(!texto) return false;
  const trimmed = texto.trim();
  const sinEsp = trimmed.replace(/\s+/g,"");
  if(sinEsp.length < 3 || sinEsp.length > 40) return false;
  const palabras = trimmed.split(/\s+/);
  if(palabras.length > 4) return false;
  if(!/[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(sinEsp)) return false;
  return palabras.every(p => /^[A-Za-zÁÉÍÓÚáéíóúÑñ]{2,}$/.test(p));
}
function esTelefonoValido(t){ return /^\d{10}$/.test(t); }
function esCorreoValido(c){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c); }

//Cargar Estudiantes
async function cargarEstudiantes(){
  try{
    const res = await fetch(API_URL);
    if(!res.ok){ document.getElementById("tablaEstudiantes").innerHTML=""; return; }
    const lista = await res.json();
    const tbody = document.getElementById("tablaEstudiantes");
    tbody.innerHTML = "";
    lista.forEach(s => {
      tbody.innerHTML += `<tr>
        <td>${s.id}</td><td>${s.nombre}</td><td>${s.apellido}</td><td>${s.correo}</td><td>${s.numeroTelefono}</td><td>${s.idioma}</td>
      </tr>`;
    });
  }catch(e){ console.error(e); }
}

//Buscar Estudiante
async function buscarPorId(){
  const id = document.getElementById("buscarId").value;
  const cont = "resultadoBuscar";
  document.getElementById(cont).innerHTML = "";
  if(!id || Number(id) < 1){ playError(); showMessage(cont,"Ingrese un ID válido.","alert",2000); return; }
  try{
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok){ playError(); showMessage(cont,"Estudiante no encontrado.","alert",2000); return; }
    const e = await res.json();
    showMessage(cont,`<strong>ID:</strong> ${e.id}<br><strong>Nombre:</strong> ${e.nombre}<br><strong>Apellido:</strong> ${e.apellido}<br><strong>Correo:</strong> ${e.correo}<br><strong>Teléfono:</strong> ${e.numeroTelefono}<br><strong>Idioma:</strong> ${e.idioma}`,"success",0);
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error de conexión.","alert",2000); }
}

//Agregar Estudiante
document.getElementById("formAgregar").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const idioma = document.getElementById("idioma").value;

  if(!esNombreValido(nombre) || !esNombreValido(apellido)){ playError(); showMessage("agregadoMsg","Nombre o apellido inválido.","alert",2200); return; }
  if(!esCorreoValido(correo)){ playError(); showMessage("agregadoMsg","Correo inválido.","alert",2200); return; }
  if(!esTelefonoValido(telefono)){ playError(); showMessage("agregadoMsg","Teléfono inválido (10 dígitos).","alert",2200); return; }

  try{
    const lista = await fetch(API_URL).then(r => r.json());
    if(lista.some(s => s.numeroTelefono === telefono)){ playError(); showMessage("agregadoMsg","Ese teléfono ya existe.","alert",2200); document.getElementById("telefono").value=""; return; }
    if(lista.some(s => s.correo === correo)){ playError(); showMessage("agregadoMsg","Ese correo ya existe.","alert",2200); return; }
    if(lista.some(s => s.nombre === nombre && s.apellido === apellido)){ playError(); showMessage("agregadoMsg","Ese estudiante ya existe.","alert",2200); return; }
  }catch(e){ console.error(e); showMessage("agregadoMsg","Error comprobando duplicados.","alert",2200); return; }

  const nuevo = { nombre, apellido, correo, numeroTelefono:telefono, idioma };
  try{
    const res = await fetch(API_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(nuevo) });
    if(res.ok){ const creado = await res.json(); playSuccess(); showMessage("agregadoMsg",`Estudiante agregado (ID ${creado.id}).`,"success",1800); document.getElementById("formAgregar").reset(); if(document.getElementById("ver").classList.contains("active")) cargarEstudiantes(); }
    else { playError(); const err = await res.json().catch(()=>({error:"Error"})); showMessage("agregadoMsg",err.error || "Error al agregar.","alert",2200); }
  }catch(err){ console.error(err); playError(); showMessage("agregadoMsg","Error de conexión.","alert",2200); }
});

//Editar Completo
let estudianteCompleto = null;
async function cargarParaEditarCompleto(){
  const id = document.getElementById("editId").value;
  const cont = "editarCompletoMsg";
  document.getElementById(cont).innerHTML = "";
  if(!id || Number(id) < 1){ playError(); showMessage(cont,"Ingrese un ID válido.","alert",2200); return; }
  try{
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok){ playError(); showMessage(cont,"Estudiante no encontrado.","alert",2200); return; }
    const est = await res.json();
    estudianteCompleto = est;
    document.getElementById("editNombre").value = est.nombre || "";
    document.getElementById("editApellido").value = est.apellido || "";
    document.getElementById("editCorreo").value = est.correo || "";
    document.getElementById("editTelefono").value = est.numeroTelefono || "";
    document.getElementById("editIdioma").value = est.idioma || "";
    playClick(); showMessage(cont,"Campos cargados. Ya puede editar y guardar.","success",2000);
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error de conexión.","alert",2200); }
}

document.getElementById("formEditar").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const id = document.getElementById("editId").value;
  const cont = "editarCompletoMsg";
  document.getElementById(cont).innerHTML = "";
  if(!id || Number(id) < 1){ playError(); showMessage(cont,"Ingrese ID válido.","alert",2200); return; }

  if(!estudianteCompleto || String(estudianteCompleto.id) !== String(id)){
    try{ estudianteCompleto = await fetch(`${API_URL}/${id}`).then(r=>r.ok? r.json(): null); }catch{}
  }

  const nombreVal = document.getElementById("editNombre").value.trim();
  const apellidoVal = document.getElementById("editApellido").value.trim();
  const correoVal = document.getElementById("editCorreo").value.trim();
  const telVal = document.getElementById("editTelefono").value.trim();
  const idiomaVal = document.getElementById("editIdioma").value;

  if(nombreVal && !esNombreValido(nombreVal)){ playError(); showMessage(cont,"Nombre inválido.","alert",2200); return; }
  if(apellidoVal && !esNombreValido(apellidoVal)){ playError(); showMessage(cont,"Apellido inválido.","alert",2200); return; }
  if(correoVal && !esCorreoValido(correoVal)){ playError(); showMessage(cont,"Correo inválido.","alert",2200); return; }
  if(telVal && !esTelefonoValido(telVal)){ playError(); showMessage(cont,"Teléfono inválido.","alert",2200); return; }

  try{
    const lista = await fetch(API_URL).then(r=>r.json());
    const actual = lista.find(s=> String(s.id) === String(id)) || {};
    if(telVal && telVal !== actual.numeroTelefono && lista.some(s => s.numeroTelefono === telVal)){ playError(); showMessage(cont,"❌ El teléfono ya pertenece a otro estudiante.","alert",2500); document.getElementById("editTelefono").value=""; return; }
    if(correoVal && correoVal !== actual.correo && lista.some(s => s.correo === correoVal)){ playError(); showMessage(cont,"❌ El correo ya pertenece a otro estudiante.","alert",2500); document.getElementById("editCorreo").value=""; return; }
  }catch(e){ console.error(e); }

  const payload = {
    nombre: nombreVal || (estudianteCompleto ? estudianteCompleto.nombre : ""),
    apellido: apellidoVal || (estudianteCompleto ? estudianteCompleto.apellido : ""),
    correo: correoVal || (estudianteCompleto ? estudianteCompleto.correo : ""),
    numeroTelefono: telVal || (estudianteCompleto ? estudianteCompleto.numeroTelefono : ""),
    idioma: idiomaVal || (estudianteCompleto ? estudianteCompleto.idioma : "")
  };

  try{
    const res = await fetch(`${API_URL}/${id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
    if(res.ok){ playSuccess(); showMessage(cont,"Estudiante actualizado correctamente.","success",2000); if(document.getElementById("ver").classList.contains("active")) cargarEstudiantes(); }
    else { playError(); showMessage(cont,"No se pudo actualizar.","alert",2200); }
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error de conexión.","alert",2200); }
});

// Editar Parcial
let _studentForPartial = null;
async function mostrarOpcionesParcial(){
  const id = document.getElementById("editParcialId").value;
  const div = document.getElementById("parcialOpciones");
  const campoDiv = document.getElementById("parcialCampo");
  div.innerHTML = ""; campoDiv.innerHTML = "";
  if(!id || Number(id) < 1){ playError(); showMessage("parcialOpciones","Ingrese un ID válido.","alert",2200); return; }
  try{
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok){ playError(); showMessage("parcialOpciones","Estudiante no encontrado.","alert",2200); return; }
    const est = await res.json();
    _studentForPartial = est;
    div.innerHTML = `
      <div class="success"><strong>Estudiante:</strong> ${est.nombre} ${est.apellido}<br><strong>ID:</strong> ${est.id}</div>
      <p>Seleccione el campo a modificar (ver valor actual en paréntesis)</p>
      <select id="campoParcialSelect">
        <option value="nombre">Nombre (Actual: ${est.nombre})</option>
        <option value="apellido">Apellido (Actual: ${est.apellido})</option>
        <option value="correo">Correo (Actual: ${est.correo})</option>
        <option value="numeroTelefono">Teléfono (Actual: ${est.numeroTelefono})</option>
        <option value="idioma">Idioma (Actual: ${est.idioma})</option>
      </select>
      <button onclick="playClick(); mostrarCampoParcial()">Continuar</button>
    `;
  }catch(err){ console.error(err); playError(); showMessage("parcialOpciones","Error de conexión.","alert",2200); }
}

function mostrarCampoParcial(){
  const campo = document.getElementById("campoParcialSelect").value;
  const div = document.getElementById("parcialCampo");
  div.innerHTML = "";
  if(!_studentForPartial){ playError(); showMessage("parcialCampo","No hay estudiante cargado.","alert",2200); return; }

  if(campo === "idioma"){
    div.innerHTML = `
      <p>Idioma actual: <strong>${_studentForPartial.idioma}</strong></p>
      <select id="valorEditarParcial">
        <option ${_studentForPartial.idioma==="Español"?"selected":""}>Español</option>
        <option ${_studentForPartial.idioma==="Inglés"?"selected":""}>Inglés</option>
        <option ${_studentForPartial.idioma==="Francés"?"selected":""}>Francés</option>
      </select>
      <button onclick="playClick(); guardarEdicionParcial()">Guardar</button>
    `;
  } else {
    const actual = _studentForPartial[campo] || "";
    div.innerHTML = `
      <p>Valor actual: <strong>${actual}</strong></p>
      <input type="text" id="valorEditarParcial" placeholder="Nuevo valor">
      <button onclick="playClick(); guardarEdicionParcial()">Guardar</button>
    `;
  }
}

async function guardarEdicionParcial(){
  const campo = document.getElementById("campoParcialSelect").value;
  let valor = document.getElementById("valorEditarParcial").value && document.getElementById("valorEditarParcial").value.trim();
  const cont = "parcialCampo";
  if(!valor){ playError(); showMessage(cont,"Ingrese un valor válido.","alert",2000); return; }

  if((campo==="nombre"||campo==="apellido") && !esNombreValido(valor)){ playError(); showMessage(cont,"Nombre/apellido inválido.","alert",2200); return; }
  if(campo==="numeroTelefono" && !/^\d{10}$/.test(valor)){ playError(); showMessage(cont,"Teléfono inválido (10 dígitos).","alert",2200); return; }
  if(campo==="correo" && !esCorreoValido(valor)){ playError(); showMessage(cont,"Correo inválido.","alert",2200); return; }

  try{
    const lista = await fetch(API_URL).then(r=>r.json());
    if(campo==="numeroTelefono" && lista.some(s=>s.numeroTelefono===valor && s.id!==_studentForPartial.id)){ playError(); showMessage(cont,"❌ Este teléfono ya fue registrado por otro estudiante.","alert",2200); return; }
    if(campo==="correo" && lista.some(s=>s.correo===valor && s.id!==_studentForPartial.id)){ playError(); showMessage(cont,"❌ Este correo ya fue registrado por otro estudiante.","alert",2200); return; }
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error comprobando duplicados.","alert",2200); return; }

  const cambios = {
    nombre: _studentForPartial.nombre,
    apellido: _studentForPartial.apellido,
    correo: _studentForPartial.correo,
    numeroTelefono: _studentForPartial.numeroTelefono,
    idioma: _studentForPartial.idioma
  };
  cambios[campo] = valor;

  try{
    const res = await fetch(`${API_URL}/${_studentForPartial.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify(cambios) });
    if(res.ok){ playSuccess(); showMessage(cont,"Campo actualizado correctamente.","success",1500); _studentForPartial[campo]=valor; if(document.getElementById("ver").classList.contains("active")) cargarEstudiantes(); }
    else { playError(); showMessage(cont,"No se pudo actualizar.","alert",2200); }
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error de conexión.","alert",2200); }
}

//Eliminar Estudiante
async function mostrarConfirmacion(){
  const id = document.getElementById("deleteId").value;
  const cont = "deleteInfo";
  document.getElementById(cont).innerHTML = "";
  if(!id || Number(id)<1){ playError(); showMessage(cont,"Ingrese un ID válido.","alert",2200); return; }
  try{
    const res = await fetch(`${API_URL}/${id}`);
    if(!res.ok){ playError(); showMessage(cont,"Estudiante no encontrado.","alert",2200); return; }
    const e = await res.json();
    const html = `<div class="alert"><strong>ID:</strong> ${e.id}<br><strong>Nombre:</strong> ${e.nombre} ${e.apellido}<br><strong>Correo:</strong> ${e.correo}<br>
                  <button onclick="playClick(); eliminarEstudiante(${e.id})" style="background:#d70088;margin-top:10px;color:#fff;">Eliminar</button></div>`;
    document.getElementById(cont).innerHTML = html;
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error de conexión.","alert",2200); }
}

async function eliminarEstudiante(id){
  const cont = "deleteInfo";
  try{
    const res = await fetch(`${API_URL}/${id}`, { method:"DELETE" });
    if(res.ok){ playSuccess(); showMessage(cont,"Estudiante eliminado correctamente.","success",1500); if(document.getElementById("ver").classList.contains("active")) cargarEstudiantes(); }
    else { playError(); showMessage(cont,"No se pudo eliminar.","alert",2200); }
  }catch(err){ console.error(err); playError(); showMessage(cont,"Error de conexión.","alert",2200); }
}

//Inicialización
document.addEventListener("DOMContentLoaded", () => { abrirSeccion("menuPrincipal"); });
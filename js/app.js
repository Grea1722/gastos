// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//Eventos
eventListeners();

function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

  formulario.addEventListener("submit", agregarGasto);
}

//Classes
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    console.log(this.gastos);
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    //crear div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //Mnesaje de error
    divMensaje.textContent = mensaje;

    //insertar en html
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

//instanciar
const ui = new UI();
let presupuesto;
//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Cual es tu presupuesto?");
  console.log(Number(presupuestoUsuario));

  if (
    presupuestoUsuario === "" ||
    presupuestoUsuario === null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

//agregar gasto

function agregarGasto(e) {
  e.preventDefault();

  //leer gastos de formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (nombre === "" && cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
  } else if (cantidad <= 0 || cantidad == isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }

  //Generar objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };

  //agrega nuevo gasto
  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta("Gasto agregado correctamente");

  //reiniciar formulario
  formulario.reset();
}

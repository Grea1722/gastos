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
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
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

  agregarGastoListado(gastos) {
    this.limpiarHtml();
    //iterar sobre los gastos
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;
      //crear li
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // nuevoGasto.setAttribute("data-id", id);
      nuevoGasto.dataset.id = id;
      //agregar gasto html
      nuevoGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'>$${cantidad}</span>`;

      //btn para borrar
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times";
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };

      nuevoGasto.appendChild(btnBorrar);

      //agregar al html
      gastoListado.appendChild(nuevoGasto);
    });
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestObj) {
    const { presupuesto, restante } = presupuestObj;

    const restanteDiv = document.querySelector(".restante");

    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-succes");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-succes", "alert-warning");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    //si el total es menor a 0

    if (restante <= 0) {
      ui.imprimirAlerta("Presupuesto agotado", "error");

      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }

  limpiarHtml() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }
}

//instanciar
const ui = new UI();
let presupuesto;
//Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Cual es tu presupuesto?");

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

  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  //reiniciar formulario
  formulario.reset();
}

function eliminarGasto(id) {
  //eliminar gastos del objeto
  presupuesto.eliminarGasto(id);

  //aliminar gastos de html
  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}

import { error } from "../../../helpers/alertas";
import { get } from "../../../helpers/api";
import { crearFila } from "../../../helpers/crearFila";
import { capitalizarPrimeraLetra } from "../../../helpers/diseño";
import {
  cerrarModal,
  cerrarModalYVolverAVistaBase,
} from "../../../helpers/modal";
import { cargarComponente } from "../../../helpers/renderView";
import { routes } from "../../../router/routes";

const asignarDatosCliente = (data) => {
  const spanNombre = document.querySelector("#profile-nombre");
  const spanTipoDocumento = document.querySelector("#profile-tipoDocumento");
  const spanNumeroDocumento = document.querySelector(
    "#profile-numeroDocumento"
  );
  const spanDireccion = document.querySelector("#profile-direccion");
  const spanTelefono = document.querySelector("#profile-telefono");
  const spanCorreo = document.querySelector("#profile-correo");

  const {
    correo,
    direccion,
    nombre,
    numeroDocumento,
    telefono,
    tipoDocumento,
  } = data.info;

  spanNombre.textContent = nombre;
  spanTipoDocumento.textContent = tipoDocumento.nombre;
  spanNumeroDocumento.textContent = numeroDocumento;
  spanDireccion.textContent = direccion;
  spanTelefono.textContent = telefono;
  spanCorreo.textContent = correo;
};

export const profileController = async (parametros = null) => {
  const tbody = document.querySelector("#pets-client .table__body");
  const btnAtras = document.querySelector("#back-perfil");
  const btnRegisterPets = document.querySelector("#register-pets-client");
  const esModal = !location.hash.includes("clientes/perfil");

  console.log(btnAtras);

  const { id } = parametros;

  const response = await get(`clientes/${id}`);
  console.log(response);

  if (!response.success) {
    await error(response.message);
    cerrarModalYVolverAVistaBase();
    return;
  }

  asignarDatosCliente(response.data);

  const responseMascotas = await get(`mascotas/cliente/${id}`);
  console.log(responseMascotas);

  if (responseMascotas.code == 500) {
    await error(responseMascotas.message);
    esModal ? cerrarModal("profile-client") : cerrarModalYVolverAVistaBase();
    return;
  }

  if (responseMascotas.success) {
    if (tbody) {
      responseMascotas.data.forEach(
        ({ id, edadFormateada, nombre, raza, sexo }) => {
          const row = crearFila([
            id,
            nombre,
            raza.especie.nombre,
            raza.nombre,
            edadFormateada,
            capitalizarPrimeraLetra(sexo),
          ]);
          tbody.insertAdjacentElement("afterbegin", row);
        }
      );
    }
  }

  btnAtras.addEventListener("click", () => {
    console.log("BOTON");

    esModal ? cerrarModal("profile-client") : cerrarModalYVolverAVistaBase();
  });

  btnRegisterPets.addEventListener("click", async () => {
    const container = document.querySelector(`[data-slot="main"]`);
    const { path, controller } = routes.mascotas.crear;

    await cargarComponente({ path, container, controller }, id);
    const selectCliente = document.querySelector("#select-clients");
    const contenedor = selectCliente?.closest(".form__container-field");
    contenedor.classList.add("hidden");
    console.log(contenedor);
  });
};

const mastermind = () => { //Función principal para la configuración previa al juego

  //Obtenemos los elementos del DOM
  const form = document.getElementById("mastermindForm");
  const dificultadSelect = document.getElementById("dificultad");
  const colorSelection = document.getElementById("colorSelection");
  const colorOptions = document.getElementById("colorOptions");

  //Array con los colores disponibles predefinidos
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
  ];

  // Crear opciones de color según la dificultad seleccionada por el usuario
  const createColorOption = (count) => {
    const colores = mezclarColores(colors);
    for (let i = 0; i < count; i++) {
      const colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.name = "color" + i;
      colorInput.value = colores[i];
      colorInput.required = true;
      colorInput.addEventListener("input", validacionColores);
      colorOptions.appendChild(colorInput);
    }
  };

  // Función para mezclar aleatoriamente los colores seleccionados
  const mezclarColores = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

// Función para verificar la validez del color seleccionado
const validacionColores = (event) => {
    const coloresSeleccionados = event.target.value;//Color seleccionado
    // Verificar para no poder elegir el color negro
    if (coloresSeleccionados === "#000000") {
      event.target.setCustomValidity("No se puede seleccionar el color negro");
    }
    // Verificar para no elegir el color es blanco
    else if (coloresSeleccionados === "#ffffff") {
      event.target.setCustomValidity("No se puede seleccionar el color blanco");
    }
    // Verificar para no repetir un color que ya ha sido seleccionado
    else if (verificarColores(coloresSeleccionados)) {
      event.target.setCustomValidity("Este color ya ha sido seleccionado");
    } else {
      event.target.setCustomValidity("");
    }
  };

  // Función para verificar si el color ya ha sido seleccionado
  const verificarColores = (color) => {
    const colorInputs = colorOptions.querySelectorAll('input[type="color"]');
    for (let i = 0; i < colorInputs.length; i++) {
      if (colorInputs[i] !== event.target && colorInputs[i].value === color) {
        return true;
      }
    }
    return false;
  };

  // Evento para manejar el envío del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault(); 
    const usuario = document.getElementById("usuario").value;
    const dificultad = dificultadSelect.value;
    const colors = Array.from(
      colorOptions.querySelectorAll('input[type="color"]')
    ).map((input) => input.value);

    // Se guardan los datos indicados por el usuario en sessionStorage
    sessionStorage.setItem("usuario", usuario);
    sessionStorage.setItem("dificultad", dificultad);
    sessionStorage.setItem("colors", JSON.stringify(colors));

    // Redireccionar al jugador a la pantalla de juego
    window.location.href = "game.html";
    console.log("usuario"); 
  });
  
  // Mostrar la sección de selección de colores cuando se selecciona una dificultad
  dificultadSelect.addEventListener("change", () => {
    colorOptions.innerHTML = ""; 
    if (dificultadSelect.value === "principiante") {
      createColorOption(4);
    } else if (dificultadSelect.value === "intermedio") {
      createColorOption(5);
    } else if (dificultadSelect.value === "experto") {
      createColorOption(6);
    }
    
    colorSelection.style.display = "block";
  });
};
// Llamada a la función principal cuando se carga la ventana
window.addEventListener("load", mastermind);

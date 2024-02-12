const mastermind = () => {

  const form = document.getElementById("mastermindForm");
  const dificultadSelect = document.getElementById("dificultad");
  const colorSelection = document.getElementById("colorSelection");
  const colorOptions = document.getElementById("colorOptions");
  // Colores disponibles
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
  ];

  // Crear opciones de color según la dificultad seleccionada
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

  // Función para mezclar aleatoriamente
  const mezclarColores = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

// Función para verificar la validez del color seleccionado
const validacionColores = (event) => {
    const coloresSeleccionados = event.target.value;
    // Verificar si el color es negro
    if (coloresSeleccionados === "#000000") {
      event.target.setCustomValidity("No se puede seleccionar el color negro");
    }
    // Verificar si el color es blanco
    else if (coloresSeleccionados === "#ffffff") {
      event.target.setCustomValidity("No se puede seleccionar el color blanco");
    }
    // Verificar si el color ya ha sido seleccionado
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

  // Manejar el envío del formulario
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe
    const usuario = document.getElementById("usuario").value;
    const dificultad = dificultadSelect.value;
    const colors = Array.from(
      colorOptions.querySelectorAll('input[type="color"]')
    ).map((input) => input.value);

    // Guardar la selección en la sesión
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
    // Mostrar la sección de selección de colores
    colorSelection.style.display = "block";
  });
  
};

window.addEventListener("load", mastermind);

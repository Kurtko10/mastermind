document.addEventListener("DOMContentLoaded", () => {
  // Obtener los datos del sessionStorage
  const usuario = sessionStorage.getItem("usuario");
  const dificultad = sessionStorage.getItem("dificultad");
  const colors = JSON.parse(sessionStorage.getItem("colors"));
  // Mostrar los datos en la consola
  console.log("Usuario:", usuario);
  console.log("Dificultad:", dificultad);
  console.log("Colores elegidos:", colors);

  // Obtener tablero de juego
  const tableroJuego = document.getElementById("juegoMastermind");


  // Array para almacenar los colores seleccionados en cada fila del tablero
  const coloresSeleccionados = [];

  // Índice de la fila actual del tablero
  let filaActualIndex = 0;

  //Array para la combinación aleatoria 
  let combinacionSecreta = [];


  // Función para generar una combinación aleatoria de colores
  const generarCombinacionAleatoria = () => {
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      combinacionSecreta.push(colors[randomIndex]);
    }
  };

  //generar una combinación aleatoria de colores
  generarCombinacionAleatoria();
  console.log("combinacion secreta", combinacionSecreta);

  // Mostrar el nombre de usuario y los colores seleccionados
  const mostrarDatosSesion = () => {
    
    const infoSesion = document.createElement("div");
    infoSesion.innerHTML = `
            <h2 id="saludo">¡Bienvenido, ${usuario}!</h2>
            <p id="mensajeDificultad">Dificultad: ${dificultad}</p>
            <div id="coloresElegidos">
                ${colors
                  .map(
                    (color, index) => `
                        <div class="color-box coloresElegidos" id="color-${
                          index + 1
                        }" style="background-color: ${color};"></div>
                    `
                  )
                  .join("")}
            </div>
        `;
    tableroJuego.appendChild(infoSesion);
  };
  mostrarDatosSesion();

  // Construir el tablero de juego
  const construirTablero = () => {

    // Crear el contenedor del tablero
    const tableroElement = document.createElement("div");
    tableroElement.classList.add("tablero");

    const totalRows = 10;
    const columnasPorFila =
      dificultad === "principiante" ? 4 : dificultad === "intermedio" ? 4 : 4;

    // Construir las cajas de intentos
    for (let i = 0; i < totalRows; i++) {
      const intentoTablero = document.createElement("div");
      intentoTablero.classList.add(
        "attempt",
        `row-${i}`,
        "d-flex",
        "justify-content-center"
      );

      for (let j = 0; j < columnasPorFila; j++) {
        const colorBox = document.createElement("div");
        colorBox.classList.add("color-box");
        intentoTablero.appendChild(colorBox);
      }

      // Agregar el intento al contenedor del tablero
      tableroElement.appendChild(intentoTablero);
    }

    // Agregar el contenedor del tablero al tablero de juego
    tableroJuego.appendChild(tableroElement);

    // Comprobación en consola si pinta los div
    console.log("Pintando colores elegidos");
    console.log("Creando tablero para", dificultad);
  };

  // Llama a la función para construir el tablero de juego
  construirTablero();

// Función para marcar la selección del usuario en el tablero
const marcarSeleccionUsuario = (color, filaActual) => {
  const columnas = filaActual.querySelectorAll(".color-box");

  // Buscar la primera columna vacía en la fila y pintar el color seleccionado
  for (let i = 0; i < columnas.length; i++) {
    const columna = columnas[i];
    if (!columna.style.backgroundColor) {
      columna.style.backgroundColor = color;

      // Obtener el índice de la fila
      const rowIndex = parseInt(filaActual.classList[1].split("-")[1]);
      // Agregar el color seleccionado al array de la fila actual
      if (!coloresSeleccionados[rowIndex]) {
        coloresSeleccionados[rowIndex] = [];
      }
      coloresSeleccionados[rowIndex].push(color);

      // llamamos a la función de verificar
      setTimeout(verificarFilaCompleta, 100); 
      break; // detienee el bucle cuando se marca un color
    }
  }
};

// Función para verificar si la fila está completa
const verificarFilaCompleta = () => {
  const filaActual = document.querySelector(`.attempt.row-${filaActualIndex}`);
  const columnas = filaActual.querySelectorAll(".color-box");
  let filaCompleta = true;
  
  columnas.forEach((columna) => {
    if (!columna.style.backgroundColor) {
      filaCompleta = false;
    }
  });

  if (filaCompleta) {
    // Mostrar mensaje indicando que la fila está completa y sugiriendo pulsar el botón de comprobar
    console.log("Fila completa. Pulsa el botón 'Comprobar' para verificar tu combinación.");
    alert('FIla completa, pulsa comprobar');
  }
};

  // Agregar evento onclick a los elementos de color
  const elementosColor = document.querySelectorAll(".color-box.coloresElegidos");

  const marcarColorFilaActual = (event) => {
    const colorIndex = parseInt(event.target.id.split("-")[1]) - 1;
    const selectedColor = colors[colorIndex];
    marcarSeleccionUsuario(
      selectedColor,
      document.querySelector(`.attempt.row-${filaActualIndex}`)
    );
    console.log(`Has elegido el color ${selectedColor}`);
   
  };

  elementosColor.forEach((elemento) => {
    elemento.addEventListener("click", marcarColorFilaActual);
  });


// Función para abrir el modal
const abrirModal = () => {
  const myModal = new bootstrap.Modal(document.getElementById('hasGanadoModal'), {
    backdrop: 'static'
  });
  myModal.show();
};

// Función para comprobar la combinación del usuario
const comprobarCombinacionUsuario = () => {
  const combinacionUsuario = coloresSeleccionados[filaActualIndex];
  // Verificar si la combinacionUsuario es un array
  if (Array.isArray(combinacionUsuario)) {
    const resultado = compararCombinaciones(combinacionUsuario, combinacionSecreta);
    console.log(combinacionUsuario);
    console.log("Resultado:", resultado);

    // Verificar si el usuario ha ganado
    if (resultado.aciertos === 4) {
      abrirModal(); // Llamar a la función para abrir el modal
    } 
  }
};


// Función para comparar las combinaciones del usuario y la combinación secreta
const compararCombinaciones = (combinacionUsuario, combinacionSecreta) => {
  const resultado = {
    aciertos: 0,
    coincidencias: 0,
    fallos: 0,
    aciertosArray: [],
    coincidenciasArray: [],
    fallosArray: [],
  };

  // Crear copias de las combinaciones para no modificar las originales
  const copiaUsuario = [...combinacionUsuario];
  const copiaSecreta = [...combinacionSecreta];

  // Verificar aciertos
  for (let i = 0; i < copiaUsuario.length; i++) {
    if (copiaUsuario[i] === copiaSecreta[i]) {
      resultado.aciertos++;
      resultado.aciertosArray.push(i);
      copiaUsuario[i] = null;
      copiaSecreta[i] = null;
    }
  }

  // Verificar coincidencias
  for (let color of copiaUsuario) {
    if (color !== null && copiaSecreta.includes(color)) {
      resultado.coincidencias++;
      resultado.coincidenciasArray.push(copiaSecreta.indexOf(color)); 
      copiaSecreta[copiaSecreta.indexOf(color)] = null; 
    }
  }

  // Calcular fallos
  resultado.fallos = 4 - resultado.aciertos - resultado.coincidencias;
  for (let i = 0; i < resultado.fallos; i++) {
    resultado.fallosArray.push(i); // Guardamos el índice del color fallo
  }

  // Mensajes para consola
  let mensaje = "";
  mensaje += `Mismo color y misma posición: ${resultado.aciertos}, `;
  mensaje += `El color está en la combinación secreta pero fuera de posición: ${resultado.coincidencias}, `;
  mensaje += `Color fallado: ${resultado.fallos}.`;
  return resultado;
};

const avanzarSiguienteFila = () => {
  const filaActual = document.querySelector(`.attempt.row-${filaActualIndex}`);
  const columnas = filaActual.querySelectorAll(".color-box");
  const resultadoComparacion = compararCombinaciones(coloresSeleccionados[filaActualIndex], combinacionSecreta);

  // Actualizar visualmente la fila actual
  for (let i = 0; i < columnas.length; i++) {
    const columna = columnas[i];
    columna.classList.remove("acertado", "coincidencia", "fallos");
    
    // Si el color está acertado, se pinta con un OK
    if (resultadoComparacion.aciertosArray.includes(i)) {
      columna.textContent = "OK";
      columna.classList.add("acertado");
    } 
    //Marca acierto fduera de posición
    else if (resultadoComparacion.coincidenciasArray.includes(i)) {
      columna.textContent = "?";
      columna.classList.add("coincidencia");
    } 
    // Si el color es un fallo, se pinta con un borde negro
    else if (resultadoComparacion.fallosArray.includes(i)) {
      columna.classList.add("fallos");
    }
  }

  // Avanzar a la siguiente fila si no es la última
  if (filaActualIndex < 9) { 
    // Eliminar los event listeners de los elementos de color
    elementosColor.forEach((elemento) => {
      elemento.removeEventListener("click", marcarColorFilaActual);
    });
    // Reiniciar los colores seleccionados para la nueva fila
    coloresSeleccionados[filaActualIndex] = [];
    // Avanzar a la siguiente fila
    filaActualIndex++;
    // Permite al usuario seleccionar colores en la nueva fila
    elementosColor.forEach((elemento) => {
      elemento.addEventListener("click", marcarColorFilaActual);
    });
  } else {
    // mostrar un mensaje de fin del juego
    alert('FIN DEL JUEGO');
    console.log("Has completado todas las filas");
    // Redirigir al usuario a la vista usuario.html

    window.location.href = '../index.html';
  }
};


// Event listener para el botón de comprobar
const comprobarButton = document.getElementById("comprobar");
comprobarButton.addEventListener("click", () => {
  // Verificar la combinación del usuario cuando se presione el botón de comprobar
  comprobarCombinacionUsuario();
  // Avanzar a la siguiente fila después de la comprobación
  avanzarSiguienteFila();
});

  // Event listener para el botón de reiniciar
  const reiniciarButton = document.getElementById("reiniciar");
  reiniciarButton.addEventListener("click", () => {
    // Reiniciar el juego
    location.reload();
  });


});


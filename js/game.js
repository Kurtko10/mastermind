document.addEventListener("DOMContentLoaded", () => {
  // Obtener los datos del sessionStorage
  const usuario = sessionStorage.getItem("usuario");
  const dificultad = sessionStorage.getItem("dificultad");
  const colors = JSON.parse(sessionStorage.getItem("colors"));
  // Mostrar los datos en la consola
  console.log("Usuario:", usuario);
  console.log("Dificultad:", dificultad);
  console.log("Colores elegidos:", colors);

  const tableroJuego = document.getElementById("juegoMastermind"); // Obtener el elemento del tablero del juego

  const coloresSeleccionados = []; // Array para almacenar los colores seleccionados en cada fila del tablero
  let filaActualIndex = 0; // Índice de la fila actual del tablero
  let combinacionSecreta = []; //Array para la combinación aleatoria
  let filaCompleta = false; // Array para almacenar la combinación secreta de colores
  let permitirSeleccionColor = true; // Variable de control para detener la función marcarColorFilaActual
  let contadorClickColor = 0; // Variable para contar los clics en los colores

  // Función para generar una combinación aleatoria de colores
  const generarCombinacionAleatoria = () => {
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      combinacionSecreta.push(colors[randomIndex]);
    }
  };

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

  // Función para construir el tablero de juego
  const construirTablero = () => {
    const tableroElement = document.createElement("div");
    tableroElement.classList.add("tablero");

    const totalRows = 10;
    const columnasPorFila =
      dificultad === "principiante" ? 4 : dificultad === "intermedio" ? 4 : 4;

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
      tableroElement.appendChild(intentoTablero);
    }

    tableroJuego.appendChild(tableroElement);

    // Agregar evento onclick a los elementos de color después de construir el tablero
    const elementosColor = document.querySelectorAll(
      ".color-box.coloresElegidos"
    );

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
  };

  // Función para marcar la selección del usuario en el tablero
  const marcarSeleccionUsuario = (color, filaActual) => {
    if (!permitirSeleccionColor) {
      filaCompleta = true;
      console.log(
        "Fila completa. Pulsa el botón 'Comprobar' para verificar tu combinación."
      );
      alert("FIla completa, pulsa comprobar");
      return; //Detener si no se puede seleccionar color
    } else {
      const columnas = filaActual.querySelectorAll(".color-box");

      for (let i = 0; i < columnas.length; i++) {
        const columna = columnas[i];
        if (!columna.style.backgroundColor) {
          columna.style.backgroundColor = color;

          const rowIndex = parseInt(filaActual.classList[1].split("-")[1]);
          if (!coloresSeleccionados[rowIndex]) {
            coloresSeleccionados[rowIndex] = [];
          }
          coloresSeleccionados[rowIndex].push(color);
          
          contadorClickColor++; 
          
          if (contadorClickColor === 4) {
            verificarFilaCompleta(); 
            permitirSeleccionColor = false; 
          }
          break; 
        }
      }
    }
  };

  // Función para verificar si la fila está completa
  const verificarFilaCompleta = () => {
    const filaActual = document.querySelector(
      `.attempt.row-${filaActualIndex}`
    );
    const columnas = filaActual.querySelectorAll(".color-box");
    filaCompleta = true;

    columnas.forEach((columna) => {
      if (!columna.style.backgroundColor) {
        filaCompleta = false;
      }
    });
  };

  // Agregar evento onclick a los elementos de color
  const elementosColor = document.querySelectorAll(
    ".color-box.coloresElegidos"
  );

  // Función para marcar el color seleccionado por el jugador
  const marcarColorFilaActual = (event) => {
    const colorIndex = parseInt(event.target.id.split("-")[1]) - 1;
    const selectedColor = colors[colorIndex];
    marcarSeleccionUsuario(
      selectedColor,
      document.querySelector(`.attempt.row-${filaActualIndex}`)
    );
    console.log(`Has elegido el color ${selectedColor}`);
  };
// Evento para escuchar los clics
  elementosColor.forEach((elemento) => {
    elemento.addEventListener("click", marcarColorFilaActual);
  });

// Crea una instancia de un modal de Bootstrap utilizando el ID "gameModal"
  const abrirModal = (titulo, mostrarBotones) => {
    const modal = new bootstrap.Modal(document.getElementById("gameModal"));
    const modalTitle = document.querySelector("#gameModal .modal-title");
    const modalFooter = document.querySelector("#gameModal .modal-footer");

    modalTitle.textContent = titulo;

    if (mostrarBotones) {
      modalFooter.style.display = "block";
    } else {
      modalFooter.style.display = "none";
      setTimeout(() => {
        modal.hide();
        window.location.href = "../index.html";
      }, 3500);
    }
    modal.show();
  };

  // Función para comprobar la combinación del usuario
  const comprobarCombinacionUsuario = () => {
    const combinacionUsuario = coloresSeleccionados[filaActualIndex];
    // Verificar si la combinacionUsuario es un array
    if (Array.isArray(combinacionUsuario)) {
      const resultado = compararCombinaciones(
        combinacionUsuario,
        combinacionSecreta
      );
      console.log(combinacionUsuario);
      console.log("Resultado:", resultado);

      // Verificar si el usuario ha ganado
      if (resultado.aciertos === 4) {
        abrirModal(`¡Has ganado!, ¡Felicidades, ${usuario}!`, true); // Llamar a la función para abrir el modal
      }
    }
  };

  // Función para comparar las combinaciones de colores del usuario y la combinación secreta
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

        console.log(
          `Fila ${filaActualIndex}, Columna ${i}: Color ${combinacionUsuario[i]} - ACIERTO`
        );
      }
    }

    // Map para realizar un seguimiento de la frecuencia de cada color en la combinación secreta
    const mapaColores = new Map();
    for (let color of copiaSecreta) {
      mapaColores.set(
        color,
        mapaColores.has(color) ? mapaColores.get(color) + 1 : 1
      );
    }

    // Verificar coincidencias
    for (let color of copiaUsuario) {
      if (
        color !== null &&
        mapaColores.has(color) &&
        mapaColores.get(color) > 0
      ) {
        resultado.coincidencias++;
        resultado.coincidenciasArray.push(copiaSecreta.indexOf(color));
        copiaSecreta[copiaSecreta.indexOf(color)] = null;
        mapaColores.set(color, mapaColores.get(color) - 1);

        // Agregar mensaje a la consola para indicar una coincidencia
        console.log(`Fila ${filaActualIndex}, Color ${color} - COINCIDENCIA`);
      }
    }

    // Calcular fallos
    resultado.fallos = 4 - resultado.aciertos - resultado.coincidencias;
    for (let i = 0; i < resultado.fallos; i++) {
      resultado.fallosArray.push(i); // Guardamos el índice del color fallo
    }
    // Agregar mensajes de registro para los fallos
    resultado.fallosArray.forEach((indice) => {
      console.log(
        `Fila ${filaActualIndex}, Columna ${indice}: Color ${combinacionUsuario[indice]} - FALLO`
      );
    });

    // Mensajes para consola
    let mensaje = "";
    mensaje += `Mismo color y misma posición: ${resultado.aciertos}, `;
    mensaje += `El color está en la combinación secreta pero fuera de posición: ${resultado.coincidencias}, `;
    mensaje += `Color fallado: ${resultado.fallos}.`;
    return resultado;
  };

  // Función para avanzar a la siguiente fila/intento del tablero
  const avanzarSiguienteFila = () => {
    permitirSeleccionColor = true; // Permitir la selección de colores para la siguiente fila
    contadorClickColor = 0; // Reiniciar el contador de clics
    const filaActual = document.querySelector(
      `.attempt.row-${filaActualIndex}`
    );
    const columnas = filaActual.querySelectorAll(".color-box");
    const resultadoComparacion = compararCombinaciones(
      coloresSeleccionados[filaActualIndex],
      combinacionSecreta
    );

    // Avanzar a la siguiente fila si no es la última
    if (filaActualIndex < 9) {
      elementosColor.forEach((elemento) => {
        elemento.removeEventListener("click", marcarColorFilaActual);
      });

      coloresSeleccionados[filaActualIndex] = [];
      // Avanzar a la siguiente fila
      filaActualIndex++;
      filaCompleta = false;
     
      elementosColor.forEach((elemento) => {
        elemento.addEventListener("click", marcarColorFilaActual);
      });
    } else {
      abrirModal(
        `¡Has perdido!, ¡Lo siento ${usuario}! Inténtalo de nuevo.`,
        false
      );

      console.log("Has completado todas las filas");
      setTimeout(() => {
        window.location.href = "game.html";
      }, 3500);
    }

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
  };

  // Event listener para el botón de comprobar
  const comprobarButton = document.getElementById("comprobar");
  comprobarButton.addEventListener("click", () => {
    if (filaCompleta === true) {
      comprobarCombinacionUsuario();
      avanzarSiguienteFila();
    } else alert("Completa la fila de colores");
  });

  // Event listener para el botón de reiniciar
  const reiniciarButton = document.getElementById("reiniciar");
  reiniciarButton.addEventListener("click", () => {
    // Reiniciar el juego
    location.reload();
  });

  // Llamadas a las funciones
  generarCombinacionAleatoria();
  console.log("combinacion secreta", combinacionSecreta);
  mostrarDatosSesion();
  construirTablero();
});

document.addEventListener("DOMContentLoaded", () => {
  // Obtener los datos del sessionStorage
  const usuario = sessionStorage.getItem("usuario");
  const dificultad = sessionStorage.getItem("dificultad");
  const colors = JSON.parse(sessionStorage.getItem("colors"));
  // Mostrar los datos en la consola
  console.log("Usuario:", usuario);
  console.log("Dificultad:", dificultad);
  console.log("Colores elegidos:", colors);

  const tableroJuego = document.getElementById("juegoMastermind");
  const coloresElegidos = document.getElementById("coloresElegidos");

  // Array bidimensional para almacenar los colores seleccionados en cada fila del tablero
  const coloresSeleccionados = [];

  let filaActualIndex = 0;
  let combinacionSecreta = [];
  let primeraFilaCompleta = false;

  // Función para generar una combinación aleatoria de colores
  const generarCombinacionAleatoria = () => {
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      combinacionSecreta.push(colors[randomIndex]);
    }
  };

  generarCombinacionAleatoria();
  console.log("combinacion secreta", combinacionSecreta);

  const mostrarDatosSesion = () => {
    // Mostrar el nombre de usuario y los colores seleccionados
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
    // Comprobar en consola si pinta los div
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
        // Agregar el color seleccionado al array de la fila actual
        const rowIndex = parseInt(filaActual.classList[1].split("-")[1]); // Obtener el índice de la fila
        if (!coloresSeleccionados[rowIndex]) {
          coloresSeleccionados[rowIndex] = []; // Si no hay un array para esta fila, crearlo
        }
        coloresSeleccionados[rowIndex].push(color);
        break; // Detener el bucle cuando se marca un color
      }
    }
    // Verificar si la fila está completa después de marcar el color
    verificarFilaCompleta();
  };

  // Función para verificar si la primera fila está completa

  const verificarFilaCompleta = () => {
    const filaActual = document.querySelector(".attempt.row-0");
    const columnas = filaActual.querySelectorAll(".color-box");
    let filaCompleta = true;
    columnas.forEach((columna) => {
      if (!columna.style.backgroundColor) {
        filaCompleta = false;
      }
    });
    if (filaCompleta) {
      primeraFilaCompleta = true;
      // Desactivar el evento de click para los colores
      elementosColor.forEach((elemento) => {
        elemento.removeEventListener("click", marcarColorPrimeraFila);
      });

      // Aquí puedes agregar un log del array coloresSeleccionados
      console.log("Colores seleccionados:", coloresSeleccionados);
      console.log("Primera fila completa");
    }
  };

  // Agregar evento onclick a los elementos de color solo para la primera fila
  const elementosColor = document.querySelectorAll(
    ".color-box.coloresElegidos"
  );

  const marcarColorPrimeraFila = (event) => {
    if (!primeraFilaCompleta) {
      const colorIndex = parseInt(event.target.id.split("-")[1]) - 1;
      const selectedColor = colors[colorIndex];
      marcarSeleccionUsuario(
        selectedColor,
        document.querySelector(".attempt.row-0")
      );
      console.log(`Has elegido el color ${selectedColor}`);
    }
  };

  elementosColor.forEach((elemento) => {
    elemento.addEventListener("click", marcarColorPrimeraFila);
  });

  // Función para comprobar la combinación del usuario
  const comprobarCombinacionUsuario = () => {
    if (!primeraFilaCompleta) {
      console.log("Primero completa la primera fila.");
      return;
    }

    const combinacionUsuario = coloresSeleccionados[filaActualIndex]; // Obtener la combinación de la fila actual
    const resultado = compararCombinaciones(
      combinacionUsuario,
      combinacionSecreta
    );

    // Mostrar el resultado por consola
    console.log("Resultado:", resultado);

    // Verificar si el usuario ha ganado
    if (resultado.aciertos === 4) {
      alert("¡Has ganado!");
      reiniciarJuego();
    } else {
      // Avanzar a la siguiente fila
      avanzarSiguienteFila();
    }
  };

  // Función para comparar las combinaciones del usuario y la combinación secreta
  const compararCombinaciones = (combinacionUsuario, combinacionSecreta) => {
    const resultado = {
      aciertos: 0,
      coincidencias: 0,
      fallos: 0,
    };

    // Crear copias de las combinaciones para no modificar las originales
    const copiaUsuario = [...combinacionUsuario];
    const copiaSecreta = [...combinacionSecreta];

    // Verificar aciertos
    for (let i = 0; i < copiaUsuario.length; i++) {
      if (copiaUsuario[i] === copiaSecreta[i]) {
        resultado.aciertos++;
        // Si hay un acierto, eliminamos el color de ambas combinaciones para no contar las coincidencias y fallos para este color
        copiaUsuario[i] = null;
        copiaSecreta[i] = null;
      }
    }

    // Verificar coincidencias
    for (let color of copiaUsuario) {
      if (color !== null && copiaSecreta.includes(color)) {
        resultado.coincidencias++;
        copiaSecreta[copiaSecreta.indexOf(color)] = null; // Eliminamos el color coincidente de la combinación secreta
      }
    }

    // Calcular fallos
    resultado.fallos = 4 - resultado.aciertos - resultado.coincidencias;

    // Construir el mensaje
    let mensaje = "";
    mensaje += `Mismo color y misma posición: ${resultado.aciertos}, `;
    mensaje += `El color está en la combinación secreta pero fuera de posición: ${resultado.coincidencias}, `;
    mensaje += `Color fallado: ${resultado.fallos}.`;
    return resultado;
  };

  const avanzarSiguienteFila = () => {
    const filas = document.querySelectorAll(".attempt");
    if (filaActualIndex < filas.length - 1) {
      // Reiniciar el array de colores seleccionados
      coloresSeleccionados[filaActualIndex] = [];

      // Avanzar a la siguiente fila
      filaActualIndex++;
      const filaActual = filas[filaActualIndex];
      console.log("avanzamos a fila", filaActual);

      // Permitir al usuario seleccionar colores en la nueva fila
      elementosColor.forEach((elemento) => {
        elemento.addEventListener("click", marcarColorPrimeraFila);
      });
    } else {
      // Se ha llenado el tablero, implementa la lógica de finalización del juego
    }
  };

  // Event listeners para los botones
  const comprobarButton = document.getElementById("comprobar");
  const reiniciarButton = document.getElementById("reiniciar");

  comprobarButton.addEventListener("click", () => {
    comprobarCombinacionUsuario();
    avanzarSiguienteFila();
  });

  reiniciarButton.addEventListener("click", () => {
    // Reiniciar el juego
    location.reload();
  });
  // Función para reiniciar el juego
  const reiniciarJuego = () => {
    location.reload();
  };
});

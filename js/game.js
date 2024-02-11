document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", () => {

// Obtener los datos del sessionStorage
    const usuario = sessionStorage.getItem("usuario");
    const dificultad = sessionStorage.getItem("dificultad");
    const colors = JSON.parse(sessionStorage.getItem("colors"));

// Mostrar los datos en la consola
    console.log("Usuario:", usuario);
    console.log("Dificultad:", dificultad);
    console.log("Colores elegidos:", colors);

// Mostrar el nombre de usuario y los colores seleccionados en la página
    const tableroJuego = document.getElementById("juegoMastermind");
    const coloresElegidos = document.getElementById("coloresElegidos");

// Construir el tablero de juego
    const buildtableroJuego = () => {
// Mostrar el nombre de usuario y los colores seleccionados
      const infoSesion = document.createElement("div");
      infoSesion.innerHTML = `
                            <h2 id="saludo">¡Bienvenido, ${usuario}!</h2>
                            <p id="mensajeDificultad">Dificultad: ${dificultad}</p>
                            <div id="coloresElegidos">
                                ${colors
                                  .map(
                                    (color) => `
                                    <div class="color-box coloresElegidos" style="background-color: ${color};"></div>
                                `
                                  )
                                  .join("")}
                            </div>
                        `;
      tableroJuego.appendChild(infoSesion);

// Crear el contenedor del tablero
      const tableroElement = document.createElement("div");
      tableroElement.classList.add("tablero");

      const totalRows =
        dificultad === "principiante"
          ? 10
          : dificultad === "intermedio"
          ? 10
          : 10;
      const columnsPerRow =
        dificultad === "principiante" ? 4 : dificultad === "intermedio" ? 5 : 6;

// Construir las cajas de intentos
      for (let i = 0; i < totalRows; i++) {
        const intentoTabler = document.createElement("div");
        intentoTabler.classList.add(
          "attempt",
          `row-${i}`,
          "d-flex",
          "justify-content-center"
        );
        for (let j = 0; j < columnsPerRow; j++) {
          const colorBox = document.createElement("div");
          colorBox.classList.add("color-box");
          intentoTabler.appendChild(colorBox);
        }
// Agregar el intento al contenedor del tablero
        tableroElement.appendChild(intentoTabler);
      }

// Agregar el contenedor del tablero al tablero de juego
      tableroJuego.appendChild(tableroElement);
//Comprobar en consola si pinta los div
      console.log("Pintando colores elegidos");
      console.log("creando tablero para", dificultad);
    };
// Llama a la función para construir el tablero de juego
    buildtableroJuego();

// Event listeners para los botones
    const comprobarButton = document.getElementById("comprobar");
    const reiniciarButton = document.getElementById("reiniciar");

    comprobarButton.addEventListener("click", () => {
// para comprobar la jugada del usuario
     
    });

    reiniciarButton.addEventListener("click", () => {
//para reiniciar el juego
    });
  });
});

        // Obtener los datos del sessionStorage
        const usuario = sessionStorage.getItem('usuario');
        const dificultad = sessionStorage.getItem('dificultad');
        const colors = JSON.parse(sessionStorage.getItem('colors'));

        // Mostrar los datos en la consola
        console.log('Usuario:', usuario);
        console.log('Dificultad:', dificultad);
        console.log('Colores elegidos:', colors);
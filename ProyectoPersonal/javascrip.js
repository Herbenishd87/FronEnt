document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Movimiento Suave al hacer clic en los enlaces del menú ---
    // Esto hace que la página se desplace suavemente cuando haces clic en "Viajes", "Comida", etc.
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Evitamos que la página salte bruscamente
            event.preventDefault();

            // Obtenemos a qué sección de la página se refiere el enlace (por ejemplo, #viajes)
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Si esa sección existe en tu página
            if (targetSection) {
                // Nos movemos hacia ella de forma suave
                targetSection.scrollIntoView({
                    behavior: 'smooth', // Hace el desplazamiento "lento" y agradable
                    block: 'start'      // Alinea la parte superior de la sección con la parte superior de la ventana
                });
            }
        });
    });

    // --- 2. Efecto en los botones principales (Hero) al pasar el ratón ---
    // Hace que los botones "Descubre Viajes" y "Deléitate con la Comida" se vean diferentes al pasar el mouse.
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    heroButtons.forEach(button => {
        // Cuando el ratón entra en el botón
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)'; // Lo agranda un poquito
            button.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'; // Le añade una sombra
            button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'; // Hace que los cambios sean suaves
        });

        // Cuando el ratón sale del botón
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)'; // Vuelve a su tamaño normal
            button.style.boxShadow = 'none'; // Quita la sombra
            button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease'; // Hace que los cambios sean suaves
        });
    });

    // --- 3. Simulación de Comentarios en los Modales (¡Aquí estaba el error!) ---
    // Gestiona el formulario de comentarios dentro de las ventanas emergentes (modales).
    const commentForms = document.querySelectorAll('.comment-form');

    commentForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Evita que la página se recargue cuando envías el formulario
            event.preventDefault();

            // Obtenemos el texto que escribió el usuario en el área de comentarios
            const textarea = form.querySelector('textarea');
            const commentText = textarea.value.trim(); // .trim() quita espacios al principio y al final

            // Si el usuario no escribió nada, mostramos una alerta
            if (commentText === '') {
                alert('¡Por favor, escribe un comentario antes de enviar!');
                return; // Detenemos la función aquí
            }

            // Si escribió algo, simulamos que se envió (verás esto en la "Consola" del navegador)
            console.log('Comentario enviado (simulado):', commentText);

            // Creamos el nuevo comentario visualmente en la página
            const commentsSection = form.closest('.comments-section'); // Buscamos la sección donde van los comentarios
            if (commentsSection) {
                const newCommentDiv = document.createElement('div'); // Creamos un nuevo "espacio" para el comentario
                newCommentDiv.classList.add('comment'); // Le damos el estilo CSS para que se vea como los otros comentarios

                // --- ¡CORRECCIÓN CLAVE AQUÍ! ---
                // Usamos las comillas invertidas ( ` ) para poder incluir código JavaScript (${...}) directamente en el texto.
                newCommentDiv.innerHTML = `
                    <div class="comment-author">Anónimo <span class="comment-date">${new Date().toLocaleDateString('es-ES')}</span></div>
                    <p class="comment-text">${commentText}</p>
                `;
                // Las comillas invertidas se consiguen presionando la tecla AltGr + } o Alt + 96 (Windows) o Option + ` (Mac)
                // O está al lado de la letra Ñ o al lado del número 1 en algunos teclados.

                // Agregamos el nuevo comentario al inicio de la lista de comentarios existentes
                const existingComments = commentsSection.querySelector('.comment');
                if (existingComments) {
                    commentsSection.insertBefore(newCommentDiv, existingComments);
                } else {
                    commentsSection.appendChild(newCommentDiv); // Si no hay comentarios aún, lo añadimos
                }
            }

            textarea.value = ''; // Limpiamos el área de texto para que el usuario pueda escribir otro comentario
            alert('¡Tu comentario ha sido "enviado" y añadido a la lista!'); // Mensaje para el usuario
        });
    });

    // --- 4. Efecto de "Carga" en los botones "Ver Más" ---
    // Cambia el texto del botón al hacer clic, como si estuviera cargando más contenido.
    const seeMoreButtons = document.querySelectorAll('.see-more .btn');

    seeMoreButtons.forEach(button => {
        let originalText = button.innerHTML; // Guardamos el texto original del botón (ej. "Ver Más Viajes")

        button.addEventListener('click', function(event) {
            event.preventDefault(); // Evita que la página salte arriba

            // Cambiamos el texto del botón para simular carga
            this.innerHTML = `Cargando más... <i class="fas fa-spinner fa-spin"></i>`;
            this.disabled = true; // Desactivamos el botón para que no se pueda hacer clic de nuevo

            // Simulamos una espera de 2 segundos (como si la página estuviera trayendo información de internet)
            setTimeout(() => {
                this.innerHTML = originalText; // Volvemos a poner el texto original en el botón
                this.disabled = false; // Activamos el botón de nuevo
                alert('¡Más contenido "cargado" (simulación)!'); // Mensaje para el usuario
            }, 2000); // 2000 milisegundos son 2 segundos
        });
    });

    // --- 5. Resaltar la sección actual en el menú de navegación (Scroll Spy) ---
    // Cuando te desplazas por la página, el enlace del menú que corresponde a la sección que estás viendo se ilumina.
    const sections = document.querySelectorAll('section[id]'); // Busca todas las secciones de tu HTML que tienen un "id" (como <section id="viajes">)
    const headerHeight = document.querySelector('.main-header').offsetHeight; // Obtiene la altura de tu barra de navegación superior (para ajustar el cálculo)

    // Función que revisa qué sección se está viendo y resalta el enlace correspondiente
    function highlightNavLink() {
        let currentActive = ''; // Aquí guardaremos el ID de la sección que está activa

        sections.forEach(section => {
            // Calculamos dónde empieza y termina cada sección en la pantalla
            const sectionTop = section.offsetTop - headerHeight;
            const sectionHeight = section.clientHeight;

            // Si la posición de la barra de desplazamiento está dentro de esta sección
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentActive = section.getAttribute('id'); // Guardamos el ID de esta sección como la "activa"
            }
        });

        // Recorremos todos los enlaces del menú
        navLinks.forEach(link => {
            link.classList.remove('active-nav-link'); // Primero, quitamos el resaltado a TODOS los enlaces

            // Si el enlace apunta a la sección que está "activa" en la pantalla
            if (link.getAttribute('href').includes(currentActive)) {
                link.classList.add('active-nav-link'); // Le añadimos la clase CSS para que se resalte
            }
        });
    }

    // Cada vez que el usuario mueva la barra de desplazamiento, llamamos a esta función
    window.addEventListener('scroll', highlightNavLink);
    // También la llamamos una vez cuando la página se carga, para que la sección inicial ya esté resaltada
    highlightNavLink();
});
# Spec — Ejercicio 2: Presentación con CSS y uso adaptable

## 1. Objetivo

Implementar la identidad visual y el diseño adaptable de la aplicación de librería utilizando exclusivamente CSS externo.

La implementación debe basarse en el `index.html` existente en la raíz del proyecto, correspondiente al Ejercicio 1. Se debe conservar su estructura y contenido, aplicando estilos coherentes, reutilizables, accesibles y adaptables a distintos tamaños de pantalla.

## 2. Alcance y restricciones

### Incluido

- Crear el archivo CSS externo necesario para la presentación visual.
- Definir una identidad visual coherente para toda la aplicación.
- Organizar los elementos mediante Flexbox o CSS Grid.
- Implementar estilos adaptables a pantallas de 320 px y 1280 px.
- Mejorar la presentación de formularios, campos, botones, tarjetas, tablas y demás elementos existentes.
- Garantizar estados de foco visibles y una presentación accesible.
- Verificar el cumplimiento de los criterios de aceptación.

### Excluido

- No modificar el contenido ni la estructura de `index.html`.
- No crear otros archivos HTML.
- No crear ni modificar archivos JavaScript.
- No agregar funcionalidades mediante JavaScript.
- No incorporar frameworks CSS, bibliotecas externas ni dependencias innecesarias.
- No modificar archivos de configuración, documentación ajena a esta etapa ni otros componentes del proyecto.
- No implementar funcionalidades que correspondan a etapas posteriores.

**Regla principal:** el único archivo que se puede crear o modificar durante esta etapa es el archivo CSS externo. Si el HTML existente necesita algún ajuste para poder aplicar los estilos, el agente debe explicar el problema y solicitar autorización antes de modificarlo.

## 3. Análisis previo obligatorio

Antes de escribir código, el agente debe:

1. Leer el `index.html` ubicado en la raíz del proyecto.
2. Identificar las secciones existentes, sus elementos, formularios, controles, tarjetas, tablas, imágenes y enlaces.
3. Identificar qué elementos pueden compartir clases CSS.
4. Comprobar si el HTML ya referencia un archivo CSS externo.
5. Determinar si las etiquetas y clases existentes permiten implementar todos los requisitos.
6. Presentar una propuesta breve con:
   - El archivo CSS que creará o modificará.
   - La identidad visual propuesta.
   - La estrategia de distribución mediante Flexbox o Grid.
   - Los ajustes responsive previstos.
   - Los posibles impedimentos relacionados con el HTML.

El agente debe esperar la confirmación del usuario antes de comenzar a implementar los cambios.

## 4. Identidad visual

Definir una identidad visual propia, consistente y apropiada para una aplicación de librería.

La propuesta debe incluir:

- **Colores:** fondo, superficies, texto principal, texto secundario, bordes, acciones y estados de error.
- **Tipografía:** familia tipográfica, tamaños, pesos y alturas de línea.
- **Espaciado:** márgenes, rellenos y separación entre elementos.
- **Contenedores:** ancho máximo del contenido y distribución de las secciones.
- **Tarjetas:** fondo, bordes, espaciado y jerarquía visual, cuando existan.
- **Formularios:** estilos consistentes para etiquetas, campos y grupos de controles.
- **Botones y enlaces:** estados normales, hover, focus y disabled, cuando corresponda.

Utilizar variables CSS en `:root` para los valores reutilizables, como colores, espaciados, tipografía y radios de borde.

No es necesario utilizar imágenes nuevas ni recursos externos para construir la identidad visual.

## 5. Organización del contenido

Utilizar Flexbox o CSS Grid para organizar las secciones y los elementos que lo necesiten.

Los estilos deben adaptarse a la estructura real del `index.html` y contemplar, cuando existan:

- Encabezado y navegación.
- Contenido principal.
- Buscador y controles de filtrado.
- Listado o catálogo de libros.
- Tarjetas o elementos repetidos.
- Formularios.
- Tablas.
- Pie de página.

Las clases CSS deben reutilizarse entre elementos equivalentes para evitar reglas duplicadas y facilitar el mantenimiento.

No aplicar Flexbox o Grid indiscriminadamente: cada técnica debe responder a una necesidad concreta de distribución.

## 6. Diseño responsive

La interfaz debe funcionar correctamente en un ancho de **320 px** y otro de **1280 px**.

### A 320 px

- El contenido debe ajustarse al ancho disponible.
- Los textos deben permanecer legibles.
- Los campos y botones deben poder utilizarse sin quedar cortados.
- Las tarjetas y secciones deben reorganizarse según el espacio disponible.
- La navegación, si existe, debe seguir siendo accesible.
- No debe producirse desplazamiento horizontal de toda la página.
- Las tablas que requieran más espacio deben desplazarse dentro de su propio contenedor.

### A 1280 px

- El contenido debe aprovechar el espacio disponible sin estirarse excesivamente.
- Las secciones deben mantener una distribución equilibrada.
- Las tarjetas y los elementos repetidos deben organizarse de manera consistente.
- Los formularios, tablas y controles deben conservar una jerarquía visual clara.

Utilizar media queries cuando sean necesarias. No agregar puntos de quiebre arbitrarios sin una necesidad de diseño.

Para evitar desbordamientos, revisar especialmente anchos fijos, márgenes, imágenes, campos, tablas y elementos con textos largos.

## 7. Accesibilidad visual y navegación

### Foco visible

- Los enlaces, botones, campos y demás controles interactivos deben tener un indicador de foco visible.
- Utilizar `:focus-visible` cuando corresponda.
- No eliminar el `outline` sin proporcionar una alternativa claramente visible.
- Mantener un orden de navegación por teclado coherente con el HTML existente.

### Mensajes de error

- Los errores deben poder identificarse mediante texto, no únicamente por el color.
- Los estilos CSS pueden destacar los mensajes existentes mediante tipografía, bordes, espaciado y colores.
- No inventar mensajes, validaciones ni comportamientos que requieran modificar el HTML o incorporar JavaScript.

### Imágenes

- Las imágenes informativas deben contar con texto alternativo en el HTML.
- Las imágenes decorativas no deben repetir información innecesariamente.
- Como esta etapa solo permite modificar CSS, si el HTML no cumple estos requisitos, documentar el problema y solicitar autorización para corregirlo en lugar de modificarlo directamente.

### Contraste y legibilidad

- Mantener un contraste suficiente entre texto y fondo.
- Evitar tamaños de fuente excesivamente pequeños.
- No depender exclusivamente de `hover` para comunicar información importante.

## 8. Organización del CSS

El archivo CSS debe:

- Permanecer separado del HTML.
- Utilizar selectores claros y específicos.
- Reutilizar clases para elementos equivalentes.
- Agrupar las reglas por secciones o componentes.
- Centralizar los valores visuales reutilizables mediante variables CSS.
- Evitar estilos inline, reglas duplicadas y el uso innecesario de `!important`.
- Evitar selectores excesivamente dependientes de la estructura del documento.
- No incorporar código JavaScript ni sintaxis de otros lenguajes.

## 9. Verificación obligatoria

Una vez implementados los estilos, comprobar el resultado visual y registrar las verificaciones realizadas.

### Resoluciones

- [ ] 320 px de ancho.
- [ ] 1280 px de ancho.

### Presentación

- [ ] Existe una identidad visual coherente.
- [ ] Los estilos se encuentran en un archivo CSS externo.
- [ ] Se reutilizan clases para elementos equivalentes.
- [ ] Flexbox o Grid organizan apropiadamente el contenido.
- [ ] Tarjetas, formularios, campos, botones y tablas existentes tienen estilos coherentes.

### Responsive

- [ ] No existe desbordamiento horizontal de toda la página a 320 px.
- [ ] Los textos y controles son legibles.
- [ ] Las tablas anchas se desplazan dentro de su propio contenedor.
- [ ] El contenido se distribuye adecuadamente a 1280 px.

### Accesibilidad

- [ ] Los controles interactivos tienen foco visible.
- [ ] Se puede recorrer la interfaz con el teclado.
- [ ] Los errores no dependen únicamente del color.
- [ ] Las imágenes informativas tienen texto alternativo y las decorativas no duplican información innecesaria, o se documentan las limitaciones que requieren autorización para modificar el HTML.

### Restricciones del proyecto

- [ ] No se modificó `index.html`.
- [ ] No se crearon otros archivos HTML.
- [ ] No se crearon ni modificaron archivos JavaScript.
- [ ] No se modificaron archivos ajenos a esta etapa.

Las verificaciones deben basarse en pruebas reales. No marcar como comprobado un requisito que no se haya revisado.

## 10. Criterios de finalización

El ejercicio se considera terminado cuando:

1. La presentación visual está implementada en el CSS externo.
2. La interfaz responde correctamente a los anchos de 320 px y 1280 px.
3. Se cumplen los requisitos de organización, reutilización de estilos y accesibilidad visual.
4. Se verificaron los criterios de aceptación y se documentaron los resultados.
5. Se respetaron todas las restricciones de alcance.

Al finalizar, el agente debe informar:

- Qué archivo CSS creó o modificó.
- Qué estilos y adaptaciones implementó.
- Qué comprobaciones realizó y sus resultados.
- Qué requisitos quedaron pendientes y por qué.
- Si detectó problemas en el HTML que requieran autorización para corregirse.

No modificar el HTML para resolver problemas sin autorización explícita del usuario.

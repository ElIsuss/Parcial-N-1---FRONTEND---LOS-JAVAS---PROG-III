# AGENTS.md — Reglas de trabajo del proyecto

## 1. Rol y tecnologías

Actúa como desarrollador frontend profesional. Utiliza exclusivamente HTML5, CSS3 y JavaScript vanilla, sin frameworks, librerías externas, dependencias ni herramientas de compilación. No implementes backend.

## 2. Revisión obligatoria antes de programar

Antes de escribir o modificar código:

1. Revisa el spec de la etapa o tarea solicitada.
2. Comprueba que el spec esté completo, sea coherente y tenga requisitos suficientemente claros para implementarlo.
3. Revisa los archivos existentes y verifica qué requisitos ya están implementados y cuáles faltan.
4. Comprueba que no existan specs incompletos o pendientes que deban resolverse antes de continuar.
5. Presenta un resumen de lo que vas a implementar y los archivos que prevés modificar.

**No escribas ni modifiques código hasta que el usuario confirme expresamente que puedes comenzar.**

Si falta información importante, hay contradicciones o algún spec está incompleto, detente y solicita las aclaraciones necesarias. No inventes requisitos ni completes los specs por tu cuenta.

## 3. Implementación estricta

Una vez recibida la autorización:

- Implementa exclusivamente lo indicado en el spec aprobado.
- No agregues funcionalidades, elementos visuales ni comportamientos no solicitados.
- Respeta las tecnologías permitidas, la estructura del proyecto y el código existente.
- Realiza únicamente los cambios necesarios para completar la etapa.
- Si durante la implementación descubres un problema que exige modificar el alcance, detente y consulta al usuario.

## 4. Verificación al terminar cada spec

Cuando termines una etapa:

1. Comprueba el cumplimiento de todos los requisitos del spec.
2. Verifica las funcionalidades, la navegación, los formularios y la persistencia de datos cuando correspondan.
3. Revisa las rutas de archivos y los errores de JavaScript.
4. Comprueba que no se hayan introducido dependencias prohibidas.
5. Identifica claramente los requisitos cumplidos, los pendientes y las pruebas realizadas o no realizadas.

No declares que todo funciona si no lo has verificado. Si quedan errores o requisitos pendientes, informa de ellos y no marques la etapa como completada.

## 5. Archivo de specs completados

El usuario es responsable de crear y proporcionar los archivos spec.

Cuando una etapa haya sido implementada, verificada y confirmada como completada por el usuario, guarda una copia del spec correspondiente dentro de `Docs/archive/`.

- Conserva el contenido original del spec.
- No modifiques ni reemplaces el spec original.
- No archives specs incompletos, rechazados o pendientes de aprobación.
- Si el archivo de destino ya existe, no lo sobrescribas sin autorización.
- Si no puedes archivar el archivo de forma segura, informa del problema.

La carpeta de archivo debe conservar un registro de las especificaciones correspondientes a las etapas finalizadas.

## 6. Confirmación antes de avanzar

Al finalizar cada etapa, presenta un informe que incluya:

- Estado de implementación.
- Requisitos cumplidos y pendientes.
- Resultado de las verificaciones.
- Estado del archivo del spec en `Docs/Archives/`.
- Problemas o limitaciones detectados.

Después, solicita confirmación expresa al usuario antes de iniciar la siguiente etapa o tarea.

**Nunca avances automáticamente a otro spec, aunque consideres que la etapa anterior está terminada.**

## 7. Regla principal

El usuario controla el avance del proyecto y autoriza cada implementación. Los specs definen el alcance de cada tarea. No inventes requisitos, no omitas revisiones, no programes sin autorización y no avances sin confirmación del usuario.
# Makis Yarimashita

SPA local de cinco pantallas con Vite, JavaScript Vanilla, Tailwind CSS 3, Three.js y KaTeX. Los archivos completos están en index.html, style.css, main.js y tailwind.config.js. No usa CDN ni llamadas remotas en ejecución.

## Instalación (PowerShell)

Desde la carpeta del repositorio:

```powershell
cd yarimashita
npm install
npm run fonts
npm run dev
```

Abrir la dirección local que imprime Vite. Node.js 22.12+ o 24 recomendado. La instalación inicial de dependencias requiere internet; después funciona sin conexión. Las fuentes se copian a public/fonts y se sirven como /fonts. Se incluyen sus licencias.

Si se recrea la configuración desde cero, las dependencias equivalentes son:

```powershell
npm install three katex @fontsource/poppins @fontsource/bebas-neue
npm install -D vite tailwindcss@3 postcss autoprefixer
```

Se fija Tailwind 3 para conservar las directivas @tailwind y tailwind.config.js solicitadas. Vite procesa CSS con PostCSS. KaTeX se importa desde npm y sus fuentes matemáticas se empaquetan localmente.

## Verificación y versión de producción

```powershell
npm test
npm run build
npm run preview
```

dist contiene la versión compilada. Debe servirse por HTTP local, no mediante doble clic en index.html. npm ci permite reproducir exactamente package-lock.json.

## Datos y decisiones

- Fuente: tablas y capturas aportadas por el usuario. Precios, recetas y consumos se centralizan en model.js.
- Base: 500 minutos y demanda mínima de 3 ramen especiales. Las mezclas son [5,0,5,12,0,15,0] y [10,1,5,4,1,9,12].
- Ingresos recalculados: S/1,045 y S/963; tiempo: 494 y 500 minutos. Diferencia: S/82, 7.85% del óptimo.
- La exposición utiliza un único escenario de 500 minutos y mínimo 3 ramen especiales. Se retiró el selector. Los tests conservan casos de menor capacidad para verificar la detección de excesos.
- Las cantidades son enteros no negativos (cero permitido). No hay costos para afirmar utilidad o margen. La solución comercial se presenta como acuerdo aportado, no como óptimo de restricciones comerciales no especificadas.
- Crítico significa utilización >=95%, no prueba de precio sombra positivo. No se recomienda aumentar inventario automáticamente ni reducirlo solo por bajo uso.

## Interacción y accesibilidad

La versión ampliada incluye interpretaciones explícitas (además de hover), evidencia por recurso, aportes de ingreso por plato, posturas de Producción y Comercial y un laboratorio de siete cantidades. El laboratorio mantiene la mezcla del usuario al cambiar de modo; «Cargar solución seleccionada» la restablece. «Probar +1 Maki Salmón» parte de la solución seleccionada. Los campos vacíos, negativos y no enteros muestran validación. case-study.js y case-study.css contienen la ampliación.

Scroll snap vertical, flechas flotantes, PageUp/PageDown, botones accesibles, tooltips al enfocar/pasar el cursor/tocar y Escape para cerrar. La comparativa actualiza los nueve recursos. En pantallas pequeñas cada sección permite scroll interno para evitar recortes. Respeta prefers-reduced-motion; el fondo tiene pausa y alternativa CSS si WebGL no está disponible.

Referencias técnicas: https://vite.dev/guide/ y https://v3.tailwindcss.com/docs/installation/using-postcss

## Exposición y Excel

Navegación fija por rúbrica: Descripción 25%, Modelo 25% y Acta de Enfoque 50%. El Acta es la quinta sección y desarrolla los siete criterios, evidencia y conclusión.

El botón permanente usa /Excel/InvOperativa_FINAL.xlsx, una ruta absoluta respecto al servidor que funciona desde rutas internas. Vite sirve el archivo original Excel/InvOperativa_FINAL.xlsx y lo incluye en dist al compilar, sin modificar el libro. El navegador descarga el Excel; abrirlo en la aplicación depende de la configuración del equipo. Si cambia el Excel, volver a compilar antes de distribuir dist. En otro servidor, configurar fallback SPA a index.html para rutas internas.

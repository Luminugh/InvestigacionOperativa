# Makis Yarimashita

Proyecto local de exposición interactiva sobre programación lineal, análisis de sensibilidad y transporte. Usa Vite, JavaScript Vanilla, Tailwind CSS 4 instalado localmente y Three.js. No requiere CDN durante la ejecución. `index.html` se mantiene como la presentación original; las páginas nuevas son `sensibilidad.html` y `transporte.html`.

## Instalación y ejecución (PowerShell)

```powershell
cd yarimashita
npm install
npm run fonts
npm run dev
```

Abre la dirección local que muestra Vite. Para ver las pruebas de aceptación en la página, agrega `?debug=1`, por ejemplo `http://127.0.0.1:5173/sensibilidad.html?debug=1`. Las pruebas aparecen solo al usar ese parámetro.

## Producción y pruebas

```powershell
npm test
npm run build
npm run preview
```

La carpeta `dist` contiene las tres páginas, módulos locales y el Excel distribuido por el proyecto. Sirve el contenido mediante HTTP, no con doble clic a un archivo HTML.

## Páginas y contenido

- `index.html`: modelo de producción existente, contexto y acta de enfoque.
- `sensibilidad.html`: reporte de coeficientes mínimos/máximos, costo reducido y precio sombra; laboratorio de reoptimización con resultado en la misma pantalla; curvas de valor unificadas con los cambios para explorar; decisiones.
- `transporte.html`: formulación, matriz editable, plan de asignación con costo mínimo y simulador de tarifas.
- `src/data.js`: parámetros del caso y datos de transporte.
- `src/lp.js`: solver simplex de dos fases implementado en JavaScript.
- `src/selftest.js`: pruebas deterministas de modelos y resultados; se carga en el navegador solo con `?debug=1`.
- `shared-theme.css`: paleta cálida, encabezados, navegación y componentes comunes a las tres páginas. Las ilustraciones SVG son locales; los fondos Three.js respetan el movimiento reducido y disponen de fallback CSS si WebGL no está disponible.

Las cantidades de producción y las capacidades proceden de la información del caso. No se han supuesto costos de preparación ni márgenes: el objetivo original es maximizar ingresos. Las posturas y el plan comercial se identifican por separado del óptimo matemático. El modelo de transporte presenta por separado el costo de compra/logística; no se suman magnitudes marginales incompatibles sin un modelo integrado.

## Excel

Vite publica el libro existente en `/Excel/InvOperativa_FINAL.xlsx` y lo incluye en `dist`. Los enlaces usan una ruta absoluta desde la raíz del sitio para abrirse desde cualquier página. El comportamiento (abrir o descargar) depende del navegador y del sistema operativo.

## Accesibilidad

Las tres páginas se organizan como presentaciones de pantalla completa. Para exponer en proyector, abre el navegador a pantalla completa (F11) y avanza con las flechas ↑/↓, Re Pág/Av Pág o los botones flotantes. En pantallas pequeñas, cada diapositiva permite desplazamiento vertical interno; las fórmulas extensas y las tablas se desplazan horizontalmente dentro de su tarjeta, sin ensanchar la página. Los tooltips admiten hover y foco, y las interpretaciones principales también aparecen como texto visible. Los gráficos son SVG y se respeta la preferencia de movimiento reducido.

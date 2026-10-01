// Distribute long case-study blocks across real slides before navigation is initialized.
function addSlide(after, id, kicker, title, innerClass = 'section-inner') {
  const slide = document.createElement('section');
  slide.id = id;
  slide.setAttribute('aria-labelledby', `${id}-title`);
  slide.className = 'continuation-slide';
  slide.innerHTML = `<div class="${innerClass}"><p class="eyebrow kicker">${kicker}</p><h2 id="${id}-title">${title}</h2></div>`;
  after.after(slide);
  return slide.querySelector(`.${innerClass}`);
}

function appendFound(target, ...nodes) {
  nodes.filter(Boolean).forEach(node => target.append(node));
}

export function organizeProductionSlides() {
  const hero = document.querySelector('#inicio');
  const context = addSlide(hero, 'contexto', '01 / DESCRIPCIÓN DEL CASO · 25%', 'El problema del restaurante');
  const contextGrid = document.createElement('div');
  contextGrid.className = 'reading-grid two context-grid';
  appendFound(contextGrid, hero.querySelector('.exposition-context'), hero.querySelector('.case-intro'));
  context.append(contextGrid);

  const model = document.querySelector('#modelo');
  const variables = addSlide(model, 'variables', '02 / MODELO · 25%', 'Variables y unidades');
  appendFound(variables, model.querySelectorAll('.section-inner > .study-heading')[0], model.querySelector('.section-inner > .table-scroll'));

  const restrictions = addSlide(document.querySelector('#variables'), 'restricciones', '03 / MODELO · 25%', 'Inventario e insumos');
  const restrictionGrid = document.createElement('div');
  restrictionGrid.className = 'restriction-grid';
  appendFound(restrictionGrid, model.querySelector('.ingredients'));
  restrictions.append(restrictionGrid);

  const capacity = addSlide(document.querySelector('#restricciones'), 'tiempo-demanda', '04 / MODELO · 25%', 'Tiempo y demanda mínima');
  appendFound(capacity, model.querySelector('.model-side'));

  const interpretation = addSlide(document.querySelector('#tiempo-demanda'), 'interpretacion', '05 / LECTURA DEL MODELO', 'De la fórmula a la decisión');
  appendFound(interpretation, model.querySelector('.section-inner > .study-heading'), model.querySelector('.section-inner > .reading-grid'));
  const interpretationCards = [...interpretation.querySelectorAll('.reading-card')];
  const practical = addSlide(document.querySelector('#interpretacion'), 'interpretacion-practica', '06 / LECTURA DEL MODELO', 'Qué limita la producción');
  const practicalGrid = document.createElement('div');
  practicalGrid.className = 'reading-grid';
  appendFound(practicalGrid, ...interpretationCards.slice(3));
  practical.append(practicalGrid);

  const comparison = document.querySelector('#comparativa');
  const criteria = addSlide(comparison, 'criterios', '07 / ENFOQUES DE DECISIÓN', 'Ingreso y variedad');
  appendFound(criteria, comparison.querySelector('.section-inner > .study-heading'), comparison.querySelector('.section-inner > .reading-grid'));

  const tradeoff = addSlide(document.querySelector('#criterios'), 'costo-variedad', '08 / COSTO DE OPORTUNIDAD', 'El precio de ofrecer toda la carta');
  appendFound(tradeoff, comparison.querySelector('.metric-ribbon'), document.querySelector('#recursos .decision'));

  const contribution = addSlide(document.querySelector('#costo-variedad'), 'aporte', '09 / CONTRIBUCIÓN AL INGRESO', 'Qué aporta cada producto');
  appendFound(contribution, comparison.querySelector('.section-inner > .study-heading'), comparison.querySelector('.section-inner > .table-scroll'));

  const simulator = addSlide(document.querySelector('#aporte'), 'simulador', '10 / LABORATORIO DEL CASO', 'Comprueba una mezcla');
  appendFound(simulator, comparison.querySelector('.section-inner > .lab'));

  const resources = document.querySelector('#recursos');
  const resourceReading = addSlide(resources, 'lectura-recursos', '12 / INTERPRETACIÓN DE RECURSOS', 'Qué significan los indicadores');
  appendFound(resourceReading, resources.querySelector('.section-inner > .study-heading'), resources.querySelector('.level-readings'), resources.querySelector('.case-caveat'));

  const resourceActions = addSlide(document.querySelector('#lectura-recursos'), 'acciones-recursos', '13 / HOLGURAS Y ACCIONES', 'Decisiones por recurso');
  appendFound(resourceActions, resources.querySelector('.section-inner > .table-scroll'));

  const recommendations = addSlide(document.querySelector('#acciones-recursos'), 'recomendaciones', '14 / DECISIÓN OPERATIVA', 'Recomendaciones con evidencia');
  appendFound(recommendations, resources.querySelector('.section-inner > .reading-grid.two'));

  const acta = document.querySelector('#acta');
  const actaGrid = acta.querySelector('.reading-grid.two');
  const cards = [...actaGrid.children];
  const evidence = addSlide(acta, 'acta-evidencia', '16 / ACTA DE ENFOQUE · 50%', 'Comercial y evidencia');
  const evidenceGrid = document.createElement('div');
  evidenceGrid.className = 'reading-grid two';
  appendFound(evidenceGrid, ...cards.slice(2, 4));
  evidence.append(evidenceGrid);

  const agreements = addSlide(document.querySelector('#acta-evidencia'), 'acta-acuerdos', '17 / ACTA DE ENFOQUE · 50%', 'Acuerdos y recomendaciones');
  const agreementsGrid = document.createElement('div');
  agreementsGrid.className = 'reading-grid two';
  appendFound(agreementsGrid, ...cards.slice(4));
  agreements.append(agreementsGrid);

  const slides = [...document.querySelectorAll('#slides > section')];
  const total = document.querySelector('.progress > span:last-child');
  if (total) total.textContent = String(slides.length).padStart(2, '0');
}

export function organizeAnalysisSlides(page) {
  if (page === 'sensibilidad') {
    const lecture = document.querySelector('#lectura');
    const report = addSlide(lecture, 'reporte', '04 · REPORTE DEL SOLVER', 'Rangos y costos reducidos', 'inner');
    appendFound(report, lecture.querySelector('.sensitivity-report-card'), lecture.querySelector('.sensitivity-caveat'));

    const lab = document.querySelector('#laboratorio');
    const decisions = document.querySelector('#decisiones');
    const findings = addSlide(decisions, 'hallazgos', '08 · RECOMENDACIONES PARA EL NEGOCIO', 'Recomendaciones para el negocio', 'inner');
    findings.insertAdjacentHTML('beforeend', `<p class="subtitle">Acciones concretas para el negocio a partir de todo lo visto en el análisis de sensibilidad.</p><div class="grid g3 recommendations-grid"><article class="card"><h3>01 · Precio del Salmón</h3><p>No tiene tope superior en el reporte: su precio puede subir sin cambiar el plan óptimo.</p><small>Acción: evaluar un aumento controlado mientras el mercado lo acepte.</small></article><article class="card"><h3>02 · Precio del Ramen Especial</h3><p>Puede subir hasta S/ 37.50 conservando la mezcla óptima.</p><small>Acción: probar un incremento de precio dentro de ese rango.</small></article><article class="card"><h3>03 · Minuto de cocina</h3><p>Cada minuto vale S/ 2 mientras el turno esté entre 314 y 519 minutos.</p><small>Acción: contratar apoyo solo si cuesta menos de S/ 120/hora; no pagar S/ 180 por 100 min extra.</small></article><article class="card"><h3>04 · Arroz adicional</h3><p>Hasta +333 g aporta ≈ S/ 8 (S/ 0.024/g); después el cuello de botella cambia.</p><small>Acción: comprar solo lo necesario; el transporte (S/ 1.75/saco) es otra cuenta.</small></article><article class="card"><h3>05 · Demandas mínimas</h3><p>Los mínimos de Acevichado y Furai cuestan S/ 4 y S/ 11 de ingreso marginal por unidad.</p><small>Acción: revisar si esas demandas mínimas se justifican comercialmente.</small></article><article class="card"><h3>06 · Productos que no entran</h3><p>California, Tokyo Roll y Ramen Clásico no se producen: les faltan S/ 6, S/ 2 y S/ 5.02 de contribución.</p><small>Acción: subir su precio o bajar su costo a esos niveles para incorporarlos.</small></article></div><p class="callout">El precio sombra y el costo reducido solo valen dentro de sus rangos. Fuera de ellos, otro recurso toma el lugar de cuello de botella: reoptimiza antes de decidir compras o cambios de precio grandes.</p>`);
  }

  if (page === 'transporte') {
    const problem = document.querySelector('#problema');
    const tariffs = addSlide(problem, 'tarifas', '03 · COSTOS DE TRANSPORTE', 'Tarifa de cada ruta', 'inner');
    appendFound(tariffs, problem.querySelector('.inner > h3.kicker'), problem.querySelector('#cost-matrix'), problem.querySelector('.inner > .button-row'), problem.querySelector('.inner > .micro'));
    const matrix = tariffs.querySelector('#cost-matrix');
    const matrixScroll = document.createElement('div');
    matrixScroll.className = 'transport-scroll';
    matrix.replaceWith(matrixScroll);
    matrixScroll.append(matrix);
  }
}

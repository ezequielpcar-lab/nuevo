# Genera story/shots.json a partir de esta tabla. La columna `line` se toma de timeline/words.json
# (palabras exactas de la narración que caen dentro de cada toma). Ejecutar desde videos-animados-2d/:
#   python3 projects/dejar-de-envejecer/story/_build_shots.py
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HERE)
words = json.load(open(os.path.join(P, 'timeline/words.json'), encoding='utf-8'))['words']
DUR = 376.2

def S(*names_gains):  # helper: sfx list [(at, name, gain[, pitch])]
    out = []
    for x in names_gains:
        d = {'at': x[0], 'name': x[1], 'gain': x[2]}
        if len(x) > 3: d['pitch'] = x[3]
        out.append(d)
    return out

# (start, set, scene, bars, in, sfx, amb)
T = [
 # --- GANCHO: el bar ---
 (0.00, 'bar', 'Toma abierta: fila del bar de noche, letrero de neón, el portero (traje negro) sostiene tu identificación frente a Sam (sudadera roja). Acercamiento lento.', None, 'cut', S((0.1, 'city', -22)), ('city', -22)),
 (2.45, 'bar', 'Primer plano gigante del portero: mira de reojo a cámara, ceja levantada.', None, 'cut', [], ('city', -26)),
 (4.00, 'bar', 'Detalle: la mano del portero con el carnet de identidad bajo la linterna (foto de Sam, NAC. 1981).', None, 'cut', S((0.2, 'swish', -14)), ('city', -26)),
 (6.50, 'bar', 'Toma media de dos: el portero habla, aparece "1981" brillando entre ellos.', None, 'cut', S((1.5, 'pop', -12)), ('city', -24)),
 (9.80, 'bar', 'Primer plano gigante de Sam: sonrisa tranquila ("Sí").', None, 'cut', [], ('city', -26)),
 (10.60, 'bar', 'Sobre el hombro: hombro desenfocado de Sam adelante; el portero pregunta. Etiqueta "45 AÑOS".', None, 'cut', S((0.5, 'blip', -12)), ('city', -24)),
 (12.50, 'bar', 'Toma media: Sam asiente; el portero se inclina, entrecierra los ojos: "¿qué crema usas?". Sam se encoge de hombros.', None, 'cut', [], ('city', -24)),
 (15.90, 'bar', 'IMAGEN CONGELADA: flash, todo quieto, etiqueta "SAM" con línea guía.', 'scope', 'flash', S((0.0, 'freeze', -6)), None),
 (17.25, 'blueprint', 'Plano: fila de siluetas de Sam creciendo (5, 10, 15, 20) y luego idénticas (25 años después). Contador de años.', None, 'zoom', S((0.2, 'whoosh', -12), (1.6, 'tick', -14)), None),
 # --- presentación ---
 (20.75, 'bar', 'Toma media: Leo (camiseta azul, canas) junto a Sam en la vereda del bar. Etiqueta "CANAS" señala su pelo.', None, 'cut', S((1.2, 'pop', -12)), ('city', -24)),
 (23.20, 'photo', 'Detalle: foto de graduación 2001 (Sam con birrete) junto a Sam hoy, cara idéntica.', None, 'cut', S((0.3, 'pop', -12)), ('roomtone', -24)),
 (26.20, 'bar', 'Sam se agacha y salta sin esfuerzo; detrás Leo se agarra la rodilla.', None, 'cut', S((0.6, 'swish', -12)), ('city', -24)),
 (27.50, 'wallet', 'Detalle: la billetera se abre y aparece el CARNET DE ESTUDIANTE. Guiño.', None, 'cut', S((0.3, 'swish', -14), (1.4, 'ding', -14)), ('roomtone', -26)),
 (31.75, 'blueprint', 'Plano: curva de masa muscular por edad, empieza a bajar después de los 30.', None, 'dip', S((0.4, 'counter', -16)), None),
 (35.95, 'blueprint', 'Tarjeta de datos: PÉRDIDA POR DÉCADA 3 % → 8 %.', None, 'cut', S((0.3, 'pop', -12), (0.6, 'counter', -16)), None),
 (38.95, 'blueprint', 'Mismo gráfico: la línea dorada de Sam queda plana en 20 para siempre (∞).', None, 'cut', S((0.4, 'ding', -12)), None),
 (42.65, 'void', 'Frase grande "PERO HAY UNA REGLA" sobre fondo oscuro con reloj detenido.', 'scope', 'cut', S((0.0, 'stinger', -10)), None),
 (44.30, 'blueprint', 'Plano: figura de Sam con reloj detenido; luego aparecen corazón, huesos, sangre: "SIGUE SIENDO UN CUERPO".', None, 'cut', S((0.3, 'blip', -14)), None),
 (47.90, 'apartment', 'Sam con el brazo enyesado y cabestrillo, cara de dolor.', None, 'cut', S((0.1, 'hit', -10)), ('roomtone', -24)),
 (49.15, 'apartment', 'Sam en cama con termómetro, sudando.', None, 'cut', [], ('roomtone', -24)),
 (50.60, 'blueprint', 'Monitor cardíaco: la línea se vuelve plana en rojo.', 'scope', 'cut', S((0.1, 'heartbeat', -10)), None),
 (51.30, 'apartment', 'Detalle: reloj de arena con la arena congelada en el aire; Sam desenfocado sonríe detrás.', None, 'cut', S((0.3, 'shimmer', -12)), ('roomtone', -26)),
 (54.15, 'title', 'TARJETA DE TÍTULO sobre la ciudad al atardecer: ¿QUÉ PASARÍA SI DEJARAS DE ENVEJECER A LOS 20?', 'scope', 'fade', S((0.05, 'stinger', -6)), ('wind', -26)),
 # --- LO BUENO ---
 (57.25, 'court', 'Toma abierta de la cancha al atardecer, frase "PRIMERO, LO BUENO".', None, 'whip', S((0.0, 'whoosh', -10)), ('city', -24)),
 (58.70, 'court3d', 'Órbita 3D: cancha de básquet, Sam corre con estela, Leo atrás.', None, 'cut', S((0.2, 'whoosh', -12)), ('city', -24)),
 (61.30, 'court', 'Leo inclinado con manos en las rodillas, jadeando y sudando; Sam al fondo rebota la pelota.', None, 'cut', S((0.3, 'kick', -16)), ('city', -24)),
 (63.05, 'court', 'Primer plano gigante de Sam, sonrisa pícara, ni una gota de sudor.', None, 'cut', [], ('city', -26)),
 (64.55, 'court', 'Primer plano gigante de Leo sudando: "Bro. Te odio."', None, 'cut', [], ('city', -26)),
 (66.20, 'court', 'Toma media: Leo abraza a Sam por el hombro: "Con cariño. Pero te odio."', None, 'cut', [], ('city', -24)),
 # --- LO RARO ---
 (68.50, 'office', 'Toma abierta de la oficina con ventanal nocturno, frase "DESPUÉS, LO RARO".', None, 'whip', S((0.0, 'swish', -10)), ('roomtone', -20)),
 (70.25, 'office', 'Jefe joven (pelo parado, traje) da órdenes a Sam. Etiquetas: JEFE 28 / SAM 45.', None, 'cut', S((0.6, 'pop', -12), (1.0, 'pop', -12, 1.2)), ('roomtone', -20)),
 (72.40, 'office', 'Sala de reuniones: dos clientes le dan sus tazas a Sam; gafete "PRACTICANTE".', None, 'cut', S((1.6, 'ding', -14)), ('murmur', -26)),
 (75.55, 'clinic', 'Toma abierta: Sam entra al consultorio, luz fría.', None, 'cut', S((0.1, 'footstep', -16)), ('hum', -24)),
 (76.75, 'clinic', 'Toma media: la doctora lee los análisis; Sam sentado en la camilla.', None, 'cut', S((0.3, 'swish', -16)), ('hum', -24)),
 (78.80, 'blueprint', 'Plano tipo radiografía: hueso, presión y arteria con marcas verdes sincronizadas.', None, 'zoom', S((0.2, 'blip', -12), (1.8, 'blip', -12, 1.2), (3.6, 'blip', -12, 1.4)), None),
 (83.65, 'clinic', 'Primer plano gigante de la doctora, confundida: "¿Seguro que esta fecha...?"', None, 'cut', [], ('hum', -26)),
 (85.80, 'clinic', 'Toma media: Sam se encoge de hombros sonriendo.', None, 'cut', [], ('hum', -24)),
 (88.05, 'blueprint', 'Plano: silueta de Sam con flechas circulares de renovación.', None, 'cut', S((0.2, 'shimmer', -14)), None),
 (90.15, 'blueprint', 'Glóbulos rojos fluyendo por un vaso; contador "120 DÍAS".', None, 'cut', S((0.5, 'counter', -16)), None),
 (93.75, 'blueprint', 'Corazón latiendo, contador sube hasta 100.000 LATIDOS/DÍA.', None, 'cut', S((0.1, 'heartbeat', -12), (0.6, 'counter', -16)), None),
 (96.80, 'void', 'TIEMPO DETENIDO: un reloj dentro del pecho de Sam se para; partículas suspendidas, tono frío.', 'scope', 'flash', S((0.0, 'freeze', -6), (1.6, 'clock', -14)), None),
 (99.90, 'cafe', 'Toma media en un café: Sam lee el menú sin lentes; Leo lo aleja con lentes. Etiqueta "A FAVOR".', None, 'cut', S((0.3, 'ding', -14)), ('murmur', -24)),
 (103.05, 'beach', 'Playa al mediodía: Sam bajo el sol, brillo rojo de quemadura. Etiqueta "EN CONTRA".', None, 'cut', S((0.3, 'buzz', -16)), ('wind', -22)),
 (105.60, 'beach', 'Sam camina por la orilla al atardecer: "NO ERES INMORTAL. SOLO JOVEN."', None, 'cut', [], ('wind', -24)),
 # --- LA GENTE ---
 (108.05, 'street', 'Calle al atardecer: la gente pasa rápido (lapso de tiempo), Sam quieto en el centro.', None, 'dip', S((0.2, 'riser', -16)), ('city', -20)),
 (111.95, 'phone', 'Detalle: pantalla del celular, perfil con la última foto de 2016.', None, 'cut', S((0.3, 'blip', -14)), ('roomtone', -26)),
 (113.90, 'street', 'Dos vecinos susurran detrás de una reja mirando a Sam.', None, 'cut', S((0.4, 'murmur', -18)), ('city', -24)),
 (115.55, 'street', 'Toma media: la vecina le pregunta a Sam: "¿Tu hijo vive contigo?"', None, 'cut', [], ('city', -24)),
 (117.40, 'street', 'Primer plano gigante de Sam, sonrisa incómoda: "No. Soy yo."', None, 'cut', [], ('city', -26)),
 (118.95, 'street', 'Sam carga cajas a un camión de mudanza; los años cambian: 2006, 2016, 2026.', None, 'cut', S((0.5, 'tick', -14), (1.2, 'tick', -14)), ('city', -22)),
 (121.25, 'park', 'Parque dorado: Toby cachorro salta alrededor de Sam. Etiqueta "TOBY".', None, 'cut', S((0.3, 'pop', -14)), ('wind', -24)),
 (122.95, 'park', 'Toby ya mayor camina lento junto a Sam.', None, 'cut', [], ('wind', -24)),
 (123.95, 'park', 'Detalle: el hocico de Toby se vuelve gris.', None, 'cut', S((0.2, 'shimmer', -16)), ('wind', -26)),
 (125.80, 'park', 'Toma abierta al atardecer: Sam carga a Toby en brazos en su último paseo.', 'scope', 'fade', [], ('wind', -24)),
 (128.50, 'park', 'Toma media: Sam abraza a Toby; etiquetas "20" y "14".', 'scope', 'cut', S((0.4, 'pop', -14), (2.6, 'pop', -14)), ('wind', -26)),
 (132.40, 'apartment', 'Noche: Sam solo junto a la ventana con lluvia. "EL COSTO".', 'scope', 'dip', S((0.1, 'rain', -20)), ('rain', -20)),
 (135.20, 'shore', 'Muelle al atardecer: un bote con Leo y mamá se aleja lentamente; Sam en el muelle.', 'scope', 'cut', [], ('wind', -22)),
 (138.75, 'shore', 'En el bote, Leo y mamá envejecen (canas, espalda curva); contador de años.', 'scope', 'cut', [], ('wind', -24)),
 (140.90, 'shore', 'Toma muy abierta: Sam diminuto en la orilla mirando el bote lejano.', 'scope', 'cut', [], ('wind', -22)),
 (143.25, 'office', 'Una compañera invita a Sam con la mano; Sam duda. "¿AMIGOS NUEVOS?"', None, 'cut', [], ('murmur', -24)),
 (145.90, 'apartment', 'Sam solo entre cajas de mudanza.', None, 'cut', [], ('roomtone', -22)),
 (147.65, 'blueprint', 'Plano: medidor de CORTISOL subiendo con la soledad.', None, 'zoom', S((0.4, 'riser', -16)), None),
 (151.45, 'apartment', 'Sam sentado en la cama de noche, encorvado, lluvia en la ventana.', None, 'cut', [], ('rain', -22)),
 (155.30, 'street', 'Sam disfrazado (capucha, lentes oscuros) camina por la calle: funciona.', None, 'cut', [], ('city', -22)),
 (157.80, 'street', 'Alguien lo señala, los lentes caen; falla técnica.', None, 'cut', S((0.1, 'glitch', -10)), ('city', -22)),
 # --- MAMÁ ---
 (159.70, 'momhouse', 'Exterior de la casa de mamá al anochecer, ventanas cálidas, acercamiento lento.', None, 'dip', [], ('wind', -26)),
 (163.15, 'kitchen', 'Cocina cálida: mamá (cárdigan rosa, moño gris) sonríe. Etiqueta "78 AÑOS".', None, 'cut', S((1.0, 'pop', -14)), ('roomtone', -22)),
 (165.95, 'kitchen', 'Mamá camina despacio con su bastón.', None, 'cut', S((0.2, 'footstep', -20), (0.9, 'footstep', -20)), ('roomtone', -22)),
 (167.35, 'kitchen', 'Detalle: el marco de la puerta de la cocina, la cámara sube hasta las rayitas de lápiz.', None, 'cut', [], ('roomtone', -24)),
 (170.80, 'frame', 'Detalle del marco: las rayitas aparecen una por una con su edad.', None, 'cut', S((0.1, 'tick', -16), (0.5, 'tick', -16), (0.9, 'tick', -16)), ('roomtone', -26)),
 (172.27, 'frame', 'Las rayitas suben hasta "20" mientras una silueta crece a su lado.', None, 'cut', S((0.4, 'counter', -18)), ('roomtone', -26)),
 (175.20, 'frame', 'Después de 20, las rayitas se apilan en el mismo lugar (21, 22... 45).', None, 'cut', S((0.3, 'tick', -16)), ('roomtone', -26)),
 (177.85, 'kitchen', 'Toma media: mamá marca la altura de Sam con el lápiz sobre su cabeza.', None, 'cut', [], ('roomtone', -22)),
 (180.30, 'frame', 'Detalle: el lápiz traza otra línea encima de la anterior.', None, 'cut', S((0.5, 'swish', -18)), ('roomtone', -26)),
 (183.65, 'frame', 'La letra de mamá aparece: "Igual de alto. Igual de mío."', None, 'cut', S((0.4, 'shimmer', -16)), ('roomtone', -26)),
 (187.90, 'kitchen', 'Toma media: Sam le pregunta a mamá junto al marco.', None, 'cut', [], ('roomtone', -22)),
 (190.30, 'kitchen', 'Primer plano gigante de mamá, sonrisa tierna: "Porque los años no se miden en centímetros, Sam."', None, 'cut', [], ('roomtone', -24)),
 # --- LA CRISIS ---
 (193.80, 'void', 'Frase "UN MARTES" y la pantalla se agrieta.', 'scope', 'dip', S((0.4, 'impact', -8)), None),
 (196.10, 'laptop', 'Alguien en su laptop de noche encuentra la foto de 2001.', None, 'cut', S((0.3, 'blip', -14)), ('hum', -24)),
 (198.50, 'photo', 'Dos fotos lado a lado (2001 / AYER); círculo en el lunar: "MISMO LUNAR".', None, 'cut', S((1.8, 'ding', -12)), ('hum', -26)),
 (201.05, 'phone', 'Celular: vistas que se disparan, corazones, notificaciones: VIRAL.', None, 'cut', S((0.2, 'phonebuzz', -14), (0.6, 'counter', -14)), ('hum', -26)),
 (204.55, 'streetnight3d', '3D: calle gris de mañana, un auto negro llega y se detiene frente a la casa de Sam.', None, 'cut', S((0.2, 'carpass', -10)), ('city', -22)),
 (208.50, 'street', 'Toma media: el señor Black (gabardina, sombrero, lentes oscuros) frente a Sam en la puerta; tarjeta ETERNA.', None, 'cut', S((1.4, 'pop', -14)), ('city', -24)),
 (211.10, 'street', 'Primer plano gigante de Black medio en sombra: "Tu sangre vale más que cualquier país."', 'scope', 'cut', S((0.2, 'hum', -20)), ('city', -26)),
 (213.85, 'contract', 'Detalle: el contrato, la cifra crece cero por cero hasta nueve ceros.', None, 'cut', S((0.4, 'counter', -14), (2.0, 'ding', -12)), ('roomtone', -26)),
 (216.45, 'labcell', 'Celda de laboratorio fría: Sam dentro de una caja de vidrio, letrero "SALIDA: —".', 'scope', 'cut', S((0.2, 'hum', -16)), ('hum', -20)),
 (220.45, 'street', 'Toma media: Black ofrece la pluma; Sam pregunta "¿Si no firmo?"', None, 'cut', [], ('city', -24)),
 (223.15, 'blueprint', 'Plano: globo terráqueo, puntos de periodistas se encienden en todo el mundo.', None, 'cut', S((0.3, 'glitch', -16), (1.0, 'blip', -14)), None),
 (226.10, 'street', 'Black se aleja hacia el auto; reloj "08:00 MAÑANA".', None, 'cut', S((0.5, 'tick', -12)), ('city', -24)),
 # --- LA CENA ---
 (228.30, 'kitchen', 'Noche: Sam y mamá cenan; mamá se ríe a carcajadas.', None, 'dip', [], ('roomtone', -22)),
 (232.20, 'kitchen', 'Primer plano gigante de mamá: la risa se apaga, se queda quieta.', 'scope', 'cut', S((1.5, 'riser', -14)), ('roomtone', -28)),
 (234.80, 'kitchen', 'CÁMARA LENTA: la cuchara cae en el aire con gotas suspendidas.', 'scope', 'flash', S((0.0, 'slowmo', -8)), None),
 (236.10, 'kitchen', 'Mamá se inclina hacia un lado; Sam se lanza a sostenerla.', None, 'cut', S((0.4, 'hit', -10)), ('roomtone', -26)),
 (238.05, 'blueprint', 'Línea de latido roja que se aplana: "PARO CARDÍACO".', 'scope', 'cut', S((0.1, 'impact', -8)), None),
 (240.40, 'kitchen', 'Sam arrodillado junto a mamá con el celular: "EMERGENCIAS" y "8 MIN".', None, 'cut', S((0.2, 'phonering', -16), (2.4, 'blip', -12)), ('roomtone', -26)),
 (243.95, 'blueprint', 'Barra de supervivencia que baja 10 % por cada minuto.', None, 'cut', S((0.5, 'tick', -14), (1.5, 'tick', -14), (2.5, 'tick', -14), (3.5, 'tick', -14)), None),
 (249.20, 'kitchen', 'Vista desde arriba: las manos de Sam en el centro del pecho de mamá.', None, 'cut', S((0.4, 'hit', -14)), ('roomtone', -26)),
 (251.60, 'blueprint', 'Diagrama de lado: manos comprimiendo el pecho, medida "5 CM".', None, 'cut', S((0.4, 'pop', -14)), None),
 (254.15, 'blueprint', 'Medidor: "100–120 COMPRESIONES / MIN" con pulso.', None, 'cut', S((0.3, 'heartbeat', -12)), None),
 (257.00, 'blueprint', 'Persona normal (línea) se cansa: barra de energía vacía a los "2 MIN".', None, 'cut', [], None),
 (260.40, 'kitchen', 'Primer plano gigante de Sam decidido, balanceándose al ritmo.', 'scope', 'cut', S((0.2, 'heartbeat', -14)), ('roomtone', -28)),
 (264.65, 'kitchen', 'Toma media de lado: Sam comprime; números 1, 2, 3, 4 aparecen con cada palabra.', None, 'cut', S((0.15, 'hit', -14), (0.87, 'hit', -14), (1.83, 'hit', -14), (2.73, 'hit', -14)), ('roomtone', -28)),
 (267.55, 'kitchen', 'Cronómetro gigante "07:00", Sam no para.', None, 'cut', S((0.1, 'clock', -12)), ('roomtone', -28)),
 (269.30, 'kitchen', 'Luces rojas y azules entran por la ventana: la sirena.', None, 'cut', S((0.0, 'riser', -14)), ('city', -22)),
 (270.35, 'kitchen', 'Paramédicos se arrodillan y toman el control; Sam se aparta exhausto.', None, 'cut', [], ('city', -24)),
 (272.40, 'blueprint', 'Monitor: plano... ¡bip! latido débil, luego más fuerte.', None, 'cut', S((1.0, 'heartbeat', -10), (2.6, 'heartbeat', -8)), None),
 # --- EL HOSPITAL ---
 (276.40, 'hospital', 'Habitación de hospital de noche: mamá en la cama, Sam en la silla; el teléfono vibra.', None, 'dip', S((1.4, 'phonebuzz', -12)), ('hum', -22)),
 (279.50, 'phone', 'Pantalla del celular: llamada de "BLACK · ETERNA", ondas de voz.', None, 'cut', S((0.1, 'phonebuzz', -16)), ('hum', -24)),
 (283.00, 'carnight', 'Primer plano gigante de Black en su auto bajo la lluvia, hablando por teléfono.', 'scope', 'cut', [], ('rain', -20)),
 (286.10, 'hospital', 'Detalle: el reloj de la pared avanza.', None, 'cut', S((0.1, 'clock', -14)), ('hum', -24)),
 (288.05, 'hospital', 'La puerta de la habitación, luz del pasillo.', None, 'cut', [], ('hum', -24)),
 (289.20, 'hospital', 'Detalle: la mano de mamá sobre la sábana, con la vía.', None, 'cut', S((0.3, 'heartbeat', -18)), ('hum', -26)),
 (290.95, 'hospital', 'Pantalla dividida: laboratorio frío a la izquierda, la mano de mamá cálida a la derecha.', 'scope', 'cut', S((0.2, 'whoosh', -14)), ('hum', -26)),
 (293.65, 'hospital', 'Toma media: Sam se sienta y le toma la mano a mamá.', None, 'cut', [], ('hum', -24)),
 (296.85, 'phone', 'Detalle: el celular se apaga.', None, 'cut', S((0.8, 'blip', -12, 0.7)), ('hum', -26)),
 # --- LA VERDAD ---
 (299.00, 'carnight', 'Black en su auto con la laptop, reloj 08:00, envía el correo.', None, 'cut', S((0.4, 'tick', -14)), ('rain', -22)),
 (301.80, 'carnight', 'Primer plano gigante de Black: sorpresa. "TARDE".', None, 'cut', S((0.4, 'stinger', -10)), ('rain', -24)),
 (303.60, 'phone', 'Celular grabando "REC 7:00", Sam en pantalla.', None, 'cut', S((0.2, 'blip', -12)), ('hum', -26)),
 (306.20, 'corridor', 'Primer plano gigante de Sam frente a la cámara, sereno y decidido.', None, 'cut', [], ('hum', -26)),
 (309.60, 'publiclab', 'Laboratorio público luminoso: la doctora Lee y científicos le dan la mano a Sam.', None, 'cut', S((0.3, 'shimmer', -14)), ('roomtone', -22)),
 (314.55, 'blueprint', 'Lista: PRUEBAS ABIERTAS ✓ RESULTADOS PARA TODOS ✓ NADA A LA VENTA ✓.', None, 'cut', S((0.15, 'ding', -14), (1.15, 'ding', -14, 1.2), (3.15, 'ding', -14, 1.4)), None),
 (319.00, 'contract', 'Contrato con banderas rojas: ESA MISMA NOCHE ✗, SIN ABOGADO ✗, BAJO AMENAZA ✗.', None, 'cut', S((2.8, 'blip', -14), (3.8, 'blip', -14), (4.8, 'blip', -14)), None),
 (324.80, 'carnight', 'Black solo junto a su auto bajo la lluvia, maletín vacío, se aleja.', 'scope', 'cut', [], ('rain', -20)),
 (327.20, 'corridor', 'Pasillo del hospital: Leo llega con dos cafés.', None, 'cut', S((0.2, 'footstep', -18), (0.7, 'footstep', -18)), ('hum', -24)),
 (329.55, 'corridor', 'Toma media: Leo le da el café a Sam: "Amigo. Siempre supe que eras raro."', None, 'cut', [], ('hum', -24)),
 (332.40, 'hospital', 'Primer plano gigante de mamá abriendo los ojos.', None, 'cut', S((0.3, 'shimmer', -14)), ('hum', -26)),
 (334.50, 'hospital', 'Detalle: Sam le pone un lápiz en la mano.', None, 'cut', [], ('hum', -26)),
 (337.05, 'kitchen', 'Cocina de día: Sam acompaña a mamá hasta el marco de la puerta.', None, 'fade', [], ('roomtone', -22)),
 (340.85, 'frame', 'Detalle: mamá dibuja otra rayita en el mismo lugar.', None, 'cut', S((0.5, 'swish', -18)), ('roomtone', -26)),
 (344.15, 'frame', 'La letra brilla: "Igual de alto. Igual de mío." Mamá y Sam abrazados detrás.', None, 'cut', S((0.2, 'shimmer', -14)), ('roomtone', -26)),
 (347.40, 'street', 'Sam camina por la calle soleado sin disfraz; los vecinos lo saludan.', None, 'cut', [], ('city', -22)),
 # --- EL GIRO ---
 (350.70, 'mailbox', 'Buzón: llega una carta escrita a mano. "3 SEMANAS DESPUÉS".', None, 'dip', S((0.3, 'pop', -14)), ('wind', -26)),
 (354.65, 'letter', 'La carta: líneas de letra a mano aparecen sincronizadas.', None, 'cut', S((0.2, 'swish', -16)), ('roomtone', -26)),
 (358.60, 'letter', 'Foto sepia de 1890: un joven idéntico de 20 años. Sam, impactado.', 'scope', 'flash', S((0.3, 'stinger', -8)), ('roomtone', -26)),
 # --- CIERRE ---
 (362.10, 'end', 'Pantalla final: pregunta, burbuja de comentario, botón de suscripción y el reparto.', None, 'fade', S((0.3, 'pop', -12)), None),
 (368.80, 'frame', 'Final: el marco con las rayitas y un corazón; "PARTE 2".', None, 'fade', S((0.4, 'shimmer', -14)), None),
]

shots = []
for i, row in enumerate(T):
    st, set_, scene, bars, tin, sfx, amb = row
    en = T[i + 1][0] if i + 1 < len(T) else DUR
    line = ' '.join(w['word'] for w in words if st - 0.05 <= w['start'] < en - 0.05)
    tr = {'type': tin}
    if tin in ('fade', 'dip', 'flash', 'whip', 'zoom'): tr['dur'] = {'fade': 0.6, 'dip': 0.6, 'flash': 0.35, 'whip': 0.35, 'zoom': 0.5}[tin]
    s = {'id': f's{i+1:03d}', 'start': round(st, 2), 'end': round(en, 2), 'line': line, 'scene': scene, 'set': set_, 'bars': bars, 'in': tr, 'sfx': sfx, 'notes': ''}
    if amb: s['amb'] = {'name': amb[0], 'gain': amb[1]}
    if set_ in ('title', 'end'): s['captions'] = False
    shots.append(s)

music = [
 {'start': 0, 'end': 54.15, 'mood': 'playful', 'intensity': 0.4},
 {'start': 54.15, 'end': 108.05, 'mood': 'wonder', 'intensity': 0.55},
 {'start': 108.05, 'end': 159.7, 'mood': 'sad', 'intensity': 0.4},
 {'start': 159.7, 'end': 193.8, 'mood': 'calm', 'intensity': 0.35},
 {'start': 193.8, 'end': 228.3, 'mood': 'mystery', 'intensity': 0.55},
 {'start': 228.3, 'end': 276.4, 'mood': 'tension', 'intensity': 0.75},
 {'start': 276.4, 'end': 303.6, 'mood': 'dark', 'intensity': 0.5},
 {'start': 303.6, 'end': 350.7, 'mood': 'triumph', 'intensity': 0.65},
 {'start': 350.7, 'end': 362.1, 'mood': 'mystery', 'intensity': 0.6},
 {'start': 362.1, 'end': DUR, 'mood': 'hopeful', 'intensity': 0.45},
]
out = {'title': '¿Qué pasaría si dejaras de envejecer a los 20?', 'duration': DUR, 'shots': shots, 'music': music, 'sfx': []}
json.dump(out, open(os.path.join(HERE, 'shots.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
durs = sorted(s['end'] - s['start'] for s in shots)
print(f'{len(shots)} tomas, mediana {durs[len(durs)//2]:.2f}s, min {durs[0]:.2f}, max {durs[-1]:.2f}')
nl = [s['id'] for s in shots if not s['line'] and s['set'] not in ('end',)]
print('sin texto:', nl)

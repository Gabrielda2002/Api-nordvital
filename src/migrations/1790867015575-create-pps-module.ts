import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

interface GoalSeed {
    line: string;
    code: string;
    description: string;
    activities: Array<{ code: string; description: string }>;
}

const ACTION_LINES: Array<[string, string]> = [
    [
        "E1La",
        "DESTINAR Y GESTIONAR LOS RECURSOS FINANCIEROS NECESARIOS EN LOS PRESUPUESTOS EN EL NIVEL NACIONAL Y TERRITORIAL ORIENTADOS A FORTALECER LAS ESTRUCTURAS ADMINISTRATIVAS Y EL RECURSO HUMANO DEDICADO AL FOMENTO Y GESTION DE LOS PROCESOS DE PARTICIPACION Y EN EL DESARROLLO DE LA POLITICA DE PARTICIPACION SOCIAL EN SALUD"
    ],
    [
        "E1Lb",
        "DEFINIR LOS PROGRAMAS DE FORMACION Y CAPACITACION AL PERSONAL DEL SECTOR SALUD PARA LA GENERACION DE CAPACIDADES PARA EL DERECHO A LA PARTICIPACION SOCIAL, ASI COMO, HERRAMIENTAS PEDAGOGICAS, DIDACTICAS Y TECNOLOGICAS QUE PERMITAN LA INTERVENCION DE LA COMUNIDAD EN EL SECTOR"
    ],
    [
        "E1Lc",
        "DESARROLLAR UNA ESTRATEGIA SISTEMATICA DE ASISTENCIA TECNICA A LAS ENTIDADES TERRITORIALES PARA LA IMPLEMENTACION DE LA POLITICA DE PARTICIPACION SOCIAL EN SALUD"
    ],
    [
        "E1Ld",
        "ESTABLECER MECANISMOS DE COFINANCIACION DE PROYECTOS DE INVERSION EN LOS DIFERENTES NIVELES DE GOBIERNO DESTINADOS A LA PROMOCION Y GESTION DE LA PARTICIPACION SOCIAL EN SALUD"
    ],
    [
        "E1Le",
        "REALIZAR GESTIONES INTERINSTITUCIONALES PARA LA FORMACION DE LA COMUNIDAD EN PLANEACION, PRESUPUESTACION Y CONTROL SOCIAL EN SALUD"
    ],
    [
        "E1Lf",
        "DEFINIR LOS LINEAMIENTOS PARA LAS ENTIDADES TERRITORIALES Y ENTIDADES DEL SECTOR SALUD QUE PROPENDAN POR GARANTIZAR LA PARTICIPACION EN LA DECISION EN LA GESTION DEL SECTOR SALUD EN EL MARCO DEL CUMPLIMIENTO DE LOS OBJETIVOS DE LA POLITICA DE PARTICIPACION SOCIAL EN SALUD"
    ],
    [
        "E1Lg",
        "TRANSVERSALIZAR LOS PROCESOS Y DINAMICAS DE PARTICIPACION SOCIAL EN EL CICLO DE LAS POLITICAS PUBLICAS DEL SECTOR SALUD A NIVEL TERRITORIAL"
    ],
    [
        "E1Lh",
        "INCORPORAR EL ENFOQUE DIFERENCIAL EN EL DESARROLLO DE LOS ESPACIOS DE PARTICIPACION EN SALUD EN LA DEFINICION E IMPLEMENTACION DE LOS PROGRAMAS DEL SECTOR SALUD"
    ],
    [
        "E1Li",
        "REALIZAR LOS AJUSTES NORMATIVOS QUE PERMITAN LA PARTICIPACION EN LA GESTION DEL SECTOR SALUD EN LOS DIFERENTES NIVELES TERRITORIALES E INSTITUCIONALES PARA EL CUMPLIMIENTO DE LOS OBJETIVOS DE LA POLITICA DE PARTICIPACION EN EL MARCO DE LA LEY ESTATUTARIA DE SALUD"
    ],
    [
        "E2La",
        "CREAR UNA ESTRATEGIA PEDAGOGICA PERMANENTE EN SALUD PARA CUALIFICAR A LOS CIUDADANOS EN LOS PROCESOS DE PARTICIPACION, EN LOS TEMAS DE INTERES EN SALUD Y EN EL DERECHO A LA SALUD"
    ],
    [
        "E2Lb",
        "ESTABLECER LOS INCENTIVOS QUE PROPICIEN LA PARTICIPACION SOCIAL Y COMUNITARIA"
    ],
    [
        "E2Lc",
        "IMPULSAR Y PROMOCIONAR LAS INICIATIVAS DEL USO Y APROPIACION DE LAS TECNOLOGIAS DE INFORMACION Y LAS COMUNICACIONES EN LAS ORGANIZACIONES SOCIALES EN SALUD"
    ],
    [
        "E2Ld",
        "FORTALECER LAS ESTRATEGIAS DE INFORMACION Y COMUNICACION INCLUIDO EL ACCESO A MEDIOS, BOLETINES, PERIODICOS QUE POSIBILITE ESPACIOS A LAS ORGANIZACIONES PARA IMPULSAR Y VISIBILIZAR SUS PROCESOS PARTICIPATIVOS"
    ],
    [
        "E2Le",
        "PROMOVER LAS FORMAS DE CONVOCATORIA DE LOS ESPACIOS DE PARTICIPACION QUE RECONOZCA LAS DINAMICAS TERRITORIALES Y COMUNITARIAS DEL SECTOR SALUD"
    ],
    [
        "E2Lf",
        "GESTIONAR RECURSOS PARA LA FINANCIACION PARA LAS INICIATIVAS COMUNITARIAS PARA QUE LA COMUNIDAD INCIDA, INTERVENGA Y DECIDA EN EL CICLO DE LAS POLITICAS EN SALUD"
    ],
    [
        "E2Lg",
        "DEFINIR LOS LINEAMIENTOS QUE PERMITAN A LAS ENTIDADES TERRITORIALES EL ESTABLECIMIENTO EN SUS PRESUPUESTOS DE LOS RECURSOS NECESARIOS PARA GARANTIZAR LA PARTICIPACION DE LA COMUNIDAD EN LOS ESPACIOS REQUERIDOS PARA LA DELIBERACION DE LAS POLITICAS PUBLICAS"
    ],
    [
        "E2Lh",
        "DEFINIR LOS MECANISMOS PARA FORTALECER LA REPRESENTACION DE LAS COMUNIDADES EN LOS ESPACIOS DE INCIDENCIA EN LA POLITICA PUBLICA EN SALUD"
    ],
    [
        "E2Li",
        "DEFINIR LOS MECANISMOS DE CONSULTA Y DE LA TRANSFERENCIA DE LA INFORMACION REQUERIDA PARA GARANTIZAR LA PARTICIPACION DE LA COMUNIDAD, EN LAS DEFINICIONES DE POLITICA INTEGRAL DE SALUD, EN LAS PRIORIDADES EN SALUD, ASI COMO EN INCLUSIONES Y EXCLUSIONES"
    ],
    [
        "E3La",
        "DEFINIR E IMPLEMENTAR LAS ESTRATEGIAS DE INCIDENCIA Y FORMACION PARA FORTALECER LA SALUD PUBLICA EN CONCERTACION CON LAS COMUNIDADES"
    ],
    [
        "E3Lb",
        "DISEÑAR UNA ESTRATEGIA DE COMUNICACION E INFORMACION PARA LA PROMOCION Y SOCIALIZACION DE UNA CULTURA DE BIENESTAR Y SALUD CON PERSPECTIVA COMUNITARIA"
    ],
    [
        "E3Lc",
        "PROMOVER UN PROGRAMA DE FORMACION DE FORMADORES COMUNITARIOS EN SALUD PUBLICA CON ENFOQUE DE DERECHO DIFERENCIAL Y DE GENERO"
    ],
    [
        "E3Ld",
        "CONFORMAR Y/O CONSOLIDAR MECANISMOS DE ESPACIOS PARA QUE LA CIUDADANIA PARTICIPE Y SE APROPIE DE LOS PROGRAMAS DE PROMOCION Y PREVENCION"
    ],
    [
        "E3Le",
        "INCORPORAR LA POLITICA DE PARTICIPACION EN LOS LINEAMIENTOS DE SALUD PUBLICA ORIENTADOS A LAS ENTIDADES TERRITORIALES"
    ],
    [
        "E4La",
        "IMPULSAR PROCESOS DE CAPACITACION Y FORMACION PARA EL DESARROLLO DE CAPACIDADES CIUDADANAS EN LOS ESPACIOS DE CONTROL SOCIAL EN SALUD EN TEMAS RELACIONADOS CON LA GESTION PUBLICA"
    ],
    [
        "E4Lb",
        "MEJORAR EL ACCESO A LA INFORMACIÓN POR PARTE DE LA CIUDADANIA A TRAVES DE LA AMPLIACION DE CANALES DE COMUNICACION POR PARTE DE LAS INSTITUCIONES"
    ],
    [
        "E4Lc",
        "POSICIONAR EL CONTROL SOCIAL COMO ELEMENTO BASICO DE LA DEMOCRACIA Y LA TRANSPARENCIA EN SALUD, LO CUAL INCLUYE EL RECONOCIMIENTO A VEEDORES Y A SUS REDES"
    ],
    [
        "E4Ld",
        "IMPLEMENTAR LOS MECANISMOS QUE PERMITAN FORTALECER LA PARTICIPACION CIUDADANA EN EL ANALISIS DE INFORMACION PARA QUE ESTA CONTRIBUYA A QUE LAS AUTORIDADES HAGAN UN MANEJO TRANSPARENTE DE LOS ASUNTOS Y RECURSOS PUBLICOS"
    ],
    [
        "E4Le",
        "DEFINIR E IMPLEMENTAR UNA ESTRATEGIA DE FORMACION DIRIGIDA A LOS FUNCIONARIOS Y LA CIUDADANIA PARA EL FORTALECIMIENTO Y PROMOCION DEL CONTROL SOCIAL EN LAS INSTITUCIONES DEL SECTOR SALUD"
    ],
    [
        "E4Lf",
        "CREAR UN OBSERVATORIO DE PARTICIPACION Y CONTROL SOCIAL EN SALUD"
    ],
    [
        "E5La",
        "DISEÑAR Y DESARROLLAR LAS METODOLOGIAS DE PLANIFICACIÓN Y PRESUPUESTACION PARTICIPATIVA CON ENFASIS EN LA GARANTIA DE LA PARTICIPACION DE LA POBLACION EN LA IDENTIFICACION, PRIORIZACION, PRESUPUESTACION, ATENCIONES EN SALUD Y LA SOLUCION DE LOS PROBLEMAS DE SALUD DE SU ENTORNO"
    ],
    [
        "E5Lb",
        "IMPLEMENTAR LOS DISPOSITIVOS QUE LE PERMITAN A LA CIUDADANIA PARTICIPAR EN LA GESTION DEL SECTOR SALUD EN LOS NIVELES TERRITORIALES E INSTITUCIONALES"
    ],
    [
        "E5Lc",
        "DEFINIR LOS MECANISMOS QUE PERMITAN LA PARTICIPACION DE LA POBLACION EN LA TOMA DE DECISIONES EN LA INVERSION PUBLICA"
    ],
    [
        "E5Ld",
        "FORTALECER LOS ESCENARIOS PARA LA PARTICIPACION EN LA DECISION"
    ]
];

const GOALS: GoalSeed[] = [
    {
        "line": "E1La",
        "code": "M01",
        "description": "GARANTIZAR LA ASIGNACIÓN DEL TALENTO HUMANO Y PRESUPUESTO ANUAL PARA LA EJECUCIÓN DE LA PPSS",
        "activities": [
            {
                "code": "A01",
                "description": "ASIGNAR EL RECURSO HUMANO QUE LIDERA LA GESTION DE LOS PROCESOS DE PARTICIPACION Y EL DESARROLLO DE LA PPSS"
            }
        ]
    },
    {
        "line": "E1Lb",
        "code": "M01",
        "description": "EJECUTAR EL CRONOGRAMA DE CAPACITACIÓN INSTITUCIONAL EN PARTICIPACION SOCIAL EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "CAPACITAR CONTINUAMENTE AL GRUPO INSTITUCIONAL DE PROMOCION DE LOS PROCESOS DE PARTICIPACION SOCIAL A NIVEL INSTITUCIONAL"
            }
        ]
    },
    {
        "line": "E1Le",
        "code": "M01",
        "description": "PARTICIPAR EN ACTIVIDADES DE CAPACITACION Y FORMACION DIRIGIDAS POR EL ENTE TERRITORIAL Y OTROS ORGANOS DE CONTROL A LA COMUNIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "GENERAR ESPACIOS DE PARTICIPACIÓN E INTEGRACION DE LOS USUARIOS EN PRO DE HACERLOS PARTICIPES DE LA PPSS Y DEMAS SERVICIOS DE LA IPS"
            }
        ]
    },
    {
        "line": "E1Lh",
        "code": "M01",
        "description": "EJECUTAR CRONOGRAMA DE CAPACITACIÓN INSTITUCIONAL DIRIGIDO A LA POBLACIÓN ASIGNADA SEGÚN ENFOQUE DIFERENCIAL Y NECESIDADES OBSERVADAS",
        "activities": [
            {
                "code": "A01",
                "description": "DESARROLLAR ACTIVIDADES DE CAPACITACIÓN Y FORMACIÓN DIRIGIDAS A POBLACION CON ENFOQUE DIFERENCIAL SEGÚN NECESIDADES DEL TERRITORIO"
            }
        ]
    },
    {
        "line": "E2La",
        "code": "M01",
        "description": "CREAR UNA ESTRATEGIA PEDAGOGICA PERMANENTE EN SALUD PARA CUALIFICAR A LOS CIUDADANOS EN LOS PROCESOS DE PARTICIPACION Y EN EL DERECHO A LA SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "PUBLICAR INFOGRAFIAS PEDAGOGICAS DE LOS PROCESOS DE PARTICIPACION SOCIAL A TRAVES DE REDES Y PAGINA INSTITUCIONAL"
            },
            {
                "code": "A02",
                "description": "CAPACITAR CONTINUAMENTE A LOS USUARIOS EN EL EJERCICIO DE SUS DERECHOS Y DEBERES A TRAVES DE FOLLETO INSTITUCIONAL Y CARTELERA"
            }
        ]
    },
    {
        "line": "E2Ld",
        "code": "M01",
        "description": "FORTALECER LAS ESTRATEGIAS DE INFORMACION Y COMUNICACION PARA VISIBILIZAR LOS PROCESOS PARTICIPATIVOS DE LAS ORGANIZACIONES SOCIALES EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "SOCIALIZAR MATERIAL DIDACTICO A LOS USUARIOS EN SALA SOBRE INFORMACION DE TEMAS EN SALUD"
            }
        ]
    },
    {
        "line": "E3La",
        "code": "M01",
        "description": "DEFINIR E IMPLEMENTAR LAS ESTRATEGIAS DE INCIDENCIA Y FORMACION PARA FORTALECER LA SALUD PUBLICA EN CONCERTACION CON LAS COMUNIDADES",
        "activities": [
            {
                "code": "A01",
                "description": "DIFUNDIR MATERIAL DIDACTICO QUE FORME AL PERSONAL DE SALUD EN TEMAS DE SALUD PUBLICA DENTRO DE LA POLITICA DE PARTICIPACION SOCIAL EN SALUD"
            }
        ]
    },
    {
        "line": "E3Lc",
        "code": "M01",
        "description": "IDENTIFICAR LIDERES Y ESCENARIOS CLAVES QUE REPLIQUEN DE FORMA EFECTIVA LOS PROCESOS EDUCATIVOS EN SU COMUNIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "REALIZAR LA CREACION O RENOVACIÓN DE LA JUNTA DIRECTIVA DE LA ASOCIACIÓN DE USUARIOS DE LA IPS"
            }
        ]
    },
    {
        "line": "E3Ld",
        "code": "M01",
        "description": "CONFORMAR Y/O CONSOLIDAR MECANISMOS Y ESPACIOS PARA QUE LA CIUDADANIA PARTICIPE Y SE APROPIE DE LOS PROGRAMAS DE PROMOCION Y PREVENCION",
        "activities": [
            {
                "code": "A01",
                "description": "CAPACITAR A LOS USUARIOS EN GENERAL EN ACCIONES DE SALUD PUBLICA CON ENFOQUE DE DERECHOS PARA IMPLEMENTAR LA PPSS"
            }
        ]
    },
    {
        "line": "E4La",
        "code": "M01",
        "description": "PROMOVER CAPACITACIONES Y FORMACIÓN PARA EL DESARROLLO DE LA CIUDADANÍA EN LOS ESPACIOS DE CONTROL SOCIAL EN SALUD EN TEMAS DE GESTIÓN PÚBLICA",
        "activities": [
            {
                "code": "A01",
                "description": "CREAR ESPACIOS ARTICULADOS CON LOS ENTES TERRITORIALES PARA CAPACITAR EN TEMAS DE GESTIÓN PÚBLICA ENCAMINADOS A LA PARTICIPACIÓN DE LA COMUNIDAD"
            }
        ]
    },
    {
        "line": "E4Lb",
        "code": "M01",
        "description": "MEJORAR EL ACCESO A LA INFORMACIÓN DE LA CIUDADANÍA MEDIANTE LA AMPLIACIÓN DE CANALES DE COMUNICACIÓN DE LA INSTITUCIÓN",
        "activities": [
            {
                "code": "A01",
                "description": "IDENTIFICAR Y HABILITAR ESPACIOS DE CARÁCTER PÚBLICO TALES COMO MURAL INFORMATIVO EN LA IPS CARTELERAS Y PÁGINA INSTITUCIONAL"
            }
        ]
    },
    {
        "line": "E5La",
        "code": "M01",
        "description": "DESARROLLAR METODOLOGIAS DE PLANIFICACIÓN Y PRESUPUESTACION PARTICIPATIVA QUE GARANTICEN LA PARTICIPACION DE LA POBLACION EN LAS DECISIONES EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "PRESENTAR EL PLAN OPERATIVO ANUAL Y EL PLAN DE ACCION DE LA PPSS DE LA VIGENCIA ANTE LAS INSTANCIAS DE PARTICIPACION DE LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E1Lc",
        "code": "M01",
        "description": "DESARROLLAR ACCIONES DE ASISTENCIA TECNICA PARA LA IMPLEMENTACION Y SEGUIMIENTO DE LA PPSS SEGÚN LAS COMPETENCIAS DE LA ENTIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "REALIZAR JORNADAS DE ASISTENCIA TECNICA Y ACOMPAÑAMIENTO A LOS ACTORES Y ESPACIOS DE PARTICIPACION DE LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E1Ld",
        "code": "M01",
        "description": "GESTIONAR MECANISMOS DE COFINANCIACION DE PROYECTOS QUE FORTALEZCAN LA PARTICIPACION SOCIAL EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "IDENTIFICAR Y GESTIONAR FUENTES DE COFINANCIACION PARA PROYECTOS DE PARTICIPACION SOCIAL EN SALUD"
            }
        ]
    },
    {
        "line": "E1Lf",
        "code": "M01",
        "description": "APROPIAR LOS LINEAMIENTOS QUE GARANTIZAN LA PARTICIPACION DE LA COMUNIDAD EN LA GESTION DEL SECTOR SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "SOCIALIZAR LOS LINEAMIENTOS DE PARTICIPACION SOCIAL EN SALUD CON LOS EQUIPOS Y ESPACIOS DE LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E1Lg",
        "code": "M01",
        "description": "TRANSVERSALIZAR LOS PROCESOS DE PARTICIPACION SOCIAL EN EL CICLO DE LAS POLITICAS Y PROCESOS DE LA ENTIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "CONFORMAR MESAS DE TRABAJO PARA ARTICULAR LA PARTICIPACION SOCIAL EN LOS PROCESOS INTERNOS DE LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E1Li",
        "code": "M01",
        "description": "GENERAR ACTOS ADMINISTRATIVOS QUE ADOPTEN Y FORTALEZCAN LA POLITICA DE PARTICIPACION SOCIAL EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "EXPEDIR Y SOCIALIZAR ACTOS ADMINISTRATIVOS PARA LA ADOPCION DE LA PPSS EN LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E2Lb",
        "code": "M01",
        "description": "ESTABLECER INCENTIVOS QUE PROPICIEN Y RECONOZCAN LA PARTICIPACION SOCIAL Y COMUNITARIA EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "RECONOCER PUBLICAMENTE A LOS LIDERES Y ORGANIZACIONES QUE PARTICIPAN EN LOS PROCESOS DE LA PPSS"
            }
        ]
    },
    {
        "line": "E2Lc",
        "code": "M01",
        "description": "IMPULSAR EL USO Y APROPIACION DE LAS TECNOLOGIAS DE INFORMACION EN LAS ORGANIZACIONES SOCIALES EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "CAPACITAR A LAS ORGANIZACIONES SOCIALES EN HERRAMIENTAS TIC PARA VISIBILIZAR SUS INICIATIVAS EN SALUD"
            }
        ]
    },
    {
        "line": "E2Le",
        "code": "M01",
        "description": "PROMOVER FORMAS DE CONVOCATORIA QUE RECONOZCAN LAS DINAMICAS TERRITORIALES Y COMUNITARIAS EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "DIFUNDIR LAS CONVOCATORIAS DE LOS ESPACIOS DE PARTICIPACION POR MULTIPLES CANALES INSTITUCIONALES Y COMUNITARIOS"
            }
        ]
    },
    {
        "line": "E2Lf",
        "code": "M01",
        "description": "GESTIONAR RECURSOS PARA LA FINANCIACION DE INICIATIVAS COMUNITARIAS QUE INCIDAN EN LAS POLITICAS EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "APOYAR INICIATIVAS COMUNITARIAS EN SALUD MEDIANTE LA GESTION DE RECURSOS Y ALIANZAS"
            }
        ]
    },
    {
        "line": "E2Lg",
        "code": "M01",
        "description": "DEFINIR LOS RECURSOS NECESARIOS EN EL PRESUPUESTO PARA GARANTIZAR LA PARTICIPACION DE LA COMUNIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "INCLUIR EN EL PRESUPUESTO LOS RECURSOS PARA LA OPERACION DE LOS ESPACIOS DE PARTICIPACION"
            }
        ]
    },
    {
        "line": "E2Lh",
        "code": "M01",
        "description": "FORTALECER LA REPRESENTACION DE LAS COMUNIDADES EN LOS ESPACIOS DE INCIDENCIA EN LA POLITICA EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "APOYAR LA PARTICIPACION DE LOS REPRESENTANTES DE LA COMUNIDAD EN LOS ESPACIOS DE DECISION EN SALUD"
            }
        ]
    },
    {
        "line": "E2Li",
        "code": "M01",
        "description": "DEFINIR MECANISMOS DE CONSULTA Y TRANSFERENCIA DE INFORMACION PARA GARANTIZAR LA PARTICIPACION DE LA COMUNIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "PONER A DISPOSICION DE LA COMUNIDAD LA INFORMACION REQUERIDA PARA SU PARTICIPACION EN LAS DECISIONES EN SALUD"
            }
        ]
    },
    {
        "line": "E3Lb",
        "code": "M01",
        "description": "DISEÑAR UNA ESTRATEGIA DE COMUNICACION E INFORMACION PARA PROMOVER UNA CULTURA DE BIENESTAR Y SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "PRODUCIR Y DIVULGAR CONTENIDOS COMUNICATIVOS SOBRE CULTURA DE BIENESTAR Y SALUD CON PERSPECTIVA COMUNITARIA"
            }
        ]
    },
    {
        "line": "E3Le",
        "code": "M01",
        "description": "INCORPORAR LA POLITICA DE PARTICIPACION EN LOS LINEAMIENTOS Y PROGRAMAS DE SALUD PUBLICA DE LA ENTIDAD",
        "activities": [
            {
                "code": "A01",
                "description": "ARTICULAR LAS ACCIONES DE PARTICIPACION SOCIAL CON LOS PROGRAMAS DE SALUD PUBLICA DE LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E4Lc",
        "code": "M01",
        "description": "POSICIONAR EL CONTROL SOCIAL COMO ELEMENTO DE LA DEMOCRACIA Y LA TRANSPARENCIA EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "RECONOCER Y APOYAR A LOS VEEDORES Y REDES DE VEEDURIAS QUE EJERCEN CONTROL SOCIAL EN SALUD"
            }
        ]
    },
    {
        "line": "E4Ld",
        "code": "M01",
        "description": "IMPLEMENTAR MECANISMOS PARA QUE LA CIUDADANIA PARTICIPE EN EL ANALISIS DE LA INFORMACION EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "PUBLICAR Y EXPLICAR A LA CIUDADANIA LA INFORMACION SOBRE LA GESTION Y LOS RECURSOS EN SALUD"
            }
        ]
    },
    {
        "line": "E4Le",
        "code": "M01",
        "description": "IMPLEMENTAR UNA ESTRATEGIA DE FORMACION EN CONTROL SOCIAL DIRIGIDA A FUNCIONARIOS Y CIUDADANIA",
        "activities": [
            {
                "code": "A01",
                "description": "REALIZAR JORNADAS DE FORMACION EN CONTROL SOCIAL EN SALUD PARA FUNCIONARIOS Y CIUDADANIA"
            }
        ]
    },
    {
        "line": "E4Lf",
        "code": "M01",
        "description": "PROMOVER ESPACIOS DE SEGUIMIENTO Y OBSERVACION DE LA PARTICIPACION Y EL CONTROL SOCIAL EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "CONSOLIDAR INFORMACION DE LOS EJERCICIOS DE PARTICIPACION Y CONTROL SOCIAL COMO INSUMO DE SEGUIMIENTO"
            }
        ]
    },
    {
        "line": "E5Lb",
        "code": "M01",
        "description": "IMPLEMENTAR DISPOSITIVOS QUE PERMITAN A LA CIUDADANIA PARTICIPAR EN LA GESTION DEL SECTOR SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "HABILITAR ESPACIOS Y CANALES PARA QUE LA CIUDADANIA PARTICIPE EN LA GESTION DE LA ENTIDAD"
            }
        ]
    },
    {
        "line": "E5Lc",
        "code": "M01",
        "description": "DEFINIR MECANISMOS QUE PERMITAN LA PARTICIPACION DE LA POBLACION EN LA INVERSION PUBLICA EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "REALIZAR EJERCICIOS DE PRESUPUESTACION PARTICIPATIVA CON LA COMUNIDAD SOBRE LA INVERSION EN SALUD"
            }
        ]
    },
    {
        "line": "E5Ld",
        "code": "M01",
        "description": "FORTALECER LOS ESCENARIOS PARA LA PARTICIPACION DE LA COMUNIDAD EN LA TOMA DE DECISIONES EN SALUD",
        "activities": [
            {
                "code": "A01",
                "description": "REALIZAR SESIONES DE LOS ESPACIOS DE PARTICIPACION PARA LA TOMA DE DECISIONES EN SALUD"
            }
        ]
    }
];

const TARGET_POPULATIONS: Array<[string, string]> = [
    [
        "01",
        "TRABAJADORES SECTOR SALUD"
    ],
    [
        "02",
        "TRABAJADORES ASISTENCIALES DE LA SALUD"
    ],
    [
        "03",
        "COPACO"
    ],
    [
        "04",
        "ASOCIACION DE USUARIOS"
    ],
    [
        "05",
        "CTSSS"
    ],
    [
        "06",
        "VEEDURIA"
    ],
    [
        "07",
        "COMITES DE ETICA"
    ],
    [
        "08",
        "COMITES DE VIGILANCIA"
    ],
    [
        "09",
        "ORGANIZACIONES SOCIALES AUTONOMAS"
    ],
    [
        "10",
        "RED COMUNITARIA"
    ],
    [
        "11",
        "RED DE ACCIONES EN SALUD PUBLICA"
    ],
    [
        "12",
        "CIUDADANIA PARTICIPANTE EN EL PIC"
    ],
    [
        "13",
        "POBLACION CON DISCAPACIDAD"
    ],
    [
        "14",
        "ADULTO MAYOR"
    ],
    [
        "15",
        "NIÑOS/AS Y ADOLESCENTES"
    ],
    [
        "16",
        "GRUPOS ETNICOS INDIGENAS"
    ],
    [
        "17",
        "GRUPOS ETNICOS AFROCOLOMBIANOS"
    ],
    [
        "18",
        "GRUPOS ETNICOS PALENQUEROS"
    ],
    [
        "19",
        "GRUPOS ETNICOS RAIZALES"
    ],
    [
        "20",
        "GRIPOS ETNICOS ROM"
    ],
    [
        "21",
        "POBLACION LGBTIQ"
    ],
    [
        "22",
        "VICTIMAS DEL CONFLICTO"
    ],
    [
        "23",
        "POBLACION DESPLAZADA"
    ],
    [
        "24",
        "MADRE GESTANTE"
    ],
    [
        "25",
        "CIUDADANIA GENERAL"
    ],
    [
        "26",
        "NO APLICA"
    ]
];

const FUNDING_SOURCES: Array<[string, string]> = [
    [
        "01",
        "RECURSOS PROPIOS DE LA ENTIDAD"
    ],
    [
        "02",
        "SISTEMA GENERAL DE PARTICIPACIONES"
    ],
    [
        "03",
        "PIC - GESTION SALUD PUBLICA"
    ],
    [
        "04",
        "RENTAS CEDIDAS"
    ],
    [
        "05",
        "TRANSFERENCIAS"
    ],
    [
        "06",
        "COOPERACION INTERNACIONAL"
    ],
    [
        "07",
        "CONVENIOS INTERADMINISTRATIVOS"
    ],
    [
        "08",
        "DONACIONES"
    ],
    [
        "09",
        "ENTIDAD PRIVADA"
    ],
    [
        "10",
        "NO APLICA"
    ]
];

const escapeSql = (value: string): string => value.replace(/'/g, "''");

export class CreatePpsModule1790867015575 implements MigrationInterface {
    name = "CreatePpsModule1790867015575";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ============ 1. pps_reporting_entity ============
        await queryRunner.createTable(
            new Table({
                name: "pps_reporting_entity",
                comment: "Datos de la entidad que reporta el PPS y parámetros de sus reportes (tabla de una sola fila)",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "identification_type",
                        type: "enum",
                        enum: ["NI", "DE", "DI", "MU"],
                        default: "'NI'",
                        comment: "Tipo de identificación (NI=NIT, DE=Departamento, DI=Distrito, MU=Municipio)",
                    },
                    {
                        name: "identification_number",
                        type: "varchar",
                        length: "20",
                        comment: "Número de identificación (NIT sin dígito de verificación; código Divipola para DE/DI/MU)",
                    },
                    {
                        name: "entity_name",
                        type: "varchar",
                        length: "150",
                        comment: "Nombre de la entidad",
                    },
                    {
                        name: "logo_path",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "Ruta relativa del logo de la entidad",
                    },
                    {
                        name: "programming_file_prefix",
                        type: "varchar",
                        length: "20",
                        default: "'PPS190PPPS'",
                        comment: "Prefijo del archivo plano de programación",
                    },
                    {
                        name: "monitoring_file_prefix",
                        type: "varchar",
                        length: "20",
                        default: "'PPS190SPPS'",
                        comment: "Prefijo del archivo plano de seguimiento (por confirmar con el lineamiento vigente)",
                    },
                    {
                        name: "strict_mode",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Modo estricto: la programación solo acepta metas y actividades del catálogo (1=Sí, 0=No)",
                    },
                    {
                        name: "programming_due_month",
                        type: "tinyint",
                        default: 1,
                        comment: "Mes límite de entrega de la programación",
                    },
                    {
                        name: "programming_due_day",
                        type: "tinyint",
                        default: 31,
                        comment: "Día límite de entrega de la programación",
                    },
                    {
                        name: "programming_due_year",
                        type: "enum",
                        enum: ["same", "next"],
                        default: "'same'",
                        comment: "Año límite de entrega de la programación (same=misma vigencia, next=año siguiente)",
                    },
                    {
                        name: "monitoring_due_month",
                        type: "tinyint",
                        default: 1,
                        comment: "Mes límite de entrega del seguimiento",
                    },
                    {
                        name: "monitoring_due_day",
                        type: "tinyint",
                        default: 31,
                        comment: "Día límite de entrega del seguimiento",
                    },
                    {
                        name: "monitoring_due_year",
                        type: "enum",
                        enum: ["same", "next"],
                        default: "'next'",
                        comment: "Año límite de entrega del seguimiento (same=misma vigencia, next=año siguiente)",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // ============ 2. pps_action_lines ============
        await queryRunner.createTable(
            new Table({
                name: "pps_action_lines",
                comment: "Catálogo de líneas de acción del Plan de Participación Social en Salud (Resolución 2063 de 2017)",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la línea de acción",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "10",
                        comment: "Código de la línea de acción (Ej: E1La)",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "400",
                        comment: "Descripción oficial de la línea de acción",
                    },
                    {
                        name: "strategic_axis",
                        type: "varchar",
                        length: "2",
                        comment: "Eje estratégico al que pertenece la línea (E1 a E5)",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Estado (1=Activa, 0=Inactiva)",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_action_lines_code", columnNames: ["code"], isUnique: true },
                ],
            }),
            true
        );

        // ============ 3. pps_goals ============
        await queryRunner.createTable(
            new Table({
                name: "pps_goals",
                comment: "Catálogo de metas por línea de acción",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la meta",
                    },
                    {
                        name: "action_line_id",
                        type: "int",
                        comment: "Línea de acción a la que pertenece la meta",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "10",
                        comment: "Consecutivo de la meta (Ej: M01)",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "300",
                        comment: "Descripción de la meta (20 a 300 caracteres, sin comas ni punto y coma)",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Estado (1=Activa, 0=Inactiva)",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_goals_action_line", columnNames: ["action_line_id"] },
                    { name: "IDX_pps_goals_action_line_code", columnNames: ["action_line_id", "code"], isUnique: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pps_goals",
            new TableForeignKey({
                name: "fk_pps_goals_action_line",
                columnNames: ["action_line_id"],
                referencedTableName: "pps_action_lines",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        // ============ 4. pps_activities ============
        await queryRunner.createTable(
            new Table({
                name: "pps_activities",
                comment: "Catálogo de actividades por meta",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la actividad",
                    },
                    {
                        name: "goal_id",
                        type: "int",
                        comment: "Meta a la que pertenece la actividad",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "10",
                        comment: "Consecutivo de la actividad (Ej: A01)",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "300",
                        comment: "Descripción de la actividad (20 a 300 caracteres, sin comas ni punto y coma)",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Estado (1=Activa, 0=Inactiva)",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_activities_goal", columnNames: ["goal_id"] },
                    { name: "IDX_pps_activities_goal_code", columnNames: ["goal_id", "code"], isUnique: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pps_activities",
            new TableForeignKey({
                name: "fk_pps_activities_goal",
                columnNames: ["goal_id"],
                referencedTableName: "pps_goals",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        // ============ 5. pps_target_populations ============
        await queryRunner.createTable(
            new Table({
                name: "pps_target_populations",
                comment: "Catálogo de población objetivo del PPS",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la población objetivo",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "10",
                        comment: "Código oficial de la población objetivo (Ej: 01)",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        comment: "Descripción de la población objetivo",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Estado (1=Activa, 0=Inactiva)",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_target_populations_code", columnNames: ["code"], isUnique: true },
                ],
            }),
            true
        );

        // ============ 6. pps_funding_sources ============
        await queryRunner.createTable(
            new Table({
                name: "pps_funding_sources",
                comment: "Catálogo de fuentes de recursos del PPS",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la fuente de recursos",
                    },
                    {
                        name: "code",
                        type: "varchar",
                        length: "10",
                        comment: "Código oficial de la fuente de recursos (Ej: 01)",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        comment: "Descripción de la fuente de recursos",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Estado (1=Activa, 0=Inactiva)",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_funding_sources_code", columnNames: ["code"], isUnique: true },
                ],
            }),
            true
        );

        // ============ 7. pps_periods ============
        await queryRunner.createTable(
            new Table({
                name: "pps_periods",
                comment: "Vigencias (periodos anuales) de programación y seguimiento del PPS",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la vigencia",
                    },
                    {
                        name: "validity_year",
                        type: "smallint",
                        comment: "Año de la vigencia (solo puede existir una por año)",
                    },
                    {
                        name: "start_date",
                        type: "date",
                        comment: "Fecha de inicio de la vigencia",
                    },
                    {
                        name: "end_date",
                        type: "date",
                        comment: "Fecha de fin de la vigencia",
                    },
                    {
                        name: "cutoff_date",
                        type: "date",
                        isNullable: true,
                        comment: "Fecha de corte para el reporte de seguimiento",
                    },
                    {
                        name: "status",
                        type: "tinyint",
                        width: 1,
                        default: 1,
                        comment: "Estado (1=Activa, 0=Inactiva)",
                    },
                    {
                        name: "created_by",
                        type: "int",
                        isNullable: true,
                        comment: "Usuario que creó la vigencia",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_periods_validity_year", columnNames: ["validity_year"], isUnique: true },
                    { name: "IDX_pps_periods_created_by", columnNames: ["created_by"] },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pps_periods",
            new TableForeignKey({
                name: "fk_pps_periods_created_by",
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        // ============ 8. pps_programmed_activities ============
        await queryRunner.createTable(
            new Table({
                name: "pps_programmed_activities",
                comment: "Actividades programadas por vigencia (archivo de programación). Conserva copia de códigos y descripciones para trazabilidad",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único de la actividad programada",
                    },
                    {
                        name: "period_id",
                        type: "int",
                        comment: "Vigencia a la que pertenece la actividad programada",
                    },
                    {
                        name: "headquarters_id",
                        type: "int",
                        comment: "Sede que ejecuta la actividad (de su código de habilitación se deriva el territorio)",
                    },
                    {
                        name: "territory_code",
                        type: "char",
                        length: "5",
                        comment: "Código Divipola (5 dígitos) derivado del código de habilitación de la sede al programar",
                    },
                    {
                        name: "action_line_code",
                        type: "varchar",
                        length: "10",
                        comment: "Código de la línea de acción (copia histórica del catálogo)",
                    },
                    {
                        name: "goal_id",
                        type: "int",
                        isNullable: true,
                        comment: "Meta del catálogo (null cuando se programó manualmente fuera del catálogo)",
                    },
                    {
                        name: "goal_code",
                        type: "varchar",
                        length: "10",
                        comment: "Consecutivo de la meta (copia histórica)",
                    },
                    {
                        name: "goal_description",
                        type: "varchar",
                        length: "300",
                        comment: "Descripción de la meta (copia histórica de la que se reportó)",
                    },
                    {
                        name: "activity_id",
                        type: "int",
                        isNullable: true,
                        comment: "Actividad del catálogo (null cuando se programó manualmente fuera del catálogo)",
                    },
                    {
                        name: "activity_code",
                        type: "varchar",
                        length: "10",
                        comment: "Consecutivo de la actividad (copia histórica)",
                    },
                    {
                        name: "activity_description",
                        type: "varchar",
                        length: "300",
                        comment: "Descripción de la actividad (copia histórica de la que se reportó)",
                    },
                    {
                        name: "numeric_expression",
                        type: "int",
                        comment: "Expresión numérica: veces que se ejecutará la actividad (mayor a 0)",
                    },
                    {
                        name: "target_population_id",
                        type: "int",
                        comment: "Población objetivo de la actividad",
                    },
                    {
                        name: "start_date",
                        type: "date",
                        comment: "Fecha de inicio de la actividad (dentro de la vigencia)",
                    },
                    {
                        name: "end_date",
                        type: "date",
                        comment: "Fecha de fin de la actividad (dentro de la vigencia)",
                    },
                    {
                        name: "programmed_resources",
                        type: "decimal",
                        precision: 12,
                        scale: 2,
                        comment: "Recursos programados (0 o mayor/igual a 10.000)",
                    },
                    {
                        name: "created_by",
                        type: "int",
                        isNullable: true,
                        comment: "Usuario que programó la actividad",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_programmed_activities_period", columnNames: ["period_id"] },
                    { name: "IDX_pps_programmed_activities_headquarters", columnNames: ["headquarters_id"] },
                    { name: "IDX_pps_programmed_activities_goal", columnNames: ["goal_id"] },
                    { name: "IDX_pps_programmed_activities_activity", columnNames: ["activity_id"] },
                    { name: "IDX_pps_programmed_activities_target_population", columnNames: ["target_population_id"] },
                    { name: "IDX_pps_programmed_activities_created_by", columnNames: ["created_by"] },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pps_programmed_activities",
            new TableForeignKey({
                name: "fk_pps_programmed_activities_period",
                columnNames: ["period_id"],
                referencedTableName: "pps_periods",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pps_programmed_activities",
            new TableForeignKey({
                name: "fk_pps_programmed_activities_headquarters",
                columnNames: ["headquarters_id"],
                referencedTableName: "headquarters",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        await queryRunner.createForeignKey(
            "pps_programmed_activities",
            new TableForeignKey({
                name: "fk_pps_programmed_activities_goal",
                columnNames: ["goal_id"],
                referencedTableName: "pps_goals",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "pps_programmed_activities",
            new TableForeignKey({
                name: "fk_pps_programmed_activities_activity",
                columnNames: ["activity_id"],
                referencedTableName: "pps_activities",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        await queryRunner.createForeignKey(
            "pps_programmed_activities",
            new TableForeignKey({
                name: "fk_pps_programmed_activities_target_population",
                columnNames: ["target_population_id"],
                referencedTableName: "pps_target_populations",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        await queryRunner.createForeignKey(
            "pps_programmed_activities",
            new TableForeignKey({
                name: "fk_pps_programmed_activities_created_by",
                columnNames: ["created_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        // ============ 9. pps_monitoring ============
        await queryRunner.createTable(
            new Table({
                name: "pps_monitoring",
                comment: "Seguimiento de ejecución por actividad programada (un registro por actividad)",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        comment: "Identificador único del registro de seguimiento",
                    },
                    {
                        name: "programmed_activity_id",
                        type: "int",
                        comment: "Actividad programada monitoreada (una fila por actividad)",
                    },
                    {
                        name: "result",
                        type: "int",
                        isNullable: true,
                        comment: "Resultado: número de veces que se ejecutó la actividad",
                    },
                    {
                        name: "intervened_population_id",
                        type: "int",
                        isNullable: true,
                        comment: "Población intervenida (puede diferir de la población objetivo programada)",
                    },
                    {
                        name: "total_persons",
                        type: "int",
                        isNullable: true,
                        comment: "Total de personas impactadas",
                    },
                    {
                        name: "executed_resources",
                        type: "decimal",
                        precision: 12,
                        scale: 2,
                        isNullable: true,
                        comment: "Recursos ejecutados (puede ser 0)",
                    },
                    {
                        name: "funding_source_id",
                        type: "int",
                        isNullable: true,
                        comment: "Fuente de los recursos ejecutados",
                    },
                    {
                        name: "evidence_link",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                        comment: "Link de la evidencia (mínimo 20 caracteres, sin comas ni punto y coma)",
                    },
                    {
                        name: "verification_means",
                        type: "varchar",
                        length: "500",
                        isNullable: true,
                        comment: "Medio de verificación (mínimo 20 caracteres, sin comas ni punto y coma)",
                    },
                    {
                        name: "updated_by",
                        type: "int",
                        isNullable: true,
                        comment: "Usuario que actualizó el seguimiento",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                indices: [
                    { name: "IDX_pps_monitoring_programmed_activity", columnNames: ["programmed_activity_id"], isUnique: true },
                    { name: "IDX_pps_monitoring_intervened_population", columnNames: ["intervened_population_id"] },
                    { name: "IDX_pps_monitoring_funding_source", columnNames: ["funding_source_id"] },
                    { name: "IDX_pps_monitoring_updated_by", columnNames: ["updated_by"] },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "pps_monitoring",
            new TableForeignKey({
                name: "fk_pps_monitoring_programmed_activity",
                columnNames: ["programmed_activity_id"],
                referencedTableName: "pps_programmed_activities",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        await queryRunner.createForeignKey(
            "pps_monitoring",
            new TableForeignKey({
                name: "fk_pps_monitoring_intervened_population",
                columnNames: ["intervened_population_id"],
                referencedTableName: "pps_target_populations",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        await queryRunner.createForeignKey(
            "pps_monitoring",
            new TableForeignKey({
                name: "fk_pps_monitoring_funding_source",
                columnNames: ["funding_source_id"],
                referencedTableName: "pps_funding_sources",
                referencedColumnNames: ["id"],
                onDelete: "RESTRICT",
            })
        );

        await queryRunner.createForeignKey(
            "pps_monitoring",
            new TableForeignKey({
                name: "fk_pps_monitoring_updated_by",
                columnNames: ["updated_by"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "SET NULL",
            })
        );

        // ============ SEEDS ============

        // Entidad reportante: fila única con valores por defecto (se actualiza por API)
        await queryRunner.query(
            `INSERT INTO \`pps_reporting_entity\` (\`identification_number\`, \`entity_name\`) VALUES ('', '')`
        );

        // Catálogo de líneas de acción
        const actionLineValues = ACTION_LINES
            .map(([code, description]) => `('${escapeSql(code)}', '${escapeSql(description)}', '${escapeSql(code.slice(0, 2))}', 1)`)
            .join(", ");
        await queryRunner.query(
            `INSERT INTO \`pps_action_lines\` (\`code\`, \`description\`, \`strategic_axis\`, \`status\`) VALUES ${actionLineValues}`
        );

        // Catálogo de metas y actividades (plantilla base)
        for (const goal of GOALS) {
            await queryRunner.query(
                `INSERT INTO \`pps_goals\` (\`action_line_id\`, \`code\`, \`description\`, \`status\`)
                 SELECT \`id\`, ?, ?, 1 FROM \`pps_action_lines\` WHERE \`code\` = ?`,
                [goal.code, goal.description, goal.line]
            );

            for (const activity of goal.activities) {
                await queryRunner.query(
                    `INSERT INTO \`pps_activities\` (\`goal_id\`, \`code\`, \`description\`, \`status\`)
                     SELECT g.\`id\`, ?, ?, 1
                     FROM \`pps_goals\` g
                     INNER JOIN \`pps_action_lines\` l ON l.\`id\` = g.\`action_line_id\`
                     WHERE l.\`code\` = ? AND g.\`code\` = ?`,
                    [activity.code, activity.description, goal.line, goal.code]
                );
            }
        }

        // Catálogo de población objetivo
        const populationValues = TARGET_POPULATIONS
            .map(([code, description]) => `('${escapeSql(code)}', '${escapeSql(description)}', 1)`)
            .join(", ");
        await queryRunner.query(
            `INSERT INTO \`pps_target_populations\` (\`code\`, \`description\`, \`status\`) VALUES ${populationValues}`
        );

        // Catálogo de fuentes de recursos
        const fundingValues = FUNDING_SOURCES
            .map(([code, description]) => `('${escapeSql(code)}', '${escapeSql(description)}', 1)`)
            .join(", ");
        await queryRunner.query(
            `INSERT INTO \`pps_funding_sources\` (\`code\`, \`description\`, \`status\`) VALUES ${fundingValues}`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Se eliminan en orden inverso: primero las tablas hijas
        await queryRunner.dropTable("pps_monitoring", true);
        await queryRunner.dropTable("pps_programmed_activities", true);
        await queryRunner.dropTable("pps_periods", true);
        await queryRunner.dropTable("pps_funding_sources", true);
        await queryRunner.dropTable("pps_target_populations", true);
        await queryRunner.dropTable("pps_activities", true);
        await queryRunner.dropTable("pps_goals", true);
        await queryRunner.dropTable("pps_action_lines", true);
        await queryRunner.dropTable("pps_reporting_entity", true);
    }
}

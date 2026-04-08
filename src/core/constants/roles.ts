/**
 * Roles que tienen acceso global a todas las carpetas del sistema
 * independientemente del departamento al que pertenezcan
 */
export const GLOBAL_FOLDER_ACCESS_ROLES = [
  "Jefe",
  "Gerente",
  "Administrador",
  "Coordinador",
  "Coordinadora Enfermeria",
  "Calidad"
];

/**
 * IDs de roles (para uso con authorizeRoles)
 */
export const ROLE_IDS = {
  RADICADOR: '1',
  SIAU: '2',
  CONTRATACION: '3',
  MEDICO: '4',
  JEFE: '5',
  CIRUGIA: '6',
  PARAMEDICO: '7',
} as const;

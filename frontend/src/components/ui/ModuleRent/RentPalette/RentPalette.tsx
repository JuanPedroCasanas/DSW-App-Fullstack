// esto es para centrar todos los colores de alquilar modulo y no tener que andar definiendolos 45 veces
export const rentColors = {
  available: "#70B603",   // Disponible
  mine:      "#73C3E6",   // Alquilado por vos
  reserved:  "#F59A23",   // Ocupado por otro
  unavailable:"#D7D7D7",  // No disponible
 
  outline:   "var(--color-primary, #0891b2)", // fallback: cyan-600
};

export const rentBackgrounds = {
  available:  `color-mix(in srgb, ${rentColors.available} 22%, white)`,
  mine:       `color-mix(in srgb, ${rentColors.mine} 22%, white)`,
  reserved:   `color-mix(in srgb, ${rentColors.reserved} 22%, white)`,
  unavailable:`color-mix(in srgb, ${rentColors.unavailable} 35%, white)`,
};

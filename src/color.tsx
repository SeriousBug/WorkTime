export type ThemedColor = {
  light: string;
  dark: string;
};

export type ColorNames =
  | 'blue'
  | 'purple'
  | 'green'
  | 'orange'
  | 'red'
  | 'beige'
  | 'cream'
  | 'turquoise'
  | 'pink'
  | 'lime'
  | 'amethyst'
  | 'peach';

export const COLOR: ReadonlyMap<ColorNames, ThemedColor> = new Map([
  [
    'blue',
    {
      light: '#0269ca',
      dark: '#95d0fc',
    },
  ],
  [
    'purple',
    {
      light: '#8c09ca',
      dark: '#eecffe',
    },
  ],
  [
    'green',
    {
      light: '#3ea907',
      dark: '#c7fdb5',
    },
  ],
  [
    'orange',
    {
      light: '#de6500',
      dark: '#ffb07c',
    },
  ],
  [
    'red',
    {
      light: '#d22500',
      dark: '#f28e8e',
    },
  ],
  [
    'beige',
    {
      light: '#706230',
      dark: '#e6daa6',
    },
  ],
  [
    'cream',
    {
      light: '#434343',
      dark: '#ffffe4',
    },
  ],
  [
    'turquoise',
    {
      light: '#00b170',
      dark: '#a4ffd6',
    },
  ],
  [
    'pink',
    {
      light: '#b5005d',
      dark: '#ffa6cf',
    },
  ],
  [
    'lime',
    {
      light: '#6cae00',
      dark: '#c5ff74',
    },
  ],
  [
    'amethyst',
    {
      light: '#6529e5',
      dark: '#b9a1fc',
    },
  ],
  [
    'peach',
    {
      light: '#9b794e',
      dark: '#ffd29d',
    },
  ],
]);

export function getColor(key: ColorNames): ThemedColor {
  // Because of how COLOR and key are defined, undefined is impossible
  return COLOR.get(key) as ThemedColor;
}

export function getThemeColor(
  theme: ReactNativePaper.Theme,
  color: ThemedColor,
): string {
  return theme.dark ? color.dark : color.light;
}

export const allColors = Array.from(COLOR.values());

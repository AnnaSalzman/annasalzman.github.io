/**
 * PROTOTYPE: the "French town" from Anna's sketch. Her drawings (extracted
 * from the sketch into src/assets/scene/) and the places they lead to, shared
 * by the home scene, the town menu and each place's page.
 */
import type { Color } from '../../lib/colors.ts';

import BoardLabel from '../../assets/scene/board-label.svg';
import BoardLetters from '../../assets/scene/board-letters.svg';
import Board from '../../assets/scene/board.svg';
import CinemaBooth from '../../assets/scene/cinema-booth.svg';
import CinemaLabel from '../../assets/scene/cinema-label.svg';
import CinemaScreen from '../../assets/scene/cinema-screen.svg';
import CinemaSeats from '../../assets/scene/cinema-seats.svg';
import MadeleineLabel from '../../assets/scene/madeleine-label.svg';
import Madeleine from '../../assets/scene/madeleine.svg';
import MuseumFigure from '../../assets/scene/museum-figure.svg';
import MuseumLabel from '../../assets/scene/museum-label.svg';
import Museum from '../../assets/scene/museum.svg';
import PortraitLabel from '../../assets/scene/portrait-label.svg';
import Portrait from '../../assets/scene/portrait.svg';
import Profile from '../../assets/scene/profile.svg';

export type Box = [x: number, y: number, w: number, h: number];

/** Where each drawing sits on Anna's sketch page (sketch units, page is 685 × 514). */
export const PARTS = {
  portrait: { svg: Portrait, box: [63.85, 37.51, 115.32, 123.33] },
  'portrait-label': { svg: PortraitLabel, box: [163.64, 43.3, 112.43, 92.68] },
  board: { svg: Board, box: [30.74, 197.37, 113.82, 62.95] },
  'board-letters': { svg: BoardLetters, box: [48.5, 205.3, 57.75, 38.29] },
  'board-label': { svg: BoardLabel, box: [12.66, 258.31, 149.46, 113.93] },
  museum: { svg: Museum, box: [324.77, 86.36, 314.19, 210.44] },
  'museum-figure': { svg: MuseumFigure, box: [430.71, 291.57, 29.64, 61.04] },
  'museum-label': { svg: MuseumLabel, box: [387.18, 352.79, 154.05, 93.71] },
  'cinema-screen': { svg: CinemaScreen, box: [206.42, 310.84, 144.82, 88.8] },
  'cinema-seats': { svg: CinemaSeats, box: [224.54, 406.08, 121.19, 22.66] },
  'cinema-booth': { svg: CinemaBooth, box: [245.16, 434.3, 82.45, 80.08] },
  'cinema-label': { svg: CinemaLabel, box: [326.99, 456.19, 125.75, 46.45] },
  profile: { svg: Profile, box: [21.86, 395.93, 65.49, 112.75] },
  madeleine: { svg: Madeleine, box: [95.13, 459.56, 22.98, 34.0] },
  'madeleine-label': { svg: MadeleineLabel, box: [86.64, 405.84, 111.32, 58.74] },
} satisfies Record<string, { svg: unknown; box: Box }>;

export type PartName = keyof typeof PARTS;

export type PlaceId = 'photos' | 'pedagogy' | 'museum' | 'cinema' | 'memory';

export interface Place {
  id: PlaceId;
  href: string;
  /** French name of the place (page title, menu label). */
  title: string;
  /** Short French label for the town menu. */
  short: string;
  /** English name, used as the accessible name and on phones. */
  name: string;
  hint: string;
  color: Color;
  /** Drawings that make up the place in the home scene. */
  art: PartName[];
  /** Anna's handwritten instruction next to it. */
  label: PartName;
  /** Drawings shown big at the top of the place's page. */
  header: PartName[];
  /** Tiny drawing used in the town menu. */
  icon: PartName[];
  /** Width of the drawing when the scene is stacked on a phone, as a share of the column. */
  mobileWidth: number;
}

export const PLACES: Place[] = [
  {
    id: 'photos',
    href: '/prototype/photos/',
    title: 'Les photos',
    short: 'Photos',
    name: 'Photos',
    hint: 'Madame Salzman’s photos',
    color: 'blue',
    art: ['portrait'],
    label: 'portrait-label',
    header: ['portrait'],
    icon: ['portrait'],
    mobileWidth: 0.62,
  },
  {
    id: 'pedagogy',
    href: '/prototype/pedagogie/',
    title: 'La pédagogie',
    short: 'Pédagogie',
    name: 'Pedagogy',
    hint: 'Notes on teaching languages',
    color: 'red',
    art: ['board', 'board-letters'],
    label: 'board-label',
    header: ['board', 'board-letters'],
    icon: ['board', 'board-letters'],
    mobileWidth: 0.8,
  },
  {
    id: 'museum',
    href: '/prototype/musee/',
    title: 'Au musée',
    short: 'Musée',
    name: 'The museum',
    hint: 'Drawings and francophone images',
    color: 'purple',
    art: ['museum', 'museum-figure'],
    label: 'museum-label',
    header: ['museum'],
    icon: ['museum'],
    mobileWidth: 1,
  },
  {
    id: 'cinema',
    href: '/prototype/cinema/',
    title: 'Au cinéma',
    short: 'Cinéma',
    name: 'The cinema',
    hint: 'French film picks and reviews',
    color: 'orange',
    art: ['cinema-screen', 'cinema-seats', 'cinema-booth'],
    label: 'cinema-label',
    header: ['cinema-screen', 'cinema-seats'],
    icon: ['cinema-screen'],
    mobileWidth: 0.72,
  },
  {
    id: 'memory',
    href: '/prototype/classe/',
    title: 'En classe',
    short: 'Classe',
    name: 'The memory classroom',
    hint: 'Games, vocab and quizzes',
    color: 'green',
    art: ['profile', 'madeleine'],
    label: 'madeleine-label',
    header: ['profile', 'madeleine'],
    icon: ['madeleine'],
    mobileWidth: 0.42,
  },
];

export const TOWN_HOME = '/prototype/';

export function placeById(id: PlaceId): Place {
  return PLACES.find((place) => place.id === id)!;
}

export const pct = (n: number) => `${+(n * 100).toFixed(3)}%`;

/** The box that holds all the given drawings. */
export function union(names: PartName[]): Box {
  const boxes = names.map((n) => PARTS[n].box);
  const x0 = Math.min(...boxes.map((b) => b[0]));
  const y0 = Math.min(...boxes.map((b) => b[1]));
  const x1 = Math.max(...boxes.map((b) => b[0] + b[2]));
  const y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
  return [x0, y0, x1 - x0, y1 - y0];
}

/** Position of one drawing inside the box of its group. */
export function inArt([x, y, w]: Box, [ax, ay, aw, ah]: Box) {
  return `--px:${pct((x - ax) / aw)};--py:${pct((y - ay) / ah)};--pw:${pct(w / aw)};`;
}

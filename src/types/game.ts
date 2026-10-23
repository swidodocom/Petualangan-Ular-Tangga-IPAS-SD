export type QuestionTopic =
  | 'Makhluk Hidup & Lingkungan'
  | 'Tumbuhan & Fotosintesis'
  | 'Wujud Benda & Materi'
  | 'Energi & Gaya'
  | 'Bumi & Tata Surya'
  | 'Tubuh & Panca Indra'
  | 'Keragaman Budaya Nusantara'
  | 'Kenampakan Alam & Peta'
  | 'Sejarah & Kerajaan Indonesia'
  | 'Ekonomi & Pelestarian Alam';

export interface IPASQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  topic: QuestionTopic;
  grade: 'Kelas 4' | 'Kelas 5' | 'Kelas 6';
  explanation: string;
  funFact?: string;
}

export type AvatarId = 'explorer' | 'scientist' | 'cultural' | 'kancil' | 'botanist';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  avatarKey: AvatarId;
  color: string;
  position: number; // 1 to boardSize
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalRolls: number;
  laddersClimbed: number;
  snakesBitten: number;
  isBot?: boolean;
}

export interface BoardSnake {
  head: number;
  tail: number;
}

export interface BoardLadder {
  bottom: number;
  top: number;
}

export type TileType = 'start' | 'finish' | 'ladder' | 'snake' | 'quiz' | 'normal';

export interface BoardTile {
  index: number;
  type: TileType;
  ladderTo?: number;
  snakeTo?: number;
  label?: string;
  iconName?: string;
}

export interface AnswerLog {
  timestamp: string;
  playerName: string;
  questionId: number;
  questionText: string;
  topic: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
}

export interface TurnLog {
  turnNumber: number;
  playerName: string;
  roll: number;
  fromTile: number;
  toTile: number;
  event: 'normal' | 'ladder' | 'snake' | 'quiz' | 'win';
  description: string;
}

export type GameMode = 'solo' | 'multiplayer';
export type QuestionCountChoice = 15 | 30;

export interface GameSettings {
  mode: GameMode;
  questionCount: QuestionCountChoice;
  boardSize: number; // 36 for 15-soal mini board, 64 for 30-soal full board, or 100
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  is3DView: boolean;
}

export interface INote {
    id: number;
    title: string;
    body: string;
    image: string | null;
    delta: object | null;
  }
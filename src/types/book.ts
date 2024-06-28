export interface Author {
  name: string;
  bio?: string;
  url?: string;
  imageUrl?: string;
  thumbnailImageUrl?: string;
}

export interface Narrator {
  name: string;
  url?: string;
}

export interface Cover {
  url?: string;
  path?: string;
}

export interface Genre {
  name: string;
  url?: string;
}

export interface Series {
  name: string;
  part?: number;
  url?: string;
}

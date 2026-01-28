export interface Wine {
  id: number;
  name: string;
  denomination: string; // e.g. DOC, IGT
  family: string;       // e.g. Tenute, Premium
  description: string;
  image: string;
  format: string;       // e.g. 0.75L
  tags: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
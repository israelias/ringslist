// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number;
  username: string;
  password: string;
  listings: Listing[];
};

export interface Category {
  id: number;
  name: string;
  slug: string;
  listings?: Listing[];
}
export interface Listing {
  id: number;
  title: string;
  description: string;
  slug: string;
  user_id: User['id'];
  user: User['username'];
  category_id: Category['id'];
  category: Category['name'];
  price: string;
  image?: ProductImage[];
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
}

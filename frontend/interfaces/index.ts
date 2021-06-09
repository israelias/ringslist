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
  listings: Listing[];
}
export interface Listing {
  id: number;
  title: string;
  description: string;
  user_id: User['id'];
  category_id: Category['id'];
  price: string;
}

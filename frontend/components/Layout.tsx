import React, { ReactNode } from 'react';

import Head from 'next/head';

import Header from './Header';
import { Category } from '../interfaces';

type Props = {
  children?: ReactNode;
  title?: string;
  categories: Category[];
};

const Layout = ({
  children,
  title = "Ring's Listings",
  categories,
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
      />
    </Head>
    <header>
      <Header categories={categories} />
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
);

export default Layout;

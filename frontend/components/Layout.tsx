import React, { ReactNode } from 'react';

import Head from 'next/head';
import { CssBaseline } from '@material-ui/core';

import Footer from './Footer';
import Navbar from './Navbar';
import { Category } from '../interfaces';

type Props = {
  children?: ReactNode;
  title?: string;
  categories: Category[];
  about?: string;
};

const Layout = ({
  children,
  title = "Ring's Listings",
  about = 'Meaningful Classifieds',
  categories,
}: Props) => (
  <>
    <CssBaseline />
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width"
      />
    </Head>
    <>
      <>
        <Navbar categories={categories} />
      </>
      {children}
      <Footer title={title} description={about} />
    </>
  </>
);

export default Layout;

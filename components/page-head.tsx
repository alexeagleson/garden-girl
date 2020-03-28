import React from 'react';
import Head from 'next/head';

export const PageHead = () => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Montserrat&display=swap"
      />
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css?family=Pacifico&display=swap" 
        /> 
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"
      />
      <link rel="icon" type="image/png" href="/48oak_notext.png" 
      />

    </Head>
  );
};

import React from 'react';
import dynamic from 'next/dynamic';
import { PageHead } from '../components/page-head';
import { MainStyle } from '../components/main-style';
// import { ReadyRoom } from 'components/ready-room';

const DynamicDisplay = dynamic(() => import('../components/display'), {
  ssr: false
});

const Screen = () => {
  return (
    <>
      <PageHead />
      <MainStyle />
      <DynamicDisplay />
    </>
  );
};

export default Screen;

import React from 'react';

export const Loading = (props: { loadingWhat?: string }) => {
  return <h1>{props.loadingWhat}</h1>;
};

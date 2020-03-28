import React from 'react';

export const MainStyle = () => (
  <style jsx global>{`
    html {
      font-family: "Montserrat", sans-serif;
      font-size: 14px;
    }

    body {
      background-color: #67722c;
    }

    #__next {
      /* box-sizing: border-box;
         width: 960px;  */
    }

    /* Hide the up/down arrows on the number inputs
      input[type="number"] {
        -moz-appearance: textfield;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      select {
        -moz-appearance: none;
        -webkit-appearance: none;
      }
      End Hide the up/down arrows on the number inputs

      @media only screen and (max-width: 960px) {
        #__next {
          width: 100%;
          padding: 0 4rem;
        }
      } */
  `}</style>
);

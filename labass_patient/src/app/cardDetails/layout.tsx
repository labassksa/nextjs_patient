// app/cardDetails/layout.tsx
import React, { ReactNode } from 'react';

interface CardDetailsLayoutProps {
  children: ReactNode;
}

const CardDetailsLayout: React.FC<CardDetailsLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Card View Payment</title>
        <script src="https://demo.myfatoorah.com/cardview/v2/session.js"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default CardDetailsLayout;

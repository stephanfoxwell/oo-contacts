import Link from 'next/link';
import React, { useEffect } from 'react';
import styled from 'styled-components';

import Button from '../components/Button/index';

const IndexPage = () => {
  return (
    <StyledIndex>
      <Button as={Link} href="/login">Sign in</Button>
    </StyledIndex>
  );
};

export default IndexPage;


const StyledIndex = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;
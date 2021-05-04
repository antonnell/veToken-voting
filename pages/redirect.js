import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

function Redirect(props) {
  const router = useRouter();
  const { address, section } = router.query;
  if (section === 'invest') {
    router.replace('/invest/' + address);
  } else if (section === 'lend') {
    router.push('/lend?address=' + address);
  }
  return <span></span>;
}

export default Redirect;

import Head from "next/head";
import classes from "./layout.module.css";
import Link from "next/link";
import Header from "../header";
import SnackbarController from "../snackbar";

export const siteTitle = "Yearn";

export default function Layout({
  children,
  configure,
  backClicked,
  changeTheme
}) {
  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Bold.ttf"
          as="font"
          crossOrigin=""
        />
        <meta name="description" content="Yearn.finance" />
        <meta name="og:title" content="Yearn" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={classes.content}>
        <SnackbarController />
        <main>{children}</main>
      </div>
    </div>
  );
}

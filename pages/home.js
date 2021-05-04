import Projects from "./projects";
import { useRouter } from "next/router";

function Home({ changeTheme, ...props }) {
  const router = useRouter();
  const activePath = router.asPath;
  if (activePath.includes("/projects")) {
    return <Projects props={props} changeTheme={changeTheme} />;
  } else {
    return <Projects props={props} changeTheme={changeTheme} />;
  }
}

export default Home;

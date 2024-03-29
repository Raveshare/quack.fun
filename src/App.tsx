import React, { useEffect } from "react";
import MainAppLayout from "../src/appCrust/Layouts/MainAppLayout.tsx";
import useUser from "./hooks/userHooks/useUser.tsx";

const App: React.FC<any> = () => {

  return (
    <>
      <MainAppLayout />
    </>
  );
};

export default App;

// https://stackoverflow.com/questions/17683458/how-do-i-commit-case-sensitive-only-filename-changes-in-git
// TS - Case sensitive only filename changes in git

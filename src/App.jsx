import React from "react";
import { Routes, Route } from "react-router-dom";

import Start from "./component/Start";
import Invited from "./component/Invited";
import Draw from "./component/Draw/Draw";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/invited" element={<Invited />} />
        <Route path="/draw" element={<Draw />} />
      </Routes>
    </div>
  );
}

export default App;

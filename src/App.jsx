import React, { useState } from "react";

import './App.css';
import Videoroom from './components/videoroom';



function App() {
  const[joined,setjoined]=useState(false);
  return (
    

   
    <div className="App">
    <h1> Virtual video call</h1>

    {!joined && (
      
     <button onClick={()=>setjoined(true)}>join room</button>
    )}
      
      {joined &&  <Videoroom/>
      }
    </div>
    
  );
}

export default App;
//전역에 공통적으로 적용되는 요소 모음
const config = {
  urls : {
      scheme : 'http',
      api : 'http://218.153.133.184:4100/v1'  //실서비스시에 실서비스에 맞게 수정해 주세요
  },
  key : 'access-token',
  host : () => {
      return `http://218.153.133.184:4100/v1`;  //실서비스시에 실서비스에 맞게 수정해 주세요
  }
};

export default config;





/*

import React from 'react';

function App() {
  return (
    <div className="App">
      <button>Start</button>
    </div>
  );
}

export default App;


*/
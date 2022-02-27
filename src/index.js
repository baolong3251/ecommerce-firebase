import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import store from './redux/createStore';
import App from './App';
const meta = {
  title: 'Some Meta Title',
  description: 'I am a description, and I can create multiple tags',
  canonical: 'http://example.com/path/to/page',
  meta: {
      charset: 'utf-8',
      name: {
          keywords: 'react,meta,document,html,tags,viewport'
      },
  }
}
ReactDOM.render( 
  <React.StrictMode>
    <Provider store={store}> {/* Provider make redux store effect on all app  */}
      <BrowserRouter>
        <App {...meta}/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


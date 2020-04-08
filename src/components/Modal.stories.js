import React from 'react';
import {Walkthrough, Modal} from '../';

export default { title: 'Modal' };

export const Simple = () => (
  <Walkthrough>
    <div style={{fontFamily: 'Helveitca-Neue, Helvetica, sans-serf', width: 500, marginLeft: 'auto', marginRight: 'auto'}}>
      <h1>Modals</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      <Modal id="welcome-modal">
        <div>
          <h1>Welcome</h1>
          <h2>Hello World</h2>
        </div>
      </Modal>
    </div>
  </Walkthrough>
)

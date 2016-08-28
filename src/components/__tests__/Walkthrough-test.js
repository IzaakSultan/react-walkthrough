/* global jest describe it expect */

jest.unmock('../Walkthrough.js');

import React from 'react';
import {mount} from 'enzyme';
import jsdom from 'jsdom';

import Walkthrough from '../Walkthrough';

describe('Walkthrough', () => {
    beforeEach(() => {
        global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
        global.window = document.defaultView;
        global.navigator = { userAgent: 'node.js' };
    });

    it('renders without shitting itself', () => {
        expect(mount(<Walkthrough><div>Hello World</div></Walkthrough>).length).toBe(1);
    });

    it('creates a beacon portal', () => {
        // expect(mount(<Walkthrough><div>Hello World</div></Walkthrough>).length).toBe(1);
    });
});

import {configure} from '@kadira/storybook';

function loadStories() {
    require('../src/components/stories/walkthrough');
}

configure(loadStories, module);

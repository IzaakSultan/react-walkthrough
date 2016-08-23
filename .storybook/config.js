import {configure} from '@kadira/storybook';

function loadStories() {
    require('../components/stories/walkthrough');
}

configure(loadStories, module);

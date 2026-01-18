import { makeProject } from '@revideo/core';
import LinearAnimation from './scenes/LinearAnimation';

export default makeProject({
  scenes: [LinearAnimation],
  settings: {
    shared: {
      size: { x: 1920, y: 1080 },
    },
  },
});

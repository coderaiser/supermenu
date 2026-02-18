import {run} from 'madrun';

export default {
    'fix:lint': () => run('lint', '--fix'),
    'lint': () => 'putout .',
};

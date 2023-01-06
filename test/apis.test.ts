import {
    describe,
    test,
    expect,
} from "vitest";

import {
    TOKEN,
} from './custom';

describe('import vue components', () => {
    test('getSiyuanStyleURL', async () => {
        const apis = await import('../src/utils/apis');
        const server = new URL('http://localhost:6806');
        for (const mode of Object.values(apis.MODE)) {
            const style_url = await apis.getSiyuanStyleURL(server, TOKEN, mode);
            expect(/base(\.[0-9a-f]+)?\.css$/.test(style_url?.pathname.split('/').pop() ?? '')).toEqual(true);
        }
    })
})

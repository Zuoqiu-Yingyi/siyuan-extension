import {
    describe,
    test,
    expect,
} from "vitest";

import {
    SERVER,
    TOKEN,
} from './custom';

describe('APIs Test', async () => {
    const siyuan = await import('../src/utils/siyuan');
    const client = new siyuan.SiyuanClient(new URL(SERVER), TOKEN);
    test('getSiyuanStyleURL', async () => {
        for (const mode of Object.values(siyuan.MODE)) {
            const style_url = await client.getSiyuanStyleURL(mode);
            expect(/base(\.[0-9a-f]+)?\.css$/.test(style_url?.pathname.split('/').pop() ?? '')).toEqual(true);
        }
    });
    test('lsNotebooks', async () => {
        const response = await client.lsNotebooks();
        expect(response?.code).toEqual(0);
    });
})

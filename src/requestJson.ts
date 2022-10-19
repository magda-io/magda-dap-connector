import type { RequestInfo, RequestInit } from "node-fetch";
import AbortController from "abort-controller";
import fetch from "./fetch";
import fse from "fs-extra";
import path from "path";

const pkgPromise = fse.readJSON(path.resolve(__dirname, "../package.json"), {
    encoding: "utf-8"
});

interface RequestOpts extends RequestInit {
    timeout?: number;
}

const DEFAULT_CONNECTION_TIMEOUT = 60000;

async function requestJson<T = any>(
    url: RequestInfo,
    init?: RequestOpts
): Promise<T> {
    const pkg = await pkgPromise;
    const controller = new AbortController();
    const timeout = setTimeout(
        () => {
            controller.abort();
        },
        init?.timeout ? init.timeout : DEFAULT_CONNECTION_TIMEOUT
    );

    try {
        const res = await fetch(url, {
            headers: {
                ...(init?.headers ? init.headers : {}),
                "User-Agent": `${pkg.name}/${pkg.version}`,
                "Content-Type": "application/json"
            },
            signal: controller.signal
        });

        if (!res.ok) {
            throw new Error(
                `Request to ${url} failed. Status code: ${res.status} ${res.statusText}.` +
                    `\n ${await res.text()}`
            );
        }
        return (await res.json()) as T;
    } catch (e) {
        throw e;
    } finally {
        clearTimeout(timeout);
    }
}

export default requestJson;

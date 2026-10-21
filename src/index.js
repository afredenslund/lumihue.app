// Serverer /media/* med korrekt Range-håndtering (HTTP 206), som Safari kræver for video.
// Alle andre adresser går direkte til de statiske filer.

const MEDIA_PREFIX = "/media/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isMedia = url.pathname.startsWith(MEDIA_PREFIX);
    const isRead = request.method === "GET" || request.method === "HEAD";
    if (!isMedia || !isRead) {
      return env.ASSETS.fetch(request);
    }

    // Hent hele filen fra de statiske filer, uden Range-headeren.
    const upstreamHeaders = new Headers(request.headers);
    upstreamHeaders.delete("range");
    upstreamHeaders.delete("if-range");
    const asset = await env.ASSETS.fetch(new Request(url.toString(), { method: "GET", headers: upstreamHeaders }));
    if (!asset.ok) {
      return asset;
    }

    const body = await asset.arrayBuffer();
    const total = body.byteLength;
    const headers = new Headers(asset.headers);
    headers.delete("content-encoding");
    headers.delete("transfer-encoding");
    headers.set("accept-ranges", "bytes");

    const range = parseRange(request.headers.get("range"), total);
    const ifRange = request.headers.get("if-range");
    const etag = asset.headers.get("etag");
    const rangeApplies = range !== null && (!ifRange || !etag || ifRange === etag);

    if (range === undefined) {
      // Ugyldigt eller umuligt interval.
      headers.set("content-range", `bytes */${total}`);
      headers.delete("content-length");
      return new Response(null, { status: 416, headers });
    }

    if (!rangeApplies) {
      headers.set("content-length", String(total));
      return new Response(request.method === "HEAD" ? null : body, { status: 200, headers });
    }

    const { start, end } = range;
    headers.set("content-range", `bytes ${start}-${end}/${total}`);
    headers.set("content-length", String(end - start + 1));
    return new Response(request.method === "HEAD" ? null : body.slice(start, end + 1), { status: 206, headers });
  },
};

// Returnerer null uden Range-header, undefined ved ugyldigt interval, ellers { start, end }.
function parseRange(header, total) {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null; // fx flere intervaller: svar med hele filen
  const [, first, last] = match;
  if (first === "" && last === "") return undefined;
  let start;
  let end;
  if (first === "") {
    const suffix = Number(last);
    if (suffix === 0) return undefined;
    start = Math.max(total - suffix, 0);
    end = total - 1;
  } else {
    start = Number(first);
    end = last === "" ? total - 1 : Math.min(Number(last), total - 1);
  }
  if (start >= total || start > end) return undefined;
  return { start, end };
}

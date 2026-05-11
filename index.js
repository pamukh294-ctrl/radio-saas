async function testStream(url) {
  if (!url) return null;

  const start = performance.now();

  try {
    // 1. normal fetch
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow"
    });

    const contentType = res.headers.get("content-type") || "";

    // STREAM detection
    const isStream =
      contentType.includes("audio") ||
      url.includes(".mp3") ||
      url.includes(".m3u8") ||
      url.includes(".aac");

    if (res.ok && isStream) {
      return Math.round(performance.now() - start);
    }

  } catch {}

  // 2. audio fallback (REAL TEST)
  return await audioProbe(url);
}
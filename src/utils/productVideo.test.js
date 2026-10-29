import test from "node:test";
import assert from "node:assert/strict";
import { getProductVideoUrl, productHasVideo } from "./productVideo.js";

test("accepts HTTPS product videos and preserves signed URLs", () => {
  for (const extension of ["mp4", "MOV", "webm", "m4v"]) {
    const url = `https://res.cloudinary.com/demo/video/upload/file.${extension}?token=a%2Bb`;
    assert.equal(getProductVideoUrl(url), url);
  }
});
test("rejects empty, unsafe and non-video sources", () => {
  for (const value of [null, undefined, {}, "", "file.mp4", "http://example.com/a.mp4", "javascript:alert(1)", "https://user:pass@example.com/a.mp4", "https://youtube.com/watch?v=123", "https://example.com/a.jpg"]) {
    assert.equal(getProductVideoUrl(value), null);
  }
});
test("ignores products without supported videos", () => {
  assert.equal(productHasVideo({}), false);
  assert.equal(productHasVideo({ video: " https://example.com/a.mp4 " }), true);
});

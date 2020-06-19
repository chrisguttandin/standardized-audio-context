export const loadFixtureAsArrayBuffer = (fixture) => fetch(`/base/test/fixtures/${fixture}`).then((response) => response.arrayBuffer());

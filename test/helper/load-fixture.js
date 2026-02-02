export const loadFixtureAsArrayBuffer = (fixture) => fetch(`/test/fixtures/${fixture}`).then((response) => response.arrayBuffer());

function Re(x, y) {
    return Math.pow(Math.E, x) * Math.cos(y);
}
function Im(x, y) {
    return Math.pow(Math.E, x) * Math.sin(y);
}
let graph = new Graph(
    Re,
    Im,
    { horz: 25, vert: 1 },
    Math.PI * 2,
    Math.PI,
    Math.PI / 16,
    24
);

function Re(x, y) {
    return Math.sin(x) * Math.cosh(y);
}
function Im(x, y) {
    return Math.cos(x) * Math.sinh(y);
}
let graph = new Graph(
    Re,
    Im,
    { horz: 1, vert: 20 },
    Math.PI,
    Math.PI * 2,
    Math.PI / 16,
    24
);

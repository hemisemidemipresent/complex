function Re(x, y) {
    return x * x - y * y;
}
function Im(x, y) {
    return 2 * x * y;
}
let graph = new Graph(Re, Im, { horz: 2, vert: 2 }, 2, 2, 0.25, 3);

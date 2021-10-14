function Re(x, y) {
    return x * x * x - 3 * x * y * y;
}
function Im(x, y) {
    return 3 * x * x * y - y * y * y;
}
let graph = new Graph(Re, Im, { horz: 10, vert: 10 }, 2, 2, 0.25, 3);

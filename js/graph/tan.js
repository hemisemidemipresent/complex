function Re(x, y) {
    let a = Math.tan(x);
    let b = Math.tanh(y);
    let c = 1;
    let d = -a * b;
    return (a * c + b * d) / (c * c + d * d);
}
function Im(x, y) {
    let a = Math.tan(x);
    let b = Math.tanh(y);
    let c = 1;
    let d = -a * b;
    return (b * c - a * d) / (c * c + d * d);
}
let graph = new Graph(
    Re,
    Im,
    { horz: 1, vert: 1 },
    Math.PI,
    Math.PI * 2,
    Math.PI / 16,
    24
);

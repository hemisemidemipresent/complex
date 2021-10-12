let container = document.getElementById('container');
let scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
var camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -2, 99999);
camera.position.set(0, 30, 0);

let frustumSize = 69;

const axes = [0x50514f, 0x70c1b3, 0xed6a5a];
const colors = [
    0xf77272, 0xf7a472, 0xf7d672, 0xe6f772, 0xb5f772, 0x83f772, 0x72f793,
    0x72f7c5, 0x72f7f7, 0x72c5f7, 0x7293f7, 0x8372f7, 0xb572f7, 0xe672f7,
    0xf772d6, 0xf772a4, 0xf77272, 0xf7a472, 0xf7d672, 0xe6f772, 0xb5f772,
    0x83f772, 0x72f793, 0x72f7c5, 0x72f7f7, 0x72c5f7, 0x7293f7, 0x8372f7,
    0xb572f7, 0xe672f7, 0xf772d6, 0xf772a4, 0xf77272,
];

var rot = 0;
var neg = 1;
var swop = false;
var defaultMax = Math.PI;
var max = Math.PI;

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
var clock = new THREE.Clock();
var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
var graph = new THREE.Object3D();
scene.add(graph);

init();
render();
showRe();

function createLines() {
    let i = 0;
    if (max != 0.1) max = defaultMax;
    for (let b = 0; b <= max; b += Math.PI / 16) {
        console.log(b);
        // for each line
        var line = new THREE.Geometry();
        var line = new Float32Array(600);
        for (var j = 0; j < 200 * 3; j += 3) {
            // for each point (a+bi) or if swop: (b+ai)
            a = j / 50 - 6;
            line[j] = a;
            if (swop) {
                line[j + 1] = Im(b, a * neg) / 20;
                line[j + 2] = Re(b, a * neg) / 20;
            } else {
                line[j + 1] = Im(a * neg, b);
                line[j + 2] = Re(a * neg, b);
            }
        }

        makeLine(line, 0);
        makeLine(line, colors[i]); // a+bi, where a is the x axis and b = 2
        i++;
    }
}

function createAxes() {
    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(-30, 0, 0));
    line.vertices.push(new THREE.Vector3(30, 0, 0));
    makeLine(line, axes[0]); // x

    // x-arrow
    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(29, 0, 1));
    line.vertices.push(new THREE.Vector3(30, 0, 0));
    makeLine(line, axes[0]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(29, 1, 0));
    line.vertices.push(new THREE.Vector3(30, 0, 0));
    makeLine(line, axes[0]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(29, 0, -1));
    line.vertices.push(new THREE.Vector3(30, 0, 0));
    makeLine(line, axes[0]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(29, -1, 0));
    line.vertices.push(new THREE.Vector3(30, 0, 0));
    makeLine(line, axes[0]);

    // y-arrow
    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, 29, 1));
    line.vertices.push(new THREE.Vector3(0, 30, 0));
    makeLine(line, axes[1]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, 29, -1));
    line.vertices.push(new THREE.Vector3(0, 30, 0));
    makeLine(line, axes[1]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(1, 29, 0));
    line.vertices.push(new THREE.Vector3(0, 30, 0));
    makeLine(line, axes[1]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(-1, 29, 0));
    line.vertices.push(new THREE.Vector3(0, 30, 0));
    makeLine(line, axes[1]);

    // z-arrow
    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(1, 0, 29));
    line.vertices.push(new THREE.Vector3(0, 0, 30));
    makeLine(line, axes[2]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(-1, 0, 29));
    line.vertices.push(new THREE.Vector3(0, 0, 30));
    makeLine(line, axes[2]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, 1, 29));
    line.vertices.push(new THREE.Vector3(0, 0, 30));
    makeLine(line, axes[2]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, -1, 29));
    line.vertices.push(new THREE.Vector3(0, 0, 30));
    makeLine(line, axes[2]);

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, -30, 0));
    line.vertices.push(new THREE.Vector3(0, 30, 0));
    makeLine(line, axes[1]); // y

    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, 0, -30));
    line.vertices.push(new THREE.Vector3(0, 0, 30));
    makeLine(line, axes[2]); // z
}

function makeLine(geo, c) {
    var g = new MeshLine();
    g.setGeometry(geo);

    var material = new MeshLineMaterial({
        useMap: false,
        color: new THREE.Color(c),
        opacity: 1,
        resolution: resolution,
        sizeAttenuation: false,
        lineWidth: 10,
    });
    var mesh = new THREE.Mesh(g.geometry, material);
    graph.add(mesh);
}
function createText() {
    const loader = new THREE.FontLoader();

    loader.load('fonts/CMU.json', function (font) {
        let options = {
            font: font,
            size: 3,
            height: 0,
            curveSegments: 12,
            bevelEnabled: false,
        };
        let xlabel = new THREE.TextGeometry('x', options);
        materials = [
            new THREE.MeshPhongMaterial({ color: null, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: null }), // side
        ];
        let xMesh = new THREE.Mesh(xlabel, materials);
        xMesh.position.x = 30;
        xMesh.rotation.x = 3.14159 / 2;

        graph.add(xMesh);

        let Imlabel = new THREE.TextGeometry('Im', options);
        materials = [
            new THREE.MeshPhongMaterial({ color: null, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: null }), // side
        ];

        let ImMesh = new THREE.Mesh(Imlabel, materials);
        ImMesh.position.y = 30;
        graph.add(ImMesh);

        let Relabel = new THREE.TextGeometry('Re', options);
        materials = [
            new THREE.MeshPhongMaterial({ color: null, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: null }), // side
        ];
        let ReMesh = new THREE.Mesh(Relabel, materials);
        ReMesh.position.z = 30;
        ReMesh.rotation.x = 3.14159 / 2;
        ReMesh.rotation.y = 3.14159;

        graph.add(ReMesh);
    });
}
function init() {
    createAxes();

    createLines();
    createText();
}
onWindowResize();

function onWindowResize() {
    var w = container.clientWidth;
    var h = container.clientHeight;

    var aspect = w / h;

    camera.left = (-frustumSize * aspect) / 2;
    camera.right = (frustumSize * aspect) / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

    resolution.set(w, h);
}
window.addEventListener('resize', onWindowResize);
function render() {
    requestAnimationFrame(render);
    controls.update();
    graph.rotation.y += rot * clock.getDelta();

    renderer.render(scene, camera);
}
function Re(x, y) {
    return Math.sin(x) * Math.cosh(y);
}
function Im(x, y) {
    return Math.cos(x) * Math.sinh(y);
}
function hina() {
    if (rot == 0.25) {
        rot = 0;
    } else {
        rot = 0.25;
        camera.position.set(0, 0, 30);
        if (graph.rotation.x == 0) {
            graph.rotation.x = 0.4;
            graph.rotation.y = 0;
            graph.rotation.z = 0;
        }

        camera.rotation.z = 180;
    }
}
function showRe() {
    rot = 0;
    camera.position.set(0, 30, 0);
    graph.rotation.x = 0;
    graph.rotation.y = 3.14159;
    graph.rotation.z = 0;
}
function showIm() {
    rot = 0;
    camera.position.set(0, 0, 30);
    graph.rotation.x = 0;
    graph.rotation.y = 0;
    graph.rotation.z = 0;

    camera.rotation.z = 180;
}
function ReIm() {
    rot = 0;
    camera.position.set(30, 0, 0);
    graph.rotation.x = 0;
    graph.rotation.y = 0;
    graph.rotation.z = 0;

    camera.rotation.z = 180;
}
function nega() {
    clear();
    if (neg == 1) neg = -1;
    else neg = 1;
    init();
    spans = document.getElementsByClassName('sign');
    for (let i = 0; i < spans.length; i++) {
        if (neg == 1) spans[i].innerHTML = '+';
        else spans[i].innerText = '-';
    }
}
function swap() {
    clear();
    swop = !swop;
    axes_var = document.getElementsByClassName('axes_var');
    for (let i = 0; i < axes_var.length; i++) {
        if (swop) axes_var[i].innerHTML = 'i';
        else axes_var[i].innerText = '';
    }
    lined_var = document.getElementsByClassName('lined_var');
    for (let i = 0; i < lined_var.length; i++) {
        if (swop) lined_var[i].innerHTML = '';
        else lined_var[i].innerText = 'i';
    }
    if (swop) defaultMax = Math.PI * 2;
    else defaultMax = Math.PI;
    init();
}
function only() {
    if (max == 0.1) max = defaultMax;
    else max = 0.1;
    clear();
    init();
}
function clear() {
    for (var i = graph.children.length - 1; i >= 0; i--) {
        graph.remove(graph.children[i]);
    }
}
